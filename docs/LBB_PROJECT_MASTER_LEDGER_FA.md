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
- Current accepted branch SHA after FC1: `7515d76026abaf4158f2d06b2c42ccc50662193b`
- Final Technical Completion branch: `feature/final-technical-completion`
- Latest implementation head before this ledger update: `0ce7e46be1ad6e5a729fb2246b17ff8e6f669c47`
- Open Final Technical Completion PR: `#87`
- PR #87 base is intentionally `fix/lbb-local-boutique-homepage`; canonical `main` reconciliation is deferred to final GitHub reconciliation.

### Backend
- Repo: `sajadkhavas/lbb-backend`
- API/Admin: `https://api.lbbclo.com`
- Backend main after FC1 mannequin merge: `21218cf34603512ee350da738df92c4bb56aa53d`
- Final Technical Completion branch: `feature/final-technical-completion`
- Current Final Technical Completion head: `ff05d186de0d92795ac1c16bc53832947a4c91ff`
- Open Final Technical Completion PR: `#28`

### Production runtime currently accepted
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

## 4) Final Technical Completion — current scope

### Backend PR #28
Implemented scope includes:
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

Last known exact-head acceptance:
- BE head: `ff05d186de0d92795ac1c16bc53832947a4c91ff`
- P3 Storefront Integration: PASS

### Frontend PR #87
Implemented scope includes:
- live Admin-backed taxonomy hierarchy in desktop/mobile navigation
- Home categories from live taxonomy
- Hero product/control hydration
- live latest-product section
- Product Card desktop hover + mobile swipe using verified preview images
- Contact form wiring
- Track Order wiring
- account Cart/Wishlist synchronization while keeping anonymous local continuity
- Home social/Lookbook hydration from Admin content
- fail-closed live behavior without prototype leakage

Current remediation state:
- Initial FE head `0e33226ff8faafd84c9063d0d7228e527518d711` failed Quality only at `prettier --check` before build/typecheck/e2e.
- Exact 10-file Prettier output was generated with the repository's own locked dependencies.
- Temporary formatting workflow was self-removed after applying output.
- Formatted implementation head: `0ce7e46be1ad6e5a729fb2246b17ff8e6f669c47`.
- A normal ledger commit is used to trigger fresh PR CI because `GITHUB_TOKEN`-authored pushes do not trigger the required downstream workflows normally.
- PR #87 remains **NOT MERGED** until exact-head Quality/PWA/P3 acceptance is green.

---

## 5) Remaining path to final handoff

1. Rerun exact-head FE #87 Quality/PWA/P3 integration after Prettier remediation.
2. Zero review threads and merge FE #87 / BE #28 only on accepted exact heads.
3. Controlled immutable Production deploy with rollback and commerce fail-closed lock.
4. Narrow live delta acceptance for changed surfaces only.
5. Final GitHub reconciliation: stale PRs/branches/docs; preserve freeze/rollback refs; canonicalize active state.
6. Enter real employer data from Admin: products, media, categories, Hero, FAQ, Terms, Privacy, merchant content, social/reels.
7. Real-data acceptance: no sample leakage; Admin/API/Frontend agreement; sitemap/schema/indexability truth.
8. Fresh final MySQL backup using `mysqldump --no-tablespaces` + checksum + disposable restore.
9. Exactly one real final server reboot and post-reboot service/runtime/media/admin verification.
10. Final freeze/tag/handoff, ledger finalization, close FE #78 and BE #21.

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
- START implementation head: `0e33226ff8faafd84c9063d0d7228e527518d711`.
- Initial Quality failure classification: `FORMAT_ONLY / 10_FILES / BUILD_TYPECHECK_E2E_NOT_REACHED`.
- Temporary artifact run: `34351827376` — SUCCESS.
- Exact Prettier apply source commit: `0ce7e46be1ad6e5a729fb2246b17ff8e6f669c47`.
- Temporary workflow removed from branch after use.
- Server mutation: NO.
- Production mutation: NO.
- Schema/business mutation: NO.
- Commerce: checkout=false / payment=false / provider=disabled.
- **EXACT NEXT:** accept the new normal GitHub-authored ledger head through Quality/PWA/P3; if green, check review threads and merge FE #87 and BE #28 with exact-head locks.
