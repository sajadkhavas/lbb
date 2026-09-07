# LBB — P4 Final Registration

> وضعیت: **MERGED CODE / PRE-ACTIVATION DEPLOY CANDIDATE / REGISTERING**
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

P4 code is merged and is a deploy candidate, but this registration **does not claim VPS activation**.

- Production/server mutation: **NO**
- Production deployment of P4: **NOT EXECUTED**
- Checkout activation: **NO**
- Payment activation: **NO**
- Currently accepted/deployed Production SHA remains the previously recorded Production baseline until a real VPS deployment/acceptance changes it.

## Status

After this registration PR is green and merged, the authoritative status is:

**P4 — Commerce Go-Live Code & Deploy Candidate = DONE / MERGED / REGISTERED**

while actual Production activation remains a separate runtime operation.
