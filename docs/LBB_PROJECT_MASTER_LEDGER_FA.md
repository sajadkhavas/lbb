# LBB — Project Master Ledger (FA)

**Authoritative continuation ledger / مرجع واحد ادامه پروژه**  
Created: `2026-09-09`  
Last synchronized checkpoint: `2026-09-09 — FINAL_ADMIN_DRIVEN_PRE_DEPLOY_ACCEPTED`

در صورت تعارض، Runtime evidence و GitHub exact SHA/PR/CI جدیدتر بر متن قدیمی مقدم‌اند. هیچ مرحله‌ای بدون evidence واقعی `DONE` محسوب نمی‌شود.

---

## 1) Current accepted identities

### Frontend

- Repo: `sajadkhavas/lbb`
- Operational branch: `fix/lbb-local-boutique-homepage`
- Production URL: `https://lbbclo.com`
- **Current Production SHA before final deployment:** `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- Final Product UX PR: `#88` — MERGED / DO NOT REDO
  - accepted head: `561b5e4042eafda819e2437d80276ce5410b4229`
  - merge SHA: `3d11cae296e83f30d43cfb4f0d0fd1f89dd36313`
- Final Admin-driven Storefront PR: `#90` — MERGED
  - accepted exact head: `7c6ff6b1292db094859549aa4b8010cf10dfd21e`
  - merge SHA: `f37bd5c2919181c4ea09e9666974d4473aa140cc`
  - accepted source tree = merge tree: `84cf2263c7424ebe179c98e49c533231d5d792a0`

### Backend

- Repo: `sajadkhavas/lbb-backend`
- API/Admin: `https://api.lbbclo.com`
- **Current Production SHA before final deployment:** `e69637548de98681830308291a60777068350bfa`
- Final Admin-driven Storefront Controls PR: `#29` — MERGED
  - accepted exact head: `67b6d1166e1e8e563d4d52b208eaec270eca8234`
  - merge SHA: `8482b6eda370ebe2ca32a674283f67b82eed8629`
  - accepted source tree = merge tree: `3602bad03dd1c591ec5cb4a1f09cb5be32d52f1e`
- Public API contract remains additive/backward-compatible: `2026-09-06-p3-storefront-v1`

### Commerce lock

- `checkout.enabled=false`
- `payment.enabled=false`
- `provider=disabled`

These values must stay fail-closed until separate external activation gates are explicitly satisfied.

---

## 2) Closed / DO NOT REDO without real drift

- F0–F20 frontend foundation/design/catalog/commerce/editorial/performance/a11y/RTL/SEO
- P1.2 / P1.3 / P1.4 SEO/content/freeze
- P2 Backend final audit/freeze
- P3 Live Integration
- P4/P4-ACT immutable `releases/current/shared` architecture
- Nginx/TLS/Cloudflare baseline
- Node SSR/PHP-FPM/MySQL health/readiness baseline
- persistent media/shared storage/permissions
- Admin login/role/navigation/UAT
- Shipping production contract/Admin controls
- catalog provenance/content/legal/SEO historical gates
- FC1 Backend PR #27 / Frontend PR #86
- Final Technical Completion Backend PR #28 / Frontend PR #87
- Final Product UX PR #88
- Final Admin-driven Storefront Frontend PR #90
- Final Admin-driven Storefront Backend PR #29
- already-applied additive Backend migrations listed below

Never intentionally re-run accepted migrations, shipping work, Product UX work, or Admin-driven wiring solely to reproduce evidence.

---

## 3) Previously deployed Final Technical Completion

### Frontend PR #87

- accepted source: `7435049fcc2336fc744ff6d8d494a048705be5fd`
- deployed runtime SHA: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- Quality #459 PASS
- P3 Live Integration #103 PASS
- PWA #55 PASS
- review threads 0

### Backend PR #28

- accepted source: `ff05d186de0d92795ac1c16bc53832947a4c91ff`
- deployed runtime SHA: `e69637548de98681830308291a60777068350bfa`

This pair remains Production until the final combined deployment described in `EXACT NEXT`.

---

## 4) Production schema / cutover truth

Already ran in Production:

- `2026_09_09_020000_add_style_mannequin_profile_to_products_table.php`
- `2026_09_09_120000_extend_categories_for_storefront_taxonomy.php`
- `2026_09_09_123000_create_customer_storefront_state_tables.php`

These migrations are already accepted and **must not be repeated for the final Admin-driven pass**.

Previous cutover backup:

`/var/www/lbb/backend/shared/deploy-backups/final-cutover-20260909T135054Z/lbb-pre-final-cutover-20260909T135054Z.sql.gz`

SHA256:

`e38eaa11bf2d5c9d1227dd6cf54db0fa8fc00eb41830e0fbec12d9029b69e442`

C1 first activation failed because FE built with Nitro `cloudflare-module` for a Node/systemd runtime. Accepted repair C1-R2A used scoped `git -c safe.directory=...`, explicit `NITRO_PRESET=node-server`, isolated port `5187` acceptance and atomic switch. Do not regress to auto-detected Cloudflare preset.

---

## 5) Current business truth

- Existing eight catalog rows are technically clean legacy/sample records classified `LEGACY_FRONTEND_CATALOG_MIGRATED / OWNER-UNVERIFIED`.
- They are not automatically accepted as final employer merchandise/inventory.
- Real employer products must be entered/reviewed through Admin.
- Prefer Draft/Inactive for unverified samples rather than destructive deletion.
- Only categories with genuine published products should be public/indexable.
- Unknown legal/commercial facts must remain pending/disabled until owner verification.
- No final-pass PR mutates Production business data.

---

## 6) PR #88 — Final Product UX Hotfix — CLOSED

Accepted user-required recovery includes:

- Backend Quick View / Eye preview restored;
- real Backend detail inside Quick View;
- Backend size labels on cards;
- mobile swipe before PDP navigation with accidental-navigation suppression;
- desktop multi-image preview;
- full-width `4:5` card media;
- FC1 2D mannequin contract retained;
- mildly rounded PDP gallery;
- desktop PDP composition polish while preserving good mobile UX.

Acceptance evidence:

- accepted head `561b5e4042eafda819e2437d80276ce5410b4229`
- merge `3d11cae296e83f30d43cfb4f0d0fd1f89dd36313`
- exact Product UX full-quality/P3 acceptance PASS
- bounded Playwright baseline update PASS
- review threads 0

`PR_88_FINAL_PRODUCT_UX = DONE / MERGED / DO_NOT_REDO`

---

## 7) Final Admin-driven Storefront pass — MERGED / PRE-DEPLOY ACCEPTED

### Frontend PR #90

- title: `Final: make production storefront fully Admin-driven`
- accepted exact head: `7c6ff6b1292db094859549aa4b8010cf10dfd21e`
- Quality Gates #482 / run `34384484660`: PASS
- P3 Live Integration #126 / run `34384484666`: PASS
- review threads: 0
- merge SHA: `f37bd5c2919181c4ea09e9666974d4473aa140cc`
- accepted source tree = merge tree: `84cf2263c7424ebe179c98e49c533231d5d792a0`

### Backend PR #29

- title: `Final: add Admin-driven storefront presentation controls`
- accepted exact head: `67b6d1166e1e8e563d4d52b208eaec270eca8234`
- P3 Storefront Integration #65 / run `34386908332`: PASS
  - SQLite full suite: PASS
  - Pint delta: PASS
  - foundation/secret safety: PASS
  - MySQL regression: PASS
  - real two-process oversell race: PASS
- review threads: 0
- merge SHA: `8482b6eda370ebe2ca32a674283f67b82eed8629`
- accepted source tree = merge tree: `3602bad03dd1c591ec5cb4a1f09cb5be32d52f1e`

### Admin / Backend authority now implemented

Normal store/business maintenance is designed to come from Backend/Admin rather than Frontend source:

- brand identity and primary copy;
- Home Hero product and section copy;
- ticker / trust cards;
- category ordering and Home category presentation;
- latest-product presentation copy;
- Decision Support;
- Local Store section;
- Featured Collection Story using a real Backend collection slug;
- Instagram/Lookbook CTAs and public social links;
- public phone / WhatsApp / email / address / map / opening hours;
- global Size Guide via Backend content authority;
- Terms and Privacy via Backend content authority;
- Shipping methods via Delivery API;
- Returns policy via Admin setting;
- Enamad display via verified Admin setting;
- SEO defaults;
- Admin-managed public links constrained to internal `/...` or HTTPS.

Prototype/sample truth remains available only for explicit non-production prototype behavior and is not the authority in `live` mode.

### Backend architecture

- existing `StoreSetting`, `ContentPage`, catalog, FAQ, Gallery/Lookbook and Post infrastructure reused;
- no parallel CMS introduced;
- no new schema migration required;
- Admin values override safe presentation defaults;
- legal/commercial defaults stay disabled/pending rather than being invented;
- Checkout/Payment state is derived from Backend runtime config, not editable presentation settings;
- stale unrelated ToolMaster `SiteDataSeeder.php` source removed; Production DB unaffected.

Tracked authority matrix:

`docs/FINAL_ADMIN_DRIVEN_STOREFRONT_AUDIT_FA.md`

Issue evidence:

- Frontend #78 comment `5606553510`
- Backend #21 comment `5606556784`

`FINAL_ADMIN_DRIVEN_CODE = DONE / MERGED / EXACT_HEAD_GREEN / PRE_DEPLOY_ACCEPTED`

---

## 8) Official implementation references used

Architecture was kept aligned with the official documentation for the actual stack:

- Laravel 12 — Eloquent casts / JSON structured values;
- Filament 3 — Repeater and structured form controls for repeatable Admin JSON data;
- TanStack Router — route/root data loading and shared route context for SSR/SEO-friendly authority;
- Playwright — stable-environment visual snapshot and assertion workflow;
- Nitro — explicit production preset selection; LBB runtime requires `node-server`.

Project evidence and versioned tests remain the final authority for LBB-specific behavior.

---

## 9) External blockers — not ordinary code incompleteness

- Kavenegar production account/template/API credentials + real OTP activation test
- Zarinpal merchant approval/credentials + controlled payment activation
- Web Push may remain disabled when VAPID is absent

These are separate activation gates and do not justify re-opening completed storefront engineering.

---

## 10) Mandatory update protocol

At every remaining checkpoint record:

- date/time;
- START/END/accepted SHA;
- PR/Issue;
- CI/run/evidence;
- Production runtime identity if changed;
- schema/business mutation YES/NO;
- Commerce state;
- failure classification if any;
- DO NOT REDO additions;
- `EXACT NEXT`.

Never mark deployment/handoff Done without live evidence.

---

## 11) EXACT NEXT

`FINAL_IMMUTABLE_ADMIN_DRIVEN_DEPLOYMENT`

1. deploy Backend merge `8482b6eda370ebe2ca32a674283f67b82eed8629` and Frontend merge `f37bd5c2919181c4ea09e9666974d4473aa140cc` as new immutable releases;
2. **run no migrations** in this deployment;
3. preserve Backend shared `.env` / storage/media and Frontend immutable `releases/current` topology;
4. build Frontend explicitly with `NITRO_PRESET=node-server` and prove isolated port `5187` HTTP acceptance before switch;
5. atomically switch Backend and Frontend with bounded rollback to current Production SHAs if application activation fails;
6. verify health/ready/bootstrap, public routes, Admin-driven authority and `checkout=false / payment=false / provider=disabled`;
7. perform live Product UX acceptance for Quick View, sizes, swipe/preview, card media, PDP and one controlled mannequin configuration without silently publishing false product truth;
8. enter/review real employer data through Admin; keep unknown legal/Enamad/returns facts pending/disabled until verified;
9. after real-data/live acceptance, create a **fresh final MySQL backup + SHA256 + disposable restore acceptance**;
10. perform exactly one final real server reboot and post-reboot acceptance;
11. freeze/tag/handoff and then close FE #78 / BE #21 only when all evidence is green.

Current Production remains FE `d5014061c1a933fd4078acc38b8fa21c5c8f628c` / BE `e69637548de98681830308291a60777068350bfa` until step 1 succeeds.
