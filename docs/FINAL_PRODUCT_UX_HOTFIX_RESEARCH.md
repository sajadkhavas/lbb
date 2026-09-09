# LBB Final Product UX Hotfix — Official References & Decisions

Date: `2026-09-09`

Tracking: Frontend Issue `#78`, Frontend PR `#88`

Production baseline before this hotfix:

- Frontend: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- Backend: `e69637548de98681830308291a60777068350bfa`
- Checkout: `false`
- Payment: `false`
- Provider: `disabled`

This document records the official documentation used for the bounded Product UX recovery. It is an implementation decision log, not a claim of Production acceptance. Production remains unchanged until PR, CI and live acceptance are complete.

## 1. Responsive / Desktop-only PDP polish

Owner requirement:

- current mobile PDP is already good and must be preserved;
- desktop PDP needs spacing, hierarchy, gallery and purchase-panel polish.

Official reference:

- Tailwind CSS — Responsive design: <https://tailwindcss.com/docs/responsive-design>

Official behavior used:

- Tailwind breakpoints are mobile-first;
- unprefixed utilities define the base/mobile behavior;
- `lg:` and `xl:` utilities layer desktop behavior on top.

LBB decision:

- preserve existing unprefixed mobile layout;
- scope new purchase-panel surface, spacing, heading scale and desktop polish to `lg:`/`xl:`;
- do not perform a broad mobile redesign in this hotfix.

Acceptance:

- Playwright checks mobile panel remains without the new desktop border/surface;
- desktop checks the purchase panel becomes a styled sticky surface;
- horizontal overflow must remain absent through the existing PDP suites.

## 2. Product-card full-width media

Owner requirement:

- product image should use the full card-media width rather than remain visually inset.

Official reference:

- Tailwind CSS — object-fit: <https://tailwindcss.com/docs/object-fit>

Official behavior used:

- `object-cover` fills the image container while preserving intrinsic aspect ratio and may crop overflow;
- `object-contain` keeps the whole image visible but may leave unused container space.

LBB decision:

- remove the previous image padding (`p-4 sm:p-7`);
- use a `4/5` product-media frame consistent with garment photography;
- use `object-cover` so the media surface is edge-to-edge in the card;
- never stretch with `object-fill`.

Acceptance:

- computed `object-fit` must equal `cover`;
- computed image padding must be zero;
- rendered image width must match its media frame within one pixel.

## 3. Mobile product-card swipe without accidental PDP navigation

Owner requirement:

- on mobile, swipe product photos on the card before opening product details;
- no extra left/right arrow controls are required on the mobile card.

Official reference:

- Tailwind CSS — touch-action: <https://tailwindcss.com/docs/touch-action>

Official behavior used:

- `touch-pan-y` delegates vertical panning to the browser while allowing the component to handle its horizontal gesture.

LBB decision:

- keep vertical page scrolling native with `touch-pan-y`;
- change image only after a bounded horizontal threshold;
- after a real swipe, suppress the next synthetic media click so the card does not accidentally navigate to the PDP;
- preserve desktop pointer-based preview behavior;
- keep mobile card indicators passive and do not add arrow buttons.

Acceptance:

- live acceptance must use a Backend product with at least two verified preview images;
- a horizontal swipe changes the preview and remains on the listing route;
- a normal tap still opens the product route.

## 4. Quick View as a modal dialog

Owner requirement:

- restore the previous Quick View experience for live Backend products;
- do not remove the old Preview/Eye interaction.

Official reference:

- W3C WAI-ARIA Authoring Practices — Dialog (Modal) Pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>

Official behavior used:

- modal container uses `role="dialog"`;
- modal container uses `aria-modal="true"`;
- dialog receives an accessible name through `aria-labelledby` or `aria-label`;
- Tab/Shift+Tab remain contained in the dialog;
- a visible close control is strongly recommended;
- focus should be restored appropriately after close.

LBB decision:

- keep the existing LBB focus-trap and overlay-history contract;
- use `role="dialog"`, `aria-modal="true"` and a visible labelled title;
- keep Escape/close and trigger-focus restoration;
- route Backend targets to a dedicated Backend Quick View instead of unsafe-casting them to the legacy prototype `Product` model.

Acceptance:

- existing Quick View focus-trap tests remain green;
- live Backend product card exposes an Eye/Preview action and opens a dialog;
- close restores focus without leaving focus in a disconnected overlay.

## 5. Quick View live Backend data fetching

Owner requirement:

- Quick View must show real Backend price, media, sizes, colors and variant availability.

Official reference:

- TanStack Query — Queries: <https://tanstack.com/query/latest/docs/framework/react/guides/queries>
- TanStack Query — `useQuery`: <https://tanstack.com/query/latest/docs/framework/react/reference/functions/useQuery>

Official behavior used:

- a query is a declarative dependency on an asynchronous source;
- the query is identified by a unique key;
- `queryFn` returns a Promise and errors are represented in query state;
- query keys support caching/refetching/sharing.

LBB decision:

- fetch `/api/v1/products/:slug` through the existing contract-checked `getProduct()` client;
- key Quick View detail by `['product-quickview', slug]`;
- map the response through existing `backendDecisionModel()`;
- preserve Backend as price/inventory authority;
- provide explicit loading/error/retry states;
- never fall back to prototype commercial data in live mode.

Acceptance:

- pure contract tests verify size/variant availability mapping;
- live acceptance verifies the modal against an actual published Backend product.

## 6. Quick View / PDP navigation

Owner requirement:

- full details remain one click away from Quick View.

Official reference:

- TanStack Router — Navigation / `<Link>`:
  <https://tanstack.com/router/latest/docs/guide/navigation>

Official behavior used:

- `<Link>` renders a real anchor with a valid `href` while preserving router-aware navigation.

LBB decision:

- use the registered typed `/product/$slug` route rather than manual URL string mutation;
- dismiss the overlay history state before navigating from Quick View.

## 7. Accessible image gallery / carousel

Owner requirement:

- swipe images on mobile;
- maintain usable desktop image controls;
- soften PDP gallery corners without damaging gallery behavior.

Official reference:

- W3C WAI-ARIA Authoring Practices — Carousel Pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/carousel/>

Official behavior used:

- a carousel container can use `role="region"` and `aria-roledescription="carousel"`;
- previous/next controls should be native buttons when present;
- slide selection/control must be keyboard-operable and labelled.

LBB decision:

- retain the existing PDP carousel region and keyboard navigation;
- Backend Quick View gallery uses a labelled carousel region, keyboard arrows/Home/End and native buttons;
- mobile uses swipe and picker indicators; desktop may expose previous/next buttons;
- no auto-rotation is introduced.

## 8. Mildly rounded PDP images

Owner requirement:

- PDP product image should no longer look like a hard square; corners should be slightly softened.

Official reference:

- Tailwind CSS — border-radius: <https://tailwindcss.com/docs/border-radius>

Official behavior used:

- Tailwind exposes bounded radius utilities such as `rounded-xl` and `rounded-2xl`.

LBB decision:

- use a bounded radius on the main gallery and thumbnails;
- avoid `rounded-full` or decorative shapes that would change the product-photography composition.

## 9. Backend sizes on product cards

Owner requirement:

- restore the sizes that used to be visible directly on product cards.

Contract truth:

- `ProductSummaryDto.sizes` already exists in the current Frontend/Backend contract;
- the summary DTO does not expose availability for each size/color combination;
- exact availability exists in Product Detail variants.

LBB decision:

- render Backend summary size labels on the product card;
- treat these card chips as informational;
- do not mark an individual Backend size as available based only on product-level availability;
- exact selectable/sold-out state remains authoritative in Quick View/PDP through `sizeAvailabilityForColor()`.

This avoids inventing stock truth that the summary contract does not provide.

## 10. 2D mannequin

Owner requirement:

- keep the Admin-backed 2D mannequin feature and prove it visibly before final handoff.

Existing accepted architecture:

- Backend FC1 PR `#27` owns mannequin enable/slot/preset/asset/transform data;
- Frontend FC1 PR `#86` fails closed unless a valid mannequin profile is returned.

LBB decision in this hotfix:

- do not duplicate or replace FC1;
- preserve the current fail-closed mannequin toggle;
- Production visibility is a live-data acceptance gate, requiring a controlled product with a valid Admin-backed profile and `mannequin-front` asset.

No product/business data is mutated by PR `#88`.

## 11. Automated acceptance

Official reference:

- Playwright — Assertions: <https://playwright.dev/docs/test-assertions>
- Playwright — Locator assertions: <https://playwright.dev/docs/api/class-locatorassertions>

Official behavior used:

- use retrying web assertions for DOM state;
- use direct assertions for deterministic contract/computed-style values.

Hotfix checks cover:

- Backend sizes are preserved in card mapping;
- Backend cards are valid Quick View targets;
- Product Detail variants preserve exact available/sold-out size state;
- unavailable variants cannot pass cart-selection gating;
- card image has no inset padding and fills the media frame;
- PDP mobile does not inherit the new desktop purchase-panel surface;
- desktop receives the new sticky panel surface;
- PDP gallery radius is non-zero.

## 12. Safety / non-goals

This hotfix must not:

- enable Checkout;
- enable Payment;
- change Payment provider;
- mutate real product/business data;
- re-run Backend migrations already applied;
- replace immutable Production deployment rules;
- redesign unrelated Home, navigation, account or checkout surfaces.

## 13. Required closure evidence

PR `#88` is not accepted until all of the following exist:

1. exact head SHA;
2. Prettier / lint / typecheck / build PASS;
3. existing Quality Gates PASS;
4. P3 Live Integration PASS;
5. focused Product UX tests PASS;
6. review threads = 0;
7. merge SHA recorded;
8. immutable Production release built with explicit Node server runtime;
9. live Backend Quick View acceptance;
10. live multi-image card swipe acceptance;
11. live Backend sizes-on-card acceptance;
12. live PDP mobile + desktop visual acceptance;
13. controlled mannequin visible acceptance when valid Admin product data exists;
14. Issue `#78` + master ledger synchronization.
