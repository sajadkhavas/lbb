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

async function expectLayoutSafe(page: Page) {
  const metrics = await page.evaluate(() => ({
    direction: getComputedStyle(document.documentElement).direction,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1Count: document.querySelectorAll("h1").length,
    mainWidth: document.querySelector("main")?.getBoundingClientRect().width ?? 0,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(metrics.direction).toBe("rtl");
  expect(metrics.overflow).toBeLessThanOrEqual(2);
  expect(metrics.h1Count).toBe(1);
  expect(metrics.mainWidth).toBeLessThanOrEqual(metrics.viewportWidth + 2);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-seasonal-v2-dismissed", "1");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const viewport of homeViewports) {
  test(`homepage visual baseline ${viewport.name}`, async ({ page }) => {
    if (viewport.width >= 1440) {
      test.setTimeout(60_000);
    }

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    await page
      .getByRole("heading", {
        name: "استایل روزمره، از مهستان کرج.",
      })
      .waitFor({
        state: "visible",
      });

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

const trustSurfaceViewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "desktop-1440", width: 1440, height: 1000 },
];

const trustSurfaceRoutes = [
  "/checkout",
  "/shipping-returns",
  "/contact",
  "/terms",
  "/privacy",
  "/order-confirmation",
  "/track-order",
];

for (const viewport of trustSurfaceViewports) {
  for (const route of trustSurfaceRoutes) {
    test(`F14E trust surface layout ${viewport.name} ${route}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto(route, {
        waitUntil: "domcontentloaded",
      });

      await page.locator("main h1").waitFor({
        state: "visible",
      });

      await stabilize(page);
      await expectLayoutSafe(page);
    });
  }
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

test("mobile empty cart drawer preserves visual layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /باز کردن سبد خرید/ }).click();
  await stabilize(page);
  const cart = page.getByRole("dialog", { name: "سبد خرید" });
  await expect(cart).toBeVisible();
  const box = await cart.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.width).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(392);
});
