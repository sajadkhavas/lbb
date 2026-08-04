import { expect, test } from "@playwright/test";

test("search URL, refresh and browser history stay synchronized", async ({ page }) => {
  await page.goto("/search?q=%D9%87%D9%88%D8%AF%DB%8C", { waitUntil: "networkidle" });
  const searchbox = page.getByRole("searchbox").first();
  await expect(searchbox).toHaveValue("هودی");

  await searchbox.fill("شلوار");
  await expect(page).toHaveURL(/\/search\?q=%D8%B4%D9%84%D9%88%D8%A7%D8%B1/);
  await page.reload({ waitUntil: "networkidle" });
  await expect(searchbox).toHaveValue("شلوار");

  await page.goBack({ waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/search\?q=%D9%87%D9%88%D8%AF%DB%8C/);
  await expect(searchbox).toHaveValue("هودی");
  await page.goForward({ waitUntil: "networkidle" });
  await expect(searchbox).toHaveValue("شلوار");
});

test("filtered category deep links survive refresh", async ({ page }) => {
  await page.goto("/hoodies?size=M&sort=price-asc", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/size=M/);
  await expect(page).toHaveURL(/sort=price-asc/);
  await expect(page.locator("h1")).toHaveCount(1);
  await page.reload({ waitUntil: "networkidle" });
  await expect(page).toHaveURL(/size=M/);
  await expect(page).toHaveURL(/sort=price-asc/);
});

test("product deep link and keyboard gallery remain usable", async ({ page }) => {
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "هودی کلاسیک LBB" })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowRight");
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "هودی کلاسیک LBB" })).toBeVisible();
});

test("lookbook dialog supports arrows, Escape and focus restoration", async ({ page }) => {
  await page.goto("/lookbook", { waitUntil: "networkidle" });
  const opener = page.locator('button[aria-haspopup="dialog"]').first();
  await opener.focus();
  await opener.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});
