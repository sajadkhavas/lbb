# Wave 1 — Supervisor Registration

Registration date: 2026-08-07

## Frozen input baseline

Frontend baseline: `phase/f14c-production-content-product-data@9c4e8b78d53bd861f9e529773da9b9645fc9be15`.

## Reviewed frontend workstreams

- F14E — `phase/f14e-trust-legal-support@eaed3255703eeee376cc1ef643015d4b987bff05` — Draft PR #38.
- F19-A — `phase/f19a-accessibility-rtl-audit@cf5faf29bee684d144dab658acc7b74f2281504d` — Draft PR #39.
- F20-A — `phase/f20a-seo-ia-contract@4a3c0c924fbe1643aa8f60aae7036dae5ff10038` — Draft PR #40.

Each source branch passed its own GitHub quality workflow before supervisor integration.

## Backend dependency reviewed separately

F14-BE-C is registered in `sajadkhavas/lbb-backend` Draft PR #2. During supervisor review two real regressions were corrected before acceptance: explicit `product_evidences` model/table mapping and an isolated Sanctum stateful-domain CI contract for the existing OTP tests. The final backend branch also uses a phase-scoped Pint gate instead of charging inherited formatting debt to BE-C.

Final reviewed backend head: `phase/f14-be-c-apparel-domain@025066720c2790f143612b21e19c78cbbca2dd73`.

## Supervisor overlap resolution

The three frontend branches intentionally shared the same F14C base. Their production ownership stayed separate. The only integration-level overlaps were:

1. `scripts/smoke-production.mjs` — the F20-A implementation is retained because it is the superset: it pins the local Wrangler smoke compatibility date while allowing an environment override.
2. `package.json` — F19-A accessibility/RTL scripts and audit gate are retained together with F20-A `test:seo`. The unrelated F19-A `tw-animate-css` manifest bump is intentionally not carried into integration because no lockfile change or accessibility requirement justified it.

No source PR is merged by this registration. This integration branch is a review artifact and a candidate baseline for the next wave only after its combined quality workflow passes.

## Deferred intentionally

- F19-B: remediation backlog that requires broader production-component changes.
- F20-B: backend-fed/dynamic SEO data, sitemap publication feed, redirect history, and production data integration.
- F14-BE-D: public commerce/API contract freeze.
- Production backend/frontend integration remains out of Wave 1 scope.

## Merge policy

No merge to `main` is performed by this registration.
