import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const product = read("src/routes/product.$slug.tsx");
const category = read("src/routes/$category.tsx");
const collection = read("src/routes/collections.$slug.tsx");
const sitemap = read("src/routes/sitemap[.]xml.ts");
const helper = read("src/lib/seo-live.ts");

const required = [
  [product, "backendCanonicalPath(product.seo", "Product consumes Backend canonicalPath"],
  [category, "backendCanonicalPath(category.seo", "Category consumes Backend canonicalPath"],
  [category, '"@type": "ItemList"', "live Category publishes ItemList"],
  [collection, "backendCanonicalPath(collection.seo", "Collection consumes Backend canonicalPath"],
  [
    collection,
    "error instanceof BackendApiError && error.status === 404",
    "Collection preserves real 404",
  ],
  [sitemap, "isLiveBackend()", "sitemap switches on production backend mode"],
  [sitemap, "listCategories()", "sitemap uses Backend categories"],
  [sitemap, "listCollections()", "sitemap uses Backend collections"],
  [sitemap, "listProducts({ page, per_page: 48", "sitemap paginates Backend products"],
  [sitemap, "<lastmod>", "sitemap supports lastmod"],
  [sitemap, '"Retry-After": "300"', "live sitemap fails closed with retry semantics"],
  [helper, 'candidate.startsWith("//")', "canonical helper rejects protocol-relative paths"],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) throw new Error(`F20-B audit failed: ${message}`);
}

if (
  sitemap.includes("evaluateProductEvidence(product).publishable") &&
  !sitemap.includes("prototypeCommerceEntries")
) {
  throw new Error(
    "F20-B audit failed: production sitemap still depends on prototype evidence registry",
  );
}

console.log("F20-B production SEO audit: PASS");
