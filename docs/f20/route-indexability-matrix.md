# Route Indexability Matrix

## Directive vocabulary

- `index, follow`: intended search landing page.
- `noindex, follow`: public utility/query state that must not become a search landing page, while crawlers may still traverse links and observe the directive.
- `noindex, nofollow`: invalid/non-publication state with no SEO link-discovery value.
- `conditional`: depends on an explicit publication/evidence state; it is never inferred from “record exists”.

Canonical URLs are always absolute in production. Query-state canonicals point to the clean route only when the query state is not an intentional SEO landing page.

| Route family | Indexability | Canonical target | Sitemap | Structured data | Internal-link priority | Contract notes |
|---|---|---|---|---|---|---|
| `/` | `index, follow` | `/` | Yes | `WebSite`, `SearchAction`, `Organization`/`ClothingStore` | P0 | Brand + verified Karaj/Mehestan local identity. |
| `/shop` clean | `index, follow` | `/shop` | Yes | `BreadcrumbList`; `ItemList` only for SEO-publishable products | P0 | Broad commercial catalogue intent. |
| `/shop?...` faceted/sort | `noindex, follow` | `/shop` | No | Breadcrumb only; do not assert unverified product lists | P3 | Shareable UX state, not an SEO landing page. |
| `/$category` valid clean | `index, follow` | self | Yes | `BreadcrumbList`, `CollectionPage`; `ItemList` only for publishable products | P0 | Commercial product-type taxonomy. |
| `/$category?...` faceted/sort | `noindex, follow` | clean category | No | Same truth-safe schema policy | P3 | Filters must remain usable/shareable. |
| invalid category | `noindex, nofollow` | None | No | None | — | Real 404; never canonicalize to a valid category or home. |
| `/search` with/without `q` | `noindex, follow` | `/search` | No | None beyond site-level schema | P3 | Internal search is never an indexable landing page in F20-A. |
| `/product/$slug` — `published` + evidence-complete | `index, follow` | self | Yes | `Product`, valid `Offer`/`AggregateOffer` as data permits, `BreadcrumbList` | P0 | Product facts must come from verified public data. |
| `/product/$slug` — draft/untracked/non-publishable | `noindex, nofollow` | self while review UI exists | No | No `Product`/`Offer`; breadcrumb may remain | — | Current F14C prototype products fall here. |
| `/product/$slug` — archived | `noindex, nofollow` or terminal status | No canonical unless a true replacement exists | No | None | — | Backend policy chooses 404/410 or explicit redirect based on migration data. |
| invalid product | `noindex, nofollow` | None | No | None | — | Real 404, not soft 404. |
| `/collections` | `index, follow` | `/collections` | Yes | `CollectionPage`/`ItemList` when truthful | P1 | Merchandising/editorial discovery hub. |
| `/collections/$slug` valid/published | `index, follow` | self | Yes | `CollectionPage`, `BreadcrumbList`; verified `ItemList` only | P1 | Must target a different intent from taxonomy category. |
| invalid/unpublished collection | `noindex, nofollow` | None | No | None | — | Real 404 for unknown; publication contract for unpublished. |
| `/lookbook` | `index, follow` | `/lookbook` | Yes | `CollectionPage` or image/editorial schema only if truthful | P2 | Visual editorial route, not a duplicate category. |
| `/journal` | `index, follow` | `/journal` | Yes | `CollectionPage`/`ItemList` for published articles | P1 | Editorial hub. |
| `/journal/$slug` valid/published | `index, follow` | self | Yes | `Article`, `BreadcrumbList` | P1 | Article dates/media must be publication facts. |
| invalid/unpublished article | `noindex, nofollow` | None | No | None | — | Real 404 unless backend provides an intentional redirect. |
| `/about` | `index, follow` | `/about` | Yes | Organization-related facts only when verified | P2 | Brand/entity intent. |
| `/faq` | `index, follow` | `/faq` | Yes | `FAQPage` only if current eligibility/visibility requirements are intentionally met | P2 | Visible FAQ content does not require rich-result markup. |
| `/shipping-returns` | `index, follow` once F14E marks truth-safe publication | self | Yes only when published | Breadcrumb/`WebPage` only | P2 | No invented shipping/returns promises. F14E owns copy. |
| `/terms` | `index, follow` once published | self | Yes only when published | `WebPage` | P2 | F14E owns legal publication state. |
| `/privacy` | `index, follow` once published | self | Yes only when published | `WebPage` | P2 | F14E owns legal publication state. |
| `/contact` | `index, follow` | `/contact` | Yes | Local/entity facts only when verified | P1 | Karaj / Mehestan allowed; no Tehran store identity. |
| `/size-guide` | `index, follow` when guidance is evidence-backed | self | Yes when published | `WebPage` | P2 | Product measurements/fit claims need evidence. |
| `/account` | `noindex, follow` | self | No | None | P3 user-only | Public placeholder/utility, not a search result. |
| `/wishlist` | `noindex, follow` | self | No | None | P3 user-only | Local/personal state. |
| `/cart` | `noindex, follow` | self | No | None | P3 user-only | Transaction utility. |
| `/checkout` | `noindex, follow` | self | No | None | P3 user-only | Transaction utility; Backend semantics deferred. |
| `/order-confirmation` | `noindex, follow` | self | No | None | P3 user-only | Per-order state must never enter sitemap/search. |
| `/track-order` | `noindex, follow` | self | No | None | P3 user-only | Query/reference state is not public search content. |
| `/design-system` | `noindex, follow` | self or none | No | None | Internal | Internal design reference. |
| `robots.txt` | n/a | n/a | n/a | n/a | n/a | Crawl-control endpoint; not a page de-indexing mechanism. |
| `sitemap.xml` | n/a | n/a | n/a | n/a | n/a | Only canonical, index-eligible URLs. |
| global unknown route | `noindex, nofollow` | None | No | None | — | Must return HTTP 404 and a comprehensible 404 title/meta. |

## Canonical policy

1. Canonical points to the URL whose content/intent should be indexed, not automatically to home.
2. Clean indexable pages are self-canonical.
3. Faceted and sort states canonicalize to the clean listing while independently carrying `noindex`.
4. `/search?q=...` canonicalizes to `/search` and remains `noindex`.
5. Invalid resources have no canonical because a canonical is not an error-recovery redirect.
6. Product canonical eligibility does not override publication eligibility. A draft product may have a deterministic self URL for review but remains excluded from indexing and sitemap.

## Sitemap inclusion rule

A URL is included only when all are true:

- route family allows indexing;
- resource exists;
- resource publication state is public/published;
- canonical target equals the URL being emitted;
- no disallowed query parameters are present;
- required truth/evidence gate is satisfied for data-backed commerce pages.

`search`, faceted URLs, sort URLs, account, wishlist, cart, checkout, order confirmation/tracking and design-system must never be emitted.