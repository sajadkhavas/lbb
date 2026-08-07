import { expect, test, type Locator, type Page } from "@playwright/test";

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
] as const;

const RTL_ROUTES = [
  "/",
  "/shop",
  "/hoodies",
  "/search?q=هودی",
  "/product/lbb-classic-hoodie",
  "/account",
  "/lookbook",
  "/faq",
  "/shipping-returns",
  "/f19-route-does-not-exist",
];

async function expectNoPageOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(2);
}

async function expectTouchTarget(locator: Locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, "touch target must have a rendered box").not.toBeNull();
  expect(Math.round(box!.width), "touch target width").toBeGreaterThanOrEqual(44);
  expect(Math.round(box!.height), "touch target height").toBeGreaterThanOrEqual(44);
}

async function addProductToCart(page: Page) {
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  const purchase = page.getByRole("button", { name: /افزودن به سبد خرید|خرید در دسترس نیست/ });

  if (await purchase.isDisabled()) {
    await page.evaluate(() => {
      localStorage.setItem(
        "lbb-cart-v1",
        JSON.stringify([
          {
            slug: "f19-touch-fixture",
            name: "F19 touch fixture",
            price: 1,
            size: "TEST",
            qty: 1,
          },
        ]),
      );
    });
    await page.reload({ waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: /سبد خرید/ })
      .first()
      .click();
    await expect(page.getByRole("dialog", { name: "سبد خرید" })).toBeVisible();
    return;
  }

  await page.locator('button[aria-label^="سایز "]:not([aria-disabled="true"])').first().click();
  await purchase.click();
  await expect(page.getByRole("dialog", { name: "سبد خرید" })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
});

for (const viewport of VIEWPORTS) {
  test(`RTL route sample reflows without page overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    for (const route of RTL_ROUTES) {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await expect(page.getByRole("main")).toHaveCount(1);
      await expectNoPageOverflow(page);
    }
  });
}

test("RTL pages keep external contact labels readable and directional media islands explicit", async ({
  page,
}) => {
  await page.goto("/contact", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  const instagram = page.getByRole("link", { name: "اینستاگرام رسمی LBB" });
  await expect(instagram).toBeVisible();
  await expect(instagram).toHaveAttribute("href", /^https:\/\/www\.instagram\.com\//);

  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  const gallery = page.locator('[aria-roledescription="carousel"]');
  await expect(gallery).toHaveAttribute("dir", "ltr");
  await expect(gallery).toHaveAttribute("aria-label", /گالری تصاویر/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("critical mobile shell and Quick View controls meet the 44px touch contract", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop", { waitUntil: "networkidle" });

  await expectTouchTarget(page.getByRole("button", { name: "منوی اصلی" }));
  await expectTouchTarget(page.getByRole("button", { name: "جست‌وجو" }).first());
  await expectTouchTarget(page.getByRole("button", { name: /سبد خرید/ }).first());
  await expectTouchTarget(page.getByRole("button", { name: /فیلترها/ }).first());

  const quickViewTrigger = page.getByRole("button", { name: /انتخاب سایز و خرید/ }).first();
  await expectTouchTarget(quickViewTrigger);
  await quickViewTrigger.click();
  const quickView = page.getByRole("dialog");
  await expectTouchTarget(quickView.getByRole("button", { name: "بستن نمای سریع" }));
  await expectTouchTarget(quickView.getByRole("button", { name: "کاهش تعداد" }));
  await expectTouchTarget(quickView.getByRole("button", { name: "افزایش تعداد" }));
});

test("F19B-P1-003: PDP mobile gallery selectors meet the 44px touch contract", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  await expectTouchTarget(page.getByRole("button", { name: /رفتن به (?:تصویر|جایگاه رسانه) 1/ }));
});

test("F19B-P1-004: Quick View thumbnails must meet the 44px touch contract", async ({ page }) => {
  test.fail(true, "F19B-P1-004 — Quick View thumbnails are 36px wide");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop", { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: /انتخاب سایز و خرید/ })
    .first()
    .click();
  await expectTouchTarget(page.getByRole("dialog").getByRole("button", { name: "نمایش تصویر 1" }));
});

test("F19B-P2-001: Cart quantity controls must meet the 44px touch contract", async ({ page }) => {
  test.fail(true, "F19B-P2-001 — Cart Drawer quantity controls are currently 36px square");

  await page.setViewportSize({ width: 390, height: 844 });
  await addProductToCart(page);
  const cart = page.getByRole("dialog", { name: "سبد خرید" });
  await expectTouchTarget(cart.getByRole("button", { name: /کاهش تعداد/ }));
  await expectTouchTarget(cart.getByRole("button", { name: /افزایش تعداد/ }));
});

test("F19B-P2-002: active filter chips must meet the 44px touch contract", async ({ page }) => {
  test.fail(true, "F19B-P2-002 — active filter chips currently use a 40px minimum height");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop", { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: /فیلترها/ })
    .first()
    .click();
  const filters = page.getByRole("dialog", { name: /فیلتر محصولات/ });
  await filters.getByRole("checkbox", { name: "فقط کالاهای موجود" }).click();
  await filters.getByRole("button", { name: /اعمال فیلترها/ }).click();
  await expectTouchTarget(page.getByRole("button", { name: "حذف فیلتر فقط موجود" }));
});

test("reduced motion disables CSS motion and leaves Lenis inactive", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });

  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true,
  );
  expect(
    await page.evaluate(
      () =>
        document.documentElement.classList.contains("lenis") ||
        document.body.classList.contains("lenis"),
    ),
  ).toBe(false);

  const probe = page.locator("#f19-motion-probe");
  await page.evaluate(() => {
    const element = document.createElement("div");
    element.id = "f19-motion-probe";
    element.className = "marquee-track frame-zoom";
    document.body.append(element);
  });
  await expect(probe).toHaveCSS("animation-name", "none");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop", { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: /انتخاب سایز و خرید/ })
    .first()
    .click();
  const quickView = page.getByRole("dialog");
  await expect(quickView).toBeVisible();
  await expect(quickView).toHaveCSS("animation-name", "none");
});

test("viewport metadata permits zoom and WCAG text spacing does not create page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/faq", { waitUntil: "networkidle" });

  const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
  expect(viewport ?? "").not.toMatch(/user-scalable\s*=\s*no/i);
  expect(viewport ?? "").not.toMatch(/maximum-scale\s*=\s*1/i);

  await page.addStyleTag({
    content: `
      p, li, a, button, summary, label, input, textarea, select {
        line-height: 1.5 !important;
        letter-spacing: 0.12em !important;
        word-spacing: 0.16em !important;
      }
      p { margin-bottom: 2em !important; }
    `,
  });

  await expectNoPageOverflow(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("summary").first()).toBeVisible();
});
