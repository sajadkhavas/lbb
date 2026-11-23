# Journal Commerce Contract

## Editorial-first principle

Journal content must remain useful without a commerce CTA. Related commerce is contextual and follows the article; it does not replace the article body or turn each paragraph into an advertisement.

## Journal index

`/journal` provides editorial discovery through:

- headline,
- summary,
- topic/category,
- recorded date,
- reading time,
- media,
- link to article detail.

The index also exposes onward discovery to Lookbook, Collections and Shop without inserting product sales claims into article cards.

## Journal detail

`/journal/$slug` keeps:

- article identity,
- article body and section navigation,
- recorded date and reading time,
- Article structured-data compatibility,
- breadcrumb hierarchy,
- related articles,
- contextual commerce bridge after the article.

Invalid article slugs keep the existing 404/noindex semantics.

## Relationship map

F17 uses an explicit static relationship map for the current Wave 1 content. Relationships are based on the article subject already present in the source material:

- oversized styling → hoodie/pants context + Night collection,
- urban visual language → broad apparel context + Night collection,
- care → apparel/shoes categories,
- color styling → red/neutral story + Signal Red collection,
- materials → denim/cargo references + Denim collection.

This map does not claim sales performance or product availability.

## Product gate

Related product references are resolved through `evaluateProductEvidence`.

- publishable product → direct product CTA may be rendered,
- draft/pending/untracked product → no product CTA,
- collection/category links may still provide a truthful next step.

Current Wave 1 product state results in zero direct Journal → Product links.

## Related commerce block

`EditorialCommerceBridge` can render:

1. public products,
2. related collections,
3. related categories,
4. Shop fallback.

When referenced products exist but none are public, it explicitly falls back to editorial/category destinations rather than leaking a draft product URL.

## SEO compatibility

F17 does not redesign dynamic SEO. It preserves:

- self canonical article URLs,
- Article schema,
- recorded `datePublished`,
- absolute article media URLs,
- BreadcrumbList,
- real 404/noindex for unknown slugs.

Backend-driven publication and dynamic SEO fields remain F20-B/F14D integration work.
