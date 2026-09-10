# LBB — Project Master Ledger (FA)

**Authoritative continuation / handoff ledger — مرجع واحد وضعیت نهایی پروژه**  
Created: `2026-09-09`  
Last synchronized checkpoint: `2026-09-10 — FINAL_HANDOFF_POST_REBOOT_PASS`

> در صورت تعارض، Runtime evidence جدیدتر و GitHub exact SHA/PR/CI جدیدتر بر متن قدیمی مقدم‌اند. این سند وضعیت نهایی مهندسی پروژه را ثبت می‌کند. هیچ فاز بسته‌ای بدون drift واقعی نباید تکرار شود.

---

## 1) Final accepted Production identities

### Frontend

- Repo: `sajadkhavas/lbb`
- Operational branch: `fix/lbb-local-boutique-homepage`
- Production URL: `https://lbbclo.com`
- **Final accepted Production SHA:** `d85ae85f8b407b11cf574dfa02416f473f87b736`
- Runtime topology: immutable `releases/current/shared`
- Node runtime: systemd `lbb.service`, listener `127.0.0.1:5173`
- Final runtime preset: `node-server`

Relevant accepted GitHub lineage:

- Final Product UX PR `#88`
  - accepted head: `561b5e4042eafda819e2437d80276ce5410b4229`
  - merge SHA: `3d11cae296e83f30d43cfb4f0d0fd1f89dd36313`
- Final Admin-driven Storefront PR `#90`
  - accepted exact head: `7c6ff6b1292db094859549aa4b8010cf10dfd21e`
  - merge SHA: `f37bd5c2919181c4ea09e9666974d4473aa140cc`
  - accepted source tree = merge tree: `84cf2263c7424ebe179c98e49c533231d5d792a0`
- Documentation closure PR `#91`
  - docs merge SHA / deployed Git identity: `d85ae85f8b407b11cf574dfa02416f473f87b736`
  - tree preserves accepted PR #90 runtime source plus authoritative docs.

### Backend

- Repo: `sajadkhavas/lbb-backend`
- API/Admin: `https://api.lbbclo.com`
- **Final accepted Production SHA:** `8482b6eda370ebe2ca32a674283f67b82eed8629`
- Runtime topology: immutable `releases/current/shared`
- PHP runtime: PHP 8.3 FPM
- Database: MySQL `lbb_prod`
- Public API contract: `2026-09-06-p3-storefront-v1`

Relevant accepted GitHub lineage:

- Final Admin-driven Storefront Controls PR `#29`
  - accepted exact head: `67b6d1166e1e8e563d4d52b208eaec270eca8234`
  - merge SHA: `8482b6eda370ebe2ca32a674283f67b82eed8629`
  - accepted source tree = merge tree: `3602bad03dd1c591ec5cb4a1f09cb5be32d52f1e`

### Commerce lock — intentionally fail-closed

- `CHECKOUT_ENABLED=false`
- `PAYMENT_ENABLED=false`
- `PAYMENT_PROVIDER=disabled`

These values are intentional final handoff state and must remain fail-closed until the separate Zarinpal activation gate is explicitly satisfied.

---

## 2) Final deployment / activation acceptance — CLOSED

Final dependency-ordered cutover completed as:

`BACKEND -> FRONTEND CANARY -> FRONTEND`

Accepted runtime after cutover:

- Frontend: `d85ae85f8b407b11cf574dfa02416f473f87b736`
- Backend: `8482b6eda370ebe2ca32a674283f67b82eed8629`
- Backend Health: PASS
- Backend Ready: PASS
- Storefront bootstrap: PASS
- Content authority: `5/5 PASS`
- Frontend canary on `5187`: PASS
- Origin routes: PASS
- Public edge routes: PASS
- Admin login: PASS
- migrations during final deploy: `NO`
- database mutation during final deploy: `NO`
- checkout/payment/provider remained `false / false / disabled`

Final cutover evidence:

`/var/www/lbb/backend/shared/deploy-evidence/final-deploy-r2-r1-r3-20260909T221351Z`

Accepted classification:

`FINAL_ADMIN_DRIVEN_DEPLOYMENT = DONE / LIVE / EXACT_SHA / POST_CUTOVER_GREEN`

### Important deployment lessons — DO NOT REGRESS

1. Frontend production must build with explicit `NITRO_PRESET=node-server`; auto-detected Cloudflare runtime is not valid for this Node/systemd deployment.
2. Backend candidate config cache must be generated with the shared Production `.env` actually visible; do not produce cached empty DB credentials.
3. New Admin-driven Frontend depends on the new bootstrap shape; during cutover activate and validate Backend before canarying the new Frontend.
4. Never use global `safe.directory`; use scoped `git -c safe.directory=<release>`.
5. Do not edit active release directories.

---

## 3) Required ContentPage authority — CLOSED / DO NOT REDO

Final required public ContentPages:

- `contact`
- `size-guide`
- `terms`
- `privacy`
- `shipping-returns`

The original Production schema uses `public_id` as **ULID / 26 chars**, not UUID. The final reconciliation correctly discovered and used the Production contract.

Accepted result:

- required pages: `5/5`
- four previously missing pages created with ULID-compatible IDs
- `contact` unchanged
- commerce state unchanged
- migrations: `NO`
- release switch during content reconciliation: `NO`
- public page API: all five `HTTP 200`

Evidence:

`/var/www/lbb/backend/shared/deploy-evidence/content-authority-r2-data-b1-r2-20260909T213757Z`

Pre-mutation backup reused by that gate:

`/var/www/lbb/backend/shared/deploy-backups/content-authority-r2-data-b1-r1-20260909T213400Z/lbb-pre-content-authority-20260909T213400Z.sql.gz`

SHA256:

`dfbc352cad8db32702e6ec86f2730a2680c0c5474ab64dc88163ca172d37897e`

Accepted classification:

`REQUIRED_CONTENT_AUTHORITY = DONE / 5_OF_5 / API_GREEN`

---

## 4) Live Admin → Backend → API → SSR acceptance — CLOSED

A reversible presentation-only UAT was executed on `home.ticker` using the same `StoreSetting` authority that Filament `SiteSettings::save()` uses.

The UAT proved:

- Admin/StoreSetting write path: PASS
- Backend bootstrap reflection: PASS
- Frontend SSR reflection: PASS
- exact setting restore: PASS
- UAT marker absent after restore: PASS
- business table counts unchanged: PASS
- live product/content routes: PASS
- checkout/payment remained fail-closed: PASS

Exact restore evidence:

- Prestate SHA256: `313b2c9df91540f90567cb59d836234f8b4510b78088dc4fdda2324e425da045`
- Poststate SHA256: `313b2c9df91540f90567cb59d836234f8b4510b78088dc4fdda2324e425da045`
- Ticker snapshot SHA256: `6be2c41b5c0f238b84628e9f5600576fea6e95d3d6353b512df190e8855a49cb`

Evidence:

`/var/www/lbb/backend/shared/deploy-evidence/live-admin-product-ux-a1-r2-20260910T064746Z`

Accepted classification:

`LIVE_ADMIN_AUTHORITY = PASS / REVERSIBLE / EXACT_RESTORE`

Normal merchant/store maintenance should now be performed through Admin/Backend rather than by editing Frontend source.

---

## 5) Final Product UX acceptance — CLOSED / DO NOT REDO

Accepted live/source contracts include:

- mobile product-card swipe across multiple images;
- accidental PDP navigation suppression after swipe;
- desktop pointer/hover preview;
- Backend-backed Quick View;
- real Backend color/size/product detail in Quick View;
- Product card size labels;
- 2D mannequin contract retained;
- `4:5` product media cards;
- mobile PDP gallery swipe;
- mildly rounded PDP gallery;
- desktop PDP composition polish while preserving mobile behavior.

Live product acceptance included public product slug:

`tyshrt-grafyk-krmz`

Both API product detail and live PDP returned `HTTP 200` during final UAT.

Accepted classification:

`FINAL_PRODUCT_UX = DONE / LIVE / DO_NOT_REDO`

---

## 6) Final recovery backup + disposable restore — CLOSED

Final Production database backup:

`/var/www/lbb/backend/shared/deploy-backups/final-recovery-20260910T065227Z/lbb-production-20260910T065227Z.sql.gz`

- bytes: `100456`
- SHA256: `e86ec54f01d6d02740c5933beb65e06e910edcc5f8cce237277d225ca1d47968`

Final media backup:

`/var/www/lbb/backend/shared/deploy-backups/final-recovery-20260910T065227Z/lbb-media-20260910T065227Z.tar.gz`

- bytes: `605795`
- SHA256: `d7a205acba7197843f8badec42fa05c7228164e0d5edfa3d77bb603ebb1b0d9b`

Recovery acceptance:

- Production DB table count: `70`
- disposable restore table count: `70`
- all table row counts match: `YES`
- disposable restore: `PASS`
- disposable database dropped: `YES`
- Production DB mutation: `NO`
- media file count: `8`
- media manifest SHA256: `bc213e4c03cabddcf073899f717d727be0182671e895ca052b740a371e42534c`
- shared `.env` SHA256: `e774e2ec40f377bba54d1a3124e2e7a1aa887fb391c00ee2e1f3d8564071d25f`
- database counts SHA256: `f4b1a7c2f690733716a9d8c7b0ba69c14ac971379277359f769199800436b264`

Recovery evidence:

`/var/www/lbb/backend/shared/deploy-evidence/final-recovery-reboot-20260910T065227Z`

Accepted classification:

`FINAL_BACKUP_RESTORE = PASS / RECOVERABLE / NO_PRODUCTION_DB_MUTATION`

---

## 7) Final real reboot + persistence acceptance — CLOSED

Exactly one final real server reboot was performed for the handoff gate.

Boot identity proof:

- pre-reboot boot ID: `31af8975-e444-4309-9556-5be84ed67de8`
- post-reboot boot ID: `36663cfb-d167-4259-9eb5-94538546fb25`

Post-reboot acceptance:

- `REAL_REBOOT=PASS`
- Nginx: active
- PHP 8.3 FPM: active
- `lbb.service`: active
- MySQL: active
- Frontend exact SHA persisted: `d85ae85f8b407b11cf574dfa02416f473f87b736`
- Backend exact SHA persisted: `8482b6eda370ebe2ca32a674283f67b82eed8629`
- DB backup integrity: PASS
- Media backup integrity: PASS
- Media persistence: PASS
- shared `.env` persistence: PASS
- database row-count persistence: PASS
- origin routes: PASS
- public edge: PASS
- Storefront bootstrap: PASS
- required ContentPages: `5/5 PASS`
- public product API/PDP: PASS
- Admin login: PASS
- checkout/payment/provider: `false / false / disabled`
- `POST_REBOOT_FINAL_STATUS=PASS`

Evidence:

`/var/www/lbb/backend/shared/deploy-evidence/final-recovery-reboot-20260910T065227Z`

Accepted classification:

`FINAL_REAL_REBOOT = PASS / SERVICE_RECOVERY_GREEN / DATA_PERSISTENCE_GREEN`

---

## 8) Current business truth / provenance boundary

Current catalog snapshot remains:

- Products: `8`
- Categories: `5`
- Orders: `0`
- Customers: `0`
- Inventory reservations: `0`
- Required public ContentPages now included in total content-page state.

The existing eight products remain classified:

`LEGACY_FRONTEND_CATALOG_MIGRATED / OWNER-UNVERIFIED`

This means:

- records are technically valid;
- they are not automatically accepted as genuine/current employer merchandise solely because they exist in Production;
- product names, price, stock, material, sizes and media must ultimately reflect merchant-approved truth;
- use Admin to correct/replace merchandise truth;
- prefer Draft/Inactive over destructive deletion for unverified/sample records when appropriate;
- only genuine published categories/products should be intentionally public/indexable.

This provenance boundary is a business-data handoff condition, not unfinished storefront engineering.

---

## 9) Admin-driven authority now implemented

Normal content/presentation/store maintenance can be controlled from Backend/Admin for:

- brand identity and main copy;
- Hero and Home copy;
- Hero product slug;
- category order / Home presentation;
- ticker;
- trust cards;
- Decision Support;
- Local Store section;
- Featured Collection Story;
- Instagram / Lookbook CTAs;
- public phone / WhatsApp / email / address / map / opening hours;
- global Size Guide content;
- Terms and Privacy content;
- Shipping display through Delivery API;
- Returns policy through Admin setting;
- Enamad display only when verified and complete;
- SEO defaults.

Admin presentation settings **cannot activate real commerce**. Checkout/payment activation remains a separate runtime/config gate.

---

## 10) Shipping production truth

Accepted operational shipping truth remains:

1. `immediate_courier` — Snapp / SnappBox — Tehran + Karaj — freight collect
2. `tipax` — nationwide — 3–7 days — freight collect
3. `decapost` — nationwide — 3–7 days — freight collect
4. `express_post` — compatibility-only / disabled

`feeToman=0` means freight is not collected online; it must not be described as free shipping unless separately verified.

---

## 11) Production schema truth — DO NOT RERUN

Already accepted Production migrations:

- `2026_09_09_020000_add_style_mannequin_profile_to_products_table.php`
- `2026_09_09_120000_extend_categories_for_storefront_taxonomy.php`
- `2026_09_09_123000_create_customer_storefront_state_tables.php`

Final deployment and recovery gates ran **no new migrations**.

Never intentionally rerun these migrations merely to reproduce evidence.

---

## 12) Closed / DO NOT REDO without real drift

The following are closed unless a concrete runtime/code/data drift signal exists:

- F0–F20 Frontend foundation/design/catalog/commerce/editorial/performance/a11y/RTL/SEO
- P1.2 / P1.3 / P1.4 SEO/content/freeze
- P2 Backend final audit/freeze
- P3 Live Integration
- P4/P4-ACT immutable release architecture
- Nginx/TLS/Cloudflare baseline
- Node SSR / PHP-FPM / MySQL health/readiness
- persistent media/shared storage/permissions
- Admin login/role/navigation/UAT
- Shipping production contract/Admin controls
- catalog provenance historical gates
- FC1 mannequin scope
- Final Technical Completion PRs `#87` / Backend `#28`
- Final Product UX PR `#88`
- Final Admin-driven Storefront PR `#90` / Backend `#29`
- required ContentPage reconciliation
- final dependency-ordered deployment
- live Admin authority UAT
- final Product UX acceptance
- final DB/media backup and disposable restore
- final real reboot and post-reboot persistence acceptance

---

## 13) External activation blockers — explicitly outside completed engineering handoff

### Kavenegar / OTP

Still requires merchant-owned production prerequisites such as account/template/API credentials and a real production OTP activation test.

Do not commit or expose credentials in GitHub/chat.

### Zarinpal / payment

Still requires merchant approval/merchant credentials and a separately controlled activation gate.

Until that gate:

- Checkout stays OFF.
- Payment stays OFF.
- Provider stays `disabled`.

### Web Push

May remain disabled when VAPID/public-push prerequisites are absent.

These are external activation dependencies, not a reason to reopen the completed storefront engineering phases.

---

## 14) Final handoff / operational model

Engineering handoff status:

`LBB_STOREFRONT_ENGINEERING = COMPLETE`

Production runtime status:

`PRODUCTION = GREEN / EXACT_SHA / POST_REBOOT_ACCEPTED`

Recovery status:

`RECOVERY = BACKUP_VERIFIED / DISPOSABLE_RESTORE_PASS / PERSISTENCE_PASS`

Admin authority status:

`ADMIN_DRIVEN_STOREFRONT = LIVE / VERIFIED / REVERSIBLE_UAT_PASS`

Commerce status:

`CHECKOUT_PAYMENT = INTENTIONALLY_DISABLED_PENDING_EXTERNAL_ACTIVATION`

Operational rule after handoff:

- routine merchant content/catalog/presentation maintenance should be performed through Admin/Backend;
- do not edit active release source for routine business changes;
- create a new tracked engineering phase/branch only for genuine code/schema/infrastructure changes;
- preserve final backup/evidence directories and immutable accepted releases.

---

## 15) Freeze references

Final freeze refs to be created as part of this documentation closure:

- Frontend: `freeze/lbb-final-handoff-20260910` — points to the final documentation closure commit built from accepted runtime Git identity `d85ae85f8b407b11cf574dfa02416f473f87b736`.
- Backend: `freeze/lbb-final-handoff-20260910` — points to accepted Production Backend `8482b6eda370ebe2ca32a674283f67b82eed8629`.

The Frontend freeze commit may be documentation-only newer than the deployed runtime SHA; that does **not** imply a Production code drift. Production runtime remains the exact accepted SHA recorded in section 1.

---

## 16) FINAL EXACT NEXT

There is no remaining general storefront engineering phase in this handoff.

`EXACT NEXT = NORMAL_ADMIN_OPERATIONS_OR_SEPARATE_EXTERNAL_ACTIVATION_GATE`

Allowed next work is one of:

1. enter/review genuine merchant catalog/content through Admin;
2. supply Kavenegar production prerequisites and run the dedicated OTP activation gate;
3. supply Zarinpal merchant approval/credentials and run the dedicated payment/Checkout activation gate;
4. open a new explicitly scoped engineering phase if a new feature or real defect is discovered.

Do **not** reopen completed deployment, Product UX, SEO, content-authority, recovery, or reboot phases without an actual drift/failure signal.

---

## Final verdict

`PROJECT_FINAL_HANDOFF = DONE`

Subject only to the explicitly documented merchant-owned external activation gates above.
