# LBB P1.3 — SEO Semantic & Content Polish Closure

Status: **IMPLEMENTED / EXACT-HEAD GATED / READY FOR FINAL MERGE GATE**

## Identity

- Repository: `sajadkhavas/lbb`
- Base branch: `fix/lbb-local-boutique-homepage`
- START_SHA: `1d6fd9170788e9e765c17fc4b29987b87436d283`
- Phase branch: `phase/p1-3-seo-semantic-content-polish`
- Tracking issue: #61
- PR: #62
- Validated implementation head before closure-document reconciliation: `03875bec5b619239c23aa502f1749447b0b14ed4`
- Production mutation: **NO**

## Accepted scope

1. Evidence-backed keyword/search-intent research.
2. Route-by-route intent mapping.
3. Semantic content reconciliation against approved Business Truth.
4. Local SEO reconciliation without keyword stuffing.
5. Title/meta/H1 strategy reconciliation for important routes.
6. FAQ/structured-data reconciliation.
7. Internal-link/anchor audit and category → Size Guide linking.
8. Canonical/filter/indexation/robots/sitemap verification.
9. Duplicate/thin-content review.
10. SSR/head and dedicated SEO regression verification.
11. Full exact-head project quality gate.

## Final semantic policy

- Home: brand + broad streetwear + factual Karaj/local-store context.
- Contact: strong local/navigation/support intent.
- Shop: broad ecommerce discovery without stale wording.
- Categories: transactional product-family intent; no forced geo or unsupported gender template.
- Product detail: only verified product-specific facts.
- FAQ/Size Guide: useful visible support content retained; retired search-feature markup removed.
- Search/filter states: noindex + clean canonical unless a future deliberate SEO landing page is created.

## Technical/search contracts

- `meta keywords`: removed from the active SEO contract.
- Homepage `SearchAction`: removed.
- FAQPage rich-result markup: removed while FAQ content stays visible.
- HowTo markup: removed while sizing guidance stays visible.
- Breadcrumb structured data retained where appropriate.
- Draft/unverified products remain blocked from unsupported Product/Offer publication.
- Sitemap contains canonical/indexable public URLs only.
- Search/filter state indexation protections remain active.

## QA evidence

- Exact-head full gate on `03875bec5b619239c23aa502f1749447b0b14ed4`:
  - Workflow: `Quality gates`
  - Run: `33983418418`
  - Conclusion: **SUCCESS**
- Prior gate `33982992361` reached 289/290 tests and failed only on the intentional category desktop visual delta.
- The category actual/diff was manually reviewed before snapshot acceptance.
- Snapshot acceptance commit `8eca10de28a0b159dd18b2e80b5b032e2d680067` changed only `tests/catalog-visual.spec.ts-snapshots/f14-category-desktop-chromium-linux.png`.
- Temporary implementation/visual helpers were removed before the accepted exact-head gate.
- PR review threads before closure: **0 open**.

## Final closure rule

The documentation-only closure reconciliation moves the PR head beyond the already validated implementation SHA. Therefore a new complete `Quality gates` run must pass on the final PR head after all temporary closure helpers are removed. Only then may PR #62 merge and issue #61 close.

## NEXT

`P1.4 — Regression QA + Frontend Freeze`
