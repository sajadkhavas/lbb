# Faceted Navigation, Search & Pagination Policy

## Current URL vocabulary

The current frontend normalizes catalogue state into these query parameters:

| Concept | Current parameter | Notes |
|---|---|---|
| Category facet | `cats` | `/shop` only; category routes lock category by path. |
| Color | `colors` | Comma-separated canonical values. |
| Size | `sizes` | Comma-separated canonical values. |
| Price ceiling | `max` | Positive value below the page scope ceiling. |
| Availability | `instock` | Boolean. |
| Sale | `sale` | Boolean. |
| Sort | `sort` | `newest` default; other values are modifiers. |
| Internal query | `q` | `/search` only. |
| Collection | path route | Collections are intentional path-based merchandising pages, not a generic query facet in F20-A. |

The conceptual F20 contract covers color, size, price, availability, sort, query and collection even where the implementation names differ.

## Default rule

A parameterized filter/sort state is **not indexable** unless SEO deliberately promotes that intent into a stable, content-complete, path-based landing page with its own ownership and publication contract.

For the existing catalogue:

- clean `/shop` and clean category URLs: `index, follow`;
- any effective filter or non-default sort modifier: `noindex, follow`;
- canonical: clean base listing/category URL;
- sitemap: exclude every parameterized variant;
- history/shareability: preserved;
- UI filtering: preserved;
- normalized query ordering/values: preserved.

## Why `noindex, follow`

These pages are public UX states with useful links, but they are not independent SEO documents. They stay crawlable so a crawler can observe the `noindex` directive. `robots.txt` is not used to hide the same HTML URLs from the crawler.

## Canonical and noindex are separate controls

For `/hoodies?sizes=M&sort=price-asc`:

- robots: `noindex, follow`;
- canonical: `/hoodies`;
- the filter state remains functional and shareable;
- the parameterized URL is absent from sitemap.

The canonical communicates preferred consolidation; `noindex` makes the indexing decision explicit. Neither is allowed to break the user-facing filter state.

## Parameter normalization

The existing frontend normalization contract remains part of SEO correctness:

- unknown/invalid facet values are discarded;
- duplicate values collapse;
- supported list values use deterministic ordering;
- default sort `newest` is omitted from the URL;
- false/default boolean facets are omitted;
- a price ceiling at/above the catalogue ceiling collapses to the unfiltered default;
- normalized changes use replace when cleaning a malformed URL, but real user filter changes remain navigable in history.

The SEO tests must test the resulting canonical/robots behavior, not only string serialization.

## Internal search

`/search` is an internal-search route and is always `noindex, follow`, including:

- empty query;
- a normal query;
- zero results;
- query + facets;
- malformed/normalized query state.

Canonical is always `/search`. Query text must never be copied into an indexable canonical URL.

### Crawl interaction

`/search` is intentionally **not** disallowed in `robots.txt` in this contract. A crawler has to read the HTML meta directive for deterministic `noindex` handling. Search is excluded from sitemap and should not receive sitewide crawl-promoting links to arbitrary generated queries.

## Empty and zero-result states

A zero-result filter/search state remains `noindex`. It must not redirect merely to create an SEO-friendly response. UX may offer links back to categories/shop, but those links do not change the HTTP/indexability policy.

## Intentional SEO facet landing pages

If research later proves a stable facet intent deserves indexing, do not simply remove `noindex` from a query combination. Create or explicitly register a landing page only when all are true:

1. demand is evidenced by Search Console/keyword research;
2. the intent is not already owned by `/shop`, a category or collection;
3. URL is stable and preferably path-based;
4. title/H1/copy are intentional rather than generated keyword permutations;
5. products/resources are publication-safe;
6. internal links point to it intentionally;
7. it receives a self-canonical and sitemap inclusion;
8. redirect/canonical behavior for the former query-state equivalent is defined.

## Collection policy

Collections are not “facets that became indexable.” A collection is a named merchandising/editorial entity with a stable slug and distinct intent. Filter query parameters must not impersonate collections.

## Pagination policy

### Current state

Current catalogue pages use client-side “show more” rather than an indexable `page` query contract. No pagination URL is therefore created by F20-A.

### Future server pagination

If Backend integration introduces crawlable pagination:

- each page with materially different product set uses a stable URL;
- page 2+ must not canonicalize to page 1 merely to collapse the series;
- pagination links are real crawlable links, not JS-only state;
- empty/out-of-range pages return the correct error/terminal behavior;
- filters applied to paginated URLs remain noindex unless promoted intentionally;
- sitemap normally contains the canonical entry landing page, not every mechanically generated combination; final strategy may be refined using crawl data.

Pagination changes belong to F20-B because the Backend paging contract is not frozen.

## Robots budget policy

F20-A prioritizes deterministic index control over speculative crawl-budget blocking. LBB is not currently at a scale where query crawling must be solved by blocking HTML noindex routes. If logs later show crawl explosion, F20-B may add parameter-aware crawl controls only after verifying they do not hide required `noindex` directives or break rendering.