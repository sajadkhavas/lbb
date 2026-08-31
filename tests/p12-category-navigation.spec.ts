import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const approvedGroups = ["تیشرت", "سویشرت", "شلوار", "پیراهن", "جکت‌ها", "کتونی"];

test("desktop shop menu exposes approved taxonomy without empty planned routes", async ({
  page,
}) => {
  await page.goto("/");

  await page
    .getByRole("button", {
      name: "فروشگاه",
    })
    .click();

  const menu = page.getByRole("dialog", {
    name: "منوی فروشگاه",
  });

  await expect(menu).toBeVisible();

  for (const label of approvedGroups) {
    await expect(
      menu
        .getByText(label, {
          exact: true,
        })
        .first(),
    ).toBeVisible();
  }

  await expect(
    menu.getByText("به‌زودی", {
      exact: true,
    }),
  ).toHaveCount(2);

  expect(await menu.locator('a[href="/shirts"]').count()).toBe(0);

  expect(await menu.locator('a[href="/jackets"]').count()).toBe(0);

  await expect(menu.getByText("مشاهده هودی‌های موجود", { exact: true })).toBeVisible();

  await expect(menu.getByText("مشاهده کتونی‌ها", { exact: true })).toBeVisible();
});

test("mobile menu uses the same approved taxonomy", async ({ page }) => {
  await page.setViewportSize({
    width: 390,
    height: 844,
  });

  await page.goto("/");

  await page
    .getByRole("button", {
      name: "منوی اصلی",
    })
    .click();

  const menu = page.getByRole("dialog", {
    name: "منوی اصلی",
  });

  await expect(menu).toBeVisible();

  for (const label of approvedGroups) {
    await expect(
      menu
        .getByText(label, {
          exact: true,
        })
        .first(),
    ).toBeVisible();
  }

  expect(await menu.locator('a[href="/shirts"]').count()).toBe(0);

  expect(await menu.locator('a[href="/jackets"]').count()).toBe(0);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(overflow).toBe(false);
});

test("retired homepage brand copy is absent", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("از مهستان، برای خیابان", { exact: true })).toHaveCount(0);

  await expect(
    page.getByText("پوشاک شهری", {
      exact: true,
    }),
  ).toHaveCount(0);

  await expect(page.getByText("الهام‌گرفته از ذهنی خلاق", { exact: true }).first()).toBeVisible();
});

test("retired slogan is absent from production source", () => {
  const sourceRoot = path.resolve(process.cwd(), "src");

  const stack = [sourceRoot];
  const files: string[] = [];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) continue;

    for (const entry of fs.readdirSync(current, {
      withFileTypes: true,
    })) {
      const full = path.join(current, entry.name);

      if (entry.isDirectory()) {
        stack.push(full);
      } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        files.push(full);
      }
    }
  }

  const matches = files.filter((file) =>
    fs.readFileSync(file, "utf8").includes("از مهستان، برای خیابان"),
  );

  expect(matches).toEqual([]);
});
