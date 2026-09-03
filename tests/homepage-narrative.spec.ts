import { expect, test, type Page } from "@playwright/test";

const ACTIVE_CATEGORIES = [
  { label: "شلوارها", href: "/pants" },
  { label: "تیشرت‌ها", href: "/tshirts" },
  { label: "کتونی‌ها", href: "/shoes" },
  { label: "جوراب‌ها", href: "/socks" },
] as const;

const CURRENT_PRODUCT_SLUGS = [
  "lbb-signature-tee",
  "denim-baggy-jean",
  "urban-runner-sneaker",
  "lbb-crew-socks",
] as const;

async function hideAnnouncement(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-seasonal-v2-dismissed", "1");
  });
}

test.beforeEach(async ({ page }) => {
  await hideAnnouncement(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("homepage communicates current identity, catalog and primary action", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle("LBB | پوشاک خیابانی و استریت‌ویر در کرج");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "از پینترست تا رگال LBB",
    }),
  ).toBeVisible();

  const hero = page.locator('section[aria-labelledby="home-hero-title"]');

  await expect(hero.getByRole("link", { name: "خرید جدیدترین‌ها" })).toHaveAttribute(
    "href",
    "/shop",
  );

  await expect(hero.getByRole("link", { name: "اطلاعات فروشگاه حضوری" })).toHaveAttribute(
    "href",
    "/contact",
  );

  const localStore = page.locator('section[aria-labelledby="local-store-title"]');

  await expect(
    localStore.getByRole("heading", {
      name: "آنلاین ببین، در مهستان از نزدیک انتخاب کن.",
    }),
  ).toBeVisible();

  await expect(localStore.getByText("کرج، پاساژ مهستان").first()).toBeVisible();
});

test("hero LCP image uses the current production asset contract", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const image = page.getByRole("img", {
    name: "تیشرت مشکی ال‌بی‌بی روی زمینه روشن",
  });

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

test("category gateway exposes current promoted categories", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const gateway = page.locator("#home-categories");

  await expect(gateway.getByRole("heading", { name: "دنبال چی می‌گردی؟" })).toBeVisible();

  for (const category of ACTIVE_CATEGORIES) {
    const link = gateway.getByRole("link", {
      name: new RegExp(`^مشاهده ${category.label} —`),
    });

    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", category.href);
  }

  await expect(gateway.locator('a[href="/hoodies"]')).toHaveCount(0);
});

test("homepage follows the current production narrative order", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const ids = [
    "home-hero-title",
    "home-categories-title",
    "home-products-title",
    "drop-story-title",
    "decision-support-title",
    "local-store-title",
  ];

  const positions = await page.evaluate((sectionIds) => {
    return sectionIds.map((id) => {
      const element = document.getElementById(id);

      if (!element) return -1;

      return element.getBoundingClientRect().top + window.scrollY;
    });
  }, ids);

  expect(positions.every((value) => value >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
});

test("product moments expose current merchandising products", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const section = page.locator('section[aria-labelledby="home-products-title"]');

  await expect(
    section.getByRole("heading", {
      name: "تازه‌ها و انتخاب‌های این هفته",
    }),
  ).toBeVisible();

  await expect(section.locator("article")).toHaveCount(4);

  for (const slug of CURRENT_PRODUCT_SLUGS) {
    await expect(section.locator(`a[href="/product/${slug}"]`).first()).toBeVisible();
  }
});

test("drop story exposes current denim capsule", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const section = page.locator('section[aria-labelledby="drop-story-title"]');

  await expect(section.getByRole("heading", { name: "کپسول دنیم" })).toBeVisible();

  await expect(
    section.getByRole("link", {
      name: "دیدن کالکشن کپسول دنیم",
    }),
  ).toHaveAttribute("href", "/collections/capsule-denim");

  await expect(section.locator("[data-f17-public-product-link]")).toHaveCount(0);

  await expect(section.locator('a[href^="/product/"]')).toHaveCount(0);

  await expect(page.getByText("دراپ بعدی در حال طراحی است", { exact: true })).toHaveCount(0);
});

test("decision-support and physical-store paths remain actionable", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const decision = page.locator('section[aria-labelledby="decision-support-title"]');

  await expect(
    decision.getByRole("heading", {
      name: "قبل از انتخاب، جواب‌ها را داشته باش",
    }),
  ).toBeVisible();

  await expect(decision.getByRole("link", { name: /راهنمای انتخاب سایز/ })).toHaveAttribute(
    "href",
    "/size-guide",
  );

  await expect(decision.getByRole("link", { name: /ارسال و مرجوعی/ })).toHaveAttribute(
    "href",
    "/shipping-returns",
  );

  await expect(decision.getByRole("link", { name: /پارچه و نگهداری/ })).toHaveAttribute(
    "href",
    "/journal/materials-101-parche-shenasi",
  );

  const localStore = page.locator('section[aria-labelledby="local-store-title"]');

  await expect(
    localStore.getByRole("link", {
      name: /اطلاعات تماس و مراجعه/,
    }),
  ).toHaveAttribute("href", "/contact");

  await expect(
    localStore.getByRole("link", {
      name: /قبل از مراجعه محصولات را ببین/,
    }),
  ).toHaveAttribute("href", "/shop");
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
