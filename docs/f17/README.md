# F17 — Editorial → Commerce

## Baseline

- Repository: `sajadkhavas/lbb`
- Base branch: `integration/wave1-reviewed`
- Base SHA: `a46aa4dbc93bb505efa9657c6ae6b91b1881a324`
- Phase branch: `phase/f17-editorial-commerce-linking`

F17 connects editorial discovery to onward commerce without changing the PDP, checkout, Backend API, global SEO architecture, or global motion architecture.

## Current Wave 1 inventory

| Surface | Current inventory | F17 interpretation |
| --- | ---: | --- |
| Collections | 3 | editorial/merchandising groupings |
| Drop-like collection records | 2 | drop UI semantics through an adapter, without timing claims |
| Lookbook scenes | 8 | visual stories with conditional product references |
| Journal articles | 5 | editorial stories with contextual onward destinations |
| Catalogue products | 8 | all remain draft/non-publishable under the existing Product Evidence Contract |
| Public editorial product links | 0 | intentionally zero until the evidence/publication gate passes |

## What changed

- Introduced `src/lib/editorial-commerce.ts` as the frontend ViewModel/adapter boundary for collections, drops, lookbook scenes, journal relationships and product references.
- Added a reusable `EditorialCommerceBridge` for contextual Story → Commerce destinations.
- Reworked `/collections` into an editorial discovery hub rather than a Shop duplicate.
- Reworked `/collections/$slug` so direct product cards/schema only exist for evidence-publishable products; otherwise the route exposes a deliberate editorial empty state and onward category/shop paths.
- Reworked `/lookbook` into a shoppable-capable visual story. Direct product links are conditional; current draft products do not produce product links or hotspots.
- Added an explicit keyboard focus trap to the lookbook dialog while preserving Escape, arrow keys and opener focus restoration.
- Added contextual Journal → Collection/Category/Product linking to `/journal/$slug`, while keeping the article primary and independent.
- Updated homepage editorial surfaces (`DropStory`, `ShopTheLook`, `EditorialGateway`) to stop presenting draft catalogue records or prototype prices as public commerce facts.

## Truth-safety decision

The existing `PRODUCT_EVIDENCE` registry marks all eight current catalogue records as `draft` and their required evidence fields as pending. F17 therefore does **not** expose direct product commerce links from editorial surfaces in the current Wave 1 data state.

This is a feature, not an empty implementation: the relation is preserved in the ViewModel, but the public link is emitted only when `evaluateProductEvidence(product).publishable === true`.

## Boundaries respected

- No change to `src/routes/product.$slug.tsx` or PDP components.
- No Backend/API integration.
- No Cart/Checkout/Payment/Account work.
- No Navbar/Footer/global style/global motion redesign.
- No dependency changes.
- Existing F20 canonical, invalid-route, Article and CollectionPage semantics remain authoritative.
- Existing F19 focus, RTL, zoom, text-spacing and reduced-motion contracts remain regression gates.

## Documents

- `editorial-commerce-architecture.md`
- `collection-contract.md`
- `lookbook-commerce-contract.md`
- `journal-commerce-contract.md`
- `f14d-backend-handoff.md`
