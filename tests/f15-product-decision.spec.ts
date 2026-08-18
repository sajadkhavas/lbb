import { expect, test } from "@playwright/test";
import {
  canPurchaseVariant,
  chooseColorMedia,
  isEvidenceFieldPublic,
  selectedVariantAvailability,
  verifiedExtensionValue,
} from "../src/lib/product-decision-policy";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-seasonal-v2-dismissed", "1");
  });
});

test("evidence publication is field-specific and fails closed", () => {
  const verified = {
    state: "verified" as const,
    source: "https://example.test/product-record",
    reviewedAt: "2026-08-07",
  };
  expect(isEvidenceFieldPublic("published", verified)).toBe(true);
  expect(isEvidenceFieldPublic("draft", verified)).toBe(false);
  expect(isEvidenceFieldPublic("archived", verified)).toBe(false);
  expect(isEvidenceFieldPublic("published", { ...verified, state: "pending" as const })).toBe(
    false,
  );
  expect(isEvidenceFieldPublic("published", { ...verified, source: null })).toBe(false);
  expect(isEvidenceFieldPublic("published", { ...verified, reviewedAt: null })).toBe(false);
});

test("verified optional decision data requires provenance", () => {
  const measurements = { unit: "cm", rows: [{ size: "M", chest: 60 }] };
  expect(
    verifiedExtensionValue({
      state: "verified",
      sourceRef: "supplier-sheet:42",
      reviewedAt: "2026-08-07",
      value: measurements,
    }),
  ).toEqual(measurements);
  expect(verifiedExtensionValue({ state: "pending" })).toBeNull();
  expect(
    verifiedExtensionValue({
      state: "verified",
      sourceRef: "",
      reviewedAt: "2026-08-07",
      value: measurements,
    }),
  ).toBeNull();
});

test("color-size matrix distinguishes available, sold-out and unavailable variants", () => {
  const variants = [
    { colorId: "black", sizeId: "M", availability: "available" as const },
    { colorId: "black", sizeId: "L", availability: "sold-out" as const },
    { colorId: "white", sizeId: "M", availability: "available" as const },
  ];
  expect(selectedVariantAvailability(variants, "black", "M")).toBe("available");
  expect(selectedVariantAvailability(variants, "black", "L")).toBe("sold-out");
  expect(selectedVariantAvailability(variants, "white", "L")).toBe("unavailable");
  expect(selectedVariantAvailability(variants, null, "M")).toBe("unknown");
  expect(
    canPurchaseVariant({
      commerceReady: true,
      productAvailability: "available",
      variantAvailability: "available",
    }),
  ).toBe(true);
  expect(
    canPurchaseVariant({
      commerceReady: true,
      productAvailability: "available",
      variantAvailability: "sold-out",
    }),
  ).toBe(false);
});

test("color-specific media falls back to verified general media", () => {
  const fallback = ["general-1", "general-2"];
  const byColor = { black: ["black-1", "black-2"], white: [] };
  expect(chooseColorMedia(fallback, byColor, "black")).toEqual(["black-1", "black-2"]);
  expect(chooseColorMedia(fallback, byColor, "white")).toEqual(fallback);
  expect(chooseColorMedia(fallback, byColor, "missing")).toEqual(fallback);
  expect(chooseColorMedia(fallback, byColor, null)).toEqual(fallback);
});

test("valid draft PDP hides unsupported commerce facts and disables purchase", async ({ page }) => {
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("اطلاعات محصول در انتظار تأیید");
  await expect(page.getByText("هودی کلاسیک LBB", { exact: true })).toHaveCount(0);
  await expect(page.getByText("۱٬۸۵۰٬۰۰۰ تومان", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/فرنچ‌تری ۳۲۰/)).toHaveCount(0);
  await expect(page.getByText(/دو سایز بزرگ‌تر/)).toHaveCount(0);
  await expect(page.getByTestId("pdp-color-selector")).toHaveCount(0);
  await expect(page.getByTestId("pdp-size-selector")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "خرید در دسترس نیست" })).toBeDisabled();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
});

test("invalid PDP remains a designed page-level failure", async ({ page }) => {
  await page.goto("/product/f15-does-not-exist", { waitUntil: "networkidle" });
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByTestId("pdp-color-selector")).toHaveCount(0);
});

test("pending gallery is keyboard usable without borrowing another product image", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  const tablist = page.getByRole("tablist", { name: /تصاویر محصول/ });
  const tabs = tablist.getByRole("tab");
  await expect(tabs).toHaveCount(2);
  await tabs.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tabs.first()).toBeFocused();
  await page.keyboard.press("End");
  await expect(tabs.last()).toBeFocused();
  await expect(page.locator('main img[alt*="هودی کلاسیک"]')).toHaveCount(0);
});

test("mobile PDP is RTL, touch-safe and does not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).direction)).toBe(
    "rtl",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(2);
  const dots = page.locator('[aria-label="انتخاب تصویر"] button');
  expect(await dots.count()).toBeGreaterThan(0);
  for (let index = 0; index < (await dots.count()); index += 1) {
    const box = await dots.nth(index).boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test("sticky purchase surface stays above mobile navigation and reflects blocked state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  const buyButton = page.getByRole("button", {
    name: "خرید در دسترس نیست",
  });

  await page.getByText("اطلاعات تصمیم‌گیری").evaluate((element) => {
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

  const sticky = page.getByTestId("pdp-sticky-buy-bar");
  await expect(sticky).toHaveAttribute("aria-hidden", "false");
  const stickyBox = await sticky.boundingBox();
  const mobileNav = page
    .locator("nav")
    .filter({ has: page.getByText("خانه") })
    .last();
  const navBox = await mobileNav.boundingBox();
  if (stickyBox && navBox) expect(stickyBox.y + stickyBox.height).toBeLessThanOrEqual(navBox.y + 2);
  await expect(sticky.locator("button")).toBeDisabled();
});

test("draft PDP has no fabricated discovery or unsupported urgency claims", async ({ page }) => {
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  await expect(page.getByTestId("pdp-complete-look")).toHaveCount(0);
  await expect(page.getByTestId("pdp-related-products")).toHaveCount(0);
  const text = (await page.locator("main").innerText()).toLowerCase();
  expect(text).not.toMatch(/best seller|most popular|فقط\s+\d+|تنها\s+\d+|رو به اتمام/);
});
