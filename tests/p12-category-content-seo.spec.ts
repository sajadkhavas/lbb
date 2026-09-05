import { expect, test } from "@playwright/test";
import { CATEGORIES } from "../src/lib/categories";

const origin = "https://lbb.example.test";

const unsupportedCategoryClaims =
  /فرنچ‌تری\s*۳۲۰|۲۲۰\s*گرم|ریپ‌استاپ|زیره\s*EVA|چرم مصنوعی|پنبه\s*۱۰۰٪|ارسال سریع|سراسر ایران|مردانه و زنانه|دوخت پریمیوم|پرینت دیجیتال|ضربه‌گیری|مقاوم در برابر خط‌وخش/i;

test("category copy stays inside verified product-level truth and transactional intent", () => {
  const titles = new Set<string>();

  for (const category of Object.values(CATEGORIES)) {
    const copy = [
      category.h1,
      category.metaTitle,
      category.metaDesc,
      category.heroTagline,
      category.seoText,
      ...category.bullets,
      ...category.faqs.flatMap((faq) => [faq.q, faq.a]),
    ].join(" ");

    expect(copy).not.toMatch(unsupportedCategoryClaims);
    expect(category.h1).toContain(`خرید ${category.nameFa}`);
    expect(category.metaTitle).toContain(`خرید ${category.nameFa}`);
    expect(category.metaTitle).toMatch(/\| مدل‌های موجود LBB$/);
    expect(category.metaTitle).not.toContain("در کرج");
    expect(category.metaTitle).not.toContain("مردانه");
    expect(titles.has(category.metaTitle)).toBe(false);
    titles.add(category.metaTitle);
  }
});

for (const [slug, category] of Object.entries(CATEGORIES)) {
  test(`${slug} exposes reconciled landing content and metadata`, async ({ page }) => {
    await page.goto(`/${slug}`, {
      waitUntil: "networkidle",
    });

    await expect(page).toHaveTitle(category.metaTitle);

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      category.metaDesc,
    );

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${origin}/${slug}`,
    );

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: category.h1,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("img", {
        name: `نمای دسته ${category.nameFaPlural} ال‌بی‌بی`,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: `برای انتخاب ${category.nameFa} در LBB به چه چیزهایی توجه کنیم؟`,
      }),
    ).toBeVisible();
  });
}

test("filtered category state stays noindex with clean canonical", async ({ page }) => {
  await page.goto("/hoodies?sizes=M&sort=price-asc", {
    waitUntil: "networkidle",
  });

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}/hoodies`);
});
