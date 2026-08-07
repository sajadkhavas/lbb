import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
] as const;

const EDITORIAL_ROUTES = [
  "/collections",
  "/collections/drop-01-shabgard",
  "/lookbook",
  "/journal",
  "/journal/materials-101-parche-shenasi",
] as const;

async function prepare(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("lbb-announcement-dismissed", "1");
    localStorage.setItem("lbb-announcement-f12-v1-dismissed", "1");
  });
}

async function expectNoBlockingAxe(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const blocking = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(
    blocking.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      targets: violation.nodes.flatMap((node) => node.target),
    })),
  ).toEqual([]);
}

async function expectNoOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(2);
}

async function expectTouchTarget(locator: Locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.round(box!.width)).toBeGreaterThanOrEqual(44);
  expect(Math.round(box!.height)).toBeGreaterThanOrEqual(44);
}

test.beforeEach(async ({ page }) => {
  await prepare(page);
});

for (const route of [
  "/collections/drop-01-shabgard",
  "/lookbook",
  "/journal",
  "/journal/materials-101-parche-shenasi",
]) {
  test(`F17 Axe gate: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expectNoBlockingAxe(page);
  });
}

test("lookbook dialog traps focus, supports arrows and restores opener", async ({ page }) => {
  await page.goto("/lookbook", { waitUntil: "networkidle" });
  const opener = page.getByTestId("lookbook-scene-0");
  await opener.focus();
  await opener.press("Enter");

  const dialog = page.locator('[data-f17-lookbook-dialog="true"]');
  const close = dialog.getByRole("button", { name: "بستن تصویر" });
  const next = dialog.getByRole("button", { name: "تصویر بعدی" });
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();

  await next.focus();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(next).toBeFocused();

  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toBeVisible();
  await expectNoBlockingAxe(page);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("lookbook commerce controls are touch-safe or fail closed without a product hotspot", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lookbook", { waitUntil: "networkidle" });

  const hotspots = page.locator("[data-f17-product-hotspot]");
  if ((await hotspots.count()) > 0) {
    for (let index = 0; index < (await hotspots.count()); index += 1) {
      await expectTouchTarget(hotspots.nth(index));
    }
  } else {
    await expect(page.getByText("این لوک‌بوک فعلاً لینک مستقیم محصول ندارد")).toBeVisible();
    const main = page.locator('main[data-f17-route="lookbook"]');
    await expectTouchTarget(main.getByRole("link", { name: "فروشگاه", exact: true }));
  }

  const opener = page.getByTestId("lookbook-scene-0");
  await opener.click();
  const dialog = page.locator('[data-f17-lookbook-dialog="true"]');
  await expectTouchTarget(dialog.getByRole("button", { name: "بستن تصویر" }));
  await expectTouchTarget(dialog.getByRole("button", { name: "تصویر قبلی" }));
  await expectTouchTarget(dialog.getByRole("button", { name: "تصویر بعدی" }));
});

for (const viewport of VIEWPORTS) {
  test(`editorial routes are RTL and overflow-safe at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const route of EDITORIAL_ROUTES) {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await expect(page.getByRole("main")).toHaveCount(1);
      await expectNoOverflow(page);
    }
  });
}

test("editorial routes remain usable with zoom-permitting viewport and WCAG text spacing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/lookbook", "/journal/materials-101-parche-shenasi"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewport ?? "").not.toMatch(/user-scalable\s*=\s*no/i);
    expect(viewport ?? "").not.toMatch(/maximum-scale\s*=\s*1/i);

    await page.addStyleTag({
      content: `
        p, li, a, button, time {
          line-height: 1.5 !important;
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
        }
        p { margin-bottom: 2em !important; }
      `,
    });
    await expectNoOverflow(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("lookbook remains operable under reduced motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/lookbook", { waitUntil: "networkidle" });
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true,
  );
  await page.getByTestId("lookbook-scene-0").click();
  const dialog = page.locator('[data-f17-lookbook-dialog="true"]');
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
