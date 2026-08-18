import { expect, test, type Page } from "@playwright/test";

async function stabilize(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-seasonal-v2-dismissed", "1");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("F14 shop desktop visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.goto("/shop", {
    waitUntil: "domcontentloaded",
  });

  await page
    .getByRole("heading", {
      name: "استایل تو، قانون تو.",
    })
    .waitFor({
      state: "visible",
    });

  await page.evaluate(async () => {
    await document.fonts.ready;

    await Promise.all(
      Array.from(document.images).map(async (image) => {
        if (!image.complete) {
          await new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), {
              once: true,
            });
            image.addEventListener("error", () => resolve(), {
              once: true,
            });
          });
        }

        if (typeof image.decode === "function") {
          await image.decode().catch(() => undefined);
        }
      }),
    );
  });

  await stabilize(page);

  await expect(page).toHaveScreenshot("f14-shop-desktop.png", {
    fullPage: true,
    animations: "disabled",
  });
});

test("F14 category desktop visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/hoodies", { waitUntil: "networkidle" });
  await stabilize(page);
  await expect(page).toHaveScreenshot("f14-category-desktop.png", {
    fullPage: true,
    animations: "disabled",
  });
});

test("F14 search results mobile visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/search?q=هودی", { waitUntil: "networkidle" });
  await stabilize(page);
  await expect(page).toHaveScreenshot("f14-search-mobile.png", {
    fullPage: true,
    animations: "disabled",
  });
});

test("F14 staged mobile filter drawer visual contract", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto("/shop", {
    waitUntil: "domcontentloaded",
  });

  await page
    .getByRole("heading", {
      name: "استایل تو، قانون تو.",
    })
    .waitFor({
      state: "visible",
    });

  const filterButton = page.getByRole("button", { name: /فیلترها/ }).first();

  await expect(filterButton).toBeVisible();
  await page.waitForLoadState("load");

  await expect
    .poll(
      async () => {
        const expanded = await filterButton.getAttribute("aria-expanded");

        if (expanded === "true") {
          return expanded;
        }

        await filterButton.click();

        return filterButton.getAttribute("aria-expanded");
      },
      {
        timeout: 15_000,
        intervals: [250, 500, 1_000],
      },
    )
    .toBe("true");

  const dialog = page.getByRole("dialog", {
    name: /فیلتر محصولات/,
  });

  await expect(dialog).toBeVisible();

  const inStock = dialog.getByRole("checkbox", {
    name: "فقط کالاهای موجود",
  });

  await expect(inStock).toBeVisible();
  await inStock.check();
  await expect(inStock).toBeChecked();

  await stabilize(page);

  await expect(page).toHaveScreenshot("f14-filter-drawer-mobile.png", {
    animations: "disabled",
  });
});
