# F19-B Remediation Backlog

This backlog is the hand-off from the Wave-1 F19-A audit. F19-A intentionally leaves shared UI redesign out of scope; every meaningful unresolved issue below has a severity, affected file/route, evidence and acceptance criteria.

## Summary

| Severity | Count | IDs                       |
| -------- | ----: | ------------------------- |
| P0       |     0 | —                         |
| P1       |     4 | F19B-P1-002 … F19B-P1-005 |
| P2       |     4 | F19B-P2-001 … F19B-P2-004 |
| P3       |     1 | F19B-P3-001               |

No P0 blocker was identified in the baseline audit.

## Resolved during F19-A

### F19A-P1-001 — Disabled Search category facets failed serious color contrast

- Route: `/search?q=هودی`
- File: `src/components/lbb/ProductFilters.tsx`
- Area: Axe / Contrast / Disabled state
- Runtime evidence: the expanded route-family Axe gate reported `color-contrast` at `serious` impact on unavailable category labels because `text-mute opacity-55` reduced the visible text contrast.
- Fix: keep the unavailable state through the disabled checkbox and `cursor-not-allowed`, but render its visible label with `text-metal` and no opacity reduction.
- Scope: one isolated class-level production patch; no filter behavior, URL state, product model or layout architecture changed.
- Regression: the Search route remains inside the mandatory `0 critical / 0 serious` Axe gate.

The Lookbook lightbox was also re-verified after the full runtime suite: its Chromium interaction gate passes initial focus, Tab/Shift+Tab containment, arrows, Escape and opener restoration. It therefore does not remain an F19-B focus-debt item.

---

## P1 — High impact

### F19B-P1-002 — Checkout custom errors are not associated or focus-managed

- Route: `/checkout`
- File: `src/routes/checkout.tsx`
- Area: Forms / Errors / Screen reader / Focus
- Evidence: `Field` renders `role="alert"` text, but inputs/select/textarea do not receive `aria-invalid` or `aria-describedby`; first invalid custom field is not focused.
- Executable characterization: `tests/f19-interactions.spec.ts` expected-failure case with this ID.
- Impact: screen-reader and keyboard users can hear an alert without a durable programmatic relation to the failing control; correction flow is slower.

Acceptance:

1. every custom validation error has a stable ID,
2. related control gets `aria-invalid="true"`,
3. related control gets `aria-describedby=<error-id>`,
4. first custom invalid control receives focus after validation,
5. `required` and autocomplete remain intact,
6. no checkout/order/payment engine behavior is changed,
7. expected-failure annotation is removed.

### F19B-P1-003 — PDP mobile gallery selectors are below 44×44

- Route: `/product/$slug`
- File: `src/components/lbb/product/Gallery.tsx`
- Area: Touch / Product Gallery
- Evidence: mobile pagination buttons use `min-h-6` and `w-3`/`w-6`.
- Executable characterization: `tests/f19-rtl.spec.ts` expected-failure case.
- Impact: core gallery navigation has a substantially undersized touch hit area.

Acceptance: preserve compact visual dots inside >=44×44 buttons, no 390px overflow, keep current accessible labels/focus ring.

### F19B-P1-004 — Quick View thumbnails are only 36px wide

- Routes: Shop, Category, Search surfaces that open Quick View
- File: `src/components/lbb/ProductQuickView.tsx`
- Area: Touch / Product selection
- Evidence: thumbnail buttons use `h-11 w-9`.
- Executable characterization: `tests/f19-rtl.spec.ts` expected-failure case.
- Impact: repeated high-value image controls miss the project 44px touch contract.

Acceptance: >=44×44 target, no distortion/overflow, retain `aria-current`, image label and focus-visible behavior.

### F19B-P1-005 — Product gallery RTL interaction is built on an LTR scroll island

- Route: `/product/$slug`
- Files: `src/components/lbb/product/Gallery.tsx`; verify `src/components/lbb/ProductQuickView.tsx` in the same workstream
- Area: RTL / Carousel / Swipe / Arrow meaning
- Evidence: Gallery track is `dir="ltr"`, active-index math uses raw `scrollLeft/clientWidth`, keyboard mappings differ between main track and thumbnails; Quick View swipe uses raw `clientX` delta.
- Current-state regression: `tests/f19-rtl.spec.ts` explicitly asserts the LTR gallery island so it is not a hidden assumption.
- Impact: RTL users can receive inconsistent previous/next semantics between visual arrows, keyboard and swipe.

Acceptance:

1. document one RTL previous/next rule,
2. keyboard arrows, arrow icons and swipe follow it in PDP and Quick View,
3. Home/End remain deterministic,
4. scroll normalization is encapsulated/tested instead of relying on accidental browser RTL behavior,
5. update/remove the explicit LTR-island test only together with the new RTL regression.

---

## P2 — Moderate

### F19B-P2-001 — Cart Drawer quantity buttons are 36×36

- Surface: Cart Drawer
- File: `src/components/lbb/CartDrawer.tsx`
- Evidence: decrement/increment use `h-9 w-9`.
- Executable characterization: `tests/f19-rtl.spec.ts` expected-failure case.
- Acceptance: >=44×44; retain names, disabled decrement state and live quantity output.

### F19B-P2-002 — Active filter chips are 40px high

- Routes: `/shop`, `/$category`, search/listing surfaces using grid controls
- File: `src/components/lbb/ProductGridControls.tsx`
- Evidence: chip/reset actions use `min-h-10` while the project overlay contract is 44px.
- Executable characterization: `tests/f19-rtl.spec.ts` expected-failure case.
- Acceptance: normalize post-filter touch actions to >=44px without bloating layout or changing URL/filter behavior.

### F19B-P2-003 — Mixed Latin SKU/identifier text lacks consistent bidi isolation

- Routes: PDP, Quick View, product cards/metadata
- Files: `src/routes/product.$slug.tsx`, `src/components/lbb/ProductQuickView.tsx`, related metadata renderers
- Evidence: Latin SKU such as `LBB-H01` is styled with `.num` but not consistently wrapped in a bidi-isolation primitive.
- Risk: punctuation/hyphen ordering can become ambiguous next to Persian copy in some user agents/assistive contexts.
- Acceptance: create/use a small, documented identifier treatment (`bdi`, explicit `dir="ltr"`, or equivalent) scoped only to Latin identifiers.

### F19B-P2-004 — Secondary chip/link targets need site-wide 44px normalization

- Routes: FAQ, 404 and similar secondary navigation chips
- Files: repeated route-level chip/link styling; prefer a shared primitive if ownership allows
- Evidence: several `px-4 py-2` chip-style controls do not guarantee 44px height.
- Impact: lower-frequency controls than product/cart, but still mobile interaction debt.
- Acceptance: post-remediation touch sweep across 390px route inventory; normalize repeated primitive rather than page-by-page arbitrary padding.

---

## P3 — Polish / robustness

### F19B-P3-001 — Product-card color information is count-only for screen readers

- Routes: Shop, Category, Search, related/recent product grids
- File: `src/components/lbb/ProductCard.tsx`
- Area: Screen-reader product-card semantics
- Evidence: color group announces only the number of colors while visual swatches are `aria-hidden`.
- Impact: low because exact color options are available in Quick View/PDP, but card-level parity could be better.
- Acceptance: if product-card density allows, include concise accessible color names without repeating verbose visual content or creating duplicate announcements.

---

## Remediation order

Recommended F19-B order:

1. `F19B-P1-002` Checkout error semantics/focus.
2. `F19B-P1-005` RTL Gallery/Quick View previous-next contract.
3. `F19B-P1-003` + `F19B-P1-004` product touch targets as one product interaction pass.
4. `F19B-P2-001` + `F19B-P2-002` cart/filter target sizing.
5. `F19B-P2-003` bidi identifier primitive.
6. `F19B-P2-004` secondary target sweep.
7. `F19B-P3-001` card semantic polish.

## F19-B exit rule

A debt item is complete only when:

- production remediation is merged through the appropriate owner,
- its expected-failure regression is converted to a normal passing test where one exists,
- Axe remains at `0 critical / 0 serious`,
- `npm run test:a11y`, `npm run test:rtl`, `npm run test:e2e`, and `npm run quality` stay green,
- RTL/touch behavior is not fixed by weakening or suppressing the gate.
