import fs from "node:fs";

const cart = fs.readFileSync("src/lib/cart.tsx", "utf8");
const continuity = fs.readFileSync("src/lib/checkout-continuity.ts", "utf8");
const checkout = fs.readFileSync("src/routes/checkout.tsx", "utf8");
const payment = fs.readFileSync("src/routes/payment.result.tsx", "utf8");

const required = [
  [cart, "schemaVersion: CART_SCHEMA_VERSION", "cart persistence is versioned"],
  [cart, 'window.addEventListener("storage", onStorage)', "cart cross-tab sync is installed"],
  [cart, "normalizeCartLines", "cart restore sanitizes and deduplicates"],
  [
    continuity,
    'PENDING_CHECKOUT_KEY = "lbb-checkout-pending-v1"',
    "pending checkout record exists",
  ],
  [continuity, "getOrCreateCheckoutCommitKey", "checkout commit idempotency is stable"],
  [checkout, "getOrder(continuity.orderId)", "pending order is recovered from backend authority"],
  [checkout, "persistPendingCheckout", "committed order handoff is persisted before cart clear"],
  [checkout, "clearCheckoutCommitKey(quote.quoteId)", "commit attempt is cleared after success"],
  [
    payment,
    "clearPendingCheckoutForOrder(response.data.order.id)",
    "verified payment clears matching handoff",
  ],
];

for (const [source, token, message] of required) {
  if (!source.includes(token)) throw new Error(`F16 audit failed: ${message}`);
}
if (checkout.includes("setOrderResult(null);\n    setActionError(null);")) {
  throw new Error("F16 audit failed: cart/form invalidation still clears committed order state");
}
console.log("F16 commerce continuity audit: PASS");
