# F14D backend handoff

F15 deliberately does not name an endpoint, request shape or backend DTO. The Public Commerce API can map its own contract into the PDP presentation ViewModel later.

## PDP data needs

### Identity

- stable public slug or route key
- verified public product name
- optional public Latin/display identifier
- category association
- optional collection association
- optional public SKU
- public description and short decision copy

### Price

- current public price and currency/unit semantics
- previous price only when supported by real price history

### Variants

- stable variant identifier
- color identifier and public color label
- optional safe swatch representation
- size identifier and public size label
- availability state for the color + size combination
- optional media association

The frontend does not need stock counts unless the product policy intentionally exposes them. It does need a reliable availability state.

### Media

- stable media identifier
- public URL/resource reference
- meaningful alt text or enough context to construct it
- intrinsic width and height
- optional color/variant association
- deterministic ordering and primary-media signal

### Decision facts

- verified fit label and optional fit guidance
- verified material/composition text or structured composition
- verified care instructions
- product-specific garment measurement columns and rows with explicit unit
- optional verified model height, worn size and body measurements

### Discovery

- explicit complete-the-look references when curated
- related product references/ranking when available
- only public/published destinations

### SEO inputs

F20-B may need public product identity, description, canonical media, offer/availability inputs and other verified fields for backend-driven structured data. F15 does not define that schema.

## Evidence metadata

The frontend publication gate requires enough metadata to distinguish `verified`, `pending` and `missing` values and to know whether a product is public. The backend may structure that metadata differently; F14D should map it into the frontend adapter rather than mirroring F15 TypeScript names.

## Server-only responsibilities

Inventory mutation, checkout, payment verification, order creation, secrets and private merchant configuration remain server-side and must never be added to the public PDP payload merely to satisfy this ViewModel.
