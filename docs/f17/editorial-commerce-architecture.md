# Editorial → Commerce Architecture

## Goal

F17 turns editorial surfaces into connected discovery journeys without making editorial content a disguised product advertisement.

The expected flow is:

`Discovery → Story → contextual destination → Commerce`

The destination can be a Product, Category, Collection or Shop. Product is **conditional** on publication/evidence eligibility.

## Adapter boundary

`src/lib/editorial-commerce.ts` is the F17 frontend boundary. Routes and homepage editorial components consume view models from this module instead of hard-coding product links.

The boundary currently maps the static Wave 1 content model, but its output is deliberately shaped around future public data:

- collection identity and kind (`collection` / `drop`),
- editorial media,
- primary category context,
- product references,
- product publication/evidence evaluation,
- public products,
- lookbook scene relationships,
- journal related commerce relationships.

It does not know or invent an HTTP endpoint.

## Publication gate

A product reference and a public product link are different concepts.

A reference may exist because a story is editorially related to a catalogue record. A public product link is emitted only when the existing Product Evidence Contract evaluates that record as publishable.

```text
reference exists
    ↓
product exists in catalogue
    ↓
evaluateProductEvidence(product)
    ↓
publishable === true ? public link : editorial fallback
```

Current Wave 1 result: all 8 catalogue records are draft, so public editorial product links are intentionally zero.

## Journey rules

### Collection

Collection → public Product when eligible → otherwise Category/Shop/Lookbook/Journal.

### Drop

Drop uses the same frontend editorial shell with an explicit `kind: "drop"`. Timing, launch state, countdown or urgency is not inferred. Those fields can be mapped later only when Backend public data supplies them.

### Lookbook

Scene → Product only when eligible; otherwise Scene → Collection and/or Category. Product hotspots are conditional on the same gate and never exist for an unknown or unpublished item.

### Journal

Article remains editorial-first. A contextual block can point to related public Products, Collections and Categories, followed by Shop. The relationship map is explicit and does not turn every article into a product ad.

## Category vs Collection

- Category = product taxonomy and commercial browse intent.
- Collection = editorial/merchandising grouping and story intent.

F17 does not use collection pages as aliases for category pages. Where a collection has a strong taxonomy relationship, that category is an onward link rather than a replacement for collection identity.

## Invalid and empty states

- Unknown dynamic collection/article slug keeps the existing real 404/noindex behavior.
- A valid collection with no public products remains a valid editorial page and exposes a deliberate onward discovery state.
- A lookbook with no shoppable public item remains useful through Collection/Category links.
- No fake product slug or placeholder URL is generated.

## Accessibility and interaction

- All onward links are normal semantic links.
- Lookbook image openers are buttons with dialog semantics.
- Dialog implements explicit Tab/Shift+Tab containment, Escape, directional keys and focus restoration.
- Navigation controls use existing 44px tap-target primitives.
- RTL logical properties are used for scene controls and CTA placement.
- Existing reduced-motion styling remains authoritative; F17 adds no heavy motion dependency.

## Performance

- No new dependency was added.
- Routes remain route-chunked by TanStack Router.
- Editorial images retain explicit dimensions, `sizes`, eager loading only for primary media and lazy/deferred loading below the fold.
- F17 does not implement the full image pipeline; that remains later media/performance work.
