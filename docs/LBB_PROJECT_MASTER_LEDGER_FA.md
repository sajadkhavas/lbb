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

### Current recovered runtime after C1 rollback
- Frontend `current`: `7148764a98654ed53f08a287a13969a8396d3c28`
- Frontend service: active/running
- Frontend listener: `127.0.0.1:5173`
- Direct frontend HTTP: `200`
- Nginx frontend origin: `200`
- Backend application symlink: rolled back to old release after C1 failure
- Production database: **forward-migrated** with the 3 additive C1 migrations already Ran
- Backend post-rollback ready check: `200`
- Commerce remains fail-closed: checkout=false / payment=false / provider=disabled

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
- C1 successful FE/BE candidate source preparation
- C1 successful Backend composer/package/optimize preparation
- C1 successful database backup + checksum
- C1 successful execution of all 3 additive database migrations
- C1-R1 root-cause diagnosis described below

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
- On the deployment retry, migration status must show these migrations as already `Ran`.
- The retry must not intentionally re-run migration work.

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

### Evidence directory
`/var/www/lbb/backend/shared/deploy-evidence/final-cutover-20260909T135054Z`

### Successful C1 gates
- PRE_FRONTEND: `200`
- PRE_API_READY: `200`
- free disk: ~9 GB
- FE candidate checkout/build: PASS as a build artifact, but built for the wrong Nitro runtime preset
- BE candidate checkout/composer/package discovery/optimize: PASS
- final API route contract: PASS
- commerce fail-closed: PASS
- DB backup + SHA256: PASS
- exact migration delta lock: PASS
- migrations: `3/3 RAN`
- BE atomic activation: PASS
- BE origin health: `200`
- BE origin ready: `200`
- category API contract: PASS

### Failure
- FE target switched into `current` and `lbb.service` restarted.
- `lbb.service` failed the active gate.
- Automatic application rollback restored old FE/BE symlinks.
- A transient FE `502` was observed immediately after rollback; subsequent C1-R1 diagnosis proved full old-FE recovery.

---

## 8) C1-R1 — ROOT CAUSE PROVEN

### Old production FE output
- release: `7148764a98654ed53f08a287a13969a8396d3c28`
- `.output/nitro.json` preset: `node-server`
- entrypoint contains Nitro Node runtime and `serve(...)`
- service listens successfully on `127.0.0.1:5173`

### Failed new FE candidate output
- release/source: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- `.output/nitro.json` preset: `cloudflare-module`
- `.output/server/wrangler.json`: present
- `.wrangler/deploy/config.json`: present
- entrypoint contains Cloudflare module handler/runtime
- isolated direct start on port `5187`: **NO LISTENER**
- process exits cleanly because Cloudflare module output exports a handler instead of starting a Node HTTP listener

### Classification
`FRONTEND_BUILD_RUNTIME_PRESET_MISMATCH / CLOUDFLARE_MODULE_ARTIFACT_DEPLOYED_TO_NODE_SYSTEMD_RUNTIME`

This is **not**:
- Nginx failure
- systemd unit design failure
- database migration failure
- Backend/API failure
- application feature-code regression proven by runtime

### Required repair
Rebuild only the existing FE candidate source `d5014061...` with explicit `NITRO_PRESET=node-server`, preserving production VITE live variables. Then:
1. assert `.output/nitro.json` preset=`node-server`
2. assert Cloudflare/Wrangler runtime artifacts are absent or irrelevant after clean rebuild
3. isolated start as user `lbb` on port `5187`
4. require listener + HTTP 200
5. only then reactivate Backend target `e696375...` without migrations
6. activate FE target `d5014061...`
7. health/identity/fail-closed acceptance

No GitHub source-code patch is required for this incident unless the Node-preset rebuild itself fails.

---

## 9) Employer / Business Truth

- Current 8 catalog records are legacy/sample records, not employer final products.
- Keep samples Draft/Inactive through Admin; do not destructively delete by default.
- Real products must be entered from Admin.
- Only categories with real published products should become public/indexable.
- Header/categories/Hero/social content must remain Admin-driven.
- Checkout and Payment stay OFF until separate external activation gates.

---

## 10) Remaining path to final handoff

1. **C1-R2 Node-preset FE candidate rebuild + isolated 5187 acceptance + bounded activation**
2. Narrow live delta acceptance for changed surfaces only
3. Final GitHub reconciliation / authoritative refs / stale cleanup
4. Enter real employer data from Admin
5. Real-data acceptance
6. Fresh final MySQL backup + checksum + disposable restore
7. Exactly one final real server reboot + post-reboot acceptance
8. Freeze/tag/handoff + close FE #78 / BE #21

---

## 11) External blockers — not code incompleteness

- Kavenegar production credentials/template + real OTP activation
- Zarinpal merchant approval/credentials + controlled payment activation
- Web Push may remain disabled if VAPID is not supplied

---

## 12) Mandatory update protocol

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

## 13) Change Log

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
- FE/BE candidates prepared successfully.
- Pre-migration DB backup created and checksummed.
- All 3 additive migrations successfully ran.
- Backend target activated and passed Health/Ready/API contract.
- Frontend target failed to become active after switch.
- Automatic application rollback executed.
- Schema left forward-compatible; no migration rollback attempted.
- Business data mutation: NO.
- Schema mutation: YES — exactly the 3 additive migrations above.
- Commerce: checkout=false / payment=false / provider=disabled.

### 2026-09-09 — C1-R1 frontend runtime root cause proven
- Old FE fully recovered: service active, listener `5173`, direct HTTP `200`, Nginx origin `200`.
- Old Nitro preset: `node-server`.
- Failed candidate Nitro preset: `cloudflare-module`.
- Failed candidate contained Wrangler/Cloudflare output and no Node listener.
- Isolated candidate start on `5187`: no listener; process exited without startup error because artifact is a Cloudflare handler module.
- Final classification: `FRONTEND_BUILD_RUNTIME_PRESET_MISMATCH`.
- Production config mutation during diagnosis: NO.
- Database mutation during diagnosis: NO.
- **EXACT NEXT:** clean-rebuild only FE candidate `d5014061...` with explicit `NITRO_PRESET=node-server`; prove isolated listener/HTTP on 5187; if PASS, activate already-built BE `e696375...` with migrations untouched, then activate FE and run narrow post-cutover health/identity/fail-closed checks.
