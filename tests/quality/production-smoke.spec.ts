import { expect, test } from "@playwright/test";

const configuredOrigin = new URL(process.env.VITE_SITE_URL || "https://lbb.test").origin;

function extractLocations(xml: string): string[] {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1]
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"')
      .replaceAll("&apos;", "'"),
  );
}

test("homepage SSR contains absolute SEO metadata and local assets", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBeTruthy();
  const html = await response.text();

  expect(html).toContain('<html lang="fa" dir="rtl">');
  expect(html).toContain(`rel="canonical" href="${configuredOrigin}/"`);
  expect(html).toContain(`property="og:image" content="${configuredOrigin}/icons/icon-512.png"`);
  expect(html).toContain('type="application/ld+json"');
  expect(html).not.toContain("fonts.googleapis.com");
  expect(html).not.toContain("fonts.gstatic.com");
  expect(html).not.toContain("/__l5e/");
  expect(html).not.toContain("assets-v1/");
});

test("sitemap contains only absolute, unique URLs", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/xml");

  const xml = await response.text();
  const locations = extractLocations(xml);
  expect(locations.length).toBeGreaterThan(10);
  expect(new Set(locations).size).toBe(locations.length);
  for (const location of locations) {
    expect(() => new URL(location)).not.toThrow();
    expect(location.startsWith(`${configuredOrigin}/`)).toBeTruthy();
  }
});

test("robots, manifest and service worker are production-ready", async ({ request }) => {
  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.ok()).toBeTruthy();
  const robots = await robotsResponse.text();
  expect(robots).toContain(`Sitemap: ${configuredOrigin}/sitemap.xml`);
  expect(robots).not.toContain("{{SITE_URL}}");
  expect(robots).toContain("Disallow: /checkout");
  expect(robots).toContain("Disallow: /order-confirmation");

  const manifestResponse = await request.get("/manifest.webmanifest");
  expect(manifestResponse.ok()).toBeTruthy();
  const manifest = await manifestResponse.json();
  expect(manifest.name).toBeTruthy();
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

  const workerResponse = await request.get("/sw.js");
  expect(workerResponse.ok()).toBeTruthy();
  const worker = await workerResponse.text();
  expect(worker.length).toBeGreaterThan(500);
  expect(worker).toContain("lbb-public-pages-v1");
  expect(worker).not.toContain("lbb-pages");
});

test("browser requests self-hosted fonts and optimized logo", async ({ page, request }) => {
  const requestedUrls: string[] = [];
  page.on("request", (browserRequest) => requestedUrls.push(browserRequest.url()));

  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  expect(requestedUrls.some((url) => url.includes("fonts.googleapis.com"))).toBeFalsy();
  expect(requestedUrls.some((url) => url.includes("fonts.gstatic.com"))).toBeFalsy();
  expect(
    requestedUrls.some((url) => url.startsWith(page.url().split("/").slice(0, 3).join("/")) && url.endsWith(".woff2")),
  ).toBeTruthy();

  await expect(page.locator('img[src="/brand/lbb-logo.svg"]').first()).toBeVisible();
  const logoResponse = await request.get("/brand/lbb-logo.svg");
  expect(logoResponse.ok()).toBeTruthy();
  expect((await logoResponse.body()).byteLength).toBeLessThan(4096);
});
