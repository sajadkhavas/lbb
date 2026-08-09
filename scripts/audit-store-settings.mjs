import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];
const read = (relative) => readFile(path.join(root, relative), "utf8").catch(() => "");

const settings = await read("src/lib/store-settings.ts");
const readiness = await read("src/lib/launch-readiness.ts");
const trustMarks = await read("src/components/lbb/TrustMarks.tsx");
const commerce = await read("src/lib/commerce.ts");
const shippingReturns = await read("src/routes/shipping-returns.tsx");
const contact = await read("src/routes/contact.tsx");
const checkout = await read("src/routes/checkout.tsx");
const orderConfirmation = await read("src/routes/order-confirmation.tsx");
const trackOrder = await read("src/routes/track-order.tsx");

if (!settings) failures.push("Typed public store settings are missing.");
if (!readiness) failures.push("Launch-readiness evaluator is missing.");
if (!trustMarks) failures.push("Controlled trust-mark component is missing.");
if (!commerce) failures.push("Frontend commerce readiness boundary is missing.");

for (const forbidden of [
  "merchantSecret",
  "clientSecret",
  "apiSecret",
  "webhookSecret",
  "privateKey",
  "dangerouslySetInnerHTML",
  "rawHtml",
  "rawScript",
]) {
  if (`${settings}\n${trustMarks}`.includes(forbidden)) {
    failures.push(`Forbidden public settings or rendering capability found: ${forbidden}`);
  }
}

for (const required of [
  "VerificationState",
  "PaymentPublicSettings",
  "EnamadPublicSettings",
  "getPublicShippingMethods",
  "canPublishShipping",
  "canPublishReturns",
  "getPublicPaymentSettings",
  "getPublicEnamad",
  "canDisplayEnamad",
  "canOfferPayment",
  "getVisibleTrustClaims",
]) {
  if (!settings.includes(required)) {
    failures.push(`Store settings contract is missing: ${required}`);
  }
}

for (const required of [
  "storefrontContentReady",
  "commerceLaunchReady",
  "backend.paymentIntegration",
  "VITE_SITE_URL",
]) {
  if (!readiness.includes(required)) {
    failures.push(`Launch-readiness contract is missing: ${required}`);
  }
}

if (!trustMarks.includes("getPublicEnamad(STORE_SETTINGS, placement)")) {
  failures.push(
    "Trust mark must remain gated by controlled verified Enamad settings and placement.",
  );
}
if (!trustMarks.includes('rel="noopener noreferrer"')) {
  failures.push("External trust verification link must prevent opener access.");
}
if (trustMarks.includes("dangerouslySetInnerHTML") || /<script\b/i.test(trustMarks)) {
  failures.push("Enamad rendering must not accept raw HTML or executable script.");
}

for (const forbidden of [
  "FREE_SHIPPING_THRESHOLD",
  "STANDARD_SHIPPING_FEE",
  "shippingFeeFor",
  "DEMO_ORDERS_KEY",
  "saveDemoOrder",
  "createDemoOrderRef",
  "findDemoOrder",
]) {
  if (commerce.includes(forbidden)) {
    failures.push(`Invented/demo commerce behavior remains in src/lib/commerce.ts: ${forbidden}`);
  }
}

// Public store settings alone are not proof that transactional backend capabilities are ready.
// F14D owns actual order/payment execution through the versioned backend contract instead.
if (!commerce.includes("orderSubmissionReady: false")) {
  failures.push("Public settings alone must not claim order-submission readiness.");
}
if (!commerce.includes("paymentVerificationReady: false")) {
  failures.push("Public settings alone must not claim payment-verification readiness.");
}

for (const required of ["getPublicShippingMethods", "canPublishReturns"]) {
  if (!shippingReturns.includes(required)) {
    failures.push(`Shipping/returns route must use truth-safe store settings helper: ${required}`);
  }
}
if (/2_000_000|60_000|ارسال 2 تا 3 روزه|۷ روز ضمانت بازگشت/.test(shippingReturns)) {
  failures.push("Unsupported shipping or returns promise remains in public policy surface.");
}

if (!contact.includes("getPublicContactChannels") || !contact.includes("getPublicStoreLocation")) {
  failures.push("Contact route must use verified public contact/location helpers.");
}
if (/<form\b/i.test(contact) || contact.includes("پیام شما ارسال شد")) {
  failures.push("Contact route must not expose a false-success form without a transport.");
}

if (!checkout.includes("getCommerceReadiness") || !checkout.includes("getPublicPaymentSettings")) {
  failures.push("Checkout must preserve explicit public commerce/payment readiness boundaries.");
}

for (const forbidden of ["saveDemoOrder", "createDemoOrderRef", "shippingFeeFor", "findDemoOrder"]) {
  if (checkout.includes(forbidden)) {
    failures.push(`Checkout still contains invented/demo commerce behavior: ${forbidden}`);
  }
}

for (const required of [
  "isLiveBackend() ? <LiveCheckout /> : <PrototypeCheckout />",
  "cartLinesToBackendItems",
  "getDeliveryOptions",
  "createCheckoutQuote",
  "commitCheckout",
  "createIdempotencyKey",
  "initiatePayment",
  "ensureBackendCsrf",
]) {
  if (!checkout.includes(required)) {
    failures.push(`F14D live checkout boundary is missing: ${required}`);
  }
}

const liveStart = checkout.indexOf("function LiveCheckout()");
const prototypeStart = checkout.indexOf("function PrototypeCheckout()");
const chromeStart = checkout.indexOf("function CheckoutChrome", prototypeStart);
if (liveStart < 0 || prototypeStart < 0 || prototypeStart <= liveStart) {
  failures.push("Checkout must keep explicit live and prototype implementations separated.");
} else {
  const liveCheckout = checkout.slice(liveStart, prototypeStart);
  const prototypeCheckout = checkout.slice(
    prototypeStart,
    chromeStart > prototypeStart ? chromeStart : checkout.length,
  );

  if (!/<form\b/i.test(liveCheckout)) {
    failures.push("Live checkout must collect recipient data only for authoritative backend quote.");
  }
  for (const required of ["createCheckoutQuote", "commitCheckout", "initiatePayment"]) {
    if (!liveCheckout.includes(required)) {
      failures.push(`Live checkout does not use backend operation: ${required}`);
    }
  }
  if (/<form\b/i.test(prototypeCheckout)) {
    failures.push("Prototype checkout must not collect order submission data.");
  }
  if (/createCheckoutQuote|commitCheckout|initiatePayment|window\.location\.assign/.test(prototypeCheckout)) {
    failures.push("Prototype checkout must not execute live commerce operations.");
  }
}

if (!orderConfirmation.includes("SERVER VERIFICATION REQUIRED")) {
  failures.push("Order confirmation must require server-side verification.");
}
if (trackOrder.includes("sessionStorage") || /findDemoOrder|DemoOrderSummary/.test(trackOrder)) {
  failures.push("Order tracking must not treat browser-local demo data as a real order source.");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Store settings, F14E trust boundary, and F14D live-commerce separation audit passed.");
