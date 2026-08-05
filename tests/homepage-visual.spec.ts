import { expect, test, type Page } from "@playwright/test";

async function stabilize(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1000 },
]) {
  test(`F13 hero ${viewport.name} visual contract`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle" });
    await stabilize(page);
    await expect(page.locator('section[aria-labelledby="home-hero-title"]')).toHaveScreenshot(
      `f13-hero-${viewport.name}.png`,
      { animations: "disabled" },
    );
  });
}

test("F13 category gateway desktop visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  await stabilize(page);
  await expect(page.locator("#home-categories")).toHaveScreenshot(
    "f13-category-gateway-desktop.png",
    { animations: "disabled" },
  );
});

test("F13 product moments mobile visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await stabilize(page);
  await expect(page.locator('section[aria-labelledby="home-products-title"]')).toHaveScreenshot(
    "f13-product-moments-mobile.png",
    { animations: "disabled" },
  );
});

test("F13 drop story desktop visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  await stabilize(page);
  await expect(page.locator('section[aria-labelledby="drop-story-title"]')).toHaveScreenshot(
    "f13-drop-story-desktop.png",
    { animations: "disabled" },
  );
});

test("F13 shop the look mobile visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await stabilize(page);
  await expect(page.locator('section[aria-labelledby="shop-look-title"]')).toHaveScreenshot(
    "f13-shop-the-look-mobile.png",
    { animations: "disabled" },
  );
});
