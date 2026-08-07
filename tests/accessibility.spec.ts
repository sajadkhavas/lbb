import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ROUTE_FAMILIES = [
  ["home", "/"],
  ["shop", "/shop"],
  ["category", "/hoodies"],
  ["search", "/search?q=هودی"],
  ["product", "/product/lbb-classic-hoodie"],
  ["cart", "/cart"],
  ["checkout-preview", "/checkout"],
  ["account", "/account"],
  ["collections", "/collections"],
  ["collection-detail", "/collections/drop-01-shabgard"],
  ["lookbook", "/lookbook"],
  ["journal", "/journal"],
  ["journal-detail", "/journal/materials-101-parche-shenasi"],
  ["about", "/about"],
  ["faq", "/faq"],
  ["shipping-returns", "/shipping-returns"],
  ["terms", "/terms"],
  ["privacy", "/privacy"],
  ["contact", "/contact"],
  ["wishlist", "/wishlist"],
  ["size-guide", "/size-guide"],
  ["track-order", "/track-order"],
  ["order-confirmation", "/order-confirmation"],
  ["404", "/f19-route-does-not-exist"],
  ["invalid-product", "/product/f19-invalid-product"],
  ["invalid-collection", "/collections/f19-invalid-collection"],
  ["invalid-journal", "/journal/f19-invalid-journal"],
] as const;

async function prepare(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
}

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

test.beforeEach(async ({ page }) => {
  await prepare(page);
});

for (const [family, route] of ROUTE_FAMILIES) {
  test(`${family}: ${route} has no serious or critical Axe violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveCount(1);
    await expectNoBlockingAxe(page);
  });
}

test("navigation overlays preserve focus and Axe quality", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });

  const shopTrigger = page.getByRole("button", { name: "فروشگاه" });
  await shopTrigger.focus();
  await shopTrigger.press("ArrowDown");
  const mega = page.getByRole("dialog", { name: "منوی فروشگاه" });
  await expect(mega).toBeVisible();
  await expect(mega.getByRole("link", { name: /همه محصولات/ })).toBeFocused();
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
  await expect(searchTrigger).toBeFocused();

  await page.getByRole("button", { name: /سبد خرید/ }).click();
  const cart = page.getByRole("dialog", { name: "سبد خرید" });
  await expect(cart).toBeVisible();
  await expectNoBlockingAxe(page);
  await page.keyboard.press("Escape");
  await expect(cart).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  const menuTrigger = page.getByRole("button", { name: "منوی اصلی" });
  await menuTrigger.click();
  const menu = page.getByRole("dialog", { name: "منوی اصلی" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "LBB — خانه" })).toBeFocused();
  await expectNoBlockingAxe(page);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(menuTrigger).toBeFocused();
});

test("catalogue and product dialogs have blocking Axe coverage", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop", { waitUntil: "networkidle" });

  const filterTrigger = page.getByRole("button", { name: /فیلترها/ }).first();
  await filterTrigger.click();
  const filters = page.getByRole("dialog", { name: /فیلتر محصولات/ });
  await expect(filters).toBeVisible();
  await expectNoBlockingAxe(page);
  await page.keyboard.press("Escape");
  await expect(filters).toBeHidden();
  await expect(filterTrigger).toBeFocused();

  const quickViewTrigger = page.getByRole("button", { name: /انتخاب سایز و خرید/ }).first();
  await quickViewTrigger.click();
  const quickView = page.getByRole("dialog");
  await expect(quickView).toBeVisible();
  await expectNoBlockingAxe(page);
  await page.keyboard.press("Escape");
  await expect(quickView).toBeHidden();
  await expect(quickViewTrigger).toBeFocused();

  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  const sizeGuideTrigger = page.getByRole("button", { name: "راهنمای سایز" });
  await sizeGuideTrigger.click();
  const sizeGuide = page.getByRole("dialog");
  await expect(sizeGuide).toBeVisible();
  await expectNoBlockingAxe(page);
  await page.keyboard.press("Escape");
  await expect(sizeGuide).toBeHidden();
  await expect(sizeGuideTrigger).toBeFocused();
});

test("lookbook lightbox has blocking Axe coverage", async ({ page }) => {
  await page.goto("/lookbook", { waitUntil: "networkidle" });
  const opener = page.locator('button[aria-haspopup="dialog"]').first();
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expectNoBlockingAxe(page);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});
