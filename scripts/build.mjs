import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { build, loadEnv } from "vite";

const root = process.cwd();
const publicOutputDir = path.join(root, ".output", "public");
const mode = process.argv[2] ?? "production";
const env = loadEnv(mode, root, "");
const configuredUrl = process.env.VITE_SITE_URL || env.VITE_SITE_URL;

function normalizeSiteUrl(value) {
  if (!value) {
    if (mode === "production") {
      throw new Error("VITE_SITE_URL is required for production builds.");
    }
    return "http://localhost:3000";
  }

  const parsed = new URL(value);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("VITE_SITE_URL must use http or https.");
  }
  if (mode === "production" && parsed.protocol !== "https:") {
    throw new Error("VITE_SITE_URL must use https in production.");
  }
  if (
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(
      "VITE_SITE_URL must be a clean origin without path, credentials, query, or hash.",
    );
  }
  return parsed.origin;
}

const siteUrl = normalizeSiteUrl(configuredUrl);
process.env.VITE_SITE_URL = siteUrl;

const robotsPath = path.join(root, "public", "robots.txt");
const manifestPath = path.join(root, "public", "manifest.webmanifest");
const robotsTemplate = await readFile(robotsPath, "utf8");
if (!robotsTemplate.includes("{{SITE_URL}}")) {
  throw new Error("public/robots.txt must contain the {{SITE_URL}} token.");
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
if (!manifest.name || manifest.display !== "standalone" || !Array.isArray(manifest.icons)) {
  throw new Error("public/manifest.webmanifest is missing required PWA fields.");
}

const renderedRobots = robotsTemplate.replaceAll("{{SITE_URL}}", siteUrl);

try {
  await build({ mode });

  await mkdir(publicOutputDir, { recursive: true });
  const builtRobotsPath = path.join(publicOutputDir, "robots.txt");
  const builtManifestPath = path.join(publicOutputDir, "manifest.webmanifest");
  await Promise.all([
    writeFile(builtRobotsPath, renderedRobots, "utf8"),
    copyFile(manifestPath, builtManifestPath),
  ]);

  const builtRobots = await readFile(builtRobotsPath, "utf8");
  if (builtRobots.includes("{{SITE_URL}}")) {
    throw new Error("Production robots.txt still contains an unresolved SITE_URL token.");
  }
  if (!builtRobots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
    throw new Error("Production robots.txt does not contain the absolute configured sitemap URL.");
  }
} finally {
  await writeFile(robotsPath, robotsTemplate, "utf8");
}
