# LBB P1.4 — Regression QA + Frontend Freeze Matrix

Status: **IN PROGRESS**

## Identity

- Repository: `sajadkhavas/lbb`
- Base branch: `fix/lbb-local-boutique-homepage`
- START_SHA: `3dfc6340a4a204f83d6131ffcc8a35a7719992be`
- Phase branch: `phase/p1-4-regression-qa-frontend-freeze`
- Tracking issue: #64
- Production mutation: **NO**

## Freeze principle

P1.4 is regression/freeze work, not redesign. Only demonstrated regressions or acceptance gaps may change runtime behavior. Snapshot changes require review of actual/diff evidence before acceptance.

## Existing project-wide quality gate

`npm run quality` already chains:

- Prettier check
- ESLint
- production build
- TypeScript typecheck
- production dependency audit
- production artifact audit
- brand/store-settings/product-evidence/source/SEO/a11y/remediation/continuity/motion audits
- production smoke
- full Playwright E2E suite

## Acceptance matrix

| Area               | Existing evidence/coverage                                                                                                                       | P1.4 acceptance rule                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Responsive/layout  | `tests/all-routes.spec.ts` checks route rendering, RTL, one H1 and horizontal overflow; catalog/PDP visual suites include representative layouts | Key storefront routes must render without horizontal overflow and representative mobile/desktop contracts must pass                                          |
| Accessibility      | `tests/accessibility.spec.ts`, F15/F17/F19 accessibility suites, `@axe-core/playwright`, static a11y audit                                       | No serious/critical Axe violations on covered templates; focus return/keyboard/dialog contracts remain green; reduced-motion behavior green                  |
| SSR/hydration      | production Node/Nitro build + smoke + route reload/runtime-error coverage + SEO SSR/head contracts                                               | Server-built app must boot; SSR/head content must be present; pageerror/console hydration regressions must remain absent on route matrix                     |
| Performance/motion | production audit/build plus `tests/f18-motion-performance.spec.ts` and motion audit                                                              | Reduced-motion, viewport-scoped ticker work and existing runtime/bundle contracts must remain green; no new performance regression accepted without evidence |
| SEO                | P1.3 dedicated tests, SEO/PWA contracts, source/F20B audits                                                                                      | P1.3 title/meta/canonical/noindex/schema/robots/sitemap/SSR-head decisions must not regress                                                                  |
| Core storefront    | all-routes, catalog discovery, PDP decision, commerce continuity, interactions, navigation and checkout-preview suites                           | Home/shop/category/product/cart/checkout/account/content/navigation behavior must remain green in prototype mode                                             |
| Visual             | catalog/PDP/full visual snapshot suites                                                                                                          | Every snapshot passes; any delta must be reviewed before baseline update                                                                                     |
| Build/security     | build, typecheck, npm production audit, production/source audits                                                                                 | All exact-head quality stages SUCCESS                                                                                                                        |

## Final freeze evidence required

- Exact final candidate SHA
- Full `Quality gates` run ID + SUCCESS
- 0 open review threads/blockers
- `FRONTEND_FREEZE_SHA` explicitly registered after merge/closure
- Master Handoff advanced from P1.4 to the next approved phase
