import { expect, test, type Page } from "@playwright/test";

const DRAFT_PRODUCT_SLUGS = [
  "lbb-classic-hoodie",
  "cargo-street-pants",
  "lbb-signature-tee",
  "urban-runner-sneaker",
  "lbb-crew-socks",
  "oversized-black-hoodie",
  "denim-baggy-jean",
  "graphic-tee-red",
] as const;

async function expectNoDraftProductLinks(page: Page, root = "main") {
  for (const slug of DRAFT_PRODUCT_SLUGS) {
    await expect(page.locator(`${root} a[href="/product/${slug}"]`)).toHaveCount(0);
  }
}

async function prepare(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
}

test.beforeEach(async ({ page }) => {
  await prepare(page);
});

test("collections index is editorial discovery rather than a shop duplicate", async ({ page }) => {
  await page.goto("/collections", { waitUntil: "networkidle" });
  await expect(page.locator('main[data-f17-route="collections"]')).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("کالکشن‌ها");
  await expect(page.locator("[data-f17-collection-link]")).toHaveCount(3);
  await expect(page.getByText("COLLECTION ≠ CATEGORY")).toBeVisible();
  await expect(page.getByRole("link", { name: "دیدن لوک‌بوک" })).toBeVisible();
  await expectNoDraftProductLinks(page);
});

test("valid drop-style collection has narrative, safe empty commerce state and onward paths", async ({
  page,
}) => {
  const response = await page.goto("/collections/drop-01-shabgard", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(200);
  const main = page.locator('main[data-f17-route="collection-detail"]');
  await expect(main).toHaveAttribute("data-f17-collection-kind", "drop");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("شبگرد");
  await expect(page.locator('[data-f17-empty-products="true"]')).toBeVisible();
  const bridge = page.locator('[data-f17-editorial="commerce-bridge"]');
  await expect(bridge).toBeVisible();
  await expect(bridge.getByRole("link", { name: "هودی‌ها" })).toBeVisible();
  await expect(bridge.getByRole("link", { name: /مرور فروشگاه/ })).toBeVisible();
  await expectNoDraftProductLinks(page);
  await expect(page.getByText(/countdown|شمارش معکوس/i)).toHaveCount(0);
});

test("collection without public products emits no product ItemList URLs", async ({ page }) => {
  await page.goto("/collections/capsule-denim", { waitUntil: "networkidle" });
  await expect(page.locator('[data-f17-empty-products="true"]')).toBeVisible();
  await expectNoDraftProductLinks(page);

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsed = schemas.flatMap((schema) => {
    try {
      return [JSON.parse(schema) as Record<string, unknown>];
    } catch {
      return [];
    }
  });
  const itemLists = parsed.filter((schema) => schema["@type"] === "ItemList");
  expect(itemLists).toEqual([]);
});

test("invalid collection keeps a real noindex 404 state", async ({ page }) => {
  const response = await page.goto("/collections/f17-does-not-exist", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(404);
  await expect(page.locator('main[data-f17-route="collection-not-found"]')).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("link", { name: "بازگشت به کالکشن‌ها" })).toBeVisible();
});

test("lookbook scenes keep collection/category discovery and suppress draft product hotspots", async ({
  page,
}) => {
  await page.goto("/lookbook", { waitUntil: "networkidle" });
  await expect(page.locator('main[data-f17-route="lookbook"]')).toBeVisible();
  await expect(page.locator("[data-f17-lookbook-scene]")).toHaveCount(8);
  await expect(page.locator("[data-f17-lookbook-product-link]")).toHaveCount(0);
  await expect(page.locator("[data-f17-product-hotspot]")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /دراپ ۰۱ — شبگرد/ }).first()).toBeVisible();
  await expectNoDraftProductLinks(page);
});

test("lookbook dialog keeps contextual non-product destinations", async ({ page }) => {
  await page.goto("/lookbook", { waitUntil: "networkidle" });
  await page.getByTestId("lookbook-scene-0").click();
  const dialog = page.locator('[data-f17-lookbook-dialog="true"]');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "مشاهده کالکشن" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "هودی‌ها" })).toBeVisible();
  await expect(dialog.locator('a[href^="/product/"]')).toHaveCount(0);
});

test("journal index exposes five editorial stories and onward discovery", async ({ page }) => {
  await page.goto("/journal", { waitUntil: "networkidle" });
  await expect(page.locator('main[data-f17-route="journal"]')).toBeVisible();
  const articleLinks = page.locator('main a[href^="/journal/"]');
  expect(await articleLinks.count()).toBeGreaterThanOrEqual(5);
  const onward = page.getByRole("navigation", { name: "مسیرهای بعدی ژورنال" });
  await expect(onward.getByRole("link", { name: "لوک‌بوک" })).toBeVisible();
  await expect(onward.getByRole("link", { name: "کالکشن‌ها" })).toBeVisible();
  await expect(onward.getByRole("link", { name: "فروشگاه" })).toBeVisible();
  await expectNoDraftProductLinks(page);
});

test("article stays editorial-first while exposing contextual collection and category links", async ({
  page,
}) => {
  const response = await page.goto("/journal/chetori-hoodie-eversayz-ro-bepoosim", {
    waitUntil: "networkidle",
  });
  expect(response?.status()).toBe(200);
  await expect(page.locator('main[data-f17-route="journal-detail"]')).toBeVisible();
  await expect(page.locator("article section")).toHaveCount(4);
  const bridge = page.locator('[data-f17-editorial="commerce-bridge"]');
  await expect(bridge).toBeVisible();
  await expect(bridge.getByRole("link", { name: /دراپ ۰۱ — شبگرد/ })).toBeVisible();
  await expect(bridge.getByRole("link", { name: "هودی‌ها" })).toBeVisible();
  await expect(bridge.getByRole("link", { name: "شلوارها" })).toBeVisible();
  await expectNoDraftProductLinks(page);
});

test("invalid journal article keeps a real noindex 404 state", async ({ page }) => {
  const response = await page.goto("/journal/f17-invalid-article", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(404);
  await expect(page.locator('main[data-f17-route="journal-not-found"]')).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("link", { name: "بازگشت به ژورنال" })).toBeVisible();
});

test("collection and journal detail breadcrumbs preserve the editorial hierarchy", async ({
  page,
}) => {
  await page.goto("/collections/drop-01-shabgard", { waitUntil: "networkidle" });
  await expect(page.getByRole("link", { name: "خانه" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "کالکشن‌ها" }).first()).toBeVisible();

  await page.goto("/journal/materials-101-parche-shenasi", { waitUntil: "networkidle" });
  await expect(page.getByRole("link", { name: "خانه" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "ژورنال" }).first()).toBeVisible();
});

test("F17 surfaces contain no unsupported urgency or popularity claims", async ({ page }) => {
  const forbidden =
    /sold out in hours|most popular drop|limited edition|exclusive|best seller|community favorite|پرفروش‌ترین|محبوب‌ترین|نسخه محدود|شمارش معکوس/i;
  for (const route of [
    "/collections",
    "/collections/drop-01-shabgard",
    "/lookbook",
    "/journal",
    "/journal/rangbandi-dar-street-fashion",
  ]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const text = await page.getByRole("main").innerText();
    expect(text).not.toMatch(forbidden);
  }

  await page.goto("/", { waitUntil: "networkidle" });
  const editorialText = await page.locator("[data-f17-editorial]").allInnerTexts();
  expect(editorialText.join("\n")).not.toMatch(forbidden);
  await expectNoDraftProductLinks(page, "[data-f17-editorial]");
});
