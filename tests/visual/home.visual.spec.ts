import { expect, test } from "@playwright/test";

/**
 * Snapshot capture is intentionally deferred until all feature branches are
 * merged in Final Review. Remove the suite-level skip only after that merge so
 * the first committed baselines represent the integrated product.
 */
test.describe("LBB integrated visual baselines", () => {
  test.skip(true, "Capture snapshots after feature branches merge in Final Review.");

  test("homepage", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.locator("[data-testid='countdown']").evaluateAll((nodes) => {
      for (const node of nodes) node.setAttribute("style", "visibility:hidden");
    });

    await expect(page).toHaveScreenshot("home-full.png", { fullPage: true });
  });
});
