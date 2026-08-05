import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
});

test("desktop mega menu is category-first, keyboard reachable and history-backed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });

  const trigger = page.getByRole("button", { name: "فروشگاه" });
  await trigger.focus();
  await page.keyboard.press("ArrowDown");

  const dialog = page.getByRole("dialog", { name: "منوی فروشگاه" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "دسته‌های محصول" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /همه محصولات/ })).toBeFocused();
  await expect(dialog.getByRole("link", { name: /هودی/ })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /حساب کاربری/ })).toBeVisible();

  await page.evaluate(() => window.history.back());
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("search supports Arrow navigation, Enter and shareable destination URLs", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "جست‌وجو" }).first().click();
  const dialog = page.getByRole("dialog", { name: "جست‌وجوی محصولات" });
  const input = page.getByRole("searchbox", { name: "عبارت جست‌وجو" });
  await expect(input).toBeFocused();
  await input.fill("هودی");
  await expect(dialog.getByRole("option")).not.toHaveCount(0);
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/hoodies$/);

  await page.getByRole("button", { name: "جست‌وجو" }).first().click();
  await input.fill("عبارت بدون نتیجه مستقیم");
  await expect(dialog.getByText("نتیجه مستقیم پیدا نشد")).toBeVisible();
  await page.getByRole("link", { name: /صفحه کامل جست‌وجو/ }).click();
  await expect(page).toHaveURL(/\/search\?q=/);
});

test("mobile navigation exposes product categories and independent account destination", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "منوی اصلی" }).click();
  const dialog = page.getByRole("dialog", { name: "منوی اصلی" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "دسته‌های محصول" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /هودی/ })).toBeVisible();
  await dialog.getByRole("link", { name: "حساب کاربری" }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole("heading", { level: 1, name: "مرکز حساب" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
});

test("mobile bottom search and cart drawer close with browser Back", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "باز کردن جست‌وجو" }).click();
  const search = page.getByRole("dialog", { name: "جست‌وجوی محصولات" });
  await expect(search).toBeVisible();
  await page.evaluate(() => window.history.back());
  await expect(search).toBeHidden();

  await page.getByRole("button", { name: /باز کردن سبد خرید/ }).click();
  const cart = page.getByRole("dialog", { name: "سبد خرید" });
  await expect(cart).toBeVisible();
  await page.evaluate(() => window.history.back());
  await expect(cart).toBeHidden();
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
]) {
  test(`global shell has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/account", { waitUntil: "networkidle" });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(2);
  });
}
