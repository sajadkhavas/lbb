# F16 — Cart & Commerce Continuity

## Scope

F16 hardens continuity on top of the accepted F14D backend integration. It does not invent a persistent-cart backend endpoint and does not change the frozen commerce contract.

## Implemented

- Versioned local cart envelope with legacy-array migration.
- Strict live/prototype separation and live Variant validation.
- Restore sanitization, duplicate collapse and quantity caps.
- Cross-tab cart synchronization through the browser `storage` event.
- Stable checkout-commit idempotency key for retries of the same quote.
- Minimal pending-order handoff persisted after authoritative checkout commit and before cart clearing.
- Checkout recovery through the existing authoritative `GET /api/v1/account/orders/{id}` endpoint.
- Stable payment-initiation idempotency key across reload/retry for the recovered order.
- Pending handoff cleanup only after matching server-verified payment.

## Truth boundary

Local storage never becomes authority for price, inventory, delivery totals, order status or payment success. Cart prices remain last-displayed hints; quote/commit/order/payment state remains Backend-authoritative.

## Explicit non-goals

- No new Backend endpoint.
- No server-persistent wishlist/cart domain.
- No redesign of Cart/Checkout.
- No fake payment recovery or browser-only success.

## Acceptance

F16-specific audit and Playwright continuity coverage must pass together with the inherited global quality and F14D live-contract gates.
