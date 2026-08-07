# F19-A — Accessibility / RTL / Interaction Audit Gates

## Scope

F19-A turns accessibility, RTL, keyboard, touch, zoom and reduced-motion checks into repeatable regression gates. It intentionally does **not** redesign shared production components in Wave 1.

Baseline:

- branch: `phase/f14c-production-content-product-data`
- SHA: `9c4e8b78d53bd861f9e529773da9b9645fc9be15`
- F19-A branch: `phase/f19a-accessibility-rtl-audit`

Primary ownership in this branch:

- `tests/`
- `scripts/audit-a11y.mjs`
- `docs/f19/`

Shared UI defects that require component work are recorded in `f19b-remediation-backlog.md` instead of being silently redesigned here.

## Commands

```bash
npm run audit:a11y
npm run test:a11y
npm run test:rtl
npm run test:e2e
npm run quality
```

`npm run quality` includes the static F19 audit guard and the complete Playwright suite. `test:e2e` therefore executes the F19 runtime gates without duplicating them as a second CI pass.

## Automated gates added

### Axe

`tests/accessibility.spec.ts` covers every required production route family, representative dynamic routes, invalid dynamic routes, the generic 404, navigation overlays, filter drawer, Quick View, size guide and lookbook lightbox.

Blocking threshold:

- `0 critical`
- `0 serious`

No Axe rule is globally disabled and no Axe false-positive suppression is present in F19-A. Any future suppression must be targeted, documented with a route/component/reason and reviewed together with this audit gate.

### Keyboard / focus / semantics / forms

`tests/f19-interactions.spec.ts` covers:

- Tab / Shift+Tab focus containment
- Escape
- Arrow keys
- Home / End where applicable
- focus entry and restoration
- route-change orphan-focus guard
- FAQ disclosure keyboard behavior
- one `main` landmark and one H1 across major route families
- checkout label / required / autocomplete contracts
- explicit expected regression cases for known F19-B debt

### RTL / touch / zoom / text spacing / reduced motion

`tests/f19-rtl.spec.ts` covers:

- RTL document direction
- horizontal overflow at `390`, `768`, `1440`, `1920`
- explicit mixed-direction islands
- critical 44px mobile touch targets
- known undersized target characterization
- `prefers-reduced-motion: reduce`
- Lenis inactivity under reduced motion
- Quick View animation suppression
- zoom-permitting viewport metadata
- WCAG text-spacing stress at mobile width

### Static audit guard

`scripts/audit-a11y.mjs` prevents accidental removal of:

- mandatory route Axe coverage
- F19 keyboard/focus contract tokens
- the four required viewport widths
- reduced-motion and text-spacing coverage
- required F19 documentation
- the `test:a11y`, `test:rtl`, `audit:a11y` package commands
- `audit:a11y` from the `quality` chain

F19 runtime tests may not use `test.skip()` or `test.fixme()`. Known unresolved defects use **named expected-failure regression cases** tied to F19-B IDs so the debt remains executable and visible.

## Audit model

Each finding uses:

- **P0** — blocks a core task or constitutes serious accessibility failure
- **P1** — high-impact accessibility / RTL / interaction defect
- **P2** — moderate defect or limited-scope usability issue
- **P3** — polish / robustness issue

The audit separates two concepts:

1. **Blocking Axe quality** — must remain zero serious/critical.
2. **Known interaction debt** — may remain in F19-A when remediation would touch shared production UI; it must have a severity, file/route, F19-B ID and executable characterization where practical.

## Documents

- `route-a11y-matrix.md` — production route inventory and required checks
- `keyboard-matrix.md` — keyboard / focus interaction matrix
- `rtl-audit.md` — RTL, bidi, arrows, carousel and drawer audit
- `touch-zoom-audit.md` — mobile touch, zoom and WCAG text-spacing audit
- `reduced-motion-audit.md` — reduced-motion contract and coverage
- `f19b-remediation-backlog.md` — prioritized remediation backlog

## Wave-1 overlap policy

F19-A does not change Trust/Legal copy owned by F14E, SEO helpers owned by F20-A, backend/domain contracts, product data models, Design System 3.0, cart/checkout engines or the motion system owned by F18.

Production source changes are intentionally avoided unless a failure can be fixed with an isolated, low-conflict semantic patch. Findings in shared Navbar, Product Gallery, filters, Quick View, Cart and checkout behavior are therefore routed to F19-B.
