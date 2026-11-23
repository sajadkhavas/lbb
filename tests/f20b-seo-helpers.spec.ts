import { expect, test } from "@playwright/test";
import { backendCanonicalPath, sitemapLastmod, xmlEscape } from "../src/lib/seo-live";

test("backend canonical paths accept only clean internal paths", () => {
  expect(backendCanonicalPath({ canonicalPath: "/product/verified" }, "/product/fallback")).toBe(
    "/product/verified",
  );
  expect(
    backendCanonicalPath({ canonicalPath: "https://evil.example/x" }, "/product/fallback"),
  ).toBe("/product/fallback");
  expect(backendCanonicalPath({ canonicalPath: "//evil.example/x" }, "/product/fallback")).toBe(
    "/product/fallback",
  );
  expect(backendCanonicalPath({ canonicalPath: "/product/x?q=1" }, "/product/fallback")).toBe(
    "/product/fallback",
  );
  expect(backendCanonicalPath({ canonicalPath: "/product/x#fragment" }, "/product/fallback")).toBe(
    "/product/fallback",
  );
});

test("sitemap helpers emit validated timestamps and escaped XML", () => {
  expect(sitemapLastmod("2026-08-09T12:30:00Z")).toBe("2026-08-09T12:30:00.000Z");
  expect(sitemapLastmod("not-a-date")).toBeNull();
  expect(xmlEscape('/product/a&b<"c"')).toBe("/product/a&amp;b&lt;&quot;c&quot;");
});
