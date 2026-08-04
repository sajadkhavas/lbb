import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const templates = [
  "/",
  "/shop",
  "/hoodies",
  "/product/lbb-classic-hoodie",
  "/cart",
  "/collections",
  "/collections/drop-01-shabgard",
  "/journal",
  "/journal/materials-101-parche-shenasi",
  "/contact",
  "/design-system",
];

for (const route of templates) {
  test(`${route} has no serious or critical Axe violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
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
  });
}

test("menu and search dialogs preserve accessible focus behavior", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "منو" }).click();
  const menu = page.getByRole("dialog", { name: "منوی اصلی" });
  await expect(menu).toBeVisible();
  expect(
    await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();

  await page.getByRole("button", { name: "جست‌وجو" }).click();
  const search = page.getByRole("dialog", { name: "جست‌وجوی محصولات" });
  await expect(search).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "عبارت جست‌وجو" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();
});
