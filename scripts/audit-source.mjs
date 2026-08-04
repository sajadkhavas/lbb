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

const catalogue = await readFile(path.join(root, "src/lib/product-catalog.ts"), "utf8").catch(
  () => "",
);
const productsFacade = await readFile(path.join(root, "src/lib/products.ts"), "utf8").catch(
  () => "",
);
const productFilter = await readFile(path.join(root, "src/lib/product-filter.ts"), "utf8");

if (!catalogue) {
  failures.push("Pure product catalogue module is missing.");
} else if (/^\s*import\s/m.test(catalogue) || /\bimport\s*\(/.test(catalogue)) {
  failures.push("Product catalogue must remain a zero-import data module.");
}
if (productsFacade.trim() !== 'export * from "./product-catalog";') {
  failures.push("products.ts must remain a compatibility facade over product-catalog.ts.");
}
if (!productFilter.includes('from "./product-catalog"')) {
  failures.push(
    "product-filter.ts must import catalogue helpers directly from product-catalog.ts.",
  );
}
if (productFilter.includes('from "./products"')) {
  failures.push("Circular product-filter → products facade dependency has returned.");
}
if (/import\s*{[^}]*\bproducts\b[^}]*}\s*from\s*"\.\/product-catalog"/s.test(productFilter)) {
  failures.push(
    "product-filter.ts must not evaluate the product catalogue during module initialization.",
  );
}
if (/products\.(?:flatMap|map)\s*\(/.test(productFilter)) {
  failures.push("Catalogue-derived filter defaults must not run at module initialization.");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Source audit passed across ${repositoryFiles.length} production files.`);
