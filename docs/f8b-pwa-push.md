# F8-B — PWA / Web App + Push Notification

## Runtime configuration

- `VITE_WEB_PUSH_PUBLIC_KEY`: public VAPID key (never a private key).
- `VITE_PUSH_SUBSCRIPTIONS_URL`: authenticated same-site endpoint accepting `PUT` and `DELETE`.

The frontend never reports a successful subscription unless the browser subscription is persisted by the server. The endpoint must validate authentication, CSRF/origin, schema, endpoint ownership and preference allowlists.

## Push payload contract

Only JSON payloads with a string `title` are shown. `url` must be a same-origin relative path. Unknown or malformed payloads are ignored.

## Cache policy

Account, cart, checkout, orders, admin and API routes are network-only. Cached public pages and images are bounded and expiring. The offline shell explicitly warns that price, stock and account data require a live connection.

## Acceptance

- Manifest and install metadata are present.
- Service worker is production-only and disabled in preview/embed contexts.
- Updates are user-visible and can be applied explicitly.
- Permission is requested only from a user action.
- Denied/unsupported/not-configured states are distinct.
- Unsubscribe is persisted server-side before removing the browser subscription.
