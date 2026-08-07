# Reduced Motion Audit

## Contract

F19-A treats `prefers-reduced-motion: reduce` as a capability contract: motion may be removed or shortened, but information, focus order and controls must remain available.

Motion redesign remains owned by F18. This document only records baseline behavior and the permanent regression gate.

## Baseline mechanisms reviewed

### Global CSS safety

`src/styles.css` contains a reduced-motion media query that:

- forces `scroll-behavior: auto`,
- collapses animation duration to `0.01ms`,
- collapses transition duration to `0.01ms`,
- limits animation iteration count to one,
- makes reveal content visible and removes its transform,
- disables marquee animation,
- disables skeleton shimmer animation.

This is a strong global fallback because content does not remain hidden when reveal motion is removed.

### Smooth scrolling

`src/components/SmoothScroll.tsx` checks:

```ts
window.matchMedia("(prefers-reduced-motion: reduce)").matches
```

before dynamically importing Lenis/GSAP/ScrollTrigger. Under reduced motion it returns early, so smooth-scroll interception is not created.

### Scroll reveal

`src/hooks/use-reveal.ts` performs the same media-query guard before dynamically importing GSAP/ScrollTrigger. Reduced-motion users therefore receive the static content without the reveal animation.

### Quick View

`src/components/lbb/ProductQuickView.tsx` includes local animation keyframes and a reduced-motion media rule that disables dialog animation. The global CSS duration clamp is an additional fallback.

### Native / CSS scrolling

The global reduced-motion rule turns smooth CSS scrolling into `auto`. Product Gallery programmatic scrolling can request `smooth`, but the browser/CSS reduced-motion layer is expected to remove visible smooth scrolling where supported. F19-B should keep this behavior intact if the gallery implementation changes.

## Automated gate

`tests/f19-rtl.spec.ts` emulates:

```ts
page.emulateMedia({ reducedMotion: "reduce" })
```

and verifies:

1. the media query is active,
2. Lenis does not appear active on the document/body,
3. a CSS motion probe using the project motion classes has no marquee animation,
4. Quick View dialog animation resolves to `none`,
5. the interaction remains available after motion is removed.

The full Playwright suite also contains earlier reduced-motion use in catalogue/discovery tests, so F19-A adds a direct assertion rather than replacing those tests.

## Homepage / overlay review

Reviewed motion families:

- homepage reveal hooks
- Lenis smooth scroll
- image hover/frame zoom
- marquee
- skeleton loading shimmer
- Navbar background transitions
- Search/Mobile/Mega overlays
- Quick View dialog
- Product Gallery scroll behavior
- Lookbook hover/lightbox transitions

The global CSS guard covers CSS transitions/animations; Lenis and the shared reveal hook have explicit JS opt-outs. No P0/P1 reduced-motion blocker was identified in the baseline audit.

## Remaining F18/F19-B boundary

F19-A does not change easing, animation choreography, duration tokens, homepage storytelling or scroll-driven visual design. If F18 introduces a new JS-driven animation path, it must either:

- opt out before initialization under `prefers-reduced-motion: reduce`, or
- provide a no-motion equivalent that preserves the same content/actions.

The F19 runtime gate should be extended whenever a new high-impact motion surface bypasses the existing global CSS/Lenis/reveal protections.

## Finding status

- P0: none
- P1: none specific to reduced motion
- P2: none currently isolated after the baseline source review
- P3: keep future JS motion additions under the same explicit media-query contract; global CSS alone is not sufficient for scroll engines or imperative animation libraries
