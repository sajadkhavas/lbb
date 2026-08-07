# HTTP Semantics, Sitemap & Robots Contract

## HTTP status semantics

### Real 404

Unknown category, product, collection, article and global routes must return HTTP `404`, render a useful error state and carry `noindex` metadata. They must not return `200` merely because the client can render a “not found” component.

A 404 must not canonicalize to home, shop or a vaguely related page.

### Unpublished resource

A resource that exists in Backend but is not public must not become an indexable frontend page. Public behavior is normally indistinguishable from not-found unless product/content policy explicitly requires another response.

For current F14C draft products retained for interface review, F20-A uses a `noindex` publication guard and excludes them from Product schema/sitemap. F20-B must switch to the final Backend visibility semantics when authentication/admin preview exists.

### Archived resource

Backend must tell the frontend whether an archived item has a true successor:

- real successor/canonical migration → explicit permanent redirect;
- intentionally removed with no successor → 404/410 according to business/content policy;
- never redirect every removed product to `/shop` solely to avoid a 404.

### Temporary Backend outage

Timeouts, upstream failures and temporary unavailability are not “not found”. Integration must return an appropriate 5xx/retry state and avoid emitting a cached/indexable “empty product” page.

## 404 metadata

Invalid-resource responses require:

- meaningful page title (for example `پیدا نشد | LBB`);
- robots `noindex` (`nofollow` is appropriate for terminal invalid resource states);
- no misleading canonical;
- no Product/Collection/Article schema for the missing entity;
- user recovery links that do not change the status code.

## Sitemap rules

### Include

Only canonical index-eligible public resources:

- `/`;
- clean `/shop`;
- valid public categories;
- SEO-publishable products;
- public collections index/detail;
- public journal index/articles;
- lookbook/about/contact/size guide/FAQ and truth-safe published policy pages according to the route matrix.

### Exclude

Always exclude:

- `/search` and every search query;
- all faceted/sort query URLs;
- `/cart`;
- `/checkout`;
- `/account`;
- `/wishlist`;
- `/order-confirmation`;
- `/track-order`;
- `/design-system`;
- invalid/unpublished/archived resources;
- current draft products until publication evidence passes.

No sitemap `<loc>` may contain a relative URL or query string in F20-A.

### `lastmod`

Do not fabricate `lastmod` from build time. F20-B may emit it when Backend provides meaningful entity update/publication timestamps.

`changefreq`/`priority` are optional hints and must not be treated as ranking controls.

## robots.txt rules

F20-A uses robots.txt for crawl guidance, not page-level de-indexing.

Contract:

```text
User-agent: *
Allow: /
Sitemap: https://<production-origin>/sitemap.xml
```

Public HTML pages that need exclusion from search use robots meta. In particular `/search` must not be simultaneously blocked by `robots.txt` and depend on a `noindex` meta that the crawler cannot read.

If future crawl logs justify parameter blocking at scale, F20-B may add targeted crawl rules after checking the interaction with noindex and canonical behavior.

## Sitemap/robots environment rules

- production site origin comes from validated `VITE_SITE_URL`;
- production origin must be HTTPS and a clean origin (no path/query/hash/credentials);
- sitemap `<loc>` and robots Sitemap line are absolute;
- local development may use relative metadata when no site origin is configured, but automated production-like tests set `https://lbb.example.test`.

## Regression assertions

Automated SEO tests must assert:

1. `/search` is `noindex` and not Disallowed by robots.
2. sitemap contains absolute canonical routes and no excluded utility/query routes.
3. known F14C draft product URLs are absent from sitemap.
4. invalid dynamic resources return 404 and noindex metadata.
5. canonical links are absolute under the configured production test origin.
6. robots advertises the absolute sitemap URL.

## F20-B handoff

Dynamic sitemap generation moves to Backend-fed publication records in F20-B. The frontend XML contract remains the same; only the source of eligible entities changes.