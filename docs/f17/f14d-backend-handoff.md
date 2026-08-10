# F17 → F14D Backend Data Handoff

## Boundary

This document defines **data needs**, not endpoints. F17 does not choose URL paths, transport, caching, authentication or Backend resource names.

The frontend adapter should be able to map future public commerce data into the same view models without changing the Editorial → Commerce interaction model.

## Collection data

Required concepts:

### Identity

- stable public ID,
- canonical slug,
- public display name,
- optional technical/Latin label,
- collection vs drop kind when the domain exposes both.

### Story

- short summary/tagline,
- long narrative,
- optional editorial note,
- ordered story points/chapters,
- editorial topic/context when available.

### Media

- public media ID or URL,
- role (hero/card/story),
- alt text or equivalent editorial description,
- intrinsic width/height,
- responsive renditions when the media pipeline provides them.

### Products

- ordered product references,
- stable product ID/slug relation,
- product publication eligibility,
- enough evidence/publication state for the frontend to decide whether a public product link is legal.

### Publication

- public/draft/archived or equivalent explicit state,
- publication timestamp when it is a real stored fact,
- optional unpublish/archive state,
- canonical slug history if maintained by Backend.

### SEO inputs

- canonical slug,
- title/description overrides when editorially approved,
- indexability/publication eligibility,
- structured-data-safe summary/media inputs,
- modified/publication timestamps only when real.

## Drop data

Required concepts:

### Identity

- stable public ID,
- slug,
- name,
- story summary,
- relationship to Collection where the domain models both.

### Publication

- explicit publication state,
- optional lifecycle state such as upcoming/active/past only if Backend owns that truth.

### Timing

- release/start/end timestamp only when it is a stored, verified fact,
- timezone semantics for any real timing value.

F17 will not infer timing from naming, slug order or frontend clock.

### Products and media

- ordered public product references,
- publication eligibility per product,
- editorial media with dimensions/alt metadata.

No countdown, scarcity or urgency should be generated merely because timing fields exist.

## Journal data

Required concepts:

### Article

- stable ID,
- canonical slug,
- headline,
- excerpt/summary,
- topic/category,
- structured article sections/body,
- reading-time value only if it is an intentional content field or deterministically derived.

### Media

- cover media,
- intrinsic dimensions,
- alt/editorial description,
- responsive renditions if available.

### Related commerce

- related product references,
- related collection references,
- related category references,
- relationship ordering or editorial priority when available.

### Publication

- public/draft/archived or equivalent,
- real publication date,
- real modified date when available,
- redirect/canonical history if a slug changes.

## Lookbook data

Required concepts:

### Scene

- stable scene ID,
- title/label,
- ordering,
- optional story/caption.

### Media

- scene image/media,
- intrinsic dimensions,
- alt/editorial description,
- responsive renditions.

### Product references

- product ID/slug,
- optional hotspot coordinates only when the scene is intentionally shoppable,
- product publication eligibility.

### Collection references

- related collection/drop ID/slug,
- optional category context.

A hotspot must never be synthesized by the frontend solely because a product appears in the same collection.

## Product eligibility contract

The public data layer must make it possible to distinguish:

- record exists,
- record is public,
- commerce facts are evidence-complete enough to expose as a public product destination.

F17 currently uses the existing frontend Product Evidence Contract as the gate. F14D can later replace the static source with public Backend state while preserving the same fail-closed behavior.

## Error and empty semantics

The public data contract should support these outcomes without frontend guessing:

- resource exists and is public,
- resource exists but is not public,
- resource does not exist,
- resource is archived/removed,
- related product is unavailable for public linking while the editorial resource remains valid.

F17 must be able to keep a valid editorial page alive even when all of its product references are non-public.

## Explicit non-requirements

F17 does not define:

- REST/GraphQL endpoint paths,
- query parameter names,
- database tables,
- transport schema envelopes,
- authentication strategy,
- cache headers,
- payment/order/cart API behavior.
