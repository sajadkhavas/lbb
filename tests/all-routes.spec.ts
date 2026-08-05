import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/shop",
  "/hoodies",
  "/pants",
  "/tshirts",
  "/shoes",
  "/socks",
  "/search?q=%D9%87%D9%88%D8%AF%DB%8C",
  "/product/lbb-classic-hoodie",
  "/cart",
  "/checkout",
  "/order-confirmation",
  "/track-order",
  "/wishlist",
  "/account",
  "/design-system",
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
  "/contact",
  "/shipping-returns",
  "/size-guide",
  "/terms",
  "/privacy",
];

for (const route of routes) {
  test(`${route} renders without runtime or resource failure`, async ({ page }) => {
    const errors: string[] = [];
    const failedResources: string[] = [];

    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const text = message.text();
      if (text.startsWith("Failed to load resource:")) return;
      errors.push(text);
    });
    page.on("response", (response) => {
      if (response.status() < 400 || response.request().resourceType() === "document") return;
      const url = new URL(response.url());
      if (url.origin === "http://127.0.0.1:4173") {
        failedResources.push(`${response.status()} ${url.pathname}`);
      }
    });

    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status(), `document status for ${route}`).toBeLessThan(400);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(2);
    expect(errors).toEqual([]);
    expect(failedResources).toEqual([]);

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveCount(1);
  });
}

test("unknown route renders the designed 404 state", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist", { waitUntil: "networkidle" });
  expect([200, 404]).toContain(response?.status());
  await expect(page.getByRole("heading", { level: 1, name: "این صفحه وجود ندارد" })).toBeVisible();
});

test("invalid dynamic slugs render designed page-level states", async ({ page }) => {
  await page.goto("/collections/not-real", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "این کالکشن پیدا نشد" })).toBeVisible();
  await page.goto("/journal/not-real", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "این مقاله پیدا نشد" })).toBeVisible();
});
