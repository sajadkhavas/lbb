import { expect, test, type Page } from "@playwright/test";

const viewports = [
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
  await page.waitForTimeout(200);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-seasonal-v2-dismissed", "1");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const viewport of viewports) {
  test(`F15 PDP default evidence-safe visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
    await stabilize(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(2);
    await expect(page).toHaveScreenshot(`f15-pdp-default-${viewport.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });
}

test("F15 mobile sticky blocked state visual", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });

  const sticky = page.getByTestId("pdp-sticky-buy-bar");
  const buyButton = page.getByRole("button", {
    name: "خرید در دسترس نیست",
  });

  await page.getByRole("heading", { name: "اطلاعات تصمیم‌گیری" }).evaluate((element) => {
    element.scrollIntoView({
      block: "start",
      behavior: "auto",
    });
  });

  const viewportHeight = page.viewportSize()?.height ?? 844;

  await expect
    .poll(async () => {
      const box = await buyButton.boundingBox();

      if (!box) return true;

      return box.y + box.height <= 0 || box.y >= viewportHeight;
    })
    .toBe(true);

  await expect(sticky).toHaveAttribute("aria-hidden", "false");

  await stabilize(page);

  await expect(page).toHaveScreenshot("f15-pdp-sticky-blocked-mobile.png", {
    animations: "disabled",
  });
});

test("F15 gallery focused state visual", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  await page.getByRole("region", { name: /گالری/ }).focus();
  await page.keyboard.press("End");
  await stabilize(page);
  await expect(page).toHaveScreenshot("f15-pdp-gallery-focused-desktop.png", {
    animations: "disabled",
  });
});
