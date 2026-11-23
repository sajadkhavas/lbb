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
const terms = await read("src/routes/terms.tsx");
const privacy = await read("src/routes/privacy.tsx");
const contact = await read("src/routes/contact.tsx");
const sizeGuide = await read("src/routes/size-guide.tsx");
const home = await read("src/routes/index.tsx");
const ticker = await read("src/components/lbb/home/TickerStrip.tsx");
const trustStrip = await read("src/components/lbb/home/TrustStrip.tsx");
const decision = await read("src/components/lbb/home/DecisionSupport.tsx");
const localStore = await read("src/components/lbb/home/LocalStoreVisit.tsx");
const dropStory = await read("src/components/lbb/home/DropStory.tsx");
const instagram = await read("src/components/lbb/InstagramStrip.tsx");
const storefrontControl = await read("src/lib/storefront-control.tsx");
const storefrontPresentation = await read("src/lib/storefront-presentation.tsx");
const publicHref = await read("src/lib/public-href.ts");
const backendApi = await read("src/lib/backend-api.ts");
const finalTechnicalApi = await read("src/lib/final-technical-api.ts");
const backendDelivery = await read("src/lib/backend-delivery.ts");
const checkout = await read("src/routes/checkout.tsx");
const orderConfirmation = await read("src/routes/order-confirmation.tsx");
const trackOrder = await read("src/routes/track-order.tsx");
const envExample = await read(".env.example");

const requiredFiles = {
  settings,
  readiness,
  trustMarks,
  commerce,
  shippingReturns,
  contact,
  storefrontControl,
  storefrontPresentation,
  backendApi,
  finalTechnicalApi,
  backendDelivery,
  publicHref,
};
for (const [name, source] of Object.entries(requiredFiles)) {
  if (!source) failures.push(`Required final storefront source is missing: ${name}`);
}

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
  if (`${settings}\n${trustMarks}\n${storefrontControl}`.includes(forbidden)) {
    failures.push(`Forbidden public setting/render capability found: ${forbidden}`);
  }
}

for (const required of [
  "storefrontContentReady",
  "commerceLaunchReady",
  "backend.paymentIntegration",
  "backendEvidence.paymentServerReady",
  "VITE_SITE_URL",
]) {
  if (!readiness.includes(required))
    failures.push(`Launch-readiness contract is missing: ${required}`);
}

if (readiness.includes('id: "payment.server"') && readiness.includes("passed: false")) {
  failures.push("Payment server readiness must be evidence-driven, not a permanent false literal.");
}

for (const required of [
  "/api/v1/storefront/bootstrap",
  'source: "prototype"',
  "ticker:",
  "trust:",
  "sectionCopy:",
  "decisionSupport:",
  "localStore:",
  "featuredStory:",
  "policies:",
  "runtime:",
  "objectSetting<ReturnsPolicyControl>",
  "objectSetting<EnamadControl>",
]) {
  if (!storefrontControl.includes(required))
    failures.push(`Final storefront control missing: ${required}`);
}
if (!backendApi.includes('LBB_CONTRACT_VERSION = "2026-09-06-p3-storefront-v1"')) {
  failures.push("Backend contract version is not locked to the accepted additive contract.");
}
if (!envExample.includes("# 2026-09-06-p3-storefront-v1")) {
  failures.push("Frontend environment example documents a stale backend contract.");
}

// Final live public business surfaces must no longer read static STORE_SETTINGS.
for (const [surface, source] of Object.entries({ trustMarks, shippingReturns, terms, privacy })) {
  if (source.includes("STORE_SETTINGS")) {
    failures.push(`${surface} still reads static STORE_SETTINGS on a final live public surface.`);
  }
}

for (const required of ["useStorefrontControl", "policies.enamad", 'rel="noopener noreferrer"']) {
  if (!trustMarks.includes(required))
    failures.push(`Backend-driven trust mark missing: ${required}`);
}
if (trustMarks.includes("dangerouslySetInnerHTML") || /<script\b/i.test(trustMarks)) {
  failures.push("Trust rendering must not accept raw HTML or executable script.");
}

for (const required of [
  "getDeliveryOptions",
  "useStorefrontControl",
  "policies.returns",
  "shippingCards",
]) {
  if (!shippingReturns.includes(required))
    failures.push(`Backend-authoritative shipping/returns missing: ${required}`);
}
if (/2_000_000|60_000|۷ روز ضمانت بازگشت/.test(shippingReturns)) {
  failures.push(
    "Unsupported fixed shipping/returns promise remains in final public policy surface.",
  );
}

for (const required of [
  "resolveStorefrontControl",
  'resolveStorefrontPage("contact")',
  "control.contact.phone",
  "control.contact.whatsapp",
  "control.contact.instagramUrl",
  "control.contact.email",
  "control.contact.addressLine",
  "control.contact.mapUrl",
  "control.contact.openingHours",
]) {
  if (!contact.includes(required))
    failures.push(`Admin-driven contact control missing: ${required}`);
}

for (const required of [
  'resolveOptionalStorefrontPage("size-guide")',
  'control.source === "live"',
  "NOINDEX_FOLLOW",
]) {
  if (!sizeGuide.includes(required))
    failures.push(`Admin-driven size guide boundary missing: ${required}`);
}

for (const required of ["runtime.checkoutEnabled", "runtime.payment.enabled", "policies.returns"]) {
  if (!terms.includes(required))
    failures.push(`Backend-authoritative Terms status missing: ${required}`);
}
for (const required of [
  "runtime.checkoutEnabled",
  "runtime.payment.enabled",
  "useStorefrontControl",
]) {
  if (!privacy.includes(required))
    failures.push(`Backend-authoritative Privacy status missing: ${required}`);
}

for (const [surface, source, required] of [
  ["ticker", ticker, ["useStorefrontControl", "ticker"]],
  ["trust strip", trustStrip, ["useStorefrontControl", "safePublicHref"]],
  ["decision support", decision, ["decisionSupport", "safePublicHref"]],
  ["local store", localStore, ["localStore", "contact", 'source === "live"']],
  ["featured story", dropStory, ["featuredStory", "liveStory", 'source === "live"']],
  ["instagram", instagram, ["sectionCopy.instagram", 'source === "live"']],
]) {
  for (const token of required) {
    if (!source.includes(token)) failures.push(`Final ${surface} wiring missing: ${token}`);
  }
}
for (const required of [
  "getCollection",
  "resolveLiveFeaturedStory",
  "featuredStory",
  "listStorefrontCategories",
  "resolveStorefrontHomeProducts",
]) {
  if (!home.includes(required))
    failures.push(`Home live loader missing backend authority: ${required}`);
}
for (const required of ["resolveStorefrontHomeProducts", "/api/v1/storefront/home-products"]) {
  if (!storefrontPresentation.includes(required)) {
    failures.push(`Backend-curated Home product authority missing: ${required}`);
  }
}

for (const required of [
  "safePublicHref",
  'url.protocol === "https:"',
  'href.startsWith("/")',
  '!href.startsWith("//")',
]) {
  if (!publicHref.includes(required))
    failures.push(`Safe admin-link boundary missing: ${required}`);
}

// A contact form is allowed only when genuinely transported to the versioned Backend.
const contactHasInteractiveForm = /<form\b/i.test(contact);
const contactTransportReady =
  contact.includes("submitContactInquiry") &&
  contact.includes("isLiveBackend()") &&
  finalTechnicalApi.includes("export async function submitContactInquiry") &&
  finalTechnicalApi.includes('requestFinal<ContactInquiryResult>("/api/v1/inquiries"') &&
  finalTechnicalApi.includes('method: "POST"');
if (contactHasInteractiveForm && !contactTransportReady) {
  failures.push("Contact form exists without real Backend transport.");
}

const canonicalDeliveryMethods = ["immediate_courier", "tipax", "decapost", "express_post"];
for (const method of canonicalDeliveryMethods) {
  if (!backendApi.includes(`\"${method}\"`))
    failures.push(`Delivery contract missing method: ${method}`);
}
if (!backendDelivery.includes("/api/v1/delivery/options")) {
  failures.push("Live delivery methods must remain Backend-authoritative.");
}
for (const required of ["policyEligible", '"freight_collect"', "isFree", "feeNotice"]) {
  if (!backendDelivery.includes(required))
    failures.push(`Delivery response contract missing: ${required}`);
}

for (const forbidden of [
  "FREE_SHIPPING_THRESHOLD",
  "STANDARD_SHIPPING_FEE",
  "saveDemoOrder",
  "createDemoOrderRef",
  "findDemoOrder",
]) {
  if (commerce.includes(forbidden))
    failures.push(`Invented/demo commerce behavior remains: ${forbidden}`);
}
if (!commerce.includes("orderSubmissionReady: false"))
  failures.push("Public settings alone must not claim order-submission readiness.");
if (!commerce.includes("paymentVerificationReady: false"))
  failures.push("Public settings alone must not claim payment-verification readiness.");

for (const forbidden of [
  "saveDemoOrder",
  "createDemoOrderRef",
  "shippingFeeFor",
  "findDemoOrder",
]) {
  if (checkout.includes(forbidden))
    failures.push(`Checkout still contains invented/demo behavior: ${forbidden}`);
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
  "method.enabled && method.policyEligible",
]) {
  if (!checkout.includes(required)) failures.push(`Live checkout boundary missing: ${required}`);
}

const liveStart = checkout.indexOf("function LiveCheckout()");
const prototypeStart = checkout.indexOf("function PrototypeCheckout()");
if (liveStart < 0 || prototypeStart < 0 || prototypeStart <= liveStart) {
  failures.push("Checkout must keep explicit live and prototype implementations separated.");
} else {
  const liveCheckout = checkout.slice(liveStart, prototypeStart);
  if (!/<form\b/i.test(liveCheckout))
    failures.push("Live checkout must collect data only for authoritative Backend quote.");
  for (const required of ["createCheckoutQuote", "commitCheckout", "initiatePayment"]) {
    if (!liveCheckout.includes(required))
      failures.push(`Live checkout does not use Backend operation: ${required}`);
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

console.log(
  "Final admin-driven storefront, safe public-link and Backend commerce authority audit passed.",
);
