import { expect, test } from "@playwright/test";

const origin = "http://127.0.0.1:4173";

test("canonical, robots and sitemap are absolute and environment-aware", async ({
  page,
  request,
}) => {
  await page.goto("/shop", { waitUntil: "networkidle" });
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toBe("https://lbb.example.test/shop");

  const robots = await request.get(`${origin}/robots.txt`);
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Sitemap: https://lbb.example.test/sitemap.xml");

  const sitemap = await request.get(`${origin}/sitemap.xml`);
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml).toContain("<loc>https://lbb.example.test/</loc>");
  expect(xml).not.toMatch(/<loc>\//);
});

test("filtered listing URLs are noindex with a clean canonical", async ({ page }) => {
  await page.goto("/hoodies?sizes=M&sort=price-asc", { waitUntil: "networkidle" });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://lbb.example.test/hoodies",
  );
});

test("fonts are self-hosted, loaded and free of external font requests", async ({
  page,
  request,
}) => {
  const externalFonts: string[] = [];
  page.on("request", (requestEvent) => {
    const url = requestEvent.url();
    if (/fonts\.googleapis|fonts\.gstatic|use\.typekit|fontshare/i.test(url))
      externalFonts.push(url);
  });

  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px "Estedad"'))).toBe(true);
  expect(await page.evaluate(() => document.fonts.check('16px "JetBrains Mono"'))).toBe(true);
  expect(externalFonts).toEqual([]);

  const stylesheets = await page
    .locator('link[rel="stylesheet"]')
    .evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
  const fontUrls: string[] = [];
  for (const stylesheet of stylesheets) {
    const response = await request.get(stylesheet);
    if (!response.ok()) continue;
    const css = await response.text();
    for (const match of css.matchAll(/url\(([^)]+\.woff2)\)/g)) {
      fontUrls.push(new URL(match[1].replace(/["']/g, ""), stylesheet).href);
    }
  }
  expect(fontUrls.length).toBeGreaterThan(0);
  expect(fontUrls.every((url) => new URL(url).origin === origin)).toBe(true);
  expect((await request.get(fontUrls[0])).ok()).toBe(true);
});

test("PWA files are valid and navigation is not cached with a stale-first strategy", async ({
  request,
}) => {
  const manifest = await request.get(`${origin}/manifest.webmanifest`);
  expect(manifest.ok()).toBe(true);
  const data = await manifest.json();
  expect(data.name).toBe("LBB — لباس برای بیرون");
  expect(data.start_url).toBe("/");

  const worker = await request.get(`${origin}/sw.js`);
  expect(worker.ok()).toBe(true);
  const source = await worker.text();
  expect(source).toContain('request.mode === "navigate"');
  expect(source).not.toMatch(/navigate[\s\S]{0,500}caches\.match/i);
});
