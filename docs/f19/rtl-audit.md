# RTL Audit

## Baseline direction contract

LBB is Persian and RTL-first. The root document renders:

```html
<html lang="fa" dir="rtl">
```

F19-A keeps that contract under automated regression. Representative route families are exercised at `390`, `768`, `1440`, and `1920` CSS pixels with:

- `html[dir="rtl"]`
- one main landmark
- no unexpected document-level horizontal overflow

The existing `tests/all-routes.spec.ts` extends the RTL/H1/overflow check across the wider production route inventory.

## Logical-direction usage reviewed

Positive baseline patterns:

- Navbar and navigation overlays explicitly render RTL.
- Breadcrumb uses RTL direction, an ordered list, logical inline overflow and `ChevronLeft` separators.
- Layout utilities generally use logical properties (`start`, `end`, `ms`, `inset-inline-*`) rather than physical left/right placement.
- Search suggestions, filters and dialogs expose Persian accessible names.
- Phone/postal values and the Instagram handle intentionally use LTR presentation as data islands.
- The price slider uses `dir="ltr"` intentionally because the numeric minimum-to-maximum axis is treated as a scalar control rather than reading-order content.

## Explicit LTR islands

The audit recognizes that an RTL application can contain legitimate bidi islands. They must be explicit rather than inherited accidentally.

| Surface | File | Why LTR exists | Audit disposition |
| --- | --- | --- | --- |
| Contact Instagram handle | `src/routes/contact.tsx` | Latin handle readability | Accepted explicit data island |
| Checkout phone/postal fields | `src/routes/checkout.tsx` | digit entry/readability | Accepted explicit input island |
| Price slider | `src/components/lbb/ProductFilters.tsx` | scalar min→max axis | Accepted, retain accessible Persian label |
| Product gallery scroll track | `src/components/lbb/product/Gallery.tsx` | current implementation normalizes `scrollLeft`/`offsetLeft` math | **Debt `F19B-P1-005`**; behavior must be made explicitly RTL-safe |

## F19B-P1-005 — Product gallery relies on an LTR scroll model

Route: `/product/$slug`

File: `src/components/lbb/product/Gallery.tsx`

Current implementation sets the mobile/main track to `dir="ltr"` and calculates the active slide with raw `scrollLeft / clientWidth` plus `child.offsetLeft`. This avoids browser-specific negative RTL `scrollLeft`, but it also makes the product gallery a deliberate LTR interaction island inside an RTL product page.

The same component maps:

- thumbnail `ArrowLeft` → next index,
- thumbnail `ArrowRight` → previous index,
- main carousel `ArrowLeft` → previous index,
- main carousel `ArrowRight` → next index.

That mixed mapping is understandable from implementation mechanics, but the user-facing arrow/swipe meaning needs one documented RTL-native rule shared by keyboard, buttons, swipe and visual placement. F19-A does not redesign Product Gallery because it is a shared product component.

F19-B acceptance:

1. Define one RTL semantic rule for previous/next.
2. Make swipe direction, keyboard arrows and visible arrow icons follow that rule.
3. Keep Home/End deterministic.
4. Avoid depending on browser-specific raw RTL `scrollLeft` semantics, or encapsulate normalization in one tested helper.
5. Remove the F19-B debt note only after Playwright verifies both keyboard and swipe behavior.

## Quick View swipe audit

`src/components/lbb/ProductQuickView.tsx` uses raw touch `clientX` deltas:

- positive delta → previous image,
- negative delta → next image.

The visible buttons use logical `start/end`, but swipe is index-driven rather than direction-aware. This should be validated together with `F19B-P1-005` so PDP Gallery and Quick View do not teach opposite gesture semantics. It is included in the same F19-B RTL remediation workstream rather than duplicated as a second architecture task.

## Drawer direction

- Filter drawer is a bottom sheet, so inline RTL direction is not ambiguous.
- Mobile menu is full-screen.
- Search is centered/full-screen depending on viewport.
- Cart Drawer is physically anchored to the left in the current design.

F19-A does **not** classify left-anchored Cart as a failure by itself because drawer side is a product/design decision, not a WCAG requirement. F19-B should only move it if the final RTL interaction specification says cart drawers must originate from inline-start/end consistently. Focus, Escape, Back and touch targets are audited independently of anchor side.

## Breadcrumbs and icons

Breadcrumb separators are decorative (`aria-hidden`) and do not become part of the accessible name. Current `ChevronLeft` direction visually matches progression in the RTL breadcrumb row.

Icon-only controls in audited shell/dialog surfaces have explicit accessible names. Directional icons in galleries are treated as presentation; previous/next meaning comes from the button label and must remain synchronized with the RTL interaction contract.

## Mixed Persian / Latin SKU and product metadata

### F19B-P2-003 — Latin SKU/Latin names are not consistently isolated

Affected examples:

- PDP product code in `src/routes/product.$slug.tsx`
- Quick View SKU in `src/components/lbb/ProductQuickView.tsx`
- Latin product/category labels rendered adjacent to Persian copy

The `.num` class changes typography/numeric features but does not itself establish Unicode bidi isolation. Hyphenated identifiers such as `LBB-H01` can become visually ambiguous next to Persian punctuation on some assistive/user-agent combinations.

F19-B acceptance: use a consistent bidi-isolation primitive (`bdi`, `dir="ltr"` on the data span, or an equivalent documented helper) for SKU/Latin identifiers without forcing whole Persian sentences into LTR.

## Automated RTL gates

`tests/f19-rtl.spec.ts` protects:

- 390 / 768 / 1440 / 1920 route samples
- root RTL direction
- document overflow
- explicit data-direction islands
- mobile touch contract
- reduced motion
- text-spacing stress

The Product Gallery LTR island is asserted explicitly so it cannot become a hidden assumption. Its removal/change belongs to F19-B and must update the test together with the documented interaction contract.
