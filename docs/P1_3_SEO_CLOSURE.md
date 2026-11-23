# LBB P1.3 — SEO Semantic & Content Polish Closure

Status: **COMPLETED / MERGED / REGISTERED**

## Identity

- Repository: `sajadkhavas/lbb`
- Base branch: `fix/lbb-local-boutique-homepage`
- START_SHA: `1d6fd9170788e9e765c17fc4b29987b87436d283`
- Phase branch: `phase/p1-3-seo-semantic-content-polish`
- Final exact-head pre-merge SHA: `2976daab0caa13d1b288f5da0a217c895f21e3fe`
- Merge SHA: `0e3512858b053ffe81aab05a4b6fe95a1811ca6a`
- Tracking issue: #61
- PR: #62 — **MERGED**
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

- Final exact-head pre-merge Quality Gates:
  - SHA: `2976daab0caa13d1b288f5da0a217c895f21e3fe`
  - Run: `33984114023`
  - Conclusion: **SUCCESS**
- Previous validated implementation run:
  - SHA: `03875bec5b619239c23aa502f1749447b0b14ed4`
  - Run: `33983418418`
  - Conclusion: **SUCCESS**
- Earlier run `33982992361` reached 289/290 tests and failed only on the intentional category desktop visual delta.
- The category actual/diff was manually reviewed before snapshot acceptance.
- Snapshot acceptance commit `8eca10de28a0b159dd18b2e80b5b032e2d680067` changed only `tests/catalog-visual.spec.ts-snapshots/f14-category-desktop-chromium-linux.png`.
- Temporary workflow helpers were absent from the final P1.3 tree.
- PR review threads before merge: **0 open**.
- Merge used `expected_head_sha=2976daab0caa13d1b288f5da0a217c895f21e3fe` to prevent stale-head merge.

## Closure

P1.3 is complete. No production/server activation was performed in this phase. The merged repository state advances the project to the final frontend regression/freeze phase.

## NEXT

`P1.4 — Regression QA + Frontend Freeze`
