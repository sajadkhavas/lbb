import { expect, test } from "@playwright/test";

const productionOrigin = "https://lbb.example.test";

test("sitemap and robots expose absolute production URLs", async ({ request }) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBe(true);
  expect(sitemapResponse.headers()["content-type"]).toContain("application/xml");
  const sitemap = await sitemapResponse.text();
  expect(sitemap).toContain(`<loc>${productionOrigin}/</loc>`);
  expect(sitemap).toContain(`<loc>${productionOrigin}/product/lbb-classic-hoodie</loc>`);
  expect(sitemap).not.toMatch(/<loc>\//);
  expect(sitemap).not.toContain("/cart</loc>");
  expect(sitemap).not.toContain("/checkout</loc>");
  expect(sitemap).not.toContain("/track-order</loc>");

  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.ok()).toBe(true);
  expect(robotsResponse.headers()["content-type"]).toContain("text/plain");
  const robots = await robotsResponse.text();
  expect(robots).toContain(`Sitemap: ${productionOrigin}/sitemap.xml`);
  expect(robots).toContain("Disallow: /checkout");
  expect(robots).toContain("Disallow: /search");
});

test("indexable pages have absolute canonical and social metadata", async ({ page }) => {
  for (const route of [
    "/",
    "/shop",
    "/hoodies",
    "/product/lbb-classic-hoodie",
    "/collections",
    "/journal",
  ]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute(
      "href",
      new RegExp(`^${productionOrigin.replaceAll(".", "\\.")}/`),
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      new RegExp(`^${productionOrigin.replaceAll(".", "\\.")}/`),
    );
  }
});

test("private and generated states are noindex", async ({ page }) => {
  for (const route of [
    "/search?q=hoodie",
    "/cart",
    "/checkout",
    "/order-confirmation",
    "/track-order",
  ]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
});

test("fonts, manifest and service worker are deployment-safe", async ({ page, request }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const stylesheetUrls = await page
    .locator('link[rel="stylesheet"]')
    .evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
  expect(stylesheetUrls.some((url) => url.includes("fonts.googleapis.com"))).toBe(false);
  expect(stylesheetUrls.some((url) => url.includes("fonts.gstatic.com"))).toBe(false);

  const fontResponses: string[] = [];
  page.on("response", (response) => {
    if (/\.(?:woff2?|ttf|otf)(?:\?|$)/.test(response.url()) && response.ok())
      fontResponses.push(response.url());
  });
  await page.reload({ waitUntil: "networkidle" });
  expect(fontResponses.some((url) => url.startsWith("http://127.0.0.1:4173/"))).toBe(true);

  const manifestResponse = await request.get("/manifest.webmanifest");
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest.display).toBe("standalone");
  expect(manifest.theme_color).toBe("#050505");
  expect(manifest.icons.length).toBeGreaterThanOrEqual(3);

  const swResponse = await request.get("/sw.js");
  expect(swResponse.ok()).toBe(true);
  const serviceWorker = await swResponse.text();
  expect(serviceWorker).toContain("/api/");
  expect(serviceWorker).toContain("/~oauth");
  expect(serviceWorker).toContain("/sitemap.xml");
  expect(serviceWorker).not.toContain("checkout");
});
