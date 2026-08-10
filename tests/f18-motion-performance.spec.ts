import { expect, test } from "@playwright/test";

test("reduced motion keeps the active ticker visually static and native scrolling intact", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });

  const ticker = page.locator('[data-f18-motion="viewport-ticker"]');
  await expect(ticker).toHaveCSS("animation-name", "none");
  const firstTransform = await ticker.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(180);
  const secondTransform = await ticker.evaluate((element) => getComputedStyle(element).transform);
  expect(secondTransform).toBe(firstTransform);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.classList.contains("lenis") ||
        document.body.classList.contains("lenis"),
    ),
  ).toBe(false);
});

test("ticker only spends animation work while near the viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "networkidle" });

  const ticker = page.locator('[data-f18-motion="viewport-ticker"]');
  await ticker.scrollIntoViewIfNeeded();
  await expect(ticker).toHaveCSS("animation-play-state", "running");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(ticker).toHaveCSS("animation-play-state", "paused");
});
