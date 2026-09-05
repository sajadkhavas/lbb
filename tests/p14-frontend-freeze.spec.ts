import { expect, test, type Page } from "@playwright/test";

const localOrigin = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";

const representativeRoutes = [
  "/",
  "/shop",
  "/hoodies",
  "/product/lbb-classic-hoodie",
  "/contact",
] as const;

const viewports = [
  { label: "mobile-390", width: 390, height: 844 },
  { label: "desktop-1440", width: 1440, height: 1000 },
] as const;

function captureRuntimeErrors(page: Page) {
  const errors: string[] = [];

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (text.startsWith("Failed to load resource:")) return;
    errors.push(text);
  });

  return errors;
}

for (const viewport of viewports) {
  for (const route of representativeRoutes) {
    test(`${viewport.label} ${route} stays responsive and hydration-stable`, async ({ page }) => {
      const errors = captureRuntimeErrors(page);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status(), `document status for ${route}`).toBeLessThan(400);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(2);

      await page.reload({ waitUntil: "networkidle" });
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(2);
      expect(errors).toEqual([]);
    });
  }
}

test("representative indexable routes expose material SSR HTML before hydration", async ({
  request,
}) => {
  for (const route of ["/", "/shop", "/hoodies", "/contact"] as const) {
    const response = await request.get(`${localOrigin}${route}`);
    expect(response.ok(), `SSR response for ${route}`).toBe(true);

    const html = await response.text();
    expect(html).toMatch(/<html[^>]*dir=["']rtl["']/i);
    expect(html).toMatch(/<title>[^<]+<\/title>/i);
    expect(html).toMatch(/<h1(?:\s|>)/i);
    expect(html).toMatch(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  }
});
