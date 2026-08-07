# Touch, Zoom & Text-Spacing Audit

## Viewports

F19-A uses the required responsive widths:

- `390 × 844`
- `768 × 1024`
- `1440 × 1000`
- `1920 × 1080`

`tests/f19-rtl.spec.ts` runs representative RTL route families at all four widths and rejects unexpected document-level horizontal overflow.

## Touch target contract

The existing F12 overlay contract requires a minimum `44px` target for critical touch controls. The design-system utility `.tap-target` correctly enforces:

```css
min-width: 44px;
min-height: 44px;
```

Passing F19-A checks cover critical mobile shell and Quick View controls such as:

- main menu
- search
- cart opener
- filter drawer opener
- Quick View opener
- Quick View close
- Quick View quantity decrement/increment

Known target failures are deliberately executable expected-failure cases rather than skipped tests.

## Known touch findings

### F19B-P1-003 — PDP mobile gallery dot buttons are below 44px

File: `src/components/lbb/product/Gallery.tsx`

Route: `/product/$slug`

Mobile image selectors use `min-h-6` and widths of `w-3` / `w-6`, yielding a target well below the 44px interaction contract. The visible dot may stay small, but the **interactive hit area** must become at least 44×44 without creating visual crowding.

Acceptance:

- keep dot/pagination visual design compact,
- enlarge the button hit box to >=44×44,
- retain focus-visible styling and accessible image labels,
- verify 390px layout does not overflow.

### F19B-P1-004 — Quick View gallery thumbnails are 36px wide

File: `src/components/lbb/ProductQuickView.tsx`

Quick View thumbnail buttons use `h-11 w-9`: height is 44px but width is 36px. This is a core product-selection surface and is therefore P1.

Acceptance: >=44×44 target, no image distortion, no horizontal overflow, retained `aria-current` and focus ring.

### F19B-P2-001 — Cart quantity controls are 36×36

File: `src/components/lbb/CartDrawer.tsx`

Cart quantity decrement/increment buttons use `h-9 w-9`. Keyboard names are present, but touch hit area violates the F12 contract.

Acceptance: >=44×44 while preserving disabled decrement state and live quantity output.

### F19B-P2-002 — Active filter chips use a 40px minimum height

File: `src/components/lbb/ProductGridControls.tsx`

Active-filter remove chips and related reset actions use `min-h-10`. The mobile filter trigger itself is compliant; the post-apply chip row is not consistently 44px high.

Acceptance: >=44px interactive height without materially increasing catalogue density.

### F19B-P2-004 — Secondary chip/link targets need a wider 44px sweep

Examples found during source audit include small chip-style anchors/actions on FAQ and invalid-route helper navigation. They are not as critical as product/cart controls, but F19-B should run a site-wide pointer-target sweep after shared component remediation and normalize repeated chip primitives rather than patching each page independently.

## Zoom contract

The root viewport metadata is:

```text
width=device-width, initial-scale=1
```

It does **not** disable user scaling with `user-scalable=no` or `maximum-scale=1`. F19-A has an automated assertion protecting that contract.

Desktop browser zoom is not a separate layout mode exposed reliably by Playwright across engines. F19-A therefore protects the same reflow pressure through fixed CSS-pixel widths:

- a ~780px desktop layout at 200% is represented by the 390px CSS-pixel gate,
- wider desktop states are also exercised at 768/1440/1920,
- the global route suite rejects unexpected horizontal page overflow.

This is intentionally described as a **reflow proxy**, not as a claim that browser UI zoom itself is emulated.

## WCAG text-spacing stress

`tests/f19-rtl.spec.ts` injects the WCAG text-spacing stress values on the FAQ route at 390px:

- line height: `1.5`
- letter spacing: `0.12em`
- word spacing: `0.16em`
- paragraph spacing: `2em`

The gate requires:

- no unexpected page-level horizontal overflow,
- the H1 remains visible,
- disclosure controls remain visible/usable.

FAQ is selected because it combines long Persian body text, Latin technical labels, anchors and native disclosures. The global 390px route regression complements it for other families.

## Clipping / overlap review

High-risk surfaces reviewed:

- fixed Navbar and Mobile Bottom Bar
- Cart/Filter/Quick View overlays
- PDP Sticky Buy Bar
- gallery track and thumbnail controls
- filter/sort controls
- long FAQ and legal/help content
- 404 helper navigation

No P0 clipping blocker was identified in the baseline source/test audit. The remaining known target-size and product-gallery RTL issues are isolated in the F19-B backlog.
