import { expect, test } from "@playwright/test";

const legacyLine = {
  slug: "f16-legacy-item",
  name: "F16 Legacy Item",
  price: 125000,
  source: "prototype",
  color: "black",
  colorLabel: "مشکی",
  size: "M",
  sizeLabel: "M",
  qty: 2,
};

test("F16 migrates legacy cart arrays into the versioned envelope", async ({ page }) => {
  await page.addInitScript((line) => {
    localStorage.setItem("lbb-cart-v1", JSON.stringify([line]));
  }, legacyLine);
  await page.goto("/cart");
  await expect(page.getByText("F16 Legacy Item")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const raw = localStorage.getItem("lbb-cart-v1");
        if (!raw) return null;
        const value = JSON.parse(raw);
        return { schemaVersion: value.schemaVersion, mode: value.mode, count: value.lines?.length };
      }),
    )
    .toEqual({ schemaVersion: 1, mode: "prototype", count: 1 });
});

test("F16 sanitizes, deduplicates and caps restored quantities", async ({ page }) => {
  await page.addInitScript((line) => {
    localStorage.setItem(
      "lbb-cart-v1",
      JSON.stringify({
        schemaVersion: 1,
        mode: "prototype",
        updatedAt: Date.now(),
        lines: [
          { ...line, qty: 15 },
          { ...line, qty: 10 },
          { slug: "broken", name: "Broken", price: -1, qty: 1 },
        ],
      }),
    );
  }, legacyLine);
  await page.goto("/cart");
  await expect
    .poll(() =>
      page.evaluate(() => {
        const raw = localStorage.getItem("lbb-cart-v1");
        if (!raw) return null;
        const value = JSON.parse(raw);
        return value.lines?.map((line: { slug: string; qty: number }) => ({
          slug: line.slug,
          qty: line.qty,
        }));
      }),
    )
    .toEqual([{ slug: "f16-legacy-item", qty: 20 }]);
});

test("F16 synchronizes cart state between tabs through storage events", async ({ context }) => {
  const first = await context.newPage();
  const second = await context.newPage();
  await first.goto("/cart");
  await second.goto("/cart");
  await expect(second.getByText("سبد خرید شما خالی است")).toBeVisible();

  await first.evaluate((line) => {
    localStorage.setItem(
      "lbb-cart-v1",
      JSON.stringify({
        schemaVersion: 1,
        mode: "prototype",
        updatedAt: Date.now(),
        lines: [line],
      }),
    );
  }, legacyLine);

  await expect(second.getByText("F16 Legacy Item")).toBeVisible();
});
