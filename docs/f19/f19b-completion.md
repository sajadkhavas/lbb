# F19-B Completion

F19-B remediates the active Wave-1 accessibility/RTL debt on the accepted Wave 3 baseline.

## Resolved

- P1-002: live checkout custom errors now have stable IDs, `aria-invalid`, `aria-describedby`, and first-error focus. Verified customer mobile remains read-only and is not given a fabricated validation error.
- P1-003: PDP mobile gallery selectors are retained at the already-remediated 44px target and remain covered by regression.
- P1-004: Quick View thumbnails are normalized to 44×44.
- P1-005: the PDP carousel now exposes RTL direction; active-index detection uses element geometry rather than browser-specific RTL `scrollLeft`. ArrowLeft means next, ArrowRight means previous; Home/End are deterministic. Quick View follows the same keyboard/arrow/swipe rule.
- P2-001: Cart Drawer quantity controls are 44×44.
- P2-002: active filter and reset controls are at least 44px high.
- P2-003: Latin identifiers use a bidi-isolated `Identifier` primitive in product metadata surfaces.
- P2-004: small CTAs, FAQ chips and 404 navigation chips are normalized to the 44px project target.
- P3-001: ProductCard announces concise color names at group level instead of count-only semantics.

## RTL carousel rule

In RTL product media, moving visually left advances to the next media item and moving visually right returns to the previous item. Keyboard ArrowLeft/ArrowRight, Quick View arrow controls and swipe direction follow the same rule. Vertical PDP thumbnail navigation keeps ArrowDown=next and ArrowUp=previous.

No accessibility gate is weakened or suppressed.
