import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function source(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("E1 sitemap follows live publication truth", async () => {
  const sitemap = await source("src/routes/sitemap[.]xml.ts");

  expect(sitemap).toContain("const prototypeEditorialEntries");
  expect(sitemap).toContain("async function liveEditorialEntries");
  expect(sitemap).toContain("resolveStorefrontFaqs()");
  expect(sitemap).toContain("resolveStorefrontJournal()");
  expect(sitemap).toContain('resolveOptionalStorefrontPage("terms")');
  expect(sitemap).toContain('resolveOptionalStorefrontPage("privacy")');
  expect(sitemap).toContain('resolveOptionalStorefrontPage("shipping-returns")');
  expect(sitemap).toContain("liveCommerceEntries()");
  expect(sitemap).toContain("liveEditorialEntries()");
  expect(sitemap).toContain("prototypeCommerceEntries()");
  expect(sitemap).toContain("prototypeEditorialEntries");
});

test("E1 unpublished fallbacks stay crawlable noindex", async () => {
  const [faq, terms, privacy, shipping] = await Promise.all([
    source("src/routes/faq.tsx"),
    source("src/routes/terms.tsx"),
    source("src/routes/privacy.tsx"),
    source("src/routes/shipping-returns.tsx"),
  ]);

  expect(faq).toContain("Array.isArray(loaderData) && loaderData.length === 0");
  expect(terms).toContain("robots: page ? undefined");
  expect(privacy).toContain("robots: page ? undefined");
  expect(shipping).toContain("robots: page ? undefined");

  for (const route of [faq, terms, privacy, shipping]) {
    expect(route).toContain("ROBOTS.NOINDEX_FOLLOW");
    expect(route).not.toContain("ROBOTS.NOINDEX_NOFOLLOW");
  }
});

test("E1 keeps the valid shop modifier contract", async () => {
  const [shop, filters, seoContract] = await Promise.all([
    source("src/routes/shop.tsx"),
    source("src/lib/product-filter.ts"),
    source("tests/seo-contract.spec.ts"),
  ]);

  expect(shop).toContain("hasSearchModifiers(filters)");
  expect(shop).toContain('robots: noindex ? "noindex, follow" : "index, follow"');
  expect(filters).toContain('"price-asc"');
  expect(filters).toContain('"price-desc"');
  expect(seoContract).toContain("/shop?sizes=M&sort=price-asc");
  expect(seoContract).toContain('"noindex, follow"');
});

test("E1 SSR credential stays server-only and scoped", async () => {
  const server = await source("src/server.ts");
  const ssrFetch = await source("src/lib/backend-ssr-fetch.ts");

  expect(server).toContain("installBackendSsrFetchCredential();");
  expect(ssrFetch).toContain("process.env.LBB_SSR_RATE_LIMIT_TOKEN");
  expect(ssrFetch).not.toContain("VITE_LBB_SSR_RATE_LIMIT_TOKEN");
  expect(ssrFetch).toContain('url.pathname.startsWith("/api/v1/")');
  expect(ssrFetch).toContain('redirect: "error"');
});
