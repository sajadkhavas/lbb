import { test, expect } from "@playwright/test";

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
];

const routes = [
  "/collections",
  "/collections/drop-01-shabgard",
  "/collections/drop-02-atashe-sorkh",
  "/collections/capsule-denim",
  "/lookbook",
  "/journal",
  "/journal/chetori-hoodie-eversayz-ro-bepoosim",
  "/journal/tarikhche-farhang-khiaboni-iran",
  "/journal/rahnama-negahdari-libas-streetwear",
  "/journal/rangbandi-dar-street-fashion",
  "/journal/materials-101-parche-shenasi",
  "/about",
  "/faq",
];

const routeName = (route) => route.replace(/^\//, "").replaceAll("/", "--") || "home";

test.use({ baseURL: process.env.PLAYWRIGHT_BASE_URL });
test.describe.configure({ mode: "serial" });

for (const viewport of viewports) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport });

    for (const route of routes) {
      test(`${route} supports direct load and refresh`, async ({ page }) => {
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(message.text());
        });

        await page.goto(route, { waitUntil: "networkidle" });
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("h1")).toBeVisible();
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1))
          .toBe(true);

        await page.reload({ waitUntil: "networkidle" });
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("h1")).toBeVisible();
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1))
          .toBe(true);

        expect(errors, `Runtime errors on ${route} at ${viewport.width}px`).toEqual([]);
        await page.screenshot({
          path: `f7-artifacts/${viewport.width}/${routeName(route)}.png`,
          fullPage: true,
        });
      });
    }
  });
}

test("collection internal link navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/collections", { waitUntil: "networkidle" });
  await page.locator('a[href="/collections/drop-01-shabgard"]').first().click();
  await expect(page).toHaveURL(/\/collections\/drop-01-shabgard$/);
  await expect(page.locator("h1")).toContainText("شبگرد");
});

test("journal internal link navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/journal", { waitUntil: "networkidle" });
  await page.locator('a[href="/journal/chetori-hoodie-eversayz-ro-bepoosim"]').first().click();
  await expect(page).toHaveURL(/\/journal\/chetori-hoodie-eversayz-ro-bepoosim$/);
  await expect(page.locator("h1")).toContainText("هودی اورسایز");
});

test("invalid collection slug has designed not-found state", async ({ page }) => {
  await page.goto("/collections/not-a-real-collection", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "این کالکشن پیدا نشد" })).toBeVisible();
  await expect(page.getByRole("link", { name: "بازگشت به کالکشن‌ها" })).toBeVisible();
});

test("invalid journal slug has designed not-found state", async ({ page }) => {
  await page.goto("/journal/not-a-real-article", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "این مقاله پیدا نشد" })).toBeVisible();
  await expect(page.getByRole("link", { name: "بازگشت به ژورنال" })).toBeVisible();
});

test("lookbook dialog supports keyboard close", async ({ page }) => {
  await page.goto("/lookbook", { waitUntil: "networkidle" });
  await page.locator('button[aria-haspopup="dialog"]').first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("FAQ disclosure opens", async ({ page }) => {
  await page.goto("/faq", { waitUntil: "networkidle" });
  const firstDetails = page.locator("details").first();
  await firstDetails.locator("summary").click();
  await expect(firstDetails).toHaveAttribute("open", "");
});
