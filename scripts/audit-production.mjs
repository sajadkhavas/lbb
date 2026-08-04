import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const publicDir = path.join(root, ".output/public");
const assetsDir = path.join(publicDir, "assets");
const limits = {
  maxJavaScriptFile: 460 * 1024,
  maxCssFile: 160 * 1024,
  maxTotalJavaScript: 1_200 * 1024,
};
const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const files = await walk(publicDir);
const assetFiles = files.filter((file) => file.startsWith(assetsDir));
const jsFiles = assetFiles.filter((file) => file.endsWith(".js"));
const cssFiles = assetFiles.filter((file) => file.endsWith(".css"));
const fontFiles = assetFiles.filter((file) => /\.(woff2?|ttf|otf)$/.test(file));

let totalJavaScript = 0;
for (const file of jsFiles) {
  const size = (await stat(file)).size;
  totalJavaScript += size;
  if (size > limits.maxJavaScriptFile) {
    failures.push(`JavaScript budget exceeded: ${path.basename(file)} = ${size} bytes`);
  }
}
for (const file of cssFiles) {
  const size = (await stat(file)).size;
  if (size > limits.maxCssFile) {
    failures.push(`CSS budget exceeded: ${path.basename(file)} = ${size} bytes`);
  }
}
if (totalJavaScript > limits.maxTotalJavaScript) {
  failures.push(`Total JavaScript budget exceeded: ${totalJavaScript} bytes`);
}
if (fontFiles.length < 2) failures.push("Self-hosted font assets were not emitted.");

for (const required of ["sw.js", "manifest.webmanifest"]) {
  const file = path.join(publicDir, required);
  const fileStat = await stat(file).catch(() => null);
  if (!fileStat?.isFile() || fileStat.size === 0) failures.push(`${required} is missing from output.`);
}

const textFiles = files.filter((file) => /\.(?:js|css|html|json|txt|xml|mjs)$/.test(file));
for (const file of textFiles) {
  const content = await readFile(file, "utf8").catch(() => "");
  if (content.includes("/__l5e/")) failures.push(`Lovable-only asset path leaked: ${file}`);
  if (content.includes("fonts.googleapis.com") || content.includes("fonts.gstatic.com")) {
    failures.push(`External Google font request leaked: ${file}`);
  }
}

const manifest = JSON.parse(await readFile(path.join(publicDir, "manifest.webmanifest"), "utf8"));
if (manifest.display !== "standalone" || !Array.isArray(manifest.icons) || manifest.icons.length < 3) {
  failures.push("Manifest is missing required standalone/icon fields.");
}

const serviceWorker = await readFile(path.join(publicDir, "sw.js"), "utf8");
for (const excluded of ["/api/", "/~oauth", "/sitemap.xml", "/sw.js"]) {
  if (!serviceWorker.includes(excluded)) failures.push(`Service worker exclusion missing: ${excluded}`);
}

console.log(
  JSON.stringify(
    {
      jsFiles: jsFiles.length,
      cssFiles: cssFiles.length,
      fontFiles: fontFiles.length,
      totalJavaScript,
      budgets: limits,
    },
    null,
    2,
  ),
);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
