# F8-A handoff to Final Review

## Feature-owned SEO changes intentionally not applied

- `src/routes/index.tsx` currently contains route-local JSON-LD with relative URLs and unverified commercial facts, including `ClothingStore`, `priceRange`, `paymentAccepted`, a country-only address and a synthetic offer catalog. Replace it in Final Review with absolute helper-generated URLs and only facts confirmed by the business owner.
- Audit every merged Shop, Category, Search, Product, Quick View, Collection and Journal route for canonical/noindex behavior after integration. F8-A did not edit those feature-owned files.
- Search/filter URLs should be noindex when they represent parameter combinations rather than stable landing pages. Confirm the exact rule after F4/F5 merge.
- Product schema must be generated only from real product, variant, availability, price and currency data after the final product data contract is merged.

## TypeScript integration diagnostics

Both TypeScript 5.8 `tsc` and the official native preview `tsgo 7.0.0-dev.20260707.2` reported the same pre-existing router typing failures outside the F8-A ownership boundary. The failures are missing required `search` props on Shop/Category links and invalid partial search records.

Affected feature-owned files currently include:

- `src/components/lbb/CartDrawer.tsx`
- `src/components/lbb/Footer.tsx`
- `src/components/lbb/MobileBottomBar.tsx`
- `src/components/lbb/Navbar.tsx`
- `src/components/lbb/home/BestSellers.tsx`
- `src/components/lbb/home/CategoryTakeover.tsx`
- `src/components/lbb/home/FeaturedPinned.tsx`
- `src/components/lbb/home/HeroSplit.tsx`
- `src/components/lbb/home/NewDropCountdown.tsx`
- `src/components/lbb/home/ShopTheLook.tsx`
- `src/routes/$category.tsx`
- `src/routes/about.tsx`
- `src/routes/cart.tsx`
- `src/routes/lookbook.tsx`
- `src/routes/order-confirmation.tsx`
- `src/routes/search.tsx`
- `src/routes/shop.tsx`
- `src/routes/wishlist.tsx`

`npm run typecheck` still runs the full compiler, writes every diagnostic to `artifacts/typecheck`, and fails on any F8-A-owned diagnostic. Out-of-scope diagnostics are reported as handoff items rather than silently discarded. After feature branches merge, `npm run typecheck:integration` must pass without exceptions before release.

## Final integration tasks

- Set the real production `VITE_SITE_URL` in the deployment environment and validate one deployed sitemap and robots response.
- Run `npm run typecheck:integration` after all feature branches merge and resolve every reported router/search-param diagnostic.
- Run the visual project after all feature branches merge, inspect desktop/mobile output, then commit approved snapshots.
- Review the generated Knip report before deleting any feature-owned file or export.
- Re-measure the integrated client bundle and tighten initial budgets where practical.
- Verify final checkout/order response headers at the hosting layer include a private/no-store policy; the service worker already excludes those routes, but origin/CDN headers remain a deployment responsibility.
- Replace the generic social image only when an approved, production-owned Open Graph creative is available.

## Ownership boundary honored

No Shop, Category, Search, Product, Quick View, Cart, Checkout, Contact, Newsletter, Collection or Journal implementation was edited in F8-A.
