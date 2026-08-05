import { expect, test, type Page } from "@playwright/test";

const homeViewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "wide-1920", width: 1920, height: 1080 },
];

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
  await page.waitForTimeout(250);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const viewport of homeViewports) {
  test(`homepage visual baseline ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "networkidle" });
    await stabilize(page);
    await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });
}

const templates = [
  { name: "shop-mobile", route: "/shop", width: 390, height: 844 },
  { name: "product-desktop", route: "/product/lbb-classic-hoodie", width: 1440, height: 1000 },
  { name: "collections-desktop", route: "/collections", width: 1440, height: 1000 },
  { name: "checkout-empty-mobile", route: "/checkout", width: 390, height: 844 },
  { name: "design-system-mobile", route: "/design-system", width: 390, height: 844 },
  { name: "design-system-desktop", route: "/design-system", width: 1440, height: 1000 },
  { name: "account-mobile", route: "/account", width: 390, height: 844 },
  { name: "account-desktop", route: "/account", width: 1440, height: 1000 },
];

for (const template of templates) {
  test(`${template.name} visual baseline`, async ({ page }) => {
    await page.setViewportSize({ width: template.width, height: template.height });
    await page.goto(template.route, { waitUntil: "networkidle" });
    await stabilize(page);
    await expect(page).toHaveScreenshot(`${template.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });
}

test("desktop mega menu visual baseline", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "فروشگاه" }).click();
  await stabilize(page);
  await expect(page).toHaveScreenshot("navigation-mega-desktop.png", {
    animations: "disabled",
  });
});

test("desktop search overlay visual baseline", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "جست‌وجو" }).first().click();
  await page.getByRole("searchbox", { name: "عبارت جست‌وجو" }).fill("هودی");
  await stabilize(page);
  await expect(page).toHaveScreenshot("navigation-search-desktop.png", {
    animations: "disabled",
  });
});

test("mobile main menu visual baseline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "منوی اصلی" }).click();
  await stabilize(page);
  await expect(page).toHaveScreenshot("navigation-menu-mobile.png", {
    animations: "disabled",
  });
});

test("mobile empty cart drawer visual baseline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /باز کردن سبد خرید/ }).click();
  await stabilize(page);
  await expect(page).toHaveScreenshot("navigation-cart-mobile.png", {
    animations: "disabled",
  });
});
