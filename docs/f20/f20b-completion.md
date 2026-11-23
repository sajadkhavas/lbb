# F20-B — Production SEO Integration

F20-B maps the accepted F20-A SEO contract onto the frozen F14D Backend data already available in the storefront.

## Completed

- Product, Category and Collection canonical URLs consume Backend `seo.canonicalPath` through a defensive internal-path validator.
- Live Category emits BreadcrumbList, CollectionPage and published-product ItemList structured data.
- Live Collection preserves a true 404 when the Backend returns 404.
- `/sitemap.xml` switches to Backend-published Categories, Products and Collections in live mode.
- Backend `seo.updatedAt` is emitted as `<lastmod>` only when it is a valid timestamp.
- Product pagination is exhausted safely for sitemap generation with a hard upper bound.
- Live sitemap generation never falls back to prototype commerce data; Backend failure returns HTTP 503, `no-store`, and `Retry-After`.
- Existing static/editorial routes remain in the sitemap because the frozen Backend contract exposes no public Journal/Article endpoint.

## Truth boundaries

- No redirect-history endpoint is invented. Canonical slug history remains unavailable until Backend exposes a frozen redirect contract.
- Journal remains frontend/editorial data; no fake Backend article DTO or publication feed is created.
- Search and faceted listing states retain F20-A `noindex, follow` behavior and clean canonicals.
- Product price/availability structured data remains sourced from Backend-authoritative published DTOs only.

## Deferred external operations

Search Console submission, crawl-log analysis and intentional faceted landing pages require a deployed production origin and real search data; they are deployment/operations work, not fabricated in code.
