import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
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

const sourceFiles = await walk(path.join(root, "src"));
const publicFiles = await walk(path.join(root, "public"));
const repositoryFiles = [...sourceFiles, ...publicFiles];

for (const file of repositoryFiles) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  if (/\.asset\.json$|\.trigger(?:\.|$)/.test(relative)) {
    failures.push(`Temporary or preview-only artifact remains: ${relative}`);
  }
  if (!/\.(?:ts|tsx|js|mjs|css|json|txt|webmanifest)$/.test(file)) continue;
  const content = await readFile(file, "utf8").catch(() => "");
  if (content.includes("/__l5e/")) failures.push(`Lovable preview path remains: ${relative}`);
  if (/\b(?:TODO|FIXME)\b/.test(content))
    failures.push(`Unresolved TODO/FIXME remains: ${relative}`);
}

const pwaConfig = await readFile(path.join(root, "vite.config.ts"), "utf8");
if (pwaConfig.includes("VitePWA") || pwaConfig.includes("vite-plugin-pwa")) {
  failures.push("Obsolete plugin-generated PWA pipeline remains in vite.config.ts.");
}

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (
  packageJson.dependencies?.["vite-plugin-pwa"] ||
  packageJson.devDependencies?.["vite-plugin-pwa"]
) {
  failures.push("Unused vite-plugin-pwa dependency remains.");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Source audit passed across ${repositoryFiles.length} production files.`);
