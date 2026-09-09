# LBB — Project Master Ledger (FA)

> **Authoritative project ledger / مرجع واحد ادامه پروژه**
>
> ایجاد: `2026-09-09`
>
> بعد از هر checkpoint مهم، PR/CI/Merge/Deploy/Incident/Acceptance و تغییر `EXACT NEXT` باید همین فایل به‌روزرسانی شود.
>
> در صورت تعارض، **Runtime evidence + GitHub exact SHA/PR/CI جدیدتر** بر متن قدیمی مقدم است.

---

## 1) Repositories / accepted code

### Frontend
- Repo: `sajadkhavas/lbb`
- Operational branch line: `fix/lbb-local-boutique-homepage`
- FC1 merge baseline: `7515d76026abaf4158f2d06b2c42ccc50662193b`
- Final Technical Completion accepted source: `7435049fcc2336fc744ff6d8d494a048705be5fd`
- PR `#87`: **MERGED**
- Final Technical Completion merge SHA: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- Quality Gates `#459`: PASS
- P3 Live Integration `#103`: PASS
- PWA `#55`: PASS
- Review threads: `0`

### Backend
- Repo: `sajadkhavas/lbb-backend`
- FC1 mannequin merge baseline: `21218cf34603512ee350da738df92c4bb56aa53d`
- Final Technical Completion accepted source: `ff05d186de0d92795ac1c16bc53832947a4c91ff`
- PR `#28`: **MERGED**
- Final Technical Completion merge SHA: `e69637548de98681830308291a60777068350bfa`
- P3 Storefront Integration: PASS before merge
- Review blockers: none

---

## 2) Current Production identity

### Before C1 attempt
- Frontend: `7148764a98654ed53f08a287a13969a8396d3c28`
- Backend: `f0583b5892a4e68a6a05549325399145136f5a3b`
- API contract: `2026-09-06-p3-storefront-v1`
- Checkout: `false`
- Payment: `false`
- Provider: `disabled`

### C1 failed activation state
- C1 target FE: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- C1 target BE: `e69637548de98681830308291a60777068350bfa`
- Application symlinks were automatically rolled back to the previous releases after FE activation failure.
- Backend post-rollback ready check: `200`.
- Frontend origin immediately after rollback returned `502` even though `lbb.service` printed `active`; this is the active incident requiring narrow diagnosis before any retry.
- Do **not** assume frontend rollback is fully healthy until listener/journal/origin are re-verified.

---

## 3) Closed / DO NOT REDO

Without real drift evidence, do not repeat:

- F0–F20 Frontend foundation/design/catalog/commerce/editorial/performance/a11y/RTL/SEO
- P1.2 / P1.3 / P1.4 SEO/content/freeze
- P2 Backend final audit/freeze
- P3 Live Integration
- P4 / P4-ACT release architecture
- Nginx / TLS / Cloudflare acceptance
- Node SSR / PHP-FPM / MySQL baseline acceptance
- persistent media/shared storage + permissions
- Admin login/role/navigation and owner UAT
- Shipping production contract/Admin configuration
- catalog provenance/content/legal/SEO E1 historical gates
- FC1 2D mannequin PR #27 / PR #86
- Final Technical Completion Backend PR #28
- Final Technical Completion Frontend PR #87
- P0 exact deployment contract discovery from `2026-09-09`
- C1 successful build preparation and successful database migration execution

---

## 4) Final Technical Completion scope — CLOSED IN GITHUB

### Backend
- three-level category hierarchy with cycle/depth guard
- parent/header/home/icon Admin controls
- additive public taxonomy metadata
- verified ordered `previewImages` max 3
- v1 Inquiry/Contact
- privacy-safe public Track Order
- account-backed Cart/Wishlist persistence
- Site Settings repair on `StoreSetting`
- unsafe File/Robots/Sitemap editor production access disabled
- Launch Readiness Admin page
- FC1 mannequin contract and Admin data

### Frontend
- live Admin-backed taxonomy hierarchy desktop/mobile
- Home categories from live taxonomy
- Admin Hero/product hydration
- live latest products
- product desktop hover + mobile swipe preview images
- Contact wired to Backend
- Track Order wired to Backend
- account Cart/Wishlist sync with anonymous local continuity
- Home Lookbook/Social hydration
- fail-closed live behavior without prototype leakage
- FC1 mannequin ProductCard integration

---

## 5) Schema truth after C1

Exactly **3 new migrations** existed between old Production backend `f0583...` and target `e696375...`:

1. `2026_09_09_020000_add_style_mannequin_profile_to_products_table.php`
2. `2026_09_09_120000_extend_categories_for_storefront_taxonomy.php`
3. `2026_09_09_123000_create_customer_storefront_state_tables.php`

### C1 result
All 3 migrations were executed successfully on Production DB:
- mannequin product columns: RAN
- category hierarchy/header/home controls: RAN
- customer cart/wishlist tables: RAN

These migrations are additive/backward-compatible with the old application release. Therefore:
- **DO NOT run `migrate:rollback` manually.**
- Application rollback does not require schema rollback.
- On the next deployment retry, migration status should show these migrations as already `Ran`; they must not be treated as pending again.

---

## 6) C1 pre-migration backup evidence

- Backup file:
  `/var/www/lbb/backend/shared/deploy-backups/final-cutover-20260909T135054Z/lbb-pre-final-cutover-20260909T135054Z.sql.gz`
- SHA256:
  `e38eaa11bf2d5c9d1227dd6cf54db0fa8fc00eb41830e0fbec12d9029b69e442`
- gzip validation: PASS
- `mysqldump --no-tablespaces`: used

This is a cutover safety backup, not the final handoff backup/restore acceptance.

---

## 7) C1 — Final Production Cutover incident

### Timestamp / evidence
- Run evidence dir:
  `/var/www/lbb/backend/shared/deploy-evidence/final-cutover-20260909T135054Z`

### Successful gates
- PRE_FRONTEND: `200`
- PRE_API_READY: `200`
- free disk: ~9 GB
- FE candidate checkout/build: PASS
- BE candidate checkout/composer/package discovery/optimize: PASS
- final new API route contract: PASS
- commerce fail-closed: PASS
  - Checkout `false`
  - Payment `false`
  - Provider `disabled`
- DB backup + SHA256: PASS
- exact migration delta lock: PASS
- migrations: `3/3 RAN`
- BE atomic activation: PASS
- BE origin health: `200`
- BE origin ready: `200`
- category API contract: PASS

### Failure
- FE atomic activation switched `current` to target and restarted `lbb.service`.
- Gate failed at `systemctl is-active --quiet lbb.service` after switch.
- Classification at this point: `FRONTEND_RUNTIME_START_FAILURE_AFTER_SWITCH / ROOT_CAUSE_NOT_YET_PROVEN`.

### Automatic rollback
- FE `current` -> old release attempted: YES
- BE `current` -> old release attempted: YES
- Backend after rollback ready: `200`
- Frontend origin immediately after rollback: `502`
- Schema auto rollback: intentionally NOT attempted
- Old releases preserved: YES

### Safety rule
Do not retry C1, rebuild candidates, edit Nginx, modify TLS/Cloudflare, or rollback DB schema until the current FE 502/start failure is diagnosed from systemd journal + listener + exact current symlink.

---

## 8) Employer / Business Truth

- Current 8 catalog records are legacy/sample records, not employer final products.
- Keep samples Draft/Inactive through Admin; do not destructively delete by default.
- Real products must be entered from Admin.
- Only categories with real published products should become public/indexable.
- Header/categories/Hero/social content must remain Admin-driven.
- Checkout and Payment stay OFF until separate external activation gates.

---

## 9) Remaining path to final handoff

1. **C1-R1 narrow frontend runtime incident diagnosis/recovery**
2. Resume/retry only the failed frontend activation portion if diagnosis proves candidate/runtime contract repair; backend schema is already migrated
3. Narrow live delta acceptance for changed surfaces only
4. Final GitHub reconciliation / authoritative refs / stale cleanup
5. Enter real employer data from Admin
6. Real-data acceptance
7. Fresh final MySQL backup + checksum + disposable restore
8. Exactly one final real server reboot + post-reboot acceptance
9. Freeze/tag/handoff + close FE #78 / BE #21

---

## 10) External blockers — not code incompleteness

- Kavenegar production credentials/template + real OTP activation
- Zarinpal merchant approval/credentials + controlled payment activation
- Web Push may remain disabled if VAPID is not supplied

---

## 11) Mandatory update protocol

After every important action record:
- date/time
- gate/incident
- START/END/accepted SHA
- PR/Issue
- CI/run/evidence
- Production runtime identity if changed
- schema/business mutation YES/NO
- commerce state
- failure classification
- DO NOT REDO additions
- `EXACT NEXT`

Never mark a phase Done without SHA/evidence.

---

## 12) Change Log

### 2026-09-09 — Master Ledger established
- Authoritative continuation ledger created.
- Production mutation: NO.

### 2026-09-09 — Final Technical Completion GitHub closure
- BE PR #28 merged at `e69637548de98681830308291a60777068350bfa`.
- FE PR #87 merged at `d5014061c1a933fd4078acc38b8fa21c5c8f628c`.
- FE Quality #459 / P3 #103 / PWA #55: PASS.
- Production mutation: NO.

### 2026-09-09 — P0 exact deployment contract
- Runtime confirmed old FE `7148764...` / BE `f0583...`.
- Services/permissions/Nginx/shared env/health matched accepted topology.
- Exact pending target schema identified as 3 migrations.

### 2026-09-09 — C1 final cutover attempt / rollback incident
- FE/BE immutable candidates built successfully.
- Pre-migration DB backup created and checksummed.
- All 3 additive migrations successfully ran.
- Backend target activated and passed Health/Ready/API contract.
- Frontend target failed to become active after switch.
- Automatic application rollback executed.
- Backend rollback state ready=200.
- Frontend origin after rollback returned 502 despite service being reported active.
- Schema left forward-compatible; no migration rollback attempted.
- Business data mutation: NO.
- Schema mutation: YES — exactly the 3 additive migrations above.
- Commerce: checkout=false / payment=false / provider=disabled.
- **EXACT NEXT:** run a narrow read-only C1-R1 frontend diagnosis: current symlink/SHA, `lbb.service` detailed state, PID/process, port 5173 listener, recent journal from cutover time, candidate vs old entrypoint permission/readability. Recover old frontend first if needed; do not retry cutover or change Nginx/schema before root cause is proven.
