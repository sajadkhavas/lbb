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

async function settleFullPageLayout(page: Page) {
  await page.waitForLoadState("networkidle");

  await page.evaluate(async () => {
    const sleep = (milliseconds: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, milliseconds);
      });

    const frame = () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

    const step = Math.max(window.innerHeight, 640);

    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({
        top: y,
        left: 0,
        behavior: "auto",
      });

      await frame();
    }

    await Promise.all(
      Array.from(document.images).map(async (image) => {
        if (!image.complete) {
          await Promise.race([
            new Promise<void>((resolve) => {
              const done = () => resolve();

              image.addEventListener("load", done, { once: true });

              image.addEventListener("error", done, { once: true });
            }),
            sleep(5_000),
          ]);
        }

        if (image.complete && image.naturalWidth > 0) {
          try {
            await Promise.race([image.decode(), sleep(5_000)]);
          } catch {
            // Visual settling must fail only
            // if layout itself remains unstable.
          }
        }
      }),
    );

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    await frame();
  });

  let previousHeight = -1;
  let stableSamples = 0;

  for (let index = 0; index < 20; index += 1) {
    const currentHeight = await page.evaluate(() => document.documentElement.scrollHeight);

    if (currentHeight === previousHeight) {
      stableSamples += 1;
    } else {
      stableSamples = 0;
    }

    if (stableSamples >= 3) {
      return;
    }

    previousHeight = currentHeight;
    await page.waitForTimeout(200);
  }

  throw new Error("F14 full-page layout did not reach a stable height.");
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-seasonal-v2-dismissed", "1");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("F14 shop desktop visual contract", async ({ page }) => {
  test.setTimeout(120_000);

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
  await settleFullPageLayout(page);

  await expect(page).toHaveScreenshot("f14-shop-desktop.png", {
    fullPage: true,
    animations: "disabled",
    timeout: 45_000,
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
