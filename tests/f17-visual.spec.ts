import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  { name: "collections", route: "/collections" },
  { name: "collection-detail", route: "/collections/drop-01-shabgard" },
  { name: "lookbook", route: "/lookbook" },
  { name: "journal", route: "/journal" },
  { name: "journal-detail", route: "/journal/materials-101-parche-shenasi" },
] as const;

const SNAPSHOT_VIEWPORTS = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "desktop-1440", width: 1440, height: 1000 },
] as const;

async function prepare(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
}

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
  await prepare(page);
});

for (const item of ROUTES) {
  for (const viewport of SNAPSHOT_VIEWPORTS) {
    test(`${item.name} F17 visual ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(item.route, { waitUntil: "networkidle" });
      await stabilize(page);
      await expectLayoutSafe(page);
      await expect(page).toHaveScreenshot(`f17-${item.name}-${viewport.name}.png`, {
        fullPage: true,
        animations: "disabled",
      });
    });
  }
}

for (const viewport of [
  { width: 768, height: 1024 },
  { width: 1920, height: 1080 },
]) {
  test(`F17 editorial layout envelope ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const item of ROUTES) {
      await page.goto(item.route, { waitUntil: "networkidle" });
      await stabilize(page);
      await expectLayoutSafe(page);
    }
  });
}
