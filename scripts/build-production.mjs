import { spawnSync } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { loadEnv } from "vite";

const root = process.cwd();
const mode = process.argv[2] ?? "production";
const env = loadEnv(mode, root, "");
const configuredUrl = process.env.VITE_SITE_URL || env.VITE_SITE_URL;

function normalizeSiteUrl(value) {
  if (!value) throw new Error("VITE_SITE_URL is required for production builds.");
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("VITE_SITE_URL must use https in production.");
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error(
      "VITE_SITE_URL must be a clean origin without path, credentials, query or hash.",
    );
  }
  return url.origin;
}

async function assertFile(file, description) {
  const result = await stat(file).catch(() => null);
  if (!result?.isFile() || result.size === 0) {
    throw new Error(`${description} was not emitted: ${path.relative(root, file)}`);
  }
}

const siteUrl = normalizeSiteUrl(configuredUrl);
const viteCli = path.join(root, "node_modules", "vite", "bin", "vite.js");
const build = spawnSync(process.execPath, [viteCli, "build", "--mode", mode], {
  cwd: root,
  env: { ...process.env, VITE_SITE_URL: siteUrl },
  stdio: "inherit",
});

if (build.error) throw build.error;
if (build.status !== 0) throw new Error(`Vite build failed with exit code ${build.status}.`);

await Promise.all([
  assertFile(path.join(root, ".output/server/index.mjs"), "SSR server entry"),
  assertFile(path.join(root, ".output/public/sw.js"), "Service worker"),
  assertFile(path.join(root, ".output/public/manifest.webmanifest"), "Web manifest"),
]);
