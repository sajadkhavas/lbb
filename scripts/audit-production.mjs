import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const clientDir = path.join(root, "dist", "client");
const artifactsDir = path.join(root, "artifacts", "audit");
const configuredSiteUrl = process.env.VITE_SITE_URL;

if (!configuredSiteUrl) throw new Error("VITE_SITE_URL is required for production audit.");
const siteUrl = new URL(configuredSiteUrl).origin;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }
  return files;
}

async function exists(file) {
  return stat(file).then(
    () => true,
    () => false,
  );
}

const checks = [];
function check(name, pass, detail) {
  checks.push({ name, pass: Boolean(pass), detail });
}

const robotsPath = path.join(clientDir, "robots.txt");
const robots = await readFile(robotsPath, "utf8");
check(
  "robots token resolved",
  !robots.includes("{{SITE_URL}}"),
  "robots.txt has no template token",
);
check(
  "robots sitemap absolute",
  robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`),
  `expected Sitemap: ${siteUrl}/sitemap.xml`,
);

const manifestPath = path.join(clientDir, "manifest.webmanifest");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
check(
  "manifest name",
  typeof manifest.name === "string" && manifest.name.length > 0,
  manifest.name,
);
check("manifest standalone", manifest.display === "standalone", manifest.display);
check(
  "manifest icons",
  Array.isArray(manifest.icons) && manifest.icons.length >= 2,
  `${manifest.icons?.length ?? 0} icons`,
);

const swPath = path.join(clientDir, "sw.js");
const swExists = await exists(swPath);
const sw = swExists ? await readFile(swPath, "utf8") : "";
check("service worker emitted", swExists && sw.length > 500, `${sw.length} bytes`);
check(
  "safe public page cache",
  sw.includes("lbb-public-pages-v1"),
  "public page cache is versioned",
);
check("legacy broad page cache removed", !sw.includes("lbb-pages"), "legacy cache name absent");

const logoPath = path.join(clientDir, "brand", "lbb-logo.svg");
check("optimized logo emitted", await exists(logoPath), "dist/client/brand/lbb-logo.svg");

const files = await walk(clientDir);
const textExtensions = new Set([".html", ".js", ".mjs", ".css", ".json", ".xml", ".txt", ".svg"]);
const forbiddenPatterns = ["/__l5e/", "assets-v1/", "lovableproject.com", "lovableproject-dev.com"];
const forbiddenHits = [];
for (const file of files) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
  const content = await readFile(file, "utf8");
  for (const pattern of forbiddenPatterns) {
    if (content.includes(pattern)) {
      forbiddenHits.push({
        file: path.relative(clientDir, file).replaceAll(path.sep, "/"),
        pattern,
      });
    }
  }
}
check("no internal Lovable asset URLs", forbiddenHits.length === 0, JSON.stringify(forbiddenHits));

const fontFiles = files.filter((file) => file.endsWith(".woff2"));
const cssFiles = files.filter((file) => file.endsWith(".css"));
const cssText = (await Promise.all(cssFiles.map((file) => readFile(file, "utf8")))).join("\n");
check("self-hosted font files emitted", fontFiles.length >= 2, `${fontFiles.length} woff2 files`);
check(
  "no Google Fonts requests",
  !cssText.includes("fonts.googleapis.com") && !cssText.includes("fonts.gstatic.com"),
  "production CSS has no Google Fonts URL",
);
check(
  "Estedad local declaration",
  cssText.includes("Estedad Variable") && cssText.includes("JetBrains Mono Variable"),
  "local font families found in CSS",
);

const report = {
  generatedAt: new Date().toISOString(),
  siteUrl,
  status: checks.every((item) => item.pass) ? "PASS" : "FAIL",
  checks,
};

await mkdir(artifactsDir, { recursive: true });
await writeFile(
  path.join(artifactsDir, "production-audit.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

for (const item of checks) {
  console.log(`${item.pass ? "PASS" : "FAIL"} ${item.name} — ${item.detail}`);
}

if (report.status === "FAIL") process.exitCode = 1;
