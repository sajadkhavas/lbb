# LBB — Project Master Ledger (FA)

> **Authoritative project ledger / مرجع واحد ادامه پروژه**
>
> ایجاد: `2026-09-09`
>
> این فایل باید بعد از هر checkpoint مهم، PR/CI/Merge/Deploy/Incident/Acceptance و تغییر `EXACT NEXT` به‌روزرسانی شود.
>
> در صورت تعارض، **Runtime evidence + GitHub exact SHA/PR/CI جدیدتر** بر متن قدیمی مقدم است. فایل‌های `LBB_CURRENT_EXECUTION_STATUS_FA.md` و `LBB_MASTER_HANDOFF_FA.md` منابع تاریخی/Business Truth هستند، اما این Ledger باید وضعیت نهایی و جاری را جمع‌بندی کند.

---

## 1) Repositories / Runtime

### Frontend

- Repo: `sajadkhavas/lbb`
- Production URL: `https://lbbclo.com`
- Operational branch line: `fix/lbb-local-boutique-homepage`
- FC1 accepted merge baseline: `7515d76026abaf4158f2d06b2c42ccc50662193b`
- Final Technical Completion branch: `feature/final-technical-completion`
- Final Technical Completion accepted source SHA: `7435049fcc2336fc744ff6d8d494a048705be5fd`
- Final Technical Completion PR: `#87` — **MERGED**
- Final Technical Completion merge SHA: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- PR #87 base intentionally remained `fix/lbb-local-boutique-homepage`; canonical `main` reconciliation is deferred to the dedicated final GitHub reconciliation gate.

### Backend

- Repo: `sajadkhavas/lbb-backend`
- API/Admin: `https://api.lbbclo.com`
- FC1 mannequin merge baseline: `21218cf34603512ee350da738df92c4bb56aa53d`
- Final Technical Completion branch: `feature/final-technical-completion`
- Final Technical Completion accepted source SHA: `ff05d186de0d92795ac1c16bc53832947a4c91ff`
- Final Technical Completion PR: `#28` — **MERGED**
- Final Technical Completion merge SHA: `e69637548de98681830308291a60777068350bfa`

### Production runtime currently accepted

> این بخش تا زمانی که cutover نهایی انجام نشده عمداً Runtime قبلی را نشان می‌دهد.

- Frontend: `7148764a98654ed53f08a287a13969a8396d3c28`
- Backend: `f0583b5892a4e68a6a05549325399145136f5a3b`
- API contract: `2026-09-06-p3-storefront-v1`
- Checkout: `false`
- Payment: `false`
- Provider: `disabled`

---

## 2) Closed / DO NOT REDO

این موارد بدون drift واقعی دوباره اجرا نشوند:

- F0–F20 Frontend foundation/design/catalog/commerce/editorial/performance/a11y/RTL/SEO
- P1.2 / P1.3 / P1.4 SEO/content/freeze work
- P2 Backend final audit/freeze
- P3 Live Integration
- P4 preactivation/deployment architecture
- P4-ACT immutable `releases/current/shared` topology
- Nginx / TLS / Cloudflare acceptance
- Node SSR / PHP-FPM / MySQL / health / readiness
- persistent media/shared storage + permissions
- Admin login/role/navigation
- Admin dashboard repair + owner UAT
- disk cleanup
- Shipping production contract + Admin configuration
- Admin Catalog/Media/Inventory UAT A1
- Admin Owner Product UAT B1
- Catalog provenance audit
- Content/legal D1/D2
- SEO FINAL E1 coordinated cutover + trusted SSR rate-limit bucket
- E1 permission contract diagnostic/repair
- FC1 2D mannequin Backend PR #27 and Frontend PR #86
- Final Technical Completion Backend PR #28
- Final Technical Completion Frontend PR #87

---

## 3) Employer / Business Truth currently locked

- 8 current catalog records are legacy/sample frontend-origin records; owner rejected them as final employer merchandise.
- Samples must become Draft/Inactive from Admin, not destructively deleted unless a later explicit decision changes this.
- Real employer products are entered manually from Admin.
- Only categories with real published products should be public/indexable.
- Header/category hierarchy must be Admin-driven.
- Home categories use employer-approved icon treatment, not category photos.
- Hero uses employer real store image/content and Admin-controlled data.
- Instagram/Reels/Home social content must be Admin-managed.
- Checkout and Payment remain OFF until separate activation gates.

---

## 4) Final Technical Completion — CLOSED IN GITHUB

### Backend PR #28 — MERGED

Implemented scope:

- three-level category hierarchy with cycle/depth guard
- parent/header/home/icon Admin controls
- additive public taxonomy metadata
- ordered verified `previewImages` (max 3)
- v1 inquiry/contact endpoint support
- privacy-safe public order tracking
- account-backed Cart/Wishlist persistence contracts
- Site Settings repair onto real `StoreSetting`
- Production disabling/removal of unsafe direct file/robots/sitemap editing surfaces
- Launch Readiness Admin surface

Accepted evidence:

- BE accepted source: `ff05d186de0d92795ac1c16bc53832947a4c91ff`
- BE merge SHA: `e69637548de98681830308291a60777068350bfa`
- PR: `#28` — MERGED
- P3 Storefront Integration: PASS before merge
- Review blockers: none at acceptance

New schema for final deploy only:

- `database/migrations/2026_09_09_120000_extend_categories_for_storefront_taxonomy.php`
- `database/migrations/2026_09_09_123000_create_customer_storefront_state_tables.php`

These are additive/reversible and must be applied once during final Backend release activation; old migration/infra procedures must not be repeated without drift evidence.

### Frontend PR #87 — MERGED

Implemented scope:

- live Admin-backed taxonomy hierarchy in desktop/mobile navigation
- Home categories from live taxonomy
- Hero product/control hydration
- live latest-product section
- Product Card desktop hover + mobile swipe using verified preview images
- Contact form wiring to real Backend transport
- privacy-safe Track Order wiring
- account Cart/Wishlist synchronization while preserving anonymous local continuity
- Home social/Lookbook hydration from Admin content
- fail-closed live behavior without prototype leakage
- FC1 2D mannequin remains integrated in Product Card flow

Final accepted evidence:

- FE accepted source: `7435049fcc2336fc744ff6d8d494a048705be5fd`
- FE PR: `#87` — MERGED
- FE merge SHA: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- Quality Gates `#459`: PASS
- P3 Live Integration `#103`: PASS
  - `frontend-contract`: PASS
  - `full-quality`: PASS
- F8-B PWA and Push validation `#55`: PASS
- Review threads: `0`
- Final E2E regression stale-copy remediation was limited to `tests/trust-legal-support.spec.ts`; runtime Contact/Track Order fail-closed behavior was not weakened.
- Temporary Prettier workflow used for exact repo formatting was removed before final accepted head.

---

## 5) Remaining path to final handoff

1. **Controlled immutable Production deploy — narrow only**
   - no re-run of old server phases without drift evidence
   - lock accepted FE/BE source/merge identities
   - inspect only narrow current drift/preflight
   - apply only new required Backend migrations
   - release/switch atomically with rollback
   - keep checkout/payment/provider fail-closed
2. **Narrow live delta acceptance** for changed surfaces only:
   - Home/Hero
   - taxonomy/Header/Home category controls
   - product preview hover/swipe
   - 2D mannequin path
   - Contact
   - Track Order
   - Account Cart/Wishlist continuity
   - Lookbook/Social
   - Admin Site Settings + Launch Readiness
3. **Final GitHub reconciliation**
   - stale PRs/branches/docs
   - preserve freeze/rollback refs
   - canonicalize active state without dragging historical branch divergence
4. **Enter real employer data from Admin**
   - products/media/categories/Hero/FAQ/Terms/Privacy/merchant/social/reels
   - legacy samples Draft/Inactive
5. **Real-data acceptance**
   - no sample leakage
   - Admin/API/Frontend agreement
   - sitemap/schema/indexability truth
6. **Fresh final backup/restore acceptance**
   - MySQL dump with `--no-tablespaces`
   - checksum
   - disposable restore
7. **Exactly one final real server reboot** + post-reboot runtime verification
8. **Freeze/tag/handoff** + ledger finalization + close FE #78 / BE #21

---

## 6) External blockers — not normal code incompleteness

- Kavenegar production credentials/template/account + real OTP activation test.
- Zarinpal merchant approval/credentials + controlled real payment activation.
- Web Push may remain disabled if VAPID is not supplied.

---

## 7) Mandatory update protocol

بعد از هر اقدام مهم باید همین فایل update شود و حداقل این موارد ثبت شوند:

- Date/time
- Gate / Phase / Incident name
- START SHA(s)
- END / accepted SHA(s)
- PR/Issue numbers
- CI workflow/run result
- Production runtime identity if changed
- Data/schema/business mutation: YES/NO
- Commerce state
- Evidence file/hash when applicable
- Classification on failure
- `DO NOT REDO` additions
- `EXACT NEXT`

هیچ مرحله‌ای فقط با عبارت «انجام شد» ثبت نشود؛ SHA/PR/CI/evidence لازم است.

---

## 8) Change Log

### 2026-09-09 — Master Ledger established

- File created because previous docs (`LBB_CURRENT_EXECUTION_STATUS_FA.md`, `LBB_MASTER_HANDOFF_FA.md`) existed but the planned `LBB_PROJECT_MASTER_LEDGER_FA.md` had not actually been created.
- Captured current Production identity, FC1 closure, Final Technical Completion PRs, current CI blocker, remaining handoff path and update protocol.
- Business mutation: NO
- Production mutation: NO
- Commerce: checkout=false / payment=false / provider=disabled

### 2026-09-09 — FE #87 exact Prettier remediation

- Initial Quality failure classification: formatting-only on Final Technical Completion files.
- Exact Prettier output applied with repository locked dependencies.
- Temporary formatting workflows removed after use.
- Server mutation: NO.
- Production mutation: NO.
- Schema/business mutation: NO.
- Commerce: checkout=false / payment=false / provider=disabled.

### 2026-09-09 — Final Technical Completion GitHub closure

- Backend PR `#28`: MERGED.
- BE accepted source: `ff05d186de0d92795ac1c16bc53832947a4c91ff`.
- BE merge SHA: `e69637548de98681830308291a60777068350bfa`.
- Frontend final source before last regression-copy repair reached all build/type/audit gates and 308/310 E2E; the only two failures were stale copy assertions for Prototype Contact and Track Order.
- Those two test assertions were aligned with the current truthful runtime copy without changing runtime behavior.
- Final FE accepted source: `7435049fcc2336fc744ff6d8d494a048705be5fd`.
- Quality Gates `#459`: PASS.
- P3 Live Integration `#103`: PASS.
- F8-B PWA `#55`: PASS.
- Review threads: `0`.
- Frontend PR `#87`: MERGED.
- FE merge SHA: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`.
- Server mutation: NO.
- Production mutation: NO.
- Business data mutation: NO.
- Commerce: checkout=false / payment=false / provider=disabled.
- **EXACT NEXT:** execute only the narrow final Production drift/preflight and immutable cutover for the accepted FE/BE releases, applying only the two new Backend migrations and preserving rollback/fail-closed commerce; do not repeat previously accepted server work without drift evidence.
