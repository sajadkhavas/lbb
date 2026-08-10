import { expect, test } from "@playwright/test";

const meta = { apiVersion: "v1", contractVersion: "2026-08-09-f14-be-f1" };

test("live checkout associates custom errors and focuses the first invalid field", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "lbb-cart-v2",
      JSON.stringify({
        schemaVersion: 1,
        mode: "live",
        updatedAt: Date.now(),
        lines: [
          {
            slug: "f19-live",
            name: "F19 live fixture",
            price: 100000,
            variantId: "01234567890123456789012345",
            source: "backend",
            qty: 1,
          },
        ],
      }),
    );
  });

  await page.route("https://api.example.test/api/v1/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/v1/auth/me") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: "customer-f19",
              mobile: "09120000000",
              fullName: null,
              email: null,
              mobileVerified: true,
              marketingConsent: false,
              createdAt: null,
              updatedAt: null,
            },
          },
          meta,
        }),
      });
      return;
    }
    if (url.pathname === "/api/v1/delivery/options") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            zone: {
              id: "zone-f19",
              name: "Test zone",
              minimumOrderToman: null,
              freeDeliveryThresholdToman: null,
              packagingFeeToman: 0,
              processing: { minDays: 1, maxDays: 2 },
            },
            methods: [{ method: "standard", label: "ارسال استاندارد", enabled: true, feeToman: 0 }],
          },
          meta,
        }),
      });
      return;
    }
    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        code: "not_found",
        message: "not found",
        errors: {},
        meta,
      }),
    });
  });

  await page.goto("/checkout", { waitUntil: "networkidle" });
  const submit = page.getByRole("button", { name: "دریافت جمع نهایی از Backend" });
  await expect(submit).toBeEnabled();
  await submit.click();

  for (const field of ["name", "province", "city", "address"] as const) {
    const control = page.locator(`#co-${field}`);
    await expect(control).toHaveAttribute("aria-invalid", "true");
    await expect(control).toHaveAttribute("aria-describedby", `co-${field}-error`);
    await expect(page.locator(`#co-${field}-error`)).toBeVisible();
  }
  await expect(page.locator("#co-name")).toBeFocused();
});
