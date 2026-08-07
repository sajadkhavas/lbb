import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const templates = [
  "/",
  "/shop",
  "/hoodies",
  "/product/lbb-classic-hoodie",
  "/cart",
  "/checkout",
  "/order-confirmation",
  "/track-order",
  "/collections",
  "/collections/drop-01-shabgard",
  "/journal",
  "/journal/materials-101-parche-shenasi",
  "/contact",
  "/shipping-returns",
  "/terms",
  "/privacy",
  "/design-system",
  "/account",
];

async function expectNoBlockingAxe(page: Page) {
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
      help: violation.help,
      targets: violation.nodes.flatMap((node) => node.target),
    })),
  ).toEqual([]);
}

for (const route of templates) {
  test(`${route} has no serious or critical Axe violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expectNoBlockingAxe(page);
  });
}

test("desktop mega menu, mobile menu and search preserve focus and Axe quality", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });

  const shopTrigger = page.getByRole("button", { name: "فروشگاه" });
  await shopTrigger.click();
  const mega = page.getByRole("dialog", { name: "منوی فروشگاه" });
  await expect(mega).toBeVisible();
  expect(
    await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null),
  ).toBe(true);
  await expectNoBlockingAxe(page);
  await page.keyboard.press("Escape");
  await expect(mega).toBeHidden();
  await expect(shopTrigger).toBeFocused();

  const searchTrigger = page.getByRole("button", { name: "جست‌وجو" }).first();
  await searchTrigger.click();
  const search = page.getByRole("dialog", { name: "جست‌وجوی محصولات" });
  await expect(search).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "عبارت جست‌وجو" })).toBeFocused();
  await expectNoBlockingAxe(page);
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "منوی اصلی" }).click();
  const menu = page.getByRole("dialog", { name: "منوی اصلی" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("heading", { name: "دسته‌های محصول" })).toBeVisible();
  await expectNoBlockingAxe(page);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});
