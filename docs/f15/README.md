# F15 — Product Decision & PDP 2.0

F15 turns the product route into a decision surface without promoting prototype catalogue values to public commerce facts.

## Baseline

- Base branch: `integration/wave1-reviewed`
- Base SHA: `a46aa4dbc93bb505efa9657c6ae6b91b1881a324`
- Phase branch: `phase/f15-product-decision-pdp-2`

## Principles

1. Show verified facts.
2. Hide uncertain commerce values.
3. Keep the PDP ViewModel independent from any backend DTO.
4. Treat availability as a color + size decision, not a product-wide decoration.
5. Keep media, measurements, fit, material and care independently evidence-gated.
6. Do not infer urgency, popularity, remaining quantity, delivery, returns or payment promises.

## Current catalogue state

The inherited eight catalogue records remain `draft`; their evidence fields remain pending. F15 therefore renders a production-safe pending state instead of exposing those prototype values as facts. The same components become fully interactive when a future adapter supplies published, verified data.

## Owned implementation

- `src/lib/product-decision.ts` — presentation ViewModel and evidence adapter.
- `src/components/lbb/product/Gallery.tsx` — media carousel and verified-media pending state.
- `ProductIdentity.tsx` — identity, availability and pricing hierarchy.
- `ProductDecisionSelectors.tsx` — accessible color and size controls.
- `ProductPurchasePanel.tsx` — variant selection, validation, cart handoff and sticky purchase state.
- `ProductFacts.tsx` — verified details, material, fit, care and measurements.
- `SizeGuideDialog.tsx` — product-specific garment measurements only.
- `ProductDiscovery.tsx` — publishable-only complete-the-look and related products.

## Explicitly not owned

F15 does not implement API fetching, checkout, payment, order creation, inventory mutation, global cart persistence, global motion, editorial routes or global SEO architecture.
