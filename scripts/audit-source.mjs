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

const homepageRoute = await readFile(path.join(root, "src/routes/index.tsx"), "utf8");
const homepageHero = await readFile(
  path.join(root, "src/components/lbb/home/HeroNarrative.tsx"),
  "utf8",
).catch(() => "");

for (const forbidden of [
  "SmoothScroll",
  "CustomCursor",
  "HeroSplit",
  "NewDropCountdown",
  "CategoryTakeover",
  "FeaturedPinned",
  "BestSellers",
  "EditorialSplit",
]) {
  if (homepageRoute.includes(forbidden)) {
    failures.push(`F13 homepage must not restore the superseded ${forbidden} composition.`);
  }
}
if (!homepageHero) {
  failures.push("F13 product-first HeroNarrative is missing.");
} else {
  if (/\buseEffect\b|\bgsap\b|\bScrollTrigger\b|\blenis\b/i.test(homepageHero)) {
    failures.push("Homepage hero must remain JavaScript-motion-free above the fold.");
  }
  if (!/loading="eager"/.test(homepageHero) || !/fetchPriority="high"/.test(homepageHero)) {
    failures.push("Homepage LCP image must remain eager and high priority.");
  }
  if (!/width=\{1200\}/.test(homepageHero) || !/height=\{1500\}/.test(homepageHero)) {
    failures.push("Homepage LCP image must retain explicit intrinsic dimensions.");
  }
}
if (!/rel:\s*"preload"[\s\S]*as:\s*"image"[\s\S]*href:\s*heroMain/.test(homepageRoute)) {
  failures.push("Homepage route must preload the hero LCP image.");
}

const discoveryModule = await readFile(
  path.join(root, "src/lib/catalog-discovery.ts"),
  "utf8",
).catch(() => "");
const productFilters = await readFile(
  path.join(root, "src/components/lbb/ProductFilters.tsx"),
  "utf8",
).catch(() => "");
const gridControls = await readFile(
  path.join(root, "src/components/lbb/ProductGridControls.tsx"),
  "utf8",
).catch(() => "");
const shopRoute = await readFile(path.join(root, "src/routes/shop.tsx"), "utf8");
const categoryRoute = await readFile(path.join(root, "src/routes/$category.tsx"), "utf8");
const searchRoute = await readFile(path.join(root, "src/routes/search.tsx"), "utf8");

if (!discoveryModule.includes("createDiscoveryScope") || !discoveryModule.includes("createFacetCounts")) {
  failures.push("F14 shared catalogue discovery utilities are missing.");
}
if (!productFilters.includes("facetCounts") || !productFilters.includes("isUnavailable")) {
  failures.push("F14 filters must expose facet counts and unavailable states.");
}
if (
  !gridControls.includes("draftFilters") ||
  !gridControls.includes("applyDraft") ||
  !gridControls.includes("اعمال فیلترها") ||
  !gridControls.includes("بستن فیلترها بدون اعمال تغییرات")
) {
  failures.push("F14 mobile filters must stage, cancel and explicitly apply changes.");
}
if (/پرفروش‌ترین|پرطرفدار/.test(`${gridControls}\n${shopRoute}\n${categoryRoute}\n${searchRoute}`)) {
  failures.push("F14 listing surfaces must not make unsupported popularity or sales claims.");
}
for (const [name, content] of [
  ["shop", shopRoute],
  ["category", categoryRoute],
  ["search", searchRoute],
]) {
  if (!content.includes("createDiscoveryScope") || !content.includes("createFacetCounts")) {
    failures.push(`F14 ${name} route must use the shared discovery contract.`);
  }
  if (!content.includes("getResultCount") || !content.includes("filterSlot={renderFilters}")) {
    failures.push(`F14 ${name} route must provide staged mobile result previews.`);
  }
}
if (!searchRoute.includes("replace: true") || searchRoute.includes("دسته‌بندی‌های پرطرفدار")) {
  failures.push("F14 search must replace live-typing history and use evidence-safe category copy.");
}
if (/\{items\.length\.toLocaleString\("fa-IR"\)\} محصول موجود/.test(categoryRoute)) {
  failures.push("F14 category inventory copy must distinguish catalogue total from availability.");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Source audit passed across ${repositoryFiles.length} production files.`);
