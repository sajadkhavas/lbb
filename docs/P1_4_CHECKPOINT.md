# LBB P1.4 — Regression QA + Frontend Freeze Checkpoint

Current status: **STARTED / NOT CLOSED**

- START_SHA: `3dfc6340a4a204f83d6131ffcc8a35a7719992be`
- Branch: `phase/p1-4-regression-qa-frontend-freeze`
- Tracking issue: #64
- QA matrix: `docs/P1_4_QA_MATRIX.md`
- Production mutation: **NO**

## Current execution order

1. Open a dedicated P1.4 PR so exact-head CI runs against the frozen P1.3 baseline plus P1.4 evidence.
2. Run the complete existing quality suite first, before adding speculative tests or fixes.
3. Inspect any failure and classify it as regression, stale contract, flaky infrastructure or intentional prior delta.
4. Add only missing P1.4 regression coverage that materially strengthens freeze confidence.
5. Re-run exact-head full quality until green.
6. Register final candidate SHA and merge with expected-head protection.
7. Post-merge register `FRONTEND_FREEZE_SHA` and advance Master Handoff.
