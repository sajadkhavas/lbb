# Structured Data Contract

Structured data is a machine-readable projection of **visible, public, verified facts**. It is never a place to make the storefront appear more complete than the underlying operational data.

## Route strategy

| Route                       | Schema                      | Publication rule                                                                                          |
| --------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| Root/global                 | `Organization`              | Brand identity and links only when verified.                                                              |
| `/`                         | `WebSite` + `SearchAction`  | Search target points to the real `/search?q=` behavior.                                                   |
| `/`                         | `ClothingStore`             | Only evidence-backed public location/entity fields.                                                       |
| Listing/category            | `BreadcrumbList`            | Stable canonical navigation path.                                                                         |
| Listing/category/collection | `CollectionPage`            | Page identity/copy must be public and visible.                                                            |
| Listing/category/collection | `ItemList`                  | Include only SEO-publishable products/resources; do not list draft catalogue records as production facts. |
| PDP                         | `Product`                   | Only when product publication/evidence gate passes.                                                       |
| PDP                         | `Offer` or `AggregateOffer` | Only from verified public price/currency/availability/variant data.                                       |
| Journal detail              | `Article`                   | Published article metadata and visible content.                                                           |
| FAQ                         | `FAQPage`                   | Optional only when visible FAQ content and current search-engine eligibility/strategy justify it.         |

## Organization and ClothingStore

Allowed current identity:

- name: LBB / ال‌بی‌بی;
- city: کرج;
- province: البرز;
- venue in visible descriptive copy: پاساژ مهستان;
- country: IR;
- verified official Instagram URL.

Not allowed until verified:

- Tehran as store location;
- complete street address;
- unit/floor/postal code;
- latitude/longitude;
- telephone/email/WhatsApp as public business contact unless independently verified;
- opening hours;
- `priceRange` guessed from prototype prices;
- payment methods, shipping or return promises not enabled/verified.

A venue name is not automatically a `streetAddress`. The schema may expose locality/region/country and visible descriptive text while the complete postal address is unknown.

## WebSite and SearchAction

`WebSite` belongs on the site/home identity. `SearchAction` is valid because `/search` exists and accepts `q`. The target URL is absolute in production.

The fact that the search result page is `noindex` does not invalidate a site search action; internal-search pages themselves remain excluded from sitemap/indexing.

## Product schema eligibility

A Product schema document may be emitted only when the product is SEO-publishable. In the F14C contract that means publication is `published` and every required evidence field is verified with source and review timestamp.

### Minimum product data contract

- canonical public slug/URL;
- name;
- public description;
- primary and additional product images;
- SKU/identifier;
- brand;
- color and size/variant facts when verified;
- publication state;
- required evidence states;
- breadcrumbs/category identity;
- update/publication timestamps when appropriate.

### Offer contract

Offer data is stricter than a visible prototype price. Before emitting `Offer`/`AggregateOffer`, Backend must provide verified:

- price value in a defined unit;
- `priceCurrency` (for example IRR only when that is the operational price currency);
- availability derived from real public stock/variant state;
- URL to the canonical purchasable item/variant as applicable;
- item condition when known rather than assumed;
- seller identity when that relationship is true.

No stock or price from current prototype records is a production fact.

### Draft/untracked products

For draft, archived, untracked or evidence-incomplete products:

- no `Product` schema;
- no `Offer`/`AggregateOffer`;
- no product sitemap entry;
- page remains `noindex` until publication (or becomes terminal 404/410 when appropriate).

## BreadcrumbList

Breadcrumbs must mirror the visible hierarchy and use absolute canonical URLs:

- Home → Shop;
- Home → Shop → Category;
- Home → Shop → Category → Product;
- Home → Collections → Collection;
- Home → Journal → Article.

A breadcrumb must not create a fake hierarchy merely for keywords.

## CollectionPage / ItemList

Category and collection pages may use `CollectionPage`. `ItemList` is allowed only for items that can be truthfully represented as public resources.

If the current UI contains prototype products for interface review, structured data must filter them out rather than asserting that they are published catalogue inventory.

Collection membership from Backend must carry its own publication truth. A collection cannot silently publish a draft product by referencing its slug.

## Article

A published journal article may include:

- `headline`;
- `description`/excerpt;
- public image;
- `datePublished`;
- `dateModified` when real;
- `articleSection`;
- `inLanguage`;
- `mainEntityOfPage` canonical absolute URL;
- author/publisher only when their identity is valid and visible/appropriate.

F20-A tests the current Article shape and absolute main entity URL.

## FAQPage

FAQ content can remain useful without FAQ structured data. For LBB, FAQ markup is not a growth assumption. Current Google rich-result eligibility is heavily restricted, so F20-A does not treat FAQ schema presence as a KPI or mandatory feature.

If `FAQPage` is emitted, every question/answer must be visible on the same page and must not encode shipping, returns, payment, stock or product facts that are unverified. Any future decision to retain/remove FAQ markup on F14E-owned pages should be coordinated to avoid branch conflicts.

## Validation gates

Automated tests must ensure:

- JSON-LD parses as JSON;
- expected schema types are present on eligible routes;
- draft product pages do not expose `Product`/`Offer`;
- Article canonical/main entity URL is absolute;
- breadcrumb item URLs are absolute;
- local schema contains Karaj identity and no Tehran store identity;
- unverified local fields are absent;
- schema facts do not bypass publication/evidence checks.

Search-engine rich-result eligibility is a separate validation step from Schema.org syntactic validity.
