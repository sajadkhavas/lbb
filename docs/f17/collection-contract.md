# Collection and Drop Contract

## Collection responsibility

A Collection is an editorial/merchandising grouping. It must not silently become a product-type taxonomy page.

A valid collection detail should be able to express:

1. identity,
2. narrative,
3. editorial media,
4. story points,
5. related product references,
6. public products after evidence gating,
7. category context where meaningful,
8. onward discovery links.

## Current frontend ViewModel

`getCollectionEditorialView(collection)` resolves:

- `collection`: existing collection record,
- `kind`: `collection` or `drop`,
- `media`: editorial hero media,
- `primaryCategory`: optional taxonomy onward destination,
- `productReferences`: all valid catalogue references,
- `publicProducts`: only evidence-publishable product references,
- `withheldProductCount`: referenced records that cannot be public commerce links yet.

## Collections index

`/collections` is an editorial discovery hub.

Cards expose story identity and media, not prototype price/stock facts. A card can state that no direct product link is currently available; it still leads to a valid editorial detail page.

## Collection detail

`/collections/$slug` keeps:

- canonical self URL,
- breadcrumb hierarchy,
- `CollectionPage` compatibility,
- real 404 for unknown slugs.

`ItemList` product schema is emitted only when `publicProducts` is non-empty. The page must never place draft product URLs in structured data just because a local catalogue record exists.

## Empty/publication state

A valid collection with zero public products is not a 404. It renders an editorial empty state and allows onward navigation to:

- relevant Category when known,
- Shop,
- Lookbook,
- Journal.

It does not render ProductCard, product price, inventory, size, fake purchase CTA or placeholder product URL.

## Drop semantics

Current Wave 1 content uses two `drop-*` collection records. F17 gives them an explicit frontend `kind: "drop"` through the adapter so future public Drop data can map into the UI without merging the Drop domain into Category semantics.

F17 does **not** infer:

- upcoming/active/past from a slug,
- release date,
- countdown,
- scarcity,
- sold-out timing,
- popularity,
- exclusivity.

If future public data provides a real publication/timing state, the adapter can map that state to the existing editorial shell.

## SEO compatibility

- `/collections` remains the collection hub.
- Published collection detail remains self-canonical.
- Invalid collection keeps HTTP 404/noindex behavior.
- Product ItemList entries are publication/evidence gated.
- Collection remains a distinct intent from taxonomy Category.
