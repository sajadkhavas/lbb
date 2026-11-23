# Size guide UX

## Rule

The PDP size guide is garment-specific. It must not fall back to a generic S/M/L body chart or infer measurements from category labels.

## Data shape

A published garment measurement set contains:

- explicit unit: `cm`;
- product-relevant columns such as chest, length, shoulder, sleeve, waist, hip or inseam;
- rows keyed by the product's actual size labels;
- nullable cells when one measurement does not apply.

Not every product needs every measurement.

## Interaction

The existing Radix dialog foundation provides modal semantics, focus containment, Escape handling and focus restoration. F15 adds:

- RTL content;
- mobile-safe max height;
- horizontally scrollable measurement table;
- a focusable overflow region;
- column labels containing the explicit unit;
- optional verified model information.

## Missing data

When product-specific measurements are not verified, the PDP does not show a fabricated size chart or generalized advice such as choosing a larger size. The size-guide entry point is omitted until useful data exists.
