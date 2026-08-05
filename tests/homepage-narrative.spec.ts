import { expect, test } from "@playwright/test";

const CATEGORY_LINKS = ["هودی‌ها", "شلوارها", "تیشرت‌ها", "کتونی‌ها", "جوراب‌ها"];

async function hideAnnouncement(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
}

test.beforeEach(async ({ page }) => {
  await hideAnnouncement(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("homepage communicates identity, catalog and primary action above the fold", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(/LBB \| استریت‌ویر تهران — دراپ ۰۰۱/);
  await expect(
    page.getByRole("heading", { level: 1, name: /تهران را.*با فرم.*خودت بپوش/ }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /خرید DROP 001/ })).toBeVisible();
  await expect(
    page.getByText("8", { exact: true }).or(page.getByText("۸", { exact: true })),
  ).toBeVisible();
  await expect(page.getByText("پرداخت و ارسال واقعی در این نسخه فعال نیست")).toBeVisible();
});

test("hero LCP image is preloaded, eager and dimensioned", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const image = page.getByRole("img", { name: "استایل شبانه LBB از دراپ ۰۰۱ در فضای شهری" });
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("loading", "eager");
  await expect(image).toHaveAttribute("fetchpriority", "high");
  await expect(image).toHaveAttribute("width", "1200");
  await expect(image).toHaveAttribute("height", "1500");
  await expect(image).toHaveAttribute("sizes", /100vw/);

  const source = await image.getAttribute("src");
  expect(source).toBeTruthy();
  const heroPath = new URL(source ?? "", page.url()).pathname;
  const preloadPaths = await page
    .locator('link[rel="preload"][as="image"]')
    .evaluateAll((links) => links.map((link) => new URL((link as HTMLLinkElement).href).pathname));
  expect(preloadPaths).toContain(heroPath);

  expect(
    await image.evaluate((node) => {
      const img = node as HTMLImageElement;
      return img.complete && img.naturalWidth > 0;
    }),
  ).toBe(true);
});

test("category gateway exposes every product family as a direct route", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const gateway = page.locator("#home-categories");
  await expect(gateway.getByRole("heading", { name: "از چیزی که می‌خوای شروع کن" })).toBeVisible();

  for (const label of CATEGORY_LINKS) {
    const link = gateway.getByRole("link", { name: new RegExp(`مشاهده ${label}`) });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /^\/(hoodies|pants|tshirts|shoes|socks)$/);
  }
});

test("homepage narrative follows identity to product to story to support", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const order = await page.evaluate(() => {
    const ids = [
      "home-hero-title",
      "home-categories-title",
      "home-products-title",
      "drop-story-title",
      "shop-look-title",
      "decision-support-title",
      "editorial-gateway-title",
      "brand-statement-title",
      "newsletter-title",
    ];
    return ids.map((id) => {
      const element = document.getElementById(id);
      if (!element) return -1;
      let index = 0;
      let current: Element | null = element;
      while (current.previousElementSibling) {
        index += 1;
        current = current.previousElementSibling;
      }
      return element.getBoundingClientRect().top + window.scrollY;
    });
  });

  expect(order.every((value) => value >= 0)).toBe(true);
  expect(order).toEqual([...order].sort((a, b) => a - b));
});

test("product moments and shop the look expose truthful direct product paths", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const productSection = page.locator('section[aria-labelledby="home-products-title"]');
  await expect(productSection.getByRole("link", { name: "مشاهده هودی کلاسیک LBB" })).toBeVisible();
  await expect(productSection.getByText("منتخب‌ها بر اساس جایگاه Merchandising")).toBeVisible();

  const look = page.locator('section[aria-labelledby="shop-look-title"]');
  await expect(look.getByRole("link", { name: /هودی کلاسیک LBB/ })).toBeVisible();
  await expect(look.getByRole("link", { name: /شلوار کارگو استریت/ })).toBeVisible();
  await expect(look.getByRole("link", { name: /کتونی اربن رانر/ })).toBeVisible();
  await expect(look.getByText("تصویر برای نمایش ترکیب است")).toBeVisible();
});

test("drop story avoids manufactured urgency and links to a real collection", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const section = page.locator('section[aria-labelledby="drop-story-title"]');
  await expect(section.getByRole("heading", { name: "دراپ ۰۱ — شبگرد" })).toBeVisible();
  await expect(section.getByText(/تاریخ انتشار تاییدشده ندارد/)).toBeVisible();
  await expect(section.getByRole("link", { name: "مشاهده کالکشن شبگرد" })).toHaveAttribute(
    "href",
    "/collections/drop-01-shabgard",
  );
  await expect(page.getByText("دراپ بعدی در حال طراحی است", { exact: true })).toHaveCount(0);
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
]) {
  test(`homepage remains usable without horizontal overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle" });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(2);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });
}
