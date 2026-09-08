import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function source(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test(
  "E1 live sitemap follows backend publication truth instead of prototype editorial data",
  async () => {
    const sitemap = await source("src/routes/sitemap[.]xml.ts");

    expect(sitemap).toContain("const prototypeEditorialEntries");
    expect(sitemap).toContain("async function liveEditorialEntries");
    expect(sitemap).toContain("resolveStorefrontFaqs()");
    expect(sitemap).toContain("resolveStorefrontJournal()");
    expect(sitemap).toContain('resolveOptionalStorefrontPage("terms")');
    expect(sitemap).toContain('resolveOptionalStorefrontPage("privacy")');
    expect(sitemap).toContain('resolveOptionalStorefrontPage("shipping-returns")');
    expect(sitemap).toContain("...(journal ?? []).map((article)");
    expect(sitemap).toContain("if ((faqs ?? []).length > 0)");
    expect(sitemap).toContain("if (shippingReturns)");
    expect(sitemap).toContain("if (terms)");
    expect(sitemap).toContain("if (privacy)");
    expect(sitemap).toContain(
      "? await Promise.all([liveCommerceEntries(), liveEditorialEntries()])",
    );
    expect(sitemap).toContain(": [prototypeCommerceEntries(), prototypeEditorialEntries]");
  },
);

test("E1 public fallbacks are crawlable but noindex until backend publication exists", async () => {
  const [faq, terms, privacy, shipping] = await Promise.all([
    source("src/routes/faq.tsx"),
    source("src/routes/terms.tsx"),
    source("src/routes/privacy.tsx"),
    source("src/routes/shipping-returns.tsx"),
  ]);

  expect(faq).toContain("loaderData !== null && loaderData.length === 0 ? ROBOTS.NOINDEX_FOLLOW");
  expect(terms).toContain("robots: page ? undefined : ROBOTS.NOINDEX_FOLLOW");
  expect(privacy).toContain("robots: page ? undefined : ROBOTS.NOINDEX_FOLLOW");
  expect(shipping).toContain("robots: page ? undefined : ROBOTS.NOINDEX_FOLLOW");

  for (const route of [faq, terms, privacy, shipping]) {
    expect(route).toContain("ROBOTS.NOINDEX_FOLLOW");
    expect(route).not.toContain("ROBOTS.NOINDEX_NOFOLLOW");
  }
});

test("E1 does not regress the existing valid shop modifier contract", async () => {
  const [shop, filters, seoContract] = await Promise.all([
    source("src/routes/shop.tsx"),
    source("src/lib/product-filter.ts"),
    source("tests/seo-contract.spec.ts"),
  ]);

  expect(shop).toContain("hasSearchModifiers(filters)");
  expect(shop).toContain('robots: noindex ? "noindex, follow" : "index, follow"');
  expect(filters).toContain('"price-asc"');
  expect(filters).toContain('"price-desc"');
  expect(seoContract).toContain('/shop?sizes=M&sort=price-asc');
  expect(seoContract).toContain('"noindex, follow"');
});
