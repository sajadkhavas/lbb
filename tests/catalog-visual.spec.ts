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
  await page.waitForTimeout(250);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("F14 shop desktop visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/shop", { waitUntil: "networkidle" });
  await stabilize(page);
  await expect(page).toHaveScreenshot("f14-shop-desktop.png", {
    fullPage: true,
    animations: "disabled",
  });
});

test("F14 category desktop visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/hoodies", { waitUntil: "networkidle" });
  await stabilize(page);
  await expect(page).toHaveScreenshot("f14-category-desktop.png", {
    fullPage: true,
    animations: "disabled",
  });
});

test("F14 search results mobile visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/search?q=هودی", { waitUntil: "networkidle" });
  await stabilize(page);
  await expect(page).toHaveScreenshot("f14-search-mobile.png", {
    fullPage: true,
    animations: "disabled",
  });
});

test("F14 staged mobile filter drawer visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /فیلترها/ }).first().click();
  const dialog = page.getByRole("dialog", { name: /فیلتر محصولات/ });
  await dialog.getByRole("checkbox", { name: "فقط کالاهای موجود" }).click();
  await stabilize(page);
  await expect(page).toHaveScreenshot("f14-filter-drawer-mobile.png", {
    animations: "disabled",
  });
});
