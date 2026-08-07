# Internal Linking Contract

The internal link graph must help users move between discovery, decision and support contexts without manufacturing crawl paths to arbitrary query states.

## Required graph

### Home → Category

Homepage must expose crawlable links to the primary commercial taxonomy. Anchor copy should name the category naturally; imagery alone is insufficient.

### Category → Product

Every publicly published product in a category must be reachable through a real link from its category or another indexable catalogue surface. Draft/non-publishable products may remain visible for development but are not treated as SEO destinations.

### Product → Category

PDP breadcrumbs and contextual navigation link back to the canonical category. This is the primary reverse hierarchy.

### Product → Collection

When collection membership is real and public, PDP may link to the collection as a merchandising/story context. A pending collection-membership field must not create a public SEO relationship.

### Collection → Product

Collections link to public, publishable products. Do not use a collection to expose otherwise unpublished product URLs to crawlers.

### Journal → Product / Collection

Editorial content should link to a product or collection only where the relationship is useful in context. Anchor text should describe the destination, not repeat exact-match keywords mechanically.

### Lookbook → Product

Shop-the-look references should resolve to canonical product pages when those products are publishable. If a product is not public, the visual can remain editorial but should not create an SEO link to a draft PDP.

### Support → Commerce

FAQ, size guidance, shipping/returns and contact pages may link users back to relevant `/shop`, category or product destinations where that resolves the support question. Support pages must not invent operational promises merely to create keyword links.

### Breadcrumbs

Breadcrumb hierarchy is a navigation contract and structured-data contract. It must follow the actual information architecture rather than a keyword-only hierarchy.

### Footer

Footer provides stable crawlable links to the highest-value commerce, brand, editorial and support hubs. It must not include generated faceted/search URLs.

## Priority tiers

- **P0:** Home, Shop, primary categories, eligible published PDPs.
- **P1:** Collections hub/detail, Journal hub/detail, Contact/local entity path.
- **P2:** Lookbook, About, FAQ, Size Guide, published legal/support pages.
- **P3:** User utilities such as Search, Account, Wishlist, Cart, Checkout and order flows. These may be easy for users to reach but do not receive SEO-priority linking treatment.

## No dead-end rule

Every important indexable route must offer at least one meaningful path onward:

- Product → category/shop and related commerce/editorial context.
- Collection → products and collections hub.
- Article → journal hub and relevant commercial/editorial context when appropriate.
- Lookbook → related product/category/collection destinations.
- Support → relevant commerce/brand destinations.
- 404 → home/shop/category/contact recovery links without pretending the missing URL is canonical.

## Query-state link policy

Do not place arbitrary filtered URLs or internal-search queries in:

- primary navigation;
- footer;
- XML sitemap;
- editorial body as permanent SEO targets;
- breadcrumbs.

User-generated filter/search URLs may be copied/shared and may appear in browser history, but they remain `noindex` UX states.

If a query state later becomes a proven search intent, promote it to an intentional landing route instead of sitewide-linking the query string.

## Anchor text rules

1. Describe destination content naturally in Persian; brand/model terms may remain Latin where appropriate.
2. Avoid repetitive exact-match anchors across every card/section.
3. Product card accessible names must identify the product, while surrounding UI can supply category/context.
4. Support/legal anchors describe the task (`شرایط ارسال و مرجوعی`, `راهنمای سایز`) rather than generic “click here”.
5. Local anchors may use `کرج` / `پاساژ مهستان` only where location is relevant and verified.

## Canonical integrity

Internal links should normally point directly to canonical URL forms:

- normalized lowercase/stable slugs;
- no default `sort=newest`;
- no empty/duplicate facet parameters;
- no tracking parameters in first-party navigation;
- no obsolete slug when a redirect target is known.

## Future Backend requirements

Backend should expose stable canonical slugs and explicit relationships:

- product → category;
- product ↔ collection;
- article → related products/collections where editorially selected;
- lookbook → products when curated;
- redirect/slug history.

The frontend must not derive these relationships from name similarity.
