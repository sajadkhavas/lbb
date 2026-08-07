# F20-A — SEO Information Architecture & Technical Contract

## Status and scope

F20-A freezes the frontend SEO architecture for LBB before Backend SEO data is integrated. It is deliberately contract-first: route loaders remain on the current frontend data sources and this phase does not design or connect Backend endpoints.

Baseline: `phase/f14c-production-content-product-data@9c4e8b78d53bd861f9e529773da9b9645fc9be15`.

Branch: `phase/f20a-seo-ia-contract`.

## Non-negotiable principles

1. **Truth before richness.** Structured data, metadata and sitemap membership must not upgrade prototype or unverified values into production facts.
2. **One intent, one preferred landing page.** `/shop`, category routes and collection routes have distinct search intents; query-string states are not accidental SEO landing pages.
3. **Noindex must be observable.** Public HTML pages controlled with a robots meta directive remain crawlable so crawlers can read that directive. `robots.txt` is not used as a de-indexing mechanism.
4. **Canonical is not a substitute for index control.** Faceted/search states receive both the intended canonical and the appropriate robots directive.
5. **Shareable UX remains shareable.** Noindex filter/search URLs may still retain absolute Open Graph/Twitter metadata and browser history behavior.
6. **Publication is explicit.** Product SEO eligibility requires the publication/evidence gate defined by F14C. Draft, archived, untracked or otherwise non-publishable products are not Product/Offer schema facts and are excluded from the product sitemap set.
7. **Local identity is evidence-based.** The only confirmed store locality in this baseline is Karaj / Mehestan Passage. No Tehran store identity, phone, complete street address, postal code, coordinates or opening hours may be invented.
8. **Backend handoff is data-first.** F20-A specifies fields and semantics, not arbitrary endpoint URLs.

## Contracts in this directory

- [`route-indexability-matrix.md`](./route-indexability-matrix.md) — route family robots, canonical, sitemap and schema rules.
- [`keyword-page-map.md`](./keyword-page-map.md) — intent-to-page architecture without fabricated keyword volumes.
- [`faceted-navigation-policy.md`](./faceted-navigation-policy.md) — filters, search, canonicalization, crawlability and pagination.
- [`structured-data-contract.md`](./structured-data-contract.md) — Organization/Store, WebSite, Product, Collection, Article and FAQ rules.
- [`internal-linking-contract.md`](./internal-linking-contract.md) — required commerce/editorial/support link graph.
- [`backend-seo-data-handoff.md`](./backend-seo-data-handoff.md) — SEO DTO requirements for BE-D/F20-B.
- [`image-social-contract.md`](./image-social-contract.md) — image SEO and social preview rules.
- [`http-semantics-sitemap-robots.md`](./http-semantics-sitemap-robots.md) — 404/status, sitemap and robots behavior.

## Baseline findings addressed by F20-A

- `/search` was both `noindex` and blocked by `robots.txt`. F20-A makes HTML noindex pages crawlable so the directive can be observed.
- `pageMeta()` omitted social preview images whenever `noindex` was set. Noindex and shareability are independent concerns; F20-A keeps social preview basics on shareable noindex states.
- Current F14C catalogue records are draft/unverified, while the product route emitted `Product`/`Offer` facts and the sitemap included those product URLs. F20-A gates product schema and sitemap eligibility on product publication evidence.
- Homepage `ClothingStore` schema used an unverified price range and treated the venue name as a street address. F20-A keeps only evidence-backed local fields.
- Route-level 404 behavior and invalid dynamic-resource states are explicitly defined and regression-tested.

## Route family ownership

F20-A may change SEO helpers, metadata/schema generation, sitemap/robots behavior, SEO tests and this documentation. It does not redesign Product, Cart/Checkout, Trust/Legal, Accessibility/RTL or motion UI.

Trust/legal copy remains owned by F14E. Accessibility/RTL remediation remains owned by F19-A/F19-B. Product domain/data publication remains owned by F14C/Backend. Dynamic sitemap/data integration is deferred to F20-B.

## Quality gates

The branch must pass:

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:seo`
- existing SEO/PWA coverage
- `npm run audit:source`
- the existing complete Playwright suite through `npm run quality`

The SEO regression suite covers canonical URLs, faceted/search noindex policy, sitemap exclusions, robots interaction, product publication/schema guardrails, BreadcrumbList, Article schema, invalid-resource 404 metadata/status, local identity regression, absolute URLs and social metadata basics.

## Deferred by design

### F20-B / integration

- Hydrating route SEO data from the real Backend.
- Dynamic product/category/collection/article sitemap data and `lastmod` from Backend publication timestamps.
- Redirect migration tables once production slugs/history exist.
- Search Console/crawl-log driven decisions on whether any intentional faceted landing pages should graduate to indexable routes.

### Backend BE-D

- SEO publication fields and evidence states.
- Canonical slug/redirect history.
- Product price/availability/variant facts suitable for public structured data.
- Category/collection/article publication and timestamps.
- Verified location/contact/NAP fields when the business supplies them.

## Merge policy

This phase ends at a Draft PR. It must not merge itself.