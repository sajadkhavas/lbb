import { expect, test, type Page } from "@playwright/test";

function jsonLdTypes(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.flatMap((node) => {
      try {
        const parsed = JSON.parse(node.textContent ?? "") as { "@type"?: string };
        return parsed["@type"] ? [parsed["@type"]] : [];
      } catch {
        return [];
      }
    }),
  );
}

test("local intent stays concentrated on home and contact", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page).toHaveTitle("LBB | پوشاک خیابانی و استریت‌ویر در کرج");
  await page.goto("/contact", { waitUntil: "networkidle" });
  await expect(page).toHaveTitle(/کرج/);
  await page.goto("/about", { waitUntil: "networkidle" });
  await expect(page).toHaveTitle("درباره LBB | از رگال تا فروشگاه");
});

test("shop uses broad commerce intent without stale brand wording", async ({ page }) => {
  await page.goto("/shop", { waitUntil: "networkidle" });
  await expect(page).toHaveTitle("فروشگاه LBB | خرید پوشاک خیابانی و استریت‌ویر");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /محصولات موجود LBB.*فیلترهای دسته، سایز، رنگ، قیمت و موجودی/,
  );
  await expect(page.locator('meta[name="description"]')).not.toHaveAttribute(
    "content",
    /پوشاک شهری/,
  );
});

test("useful FAQ remains visible without retired FAQPage search markup", async ({ page }) => {
  await page.goto("/faq", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("پاسخ‌های روشن");
  const types = await jsonLdTypes(page);
  expect(types).not.toContain("FAQPage");
  expect(types).toContain("BreadcrumbList");
});

test("size guide keeps useful content and breadcrumb markup without retired HowTo markup", async ({
  page,
}) => {
  await page.goto("/size-guide", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("راهنمای انتخاب اندازه");
  const types = await jsonLdTypes(page);
  expect(types).not.toContain("HowTo");
  expect(types).toContain("BreadcrumbList");
});

test("category pages link naturally to the size guide", async ({ page }) => {
  await page.goto("/tshirts", { waitUntil: "networkidle" });
  await expect(page.getByRole("link", { name: "راهنمای انتخاب اندازه" })).toHaveAttribute(
    "href",
    "/size-guide",
  );
});
