import { expect, test, type Page } from "@playwright/test";
import {
  STORE_SETTINGS,
  canDisplayEnamad,
  canOfferPayment,
  canPublishReturns,
  canPublishShipping,
  getPublicContactChannels,
  getPublicEnamad,
  getPublicPaymentSettings,
  getPublicShippingMethods,
  type StoreSettings,
} from "../src/lib/store-settings";

function cloneSettings(): StoreSettings {
  return structuredClone(STORE_SETTINGS);
}

function collectKeys(value: unknown, keys = new Set<string>()): Set<string> {
  if (!value || typeof value !== "object") return keys;
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, keys);
    return keys;
  }
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    keys.add(key);
    collectKeys(child, keys);
  }
  return keys;
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(2);
}

test("shipping remains hidden for missing, pending and disabled settings", () => {
  const missing = cloneSettings();
  missing.shipping.isEnabled = false;
  missing.shipping.verification = "missing";
  missing.shipping.methods = [];
  expect(getPublicShippingMethods(missing)).toEqual([]);
  expect(canPublishShipping(missing)).toBe(false);

  const pending = cloneSettings();
  pending.shipping.isEnabled = true;
  pending.shipping.verification = "pending";
  pending.shipping.methods = [
    {
      id: "pending-method",
      title: "روش در حال بررسی",
      description: "",
      feeToman: 123_456,
      freeFromToman: 987_654,
      processingTimeLabel: "نامعتبر تا تأیید",
      deliveryTimeLabel: "نامعتبر تا تأیید",
      isEnabled: true,
      verification: "pending",
    },
  ];
  expect(getPublicShippingMethods(pending)).toEqual([]);

  const disabled = cloneSettings();
  disabled.shipping.isEnabled = false;
  disabled.shipping.verification = "verified";
  disabled.shipping.methods = [
    {
      ...pending.shipping.methods[0],
      id: "disabled-method",
      verification: "verified",
    },
  ];
  expect(getPublicShippingMethods(disabled)).toEqual([]);
});

test("only verified and enabled shipping methods become public", () => {
  const settings = cloneSettings();
  settings.shipping.isEnabled = true;
  settings.shipping.verification = "verified";
  settings.shipping.methods = [
    {
      id: "verified-method",
      title: "روش تأییدشده",
      description: "اطلاعات عمومی تأییدشده",
      feeToman: null,
      freeFromToman: null,
      processingTimeLabel: null,
      deliveryTimeLabel: null,
      isEnabled: true,
      verification: "verified",
    },
    {
      id: "pending-method",
      title: "روش منتشرنشده",
      description: "",
      feeToman: 42,
      freeFromToman: 84,
      processingTimeLabel: "pending",
      deliveryTimeLabel: "pending",
      isEnabled: true,
      verification: "pending",
    },
  ];

  expect(getPublicShippingMethods(settings).map((method) => method.id)).toEqual([
    "verified-method",
  ]);
  expect(canPublishShipping(settings)).toBe(true);
});

test("returns require verified enabled settings and a published policy", () => {
  const settings = cloneSettings();
  settings.returns.isEnabled = true;
  settings.returns.verification = "verified";
  settings.returns.returnWindowDays = 99;

  expect(canPublishReturns(settings)).toBe(false);
  settings.legal.shippingReturnsPublished = true;
  expect(canPublishReturns(settings)).toBe(true);

  settings.returns.verification = "pending";
  expect(canPublishReturns(settings)).toBe(false);
});

test("Enamad renders only controlled verified HTTPS data at its placement", () => {
  const settings = cloneSettings();
  expect(canDisplayEnamad(settings)).toBe(false);
  expect(getPublicEnamad(settings, "footer")).toBeNull();

  settings.enamad = {
    isEnabled: true,
    verification: "verified",
    identifier: "controlled-public-id",
    verificationUrl: "https://example.test/verify",
    badgeImageUrl: "https://example.test/badge.png",
    altText: "نماد تأییدشده",
    displayLocation: "footer",
  };

  expect(canDisplayEnamad(settings, "footer")).toBe(true);
  expect(getPublicEnamad(settings, "trust-page")).toBeNull();

  settings.enamad.verificationUrl = "javascript:alert(1)";
  expect(canDisplayEnamad(settings, "footer")).toBe(false);
  settings.enamad.verificationUrl = "https://example.test/verify";
  settings.enamad.badgeImageUrl = "data:image/svg+xml,<svg></svg>";
  expect(canDisplayEnamad(settings, "footer")).toBe(false);
});

test("payment exposes only verified public configuration and no private key fields", () => {
  const settings = cloneSettings();
  expect(canOfferPayment(settings)).toBe(false);
  expect(getPublicPaymentSettings(settings)).toBeNull();

  settings.payment = {
    isEnabled: true,
    verification: "verified",
    provider: "custom",
    displayName: "روش عمومی تأییدشده",
    iconUrl: null,
    callbackPath: "/payment/callback",
    paymentMethods: ["online-gateway"],
  };

  expect(canOfferPayment(settings)).toBe(true);
  expect(getPublicPaymentSettings(settings)?.displayName).toBe("روش عمومی تأییدشده");

  const publicKeys = collectKeys(settings.payment);
  for (const forbidden of [
    "merchantId",
    "merchantID",
    "apiKey",
    "clientSecret",
    "privateKey",
    "webhookSecret",
  ]) {
    expect(publicKeys.has(forbidden)).toBe(false);
  }
});

test("contacts require public verified safe channels", () => {
  const settings = cloneSettings();
  settings.contacts = [
    {
      kind: "instagram",
      label: "verified",
      value: "verified",
      href: "https://example.test/contact",
      isPublic: true,
      verification: "verified",
    },
    {
      kind: "instagram",
      label: "pending",
      value: "pending",
      href: "https://example.test/pending",
      isPublic: true,
      verification: "pending",
    },
    {
      kind: "instagram",
      label: "unsafe",
      value: "unsafe",
      href: "javascript:alert(1)",
      isPublic: true,
      verification: "verified",
    },
  ];

  expect(getPublicContactChannels(settings).map((channel) => channel.label)).toEqual(["verified"]);
});

test("shipping, contact, legal and privacy routes are truth-safe at mobile width", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 390,
    height: 844,
  });

  await page.goto("/shipping-returns", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "ارسال، تعویض و مرجوعی",
    }),
  ).toBeVisible();

  const shippingSection = page.locator('section[aria-labelledby="shipping-heading"]');

  await expect(shippingSection).toBeVisible();

  for (const method of [
    "ارسال فوری با پیک",
    "تیپاکس — پس‌کرایه",
    "دکاپست — پس‌کرایه",
    "پست پیشتاز",
  ]) {
    await expect(
      shippingSection.getByText(method, {
        exact: true,
      }),
    ).toBeVisible();
  }

  const returnsSection = page.locator('section[aria-labelledby="returns-heading"]');

  await expect(returnsSection).toBeVisible();

  await expect(
    returnsSection.getByText("سیاست بازگشت در حال بررسی است", {
      exact: true,
    }),
  ).toBeVisible();

  await expect(page.getByText(/۷ روز ضمانت بازگشت/)).toHaveCount(0);

  await expectNoHorizontalOverflow(page);

  await page.goto("/contact", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByText("کرج", {
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByText("پاساژ مهستان", {
      exact: true,
    }),
  ).toBeVisible();

  await expect(page.locator("main form")).toHaveCount(0);

  await expect(page.getByText("فرم تماس آنلاین فعال نیست")).toBeVisible();

  await expectNoHorizontalOverflow(page);

  await page.goto("/terms", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "شرایط استفاده",
    }),
  ).toBeVisible();

  await expectNoHorizontalOverflow(page);

  await page.goto("/privacy", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "حریم خصوصی",
    }),
  ).toBeVisible();

  await expectNoHorizontalOverflow(page);
});

test("checkout with cart data cannot submit or claim payment success", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.setItem(
      "lbb-cart-v1",
      JSON.stringify([
        {
          slug: "lbb-classic-hoodie",
          name: "هودی کلاسیک LBB",
          price: 1_000_000,
          color: "#000000",
          size: "L",
          qty: 1,
        },
      ]),
    );
  });

  await page.goto("/checkout", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "تکمیل سفارش" })).toBeVisible();
  await expect(page.locator("main form")).toHaveCount(0);
  await expect(page.getByText("ثبت نهایی سفارش هنوز سمت سرور تأیید نشده است")).toBeVisible();
  await expect(page.getByText(/پرداخت موفق/)).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test("order confirmation and tracking never trust browser-local success", async ({ page }) => {
  await page.goto("/order-confirmation?status=success&ref=fake", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { level: 1, name: "سفارشی برای تأیید معتبر وجود ندارد" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /سفارش.*ثبت شد/ })).toHaveCount(0);

  await page.goto("/track-order", { waitUntil: "networkidle" });
  await expect(page.locator("main form")).toHaveCount(0);
  await expect(page.getByText("فرم پیگیری عمداً غیرفعال است")).toBeVisible();
});
