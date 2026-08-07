# Lookbook Commerce Contract

## Purpose

`/lookbook` is a visual editorial surface that can become shoppable **only where a real, publishable product relationship exists**.

A scene can link to:

- a public Product,
- a Collection,
- a Category,
- or remain editorial-only.

## Scene model

F17 keeps explicit scene records in `LOOKBOOK_SCENES` with:

- stable scene ID,
- media source,
- meaningful alt text,
- editorial label,
- layout ratio/class,
- optional collection reference,
- optional product references,
- optional category reference.

The scene ViewModel resolves product references against the catalogue and Product Evidence Contract. Unknown or non-publishable products never generate a public product CTA.

## Hotspot rule

A hotspot is allowed only when all are true:

1. the scene has a specific product reference,
2. the product exists,
3. publication/evidence evaluation is publishable,
4. the hotspot can be operated with keyboard and touch,
5. its accessible name identifies the destination.

Current Wave 1 has zero eligible products; therefore F17 intentionally renders zero product hotspots in the Lookbook and Homepage Shop-the-Story scene.

## Lightbox/dialog

The dialog contract includes:

- `role="dialog"`,
- `aria-modal="true"`,
- accessible title and instructions,
- focus moved inside on open,
- Tab/Shift+Tab focus containment,
- Escape closes,
- directional keys navigate scenes,
- opener focus restores on close,
- Previous/Next/Close controls meet the existing tap-target contract,
- logical RTL positioning.

A scene change does not create a new browser history entry and does not move focus outside the dialog.

## Commerce inside the dialog

The dialog can expose the same safe destinations as the scene card:

- public Product when eligible,
- related Collection,
- related Category.

Closing/navigating from a destination must not leave focus on a disconnected overlay.

## No-product state

When all referenced products are non-public, the route remains a complete visual story. A state panel explains that direct product linking is unavailable and keeps Collection/Category/Shop destinations visible. No fake hotspot is created to make the page appear shoppable.

## Media/performance

- Primary scene media may load eagerly.
- Subsequent scene media is lazy/deferred.
- Explicit width/height and aspect ratio are retained.
- No new gallery or animation dependency is introduced.
- Full media optimization is deferred to the dedicated media/performance phase.
