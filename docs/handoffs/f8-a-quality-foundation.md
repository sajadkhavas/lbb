# F8-A handoff to Final Review

## Feature-owned SEO changes intentionally not applied

- `src/routes/index.tsx` currently contains route-local JSON-LD with relative URLs and unverified commercial facts, including `ClothingStore`, `priceRange`, `paymentAccepted`, a country-only address and a synthetic offer catalog. Replace it in Final Review with absolute helper-generated URLs and only facts confirmed by the business owner.
- Audit every merged Shop, Category, Search, Product, Quick View, Collection and Journal route for canonical/noindex behavior after integration. F8-A did not edit those feature-owned files.
- Search/filter URLs should be noindex when they represent parameter combinations rather than stable landing pages. Confirm the exact rule after F4/F5 merge.
- Product schema must be generated only from real product, variant, availability, price and currency data after the final product data contract is merged.

## Final integration tasks

- Set the real production `VITE_SITE_URL` in the deployment environment and validate one deployed sitemap and robots response.
- Run the visual project after all feature branches merge, inspect desktop/mobile output, then commit approved snapshots.
- Review the generated Knip report before deleting any feature-owned file or export.
- Re-measure the integrated client bundle and tighten initial budgets where practical.
- Verify final checkout/order response headers at the hosting layer include a private/no-store policy; the service worker already excludes those routes, but origin/CDN headers remain a deployment responsibility.
- Replace the generic social image only when an approved, production-owned Open Graph creative is available.

## Ownership boundary honored

No Shop, Category, Search, Product, Quick View, Cart, Checkout, Contact, Newsletter, Collection or Journal implementation was edited in F8-A.
