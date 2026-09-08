import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function source(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("D2 legal/content routes are wired to backend authority without stale express-post claims", async () => {
  const [terms, privacy, shipping, faq, helper] = await Promise.all([
    source("src/routes/terms.tsx"),
    source("src/routes/privacy.tsx"),
    source("src/routes/shipping-returns.tsx"),
    source("src/routes/faq.tsx"),
    source("src/lib/content-page.ts"),
  ]);

  expect(terms).toContain('resolveOptionalStorefrontPage("terms")');
  expect(privacy).toContain('resolveOptionalStorefrontPage("privacy")');
  expect(shipping).toContain('resolveOptionalStorefrontPage("shipping-returns")');
  expect(shipping).toContain("getDeliveryOptions");
  expect(shipping).toContain('city: "تهران"');
  expect(shipping).toContain('city: "کرج"');
  expect(shipping).not.toContain("پست پیشتاز");

  expect(faq).toContain("liveFaqs === null ? FAQ_GROUPS : backendFaqGroups(liveFaqs)");
  expect(faq).toContain("faqGroups.map((group, groupIndex)");
  expect(faq).not.toContain("FAQ_GROUPS.map((group, groupIndex)");
  expect(faq).not.toContain("پست پیشتاز");

  expect(helper).toContain("error instanceof BackendApiError && error.status === 404");
  expect(helper).toContain("throw error");
});

test("D2 prototype fallbacks remain truthful and accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto("/terms", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "شرایط استفاده" })).toBeVisible();
  await expect(page.getByText(/۴۸ ساعت، حقوق قانونی را محدود نمی‌کند/)).toBeVisible();

  await page.goto("/privacy", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "حریم خصوصی" })).toBeVisible();

  await page.goto("/shipping-returns", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { level: 1, name: "ارسال، تعویض و مرجوعی" }),
  ).toBeVisible();
  await expect(page.getByText("ارسال فوری — اسنپ / اسنپ‌باکس", { exact: true })).toBeVisible();
  await expect(page.getByText("تیپاکس — پس‌کرایه", { exact: true })).toBeVisible();
  await expect(page.getByText("دکاپست — پس‌کرایه", { exact: true })).toBeVisible();
  await expect(page.getByText("پست پیشتاز", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/حداکثر تا ۴۸ ساعت پس از تحویل/)).toBeVisible();

  await page.goto("/faq", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { level: 1, name: "پاسخ‌های روشن پیش از انتخاب و ثبت سفارش" }),
  ).toBeVisible();
  await expect(page.getByText("ارسال و تحویل", { exact: true }).first()).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(2);
});
