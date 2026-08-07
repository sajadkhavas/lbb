import { expect, test, type Locator, type Page } from "@playwright/test";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

async function visibleFocusEdges(root: Locator) {
  const candidates = root.locator(FOCUSABLE);
  const visible: Locator[] = [];
  for (let index = 0; index < (await candidates.count()); index += 1) {
    const candidate = candidates.nth(index);
    if (await candidate.isVisible()) visible.push(candidate);
  }
  expect(visible.length).toBeGreaterThan(1);
  return { first: visible[0], last: visible[visible.length - 1] };
}

async function expectFocusWrap(page: Page, root: Locator) {
  const { first, last } = await visibleFocusEdges(root);

  await last.focus();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();

  await first.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();
}

async function addProductToCart(page: Page) {
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  await page.locator('button[aria-label^="انتخاب سایز"]:not(:disabled)').first().click();
  await page.getByRole("button", { name: "افزودن به سبد خرید" }).click();
  await expect(page.getByRole("dialog", { name: "سبد خرید" })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
});

test("mega menu traps Tab and Shift+Tab and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });

  const trigger = page.getByRole("button", { name: "فروشگاه" });
  await trigger.focus();
  await trigger.press("ArrowDown");
  const dialog = page.getByRole("dialog", { name: "منوی فروشگاه" });
  await expect(dialog).toBeVisible();
  await expectFocusWrap(page, dialog);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("mobile menu and cart drawer contain focus and support Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const menuTrigger = page.getByRole("button", { name: "منوی اصلی" });
  await menuTrigger.click();
  const menu = page.getByRole("dialog", { name: "منوی اصلی" });
  await expect(menu).toBeVisible();
  await expectFocusWrap(page, menu);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(menuTrigger).toBeFocused();

  const cartTrigger = page.getByRole("button", { name: /سبد خرید/ }).first();
  await cartTrigger.click();
  const cart = page.getByRole("dialog", { name: "سبد خرید" });
  await expect(cart).toBeVisible();
  await expectFocusWrap(page, cart.locator("aside"));
  await page.keyboard.press("Escape");
  await expect(cart).toBeHidden();
  await expect(cartTrigger).toBeFocused();
});

test("filter drawer and Quick View trap and restore focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop", { waitUntil: "networkidle" });

  const filterTrigger = page.getByRole("button", { name: /فیلترها/ }).first();
  await filterTrigger.click();
  const filters = page.getByRole("dialog", { name: /فیلتر محصولات/ });
  await expect(filters).toBeVisible();
  await expectFocusWrap(page, filters);
  await page.keyboard.press("Escape");
  await expect(filters).toBeHidden();
  await expect(filterTrigger).toBeFocused();

  const quickViewTrigger = page.getByRole("button", { name: /انتخاب سایز و خرید/ }).first();
  await quickViewTrigger.click();
  const quickView = page.getByRole("dialog");
  await expect(quickView).toBeVisible();
  await expectFocusWrap(page, quickView);
  await page.keyboard.press("Escape");
  await expect(quickView).toBeHidden();
  await expect(quickViewTrigger).toBeFocused();
});

test("lookbook lightbox traps focus and supports arrows, Escape and restoration", async ({
  page,
}) => {
  await page.goto("/lookbook", { waitUntil: "networkidle" });
  const opener = page.locator('button[aria-haspopup="dialog"]').first();
  await opener.focus();
  await opener.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect
    .poll(() => dialog.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);
  await expectFocusWrap(page, dialog);
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("product gallery supports roving focus, arrows, Home and End", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });

  const tablist = page.getByRole("tablist", { name: "تصاویر محصول" });
  const tabs = tablist.getByRole("tab");
  expect(await tabs.count()).toBeGreaterThan(1);

  await tabs.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press("End");
  await expect(tabs.last()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tabs.first()).toBeFocused();
});

test("FAQ disclosures work with Enter and Space", async ({ page }) => {
  await page.goto("/faq", { waitUntil: "networkidle" });
  const summary = page.locator("summary").first();
  const details = summary.locator("xpath=..");

  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  await page.keyboard.press("Space");
  await expect(details).not.toHaveAttribute("open", "");
});

test("checkout controls have labels, required state and valid autocomplete tokens", async ({
  page,
}) => {
  await addProductToCart(page);
  await page.goto("/checkout", { waitUntil: "networkidle" });

  const expectations = [
    ["نام و نام‌خانوادگی", "name"],
    ["شماره موبایل", "tel"],
    ["استان", "address-level1"],
    ["شهر", "address-level2"],
    ["آدرس کامل", "street-address"],
    ["کد پستی", "postal-code"],
  ] as const;

  for (const [label, autocomplete] of expectations) {
    const control = page.getByLabel(label);
    await expect(control).toBeVisible();
    await expect(control).toHaveAttribute("required", "");
    await expect(control).toHaveAttribute("autocomplete", autocomplete);
  }
});

test("F19B-P1-002: checkout errors must be programmatically associated and focused", async ({
  page,
}) => {
  test.fail(
    true,
    "F19B-P1-002 — custom checkout errors are not wired with aria-invalid/aria-describedby or first-error focus",
  );

  await addProductToCart(page);
  await page.goto("/checkout", { waitUntil: "networkidle" });
  await page.locator("form").evaluate((form: HTMLFormElement) => {
    form.noValidate = true;
  });
  await page.getByRole("button", { name: "مشاهده خلاصه نمایشی" }).click();

  const fields = ["name", "phone", "province", "city", "address", "postal"] as const;
  for (const field of fields) {
    const control = page.locator(`#co-${field}`);
    await expect(control).toHaveAttribute("aria-invalid", "true");
    await expect(control).toHaveAttribute("aria-describedby", `co-${field}-error`);
    await expect(page.locator(`#co-${field}-error`)).toBeVisible();
  }
  await expect(page.locator("#co-name")).toBeFocused();
});

test("route navigation never leaves focus in a disconnected overlay", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "جست‌وجو" }).first().click();
  const dialog = page.getByRole("dialog", { name: "جست‌وجوی محصولات" });
  await expect(dialog).toBeVisible();

  await dialog.getByRole("link", { name: "کالکشن‌های فعلی" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/collections$/);
  await expect(dialog).toBeHidden();
  expect(
    await page.evaluate(() =>
      Boolean(document.activeElement && document.activeElement.isConnected),
    ),
  ).toBe(true);
});

test("major route families expose one main landmark and one H1", async ({ page }) => {
  const routes = [
    "/",
    "/shop",
    "/hoodies",
    "/search?q=هودی",
    "/product/lbb-classic-hoodie",
    "/cart",
    "/checkout",
    "/account",
    "/collections",
    "/lookbook",
    "/journal",
    "/about",
    "/faq",
    "/shipping-returns",
    "/terms",
    "/privacy",
    "/contact",
    "/f19-route-does-not-exist",
  ];

  for (const route of routes) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  }
});
