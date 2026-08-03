# LBB quality foundation

## Production environment

`VITE_SITE_URL` is mandatory for production builds. It must be the public HTTPS origin only, for example `https://shop.example.com`; paths, credentials, query strings and fragments are rejected.

The build wrapper uses this origin for canonical URLs, Open Graph URLs, JSON-LD, sitemap entries and the absolute `Sitemap` line in `robots.txt`.

## Required local gates

```bash
npm ci
npx playwright install chromium
VITE_SITE_URL=https://lbb.test npm run typecheck
VITE_SITE_URL=https://lbb.test npm run typecheck:tests
VITE_SITE_URL=https://lbb.test npm run lint
VITE_SITE_URL=https://lbb.test npm run build
VITE_SITE_URL=https://lbb.test npm run test:quality
VITE_SITE_URL=https://lbb.test npm run audit:production
VITE_SITE_URL=https://lbb.test npm run bundle:check
npm run dead-code:report
```

`npm run release:check` runs the same validation chain after dependencies and Chromium are installed.

## PWA cache policy

The worker precaches hashed JavaScript, CSS, font and SVG build assets. Public documents use a bounded `NetworkFirst` cache. Public product/editorial images use a bounded `StaleWhileRevalidate` cache.

Cart, checkout, order confirmation, order tracking, wishlist, account, orders, admin, API and OAuth routes use `NetworkOnly` and are denied from navigation fallback. Sensitive HTML and user-specific responses must never be added to a runtime cache.

## Bundle budgets

Budgets are stored in `config/bundle-budgets.json`. `npm run bundle:report` writes raw, gzip and Brotli measurements to `artifacts/bundle`; `npm run bundle:check` fails when a recorded budget is exceeded.

Budgets are initial guardrails, not performance targets. Tighten them after the integrated Final Review build establishes an approved baseline.

## Dead-code policy

`npm run dead-code:report` writes a Knip report without deleting files or failing the phase. Every finding must be reviewed against feature ownership before removal.

## Visual regression policy

Visual projects and deterministic browser settings are defined in `playwright.visual.config.ts`. Baseline images are intentionally deferred until all feature branches are merged and approved in Final Review.
