import { readFile, writeFile } from "node:fs/promises";

async function read(path) {
  return readFile(path, "utf8");
}

async function write(path, content) {
  await writeFile(path, content, "utf8");
}

function replaceOnce(content, before, after, label) {
  const first = content.indexOf(before);
  if (first === -1) throw new Error(`F20-A bootstrap could not find: ${label}`);
  if (content.indexOf(before, first + before.length) !== -1) {
    throw new Error(`F20-A bootstrap replacement is ambiguous: ${label}`);
  }
  return `${content.slice(0, first)}${after}${content.slice(first + before.length)}`;
}

async function patch(path, transforms) {
  let content = await read(path);
  for (const [before, after, label] of transforms) {
    content = replaceOnce(content, before, after, `${path} :: ${label}`);
  }
  await write(path, content);
}

await patch("src/lib/site.ts", [
  [
    `export const OG_IMAGE = absUrl("/icons/icon-512.png");\nexport const NOINDEX = { name: "robots", content: "noindex, nofollow" } as const;`,
    `export const OG_IMAGE = absUrl("/icons/icon-512.png");\nexport const ROBOTS = {\n  INDEX_FOLLOW: "index, follow",\n  NOINDEX_FOLLOW: "noindex, follow",\n  NOINDEX_NOFOLLOW: "noindex, nofollow",\n} as const;\nexport type RobotsDirective = (typeof ROBOTS)[keyof typeof ROBOTS];\nexport const NOINDEX = { name: "robots", content: ROBOTS.NOINDEX_NOFOLLOW } as const;`,
    "robots vocabulary",
  ],
  [
    `  type?: "website" | "article" | "product";\n  noindex?: boolean;`,
    `  type?: "website" | "article" | "product";\n  robots?: RobotsDirective;\n  noindex?: boolean;`,
    "pageMeta robots option",
  ],
  [
    `  const { title, description, path, image, type = "website", noindex } = opts;`,
    `  const { title, description, path, image, type = "website", robots, noindex } = opts;`,
    "pageMeta destructure",
  ],
  [
    `    { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" },`,
    `    {\n      name: "robots",\n      content: robots ?? (noindex ? ROBOTS.NOINDEX_FOLLOW : ROBOTS.INDEX_FOLLOW),\n    },`,
    "robots directive semantics",
  ],
  [
    `  if (!noindex) {\n    meta.push({ property: "og:image", content: img });\n    meta.push({ name: "twitter:image", content: img });\n  }`,
    `  meta.push({ property: "og:image", content: img });\n  meta.push({ name: "twitter:image", content: img });`,
    "noindex social preview",
  ],
]);

await patch("src/routes/robots[.]txt.ts", [
  [
    `            "Allow: /",\n            "Disallow: /checkout",\n            "Disallow: /order-confirmation",\n            "Disallow: /track-order",\n            "Disallow: /search",\n            "Disallow: /cart",\n            \`Sitemap: \${absUrl("/sitemap.xml")}\`,`,
    `            "Allow: /",\n            \`Sitemap: \${absUrl("/sitemap.xml")}\`,`,
    "crawlable noindex HTML",
  ],
]);

await patch("src/routes/sitemap[.]xml.ts", [
  [
    `import { JOURNAL_ARTICLES } from "@/lib/journal";\nimport { absUrl } from "@/lib/site";`,
    `import { JOURNAL_ARTICLES } from "@/lib/journal";\nimport { evaluateProductEvidence } from "@/lib/product-evidence";\nimport { absUrl } from "@/lib/site";`,
    "product evidence import",
  ],
  [
    `          ...products.map((product) => ({\n            path: \`/product/\${product.slug}\`,\n            priority: "0.8",\n            changefreq: "weekly",\n          })),`,
    `          ...products\n            .filter((product) => evaluateProductEvidence(product).publishable)\n            .map((product) => ({\n              path: \`/product/\${product.slug}\`,\n              priority: "0.8",\n              changefreq: "weekly",\n            })),`,
    "publication-aware product sitemap",
  ],
]);

await patch("src/routes/index.tsx", [
  [
    `  description: BRAND.shortIntroduction,\n  priceRange: "$$",\n  currenciesAccepted: "IRR",\n  address: {\n    "@type": "PostalAddress",\n    streetAddress: BRAND.physicalLocation,\n    addressLocality: BRAND.city,`,
    `  description: BRAND.shortIntroduction,\n  address: {\n    "@type": "PostalAddress",\n    addressLocality: BRAND.city,`,
    "truth-safe ClothingStore fields",
  ],
]);

await patch("src/routes/__root.tsx", [
  [
    `function NotFoundComponent() {\n  return (\n    <main`,
    `function NotFoundComponent() {\n  return (\n    <>\n      <title>صفحه پیدا نشد | LBB</title>\n      <meta name="robots" content="noindex, nofollow" />\n      <main`,
    "404 metadata fragment start",
  ],
  [
    `      </div>\n    </main>\n  );\n}\n\nfunction ErrorComponent`,
    `      </div>\n      </main>\n    </>\n  );\n}\n\nfunction ErrorComponent`,
    "404 metadata fragment end",
  ],
]);

await patch("src/routes/product.$slug.tsx", [
  [
    `import { recordRecentlyViewed } from "@/lib/recently-viewed";\nimport { absAsset, absUrl, breadcrumbLd as buildBreadcrumbLd } from "@/lib/site";`,
    `import { recordRecentlyViewed } from "@/lib/recently-viewed";\nimport { evaluateProductEvidence } from "@/lib/product-evidence";\nimport {\n  absAsset,\n  absUrl,\n  breadcrumbLd as buildBreadcrumbLd,\n  canonical,\n  pageMeta,\n  ROBOTS,\n} from "@/lib/site";`,
    "SEO publication imports",
  ],
  [
    `      return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex" }] };`,
    `      return {\n        meta: [{ title: "پیدا نشد" }, { name: "robots", content: ROBOTS.NOINDEX_NOFOLLOW }],\n      };`,
    "invalid product robots",
  ],
  [
    `    const title = \`\${product.name} | خرید از LBB — \${category.nameFa}\`.slice(0, 59);\n    const description = \`\${product.shortDescription} قیمت: \${fmtToman(product.price)}.\`.slice(\n      0,\n      159,\n    );`,
    `    const title = \`\${product.name} | خرید از LBB — \${category.nameFa}\`.slice(0, 59);\n    const evidence = evaluateProductEvidence(product);\n    const description = (\n      evidence.publishable\n        ? \`\${product.shortDescription} قیمت: \${fmtToman(product.price)}.\`\n        : product.shortDescription\n    ).slice(0, 159);`,
    "publication-aware metadata description",
  ],
  [
    `        itemCondition: "https://schema.org/NewCondition",\n        seller: { "@type": "Organization", name: "LBB" },\n`,
    ``,
    "remove unverified offer condition and seller",
  ],
  [
    `    return {\n      meta: [\n        { title },\n        { name: "description", content: description },\n        { name: "robots", content: "index, follow" },\n        { property: "og:title", content: title },\n        { property: "og:description", content: description },\n        { property: "og:type", content: "product" },\n        { property: "og:url", content: absUrl(path) },\n        { property: "og:image", content: gallery[0] },\n        { name: "twitter:card", content: "summary_large_image" },\n        { name: "twitter:title", content: title },\n        { name: "twitter:description", content: description },\n        { name: "twitter:image", content: gallery[0] },\n      ],\n      links: [{ rel: "canonical", href: absUrl(path) }],\n      scripts: [\n        { type: "application/ld+json", children: JSON.stringify(productLd) },\n        { type: "application/ld+json", children: JSON.stringify(crumbs) },\n      ],\n    };`,
    `    return {\n      meta: pageMeta({\n        title,\n        description,\n        path,\n        image: gallery[0],\n        type: "product",\n        robots: evidence.publishable ? ROBOTS.INDEX_FOLLOW : ROBOTS.NOINDEX_NOFOLLOW,\n      }),\n      links: canonical(path),\n      scripts: [\n        ...(evidence.publishable\n          ? [{ type: "application/ld+json", children: JSON.stringify(productLd) }]\n          : []),\n        { type: "application/ld+json", children: JSON.stringify(crumbs) },\n      ],\n    };`,
    "truth-safe product head and schema gate",
  ],
]);

await patch("src/routes/shop.tsx", [
  [
    `import { products } from "@/lib/product-catalog";\nimport { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";`,
    `import { products } from "@/lib/product-catalog";\nimport { evaluateProductEvidence } from "@/lib/product-evidence";\nimport { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";`,
    "shop evidence import",
  ],
  [
    `function createItemListLd() {\n  return {`,
    `function createItemListLd() {\n  const publishedProducts = products.filter((product) => evaluateProductEvidence(product).publishable);\n  return {`,
    "shop published item set",
  ],
  [
    `    numberOfItems: products.length,\n    itemListElement: products.slice(0, 20).map((product, index) => ({`,
    `    numberOfItems: publishedProducts.length,\n    itemListElement: publishedProducts.slice(0, 20).map((product, index) => ({`,
    "shop ItemList truth gate",
  ],
]);

await patch("src/routes/$category.tsx", [
  [
    `import { productsByCategory } from "@/lib/products";\nimport { absAsset, absUrl, breadcrumbLd, canonical, pageMeta } from "@/lib/site";`,
    `import { productsByCategory } from "@/lib/products";\nimport { evaluateProductEvidence } from "@/lib/product-evidence";\nimport { absAsset, absUrl, breadcrumbLd, canonical, pageMeta } from "@/lib/site";`,
    "category evidence import",
  ],
  [
    `    const { cat, items } = loaderData;\n    const filters = parseFilters(match.search as unknown as Record<string, unknown>);`,
    `    const { cat, items } = loaderData;\n    const publishedItems = items.filter((product) => evaluateProductEvidence(product).publishable);\n    const filters = parseFilters(match.search as unknown as Record<string, unknown>);`,
    "category published item set",
  ],
  [
    `      numberOfItems: items.length,\n      itemListElement: items.slice(0, 20).map((product, index) => ({`,
    `      numberOfItems: publishedItems.length,\n      itemListElement: publishedItems.slice(0, 20).map((product, index) => ({`,
    "category ItemList truth gate",
  ],
]);

await patch("src/routes/collections.$slug.tsx", [
  [
    `import { products, type Product } from "@/lib/products";\nimport { productImage } from "@/lib/product-images";`,
    `import { products, type Product } from "@/lib/products";\nimport { evaluateProductEvidence } from "@/lib/product-evidence";\nimport { productImage } from "@/lib/product-images";`,
    "collection evidence import",
  ],
  [
    `    const { collection, items } = loaderData;\n    const path = \`/collections/\${collection.slug}\`;`,
    `    const { collection, items } = loaderData;\n    const publishedItems = items.filter((product) => evaluateProductEvidence(product).publishable);\n    const path = \`/collections/\${collection.slug}\`;`,
    "collection published item set",
  ],
  [
    `      numberOfItems: items.length,\n      itemListElement: items.map((product, index) => ({`,
    `      numberOfItems: publishedItems.length,\n      itemListElement: publishedItems.map((product, index) => ({`,
    "collection ItemList truth gate",
  ],
]);

await patch("package.json", [
  [
    `    "test:a11y": "playwright test tests/accessibility.spec.ts",\n    "test:visual": "playwright test tests/visual.spec.ts",`,
    `    "test:a11y": "playwright test tests/accessibility.spec.ts",\n    "test:seo": "playwright test tests/seo-contract.spec.ts tests/seo-pwa.spec.ts",\n    "test:visual": "playwright test tests/visual.spec.ts",`,
    "dedicated SEO test command",
  ],
]);

await patch("tests/seo-contract.spec.ts", [
  [
    `import { expect, test } from "@playwright/test";`,
    `import { expect, test, type Page } from "@playwright/test";`,
    "Page type import",
  ],
  [
    `async function jsonLd(page: Parameters<typeof test>[0] extends never ? never : any) {`,
    `async function jsonLd(page: Page) {`,
    "typed jsonLd helper",
  ],
]);

console.log("F20-A deterministic SEO patches applied.");
