import { expect, test } from "@playwright/test";

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-seasonal-v2-dismissed", "1");
  });
  await page.goto("/design-system", { waitUntil: "networkidle" });
});

test("reference route exposes the F11 token contract and stays noindex", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1, name: "Karaj After Dark" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.locator("[data-token]")).toHaveCount(12);

  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      canvas: styles.getPropertyValue("--lbb-surface-canvas").trim(),
      raised: styles.getPropertyValue("--lbb-surface-raised").trim(),
      text: styles.getPropertyValue("--lbb-text-primary").trim(),
      action: styles.getPropertyValue("--lbb-action-primary").trim(),
      focus: styles.getPropertyValue("--lbb-focus").trim(),
      section: styles.getPropertyValue("--lbb-section-md").trim(),
      overlay: styles.getPropertyValue("--z-overlay").trim(),
    };
  });

  for (const value of Object.values(tokens)) expect(value).not.toBe("");
  expect(tokens.action).toBe(tokens.focus);
});

test("choice and icon controls expose pressed state", async ({ page }) => {
  const medium = page.getByRole("button", { name: "M", exact: true });
  await medium.click();
  await expect(medium).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "L", exact: true })).toHaveAttribute(
    "aria-pressed",
    "false",
  );

  const wishlist = page.getByRole("button", { name: "افزودن به علاقه‌مندی‌ها" });
  await wishlist.click();
  await expect(page.getByRole("button", { name: "حذف از علاقه‌مندی‌ها" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("focus indicator and disabled/loading states are explicit", async ({ page }) => {
  const primary = page.getByRole("button", { name: "اقدام اصلی" });
  await primary.focus();
  const focus = await primary.evaluate((element) => {
    const styles = getComputedStyle(element);
    return { outlineStyle: styles.outlineStyle, outlineWidth: styles.outlineWidth };
  });
  expect(focus.outlineStyle).not.toBe("none");
  expect(Number.parseFloat(focus.outlineWidth)).toBeGreaterThanOrEqual(2);

  await expect(page.getByRole("button", { name: "در حال انجام" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "در حال انجام" })).toHaveAttribute(
    "aria-busy",
    "true",
  );
  await expect(page.getByRole("button", { name: "غیرفعال" })).toBeDisabled();
  await expect(page.locator('input[aria-invalid="true"]')).toHaveAttribute(
    "aria-describedby",
    "coupon-error",
  );
});

for (const viewport of viewports) {
  test(`reference page has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.reload({ waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(2);
  });
}
