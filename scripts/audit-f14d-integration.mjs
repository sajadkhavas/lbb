import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];
const read = (relative) => readFile(path.join(root, relative), "utf8").catch(() => "");

const api = await read("src/lib/backend-api.ts");
const session = await read("src/lib/backend-session.ts");
const checkout = await read("src/routes/checkout.tsx");
const paymentResult = await read("src/routes/payment.result.tsx");
const card = await read("src/components/lbb/ProductCard.tsx");
const category = await read("src/routes/$category.tsx");
const search = await read("src/routes/search.tsx");
const collections = await read("src/routes/collections.index.tsx");
const collectionDetail = await read("src/routes/collections.$slug.tsx");
const product = await read("src/routes/product.$slug.tsx");

for (const [name, source] of Object.entries({
  api,
  session,
  checkout,
  paymentResult,
  card,
  category,
  search,
  collections,
  collectionDetail,
  product,
})) {
  if (!source) failures.push(`Required F14D source is missing: ${name}`);
}

const requireText = (source, text, message) => {
  if (!source.includes(text)) failures.push(message);
};

requireText(
  api,
  'export const LBB_CONTRACT_VERSION = "2026-08-09-f14-be-f1"',
  "Frontend is not pinned to the accepted F14-BE-F1 contract.",
);
requireText(
  api,
  'return import.meta.env.PROD ? "live" : "prototype";',
  "Production backend mode must default to live.",
);
requireText(api, 'credentials: "include"', "Backend client must send credentialed requests.");
requireText(
  api,
  'headers.set("X-XSRF-TOKEN", decodeURIComponent(token));',
  "Mutation requests must forward the URL-decoded XSRF token.",
);
requireText(
  api,
  'code: "contract_version_mismatch"',
  "Backend contract mismatch must fail closed.",
);
requireText(
  api,
  'code: "backend_https_required"',
  "Live backend base URL must reject non-HTTPS remote origins.",
);

for (const endpoint of [
  "/api/v1/auth/otp/request",
  "/api/v1/auth/otp/verify",
  "/api/v1/auth/me",
  "/api/v1/auth/logout",
  "/api/v1/products",
  "/api/v1/catalog/facets",
  "/api/v1/cart/validate",
  "/api/v1/checkout/quote",
  "/api/v1/checkout/commit",
  "/api/v1/account/orders",
  "/api/v1/payments/verify",
]) {
  requireText(api, endpoint, `Versioned backend endpoint missing from typed client: ${endpoint}`);
}

for (const legacy of [
  "/api/auth/",
  "/api/checkout",
  "/api/account/",
  "/api/delivery/options",
]) {
  if (`${api}\n${checkout}\n${paymentResult}`.includes(legacy)) {
    failures.push(`Legacy unversioned backend route leaked into F14D: ${legacy}`);
  }
}

requireText(
  session,
  "/sanctum/csrf-cookie",
  "Sanctum CSRF bootstrap endpoint is missing from browser session helper.",
);
requireText(
  session,
  'credentials: "include"',
  "CSRF bootstrap must include browser credentials.",
);

for (const required of [
  "isLiveBackend() ? <LiveCheckout /> : <PrototypeCheckout />",
  "createCheckoutQuote",
  "commitCheckout",
  "createIdempotencyKey",
  "initiatePayment",
  "getDeliveryOptions",
  "cartLinesToBackendItems",
  "ensureBackendCsrf",
]) {
  requireText(checkout, required, `Live checkout integration contract is missing: ${required}`);
}

const liveStart = checkout.indexOf("function LiveCheckout()");
const prototypeStart = checkout.indexOf("function PrototypeCheckout()");
if (liveStart < 0 || prototypeStart < 0 || prototypeStart <= liveStart) {
  failures.push("Live and prototype checkout implementations are not explicitly separated.");
} else {
  const live = checkout.slice(liveStart, prototypeStart);
  const prototype = checkout.slice(prototypeStart);
  for (const required of ["createCheckoutQuote", "commitCheckout", "initiatePayment"]) {
    if (!live.includes(required)) failures.push(`Live checkout does not execute ${required}.`);
  }
  if (/createCheckoutQuote|commitCheckout|initiatePayment|window\.location\.assign/.test(prototype)) {
    failures.push("Prototype checkout must never execute production commerce operations.");
  }
}

for (const required of [
  "verifyPayment",
  "ensureBackendCsrf",
  "result?.verified",
  "پرداخت توسط Backend تأیید شد",
  "بازگشت مرورگر به‌تنهایی Success محسوب نمی‌شود",
]) {
  requireText(paymentResult, required, `Payment result server-verification boundary is missing: ${required}`);
}
if (paymentResult.includes("setResult({ verified: true")) {
  failures.push("Frontend must not synthesize a successful payment verification result.");
}

for (const required of ["BACKEND PRODUCT ONLY", "!backend && isLiveBackend()"] ) {
  requireText(card, required, `Prototype ProductCard live-mode guard is missing: ${required}`);
}

for (const [routeName, source] of [
  ["category", category],
  ["search", search],
  ["collections", collections],
  ["collection detail", collectionDetail],
  ["product detail", product],
]) {
  requireText(source, "isLiveBackend", `${routeName} route is not explicitly live-aware.`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("F14D production backend integration contract audit passed.");
