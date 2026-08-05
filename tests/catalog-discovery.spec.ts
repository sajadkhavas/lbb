import { expect, test } from "@playwright/test";

async function preparePage(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
}

test.beforeEach(async ({ page }) => {
  await preparePage(page);
});

test("catalogue inventory and merchandising labels stay evidence-safe", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/shop", { waitUntil: "networkidle" });

  await expect(page.getByText(/۸ قطعه در کاتالوگ.*۷ موجود.*۱ ناموجود/)).toBeVisible();
  await expect(page.getByText("پرفروش‌ترین", { exact: true })).toHaveCount(0);

  const sort = page.getByRole("combobox", { name: "مرتب‌سازی محصولات" });
  await sort.click();
  await expect(page.getByRole("option", { name: "منتخب LBB" })).toBeVisible();
});

test("desktop facets expose result counts and unavailable states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/shop", { waitUntil: "networkidle" });

  const filters = page.getByLabel("فیلتر محصولات");
  await expect(filters).toBeVisible();
  await expect(filters.locator('[aria-label*="نتیجه"]').first()).toBeVisible();
  await expect(filters.getByText("دسته‌بندی")).toBeVisible();
  await expect(filters.getByText("سایز قابل انتخاب")).toBeVisible();
});

test("mobile filter drawer stages, cancels and applies URL changes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop", { waitUntil: "networkidle" });

  const opener = page.getByRole("button", { name: /فیلترها/ }).first();
  await opener.focus();
  await opener.click();

  let dialog = page.getByRole("dialog", { name: /فیلتر محصولات/ });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("checkbox", { name: "فقط کالاهای موجود" }).click();
  await expect(dialog.getByText(/۷ نتیجه پیش‌نمایش/)).toBeVisible();
  await expect(page).not.toHaveURL(/instock/);

  await dialog.getByRole("button", { name: "بستن فیلترها بدون اعمال تغییرات" }).click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page).not.toHaveURL(/instock/);

  await opener.click();
  dialog = page.getByRole("dialog", { name: /فیلتر محصولات/ });
  await dialog.getByRole("checkbox", { name: "فقط کالاهای موجود" }).click();
  await dialog.getByRole("button", { name: /اعمال فیلترها/ }).click();

  await expect(page).toHaveURL(/instock=true/);
  await expect(page.getByRole("button", { name: "حذف فیلتر فقط موجود" })).toBeVisible();
  await page.goBack({ waitUntil: "networkidle" });
  await expect(page).not.toHaveURL(/instock/);
});

test("filtered shop deep links canonicalize, survive refresh and stay noindex", async ({
  page,
}) => {
  await page.goto("/shop?sizes=XL,M&sort=price-asc&instock=1", {
    waitUntil: "networkidle",
  });

  const url = new URL(page.url());
  expect(url.searchParams.get("sizes")).toBe("M,XL");
  expect(url.searchParams.get("sort")).toBe("price-asc");
  expect(url.searchParams.get("instock")).toBe("true");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/shop$/);

  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "حذف فیلتر فقط موجود" })).toBeVisible();
  await expect(page.getByRole("button", { name: "حذف فیلتر سایز M", exact: true })).toBeVisible();
});

test("empty catalogue state resets to the complete result set", async ({ page }) => {
  await page.goto("/shop?max=150000", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { name: "محصولی با این ترکیب فیلتر پیدا نشد" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "بازگشت به همه قطعه‌ها" }).click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByText("۸ نتیجه", { exact: true })).toBeVisible();
});

test("search typing replaces the current history entry and remains refresh-safe", async ({
  page,
}) => {
  await page.goto("/shop", { waitUntil: "networkidle" });
  await page.goto("/search?q=%D9%87%D9%88%D8%AF%DB%8C", { waitUntil: "networkidle" });

  const searchbox = page.locator("#site-search");
  await expect(searchbox).toHaveValue("هودی");
  await searchbox.fill("شلوار");
  await expect(page).toHaveURL(/\/search\?q=%D8%B4%D9%84%D9%88%D8%A7%D8%B1/);

  await page.reload({ waitUntil: "networkidle" });
  await expect(searchbox).toHaveValue("شلوار");
  await page.goBack({ waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/shop$/);
});

test("search discovery avoids unsupported popularity claims", async ({ page }) => {
  await page.goto("/search", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "جستجو در کاتالوگ" })).toBeVisible();
  await expect(page.getByText("دسته‌بندی‌های کاتالوگ", { exact: true })).toBeVisible();
  await expect(page.getByText(/پرطرفدار/)).toHaveCount(0);

  await page.goto("/search?q=%D9%87%D9%88%D8%AF%DB%8C", { waitUntil: "networkidle" });
  await expect(page.getByText(/«هودی».*۲ نتیجه از.*۲ تطابق متنی/)).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
]) {
  test(`listing routes avoid horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of ["/shop", "/hoodies", "/search?q=هودی"]) {
      await page.goto(path, { waitUntil: "networkidle" });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(2);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    }
  });
}
