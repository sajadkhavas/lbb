# Variant selection contract

This is a frontend presentation contract, not a backend DTO or endpoint contract.

## View state

A decision variant has:

- `id`
- `colorId`
- `sizeId`
- `availability`: `available | sold-out | unavailable | unknown`
- optional associated `mediaIds`

## Selection rules

- A color change recomputes size availability.
- If a previously selected size is unavailable in the new color, the size selection is cleared.
- `sold-out` and `unavailable` remain semantically exposed to assistive technology; they are not communicated by opacity alone.
- The add-to-cart action requires a commerce-ready product and an `available` selected variant.
- Missing color or size produces an explicit decision error; no default transaction is inferred.

## Existing catalogue fallback

The current catalogue has product-level `soldOutSizes`, not a color-specific inventory matrix. When every required field is published and verified, the adapter can derive a conservative matrix from that existing structure. A future F14D adapter may instead provide an explicitly verified variant matrix.

F15 does not define how backend inventory is stored or mutated.
