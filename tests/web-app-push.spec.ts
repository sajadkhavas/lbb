import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Web App settings route exposes install and notification controls", async ({ page }) => {
  await page.goto("/web-app");

  await expect(page.getByRole("heading", { level: 1, name: "Web App و اعلان‌های سفارش" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "نصب LBB روی دستگاه" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "اعلان وضعیت سفارش" })).toBeVisible();
  await expect(page.getByText("مجوز اعلان فقط وقتی خودت دکمه فعال‌سازی را بزنی درخواست می‌شود.")).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );
  expect(blocking).toEqual([]);
});

test("manifest remains installable and links to Web App settings", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();

  expect(manifest.id).toBe("/");
  expect(manifest.start_url).toBe("/");
  expect(manifest.scope).toBe("/");
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons.some((icon: { sizes?: string }) => icon.sizes === "512x512")).toBeTruthy();
  expect(manifest.shortcuts.some((shortcut: { url?: string }) => shortcut.url === "/web-app")).toBeTruthy();
});

test("service worker has visible Push and safe notification-click handling", async ({ request }) => {
  const response = await request.get("/sw.js");
  expect(response.ok()).toBeTruthy();
  const worker = await response.text();

  expect(worker).toContain('addEventListener("push"');
  expect(worker).toContain("showNotification");
  expect(worker).toContain('addEventListener("notificationclick"');
  expect(worker).toContain("safeNotificationUrl");
  expect(worker).toContain("clients.openWindow");
});
