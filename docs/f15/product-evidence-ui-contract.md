# Product evidence UI contract

F15 consumes the F14C evidence model; it does not replace it.

## Publication rule

A catalogue value is not treated as a public fact merely because it exists in `product-catalog.ts`. The PDP adapter requires the product to be `published` and the relevant field to be `verified` with a source and review timestamp before that value reaches the public decision ViewModel.

## Independent fields

Identity, media, price, previous price, color, size, stock, description, material, care, fit, SKU and collection remain independently gated. Verification of price never implies stock; verification of material never implies fit; verification of media never implies color-specific media association.

## Optional F15 extensions

Garment measurements, model information, color-specific media, explicit variants and complete-the-look references use `VerifiedExtension<T>` in the presentation layer. An extension requires:

- `state: verified`
- a non-empty source reference
- a review timestamp
- a value

`pending` and `missing` extensions do not reach public UI.

These types are UI adapter inputs only. They do not prescribe Backend storage or API DTO names.

## Failure mode

Uncertain values fail closed. F15 prefers a useful pending-state explanation over a plausible-looking fabricated number, swatch, image, fit claim or size table.
