import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
});

test("F15 PDP has no serious or critical Axe violations", async ({ page }) => {
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const blocking = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(
    blocking.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      targets: violation.nodes.flatMap((node) => node.target),
    })),
  ).toEqual([]);
});

test("gallery focus, Home/End and RTL arrow semantics remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  const gallery = page.getByRole("region", { name: /گالری تصاویر/ });
  await gallery.focus();
  await page.keyboard.press("End");
  await expect(page.getByText(/جایگاه رسانه 2 از 2/)).toBeAttached();
  await page.keyboard.press("Home");
  await expect(gallery).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(gallery).toBeFocused();
});

test("PDP survives text-spacing override at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: `
      * {
        line-height: 1.5 !important;
        letter-spacing: 0.12em !important;
        word-spacing: 0.16em !important;
      }
      p { margin-bottom: 2em !important; }
    `,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(2);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "خرید در دسترس نیست" })).toBeVisible();
});

test("reduced motion reduces sticky purchase transition to a negligible duration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  const duration = await page
    .getByTestId("pdp-sticky-buy-bar")
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration));
  expect(duration).toBeLessThanOrEqual(0.001);
});

test("PDP keeps one main landmark and one H1", async ({ page }) => {
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
});
