# LBB — P4 Final Registration

> وضعیت: **DONE / MERGED / REGISTERED / PRE-ACTIVATION DEPLOY CANDIDATE / PRODUCTION ACTIVATION PENDING**
>
> تاریخ ثبت: 2026-09-07

## Baselines

- Frontend P3 registration baseline: `44a7263254cb5f8f01db27ac941fa26258f06f44`
- Backend P3 merge baseline: `5a874d66b5d031fd1ab739a4b7bd8b7c04d4acf6`
- Accepted API contract: `2026-09-06-p3-storefront-v1`

## P4 Frontend

- Source branch: `phase/lbb-p4-commerce-go-live`
- Exact source head: `6c57011146c4cf90c5ad337e81b5377b4395044f`
- PR: `#74`
- Merge SHA: `4e572b580a38d4fd28420c8e6d8dd69de945f76d`
- Quality Gates: `34106986013` — PASS
- Live Integration: `34106986019` — PASS
  - `frontend-contract` — PASS
  - `full-quality` — PASS
- Review threads: `0`

## P4 Backend

- Source branch: `phase/lbb-p4-commerce-go-live`
- Exact source head: `57aa03aa8c27ce24263c5abedd6332dec254060c`
- PR: `#20`
- Merge SHA: `0c068df2ea43c8706932a73424014c59a313fc6b`
- Exact-head gate: `34107023080` — PASS
  - SQLite / P3 — PASS
  - Full backend suite — PASS
  - Pint — PASS
  - MySQL regression — PASS
  - Real two-process oversell race — PASS
- Review threads: `0`

## P4 Registration Closure

- Registration branch: `phase/lbb-p4-registration`
- Registration exact head: `433dbc49b55299602c1fd55838200ef8de7dd97c`
- Registration PR: `#76` — MERGED
- Registration merge SHA: `3ea4ee261b8bcf9b9a97372f7de4144b3911784b`
- Registration Quality Gates: `34108910099` — PASS
- Registration Live Integration: `34108910118` — PASS
  - `frontend-contract` — PASS
  - `full-quality` — PASS
- Registration review threads: `0`
- Final registration diff from the P4 frontend merge baseline contained only:
  - `docs/LBB_MASTER_HANDOFF_FA.md`
  - `docs/P4_FINAL_REGISTRATION_FA.md`
- Temporary registration workflow/script were removed before PR #76.
- Master Handoff now records P4 as `DONE / MERGED / REGISTERED` with Production Activation pending.
- Master Handoff `CURRENT NEXT`: `P4-ACT — Controlled Production Deployment & Activation`.

## P4 Commerce Truth

- Inventory reservation: **30 minutes**.
- Official delivery methods:
  - `immediate_courier` — پیک فوری کرج و تهران
  - `tipax` — تیپاکس / پس‌کرایه
  - `decapost` — دکاپست / پس‌کرایه
  - `express_post` — پست پیشتاز
- Live Frontend delivery options are Backend-authoritative.
- Price, inventory, quote, order, reservation and payment state are Backend-authoritative.
- New delivery-method schema is additive and all official methods are disabled by default.
- Legacy `standard` / `pickup` remain compatibility-only in Backend and are not official P4 delivery options.
- Checkout remains fail-closed by default.
- Payment remains fail-closed by default.
- Payment success requires Backend verification.
- API contract remains `2026-09-06-p3-storefront-v1`.

## Production Truth Boundary

P4 code and registration are complete, but this closure **does not claim VPS activation**.

- Production/server mutation during P4 GitHub closure: **NO**
- Production deployment of P4: **NOT EXECUTED**
- Checkout activation: **NO**
- Payment activation: **NO**
- Currently accepted/deployed Production SHA remains the previously recorded Production baseline until a real VPS deployment/acceptance changes it.

## Final Status

**P4 — Commerce Go-Live Code & Deploy Candidate = DONE / MERGED / REGISTERED**

**Production Activation = PENDING / NOT EXECUTED**

The authoritative next runtime phase is **`P4-ACT — Controlled Production Deployment & Activation`**. After real VPS acceptance, the project can advance to **P5 — SEO / Operations / Final Acceptance & Handoff**.
