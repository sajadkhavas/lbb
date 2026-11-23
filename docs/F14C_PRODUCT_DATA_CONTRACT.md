# F14C — Product Data and Publication Contract

## Purpose

The storefront must not present guessed prices, discounts, stock, fabric composition, care instructions or fit guidance as facts. A complete-looking record is not necessarily a verified record.

## Publication states

- `draft`: usable for interface development and internal review; not approved for production commerce.
- `published`: every required field has an attributable source and review date.
- `archived`: retained for history but excluded from the active catalogue.

## Evidence states

- `verified`: the value matches an attributable operational source and has a review date.
- `pending`: a value exists in the current code but the store has not verified it.
- `missing`: the field has no usable value.

## Required evidence fields

Name, media, price, previous price, colors, sizes, stock, description, material, care, fit, SKU and collection membership are independently verified. Verification of one field never implies verification of another.

## Accepted sources

- Product record in the future admin/API
- Invoice or supplier specification
- Garment label and care label
- Physical measurement recorded by the store
- Inventory system or an explicit stock confirmation
- Approved brand copy supplied by the store

A source must be specific enough to audit later. General market knowledge, competitor pages and AI-generated text are not product evidence.

## Price and discount rules

- A current price must come from the operational product record.
- A previous price requires real price history.
- Discount percentages are calculated from verified prices; they are never written independently.
- Urgency language such as «رو به اتمام» requires a defined inventory threshold and live stock.

## Material, care and fit rules

- Fibre percentages and fabric weights require a label or supplier specification.
- Care instructions come from the garment label or manufacturer.
- Fit describes how the garment sits on the body; it is not a substitute for measurements.
- Size advice requires real garment measurements or a documented fitting test.

## Current catalogue status

The eight records inherited from the interface prototype are explicitly `draft`. They may support layout and interaction work, but they block storefront-content readiness and commerce launch until their evidence is completed.

## Admin/API hand-off

The future backend should store every product field together with:

- evidence state
- source reference
- review timestamp
- reviewer identity
- publication state

Secrets, payment verification and inventory mutation remain server-side concerns and are not part of this public content contract.
