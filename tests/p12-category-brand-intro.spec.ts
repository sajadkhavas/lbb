import { expect, test } from "@playwright/test";
import {
  APPROVED_CATALOG_TAXONOMY,
  CATALOG_TAXONOMY_COMPATIBILITY,
  CURRENT_PROTOTYPE_CATEGORY_ROUTES,
} from "../src/lib/catalog-taxonomy";
import { BRAND_INTRO_STORAGE_KEY } from "../src/components/lbb/BrandIntro";

test("approved employer catalog taxonomy is preserved", () => {
  expect(APPROVED_CATALOG_TAXONOMY.map((group) => group.label)).toEqual([
    "تیشرت",
    "سویشرت",
    "شلوار",
    "پیراهن",
    "جکت‌ها",
    "کتونی",
  ]);

  const tshirts = APPROVED_CATALOG_TAXONOMY.find((group) => group.slug === "tshirts");

  expect(tshirts?.children?.map((item) => item.label)).toEqual([
    "اورسایز",
    "باکس",
    "یقه‌دار",
    "آستین‌بلند",
    "حلقه‌ای",
  ]);

  const denim = APPROVED_CATALOG_TAXONOMY.find((group) => group.slug === "pants")?.children?.find(
    (item) => item.slug === "denim",
  );

  expect(denim?.children?.map((item) => item.label)).toEqual(["بگ", "فول‌بگ", "بوت‌کات"]);

  const shoes = APPROVED_CATALOG_TAXONOMY.find((group) => group.slug === "shoes");

  expect(shoes?.strategy).toBe("filter-first");
  expect(shoes?.filters).toEqual(["برند", "سایز", "رنگ", "استایل", "موجودی", "محدوده قیمت"]);

  expect(CURRENT_PROTOTYPE_CATEGORY_ROUTES).toEqual([
    "hoodies",
    "pants",
    "tshirts",
    "shoes",
    "socks",
  ]);

  expect(CATALOG_TAXONOMY_COMPATIBILITY.retainedInventoryOnlyRoutes).toEqual(["socks"]);
});

test("normal regression-test state skips first-visit intro", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("lbb-brand-intro")).toHaveCount(0);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "از پینترست تا رگال LBB",
    }),
  ).toBeVisible();
});

test.describe("first-visit brand intro", () => {
  test.use({
    storageState: {
      cookies: [],
      origins: [],
    },
  });

  test("shows once, traps the first visit, then stays dismissed", async ({ page }) => {
    await page.goto("/");

    const intro = page.getByTestId("lbb-brand-intro");

    await expect(intro).toBeVisible();

    await expect(
      intro.getByRole("heading", {
        name: "از رگال تا فروشگاه",
      }),
    ).toBeVisible();

    await expect(
      intro.getByText("الهام‌گرفته از ذهنی خلاق", {
        exact: true,
      }),
    ).toBeVisible();

    await intro
      .getByRole("button", {
        name: "ورود به فروشگاه",
      })
      .click();

    await expect(intro).toHaveCount(0);

    const stored = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      BRAND_INTRO_STORAGE_KEY,
    );

    expect(stored).toBe("1");

    await page.reload();

    await expect(page.getByTestId("lbb-brand-intro")).toHaveCount(0);
  });

  test("story CTA records the visit and opens About", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("lbb-brand-intro")).toBeVisible();

    await page
      .getByRole("link", {
        name: "داستان LBB",
      })
      .click();

    await expect(page).toHaveURL(/\/about$/);

    const stored = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      BRAND_INTRO_STORAGE_KEY,
    );

    expect(stored).toBe("1");

    await expect(
      page.getByRole("heading", {
        name: "از رگال تا فروشگاه",
      }),
    ).toBeVisible();
  });
});
