# F18 — Motion & Performance Polish

Baseline: `integration/wave4-reviewed@45a210b3c1e049d4640bf0feffdac23b56fb596b`.

## Scope

F18 is a finish-mode performance pass. It does not redesign the storefront, add choreography, or introduce a new animation library.

## Completed

- Removed the disconnected legacy motion stack (`SmoothScroll`, `CustomCursor`, `MagneticButton`, legacy `BestSellers`/`HeroSplit`, and `useReveal`).
- Removed the unused `gsap`, `lenis`, and `motion` production dependencies and their lockfile entries.
- Preserved native browser scrolling as required by the accepted homepage performance contract.
- Kept the existing global `prefers-reduced-motion` safety contract intact.
- Hardened the active homepage ticker so its continuous animation is paused by default, runs only while near/in the viewport, pauses while the document is hidden, and remains visually static for reduced-motion users.
- Added a permanent source audit and focused Playwright regression for the F18 contract.

## Performance boundary

F18 deliberately does not activate smooth scrolling, custom cursors, magnetic pointer effects, GSAP, Lenis, or Motion. Focus-management `requestAnimationFrame` calls remain because they schedule accessibility state after DOM updates rather than drive continuous visual animation.

## Acceptance

F18 is acceptable only when its dedicated workflow, the inherited F19 reduced-motion/RTL regression, production bundle audit, and global Quality suite all pass on the same final head.
