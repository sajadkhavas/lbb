# LBB — Project Master Ledger Appendix — Final Admin Control Completion

Date: `2026-09-10`  
Type: `APPEND-ONLY CHECKPOINT`  
Parent ledger: `docs/LBB_PROJECT_MASTER_LEDGER_FA.md`

> این سند تاریخچه‌ی Ledger قبلی را بازنویسی نمی‌کند. این Appendix فقط checkpoint جدیدی را بعد از handoff بسته‌شده‌ی قبلی اضافه می‌کند. در صورت تعارض، Runtime evidence و exact SHAهای جدیدتر این checkpoint بر وضعیت قدیمی‌تر مقدم‌اند.

---

## A1) Checkpoint identity

Checkpoint:

`FINAL_ADMIN_CONTROL_COMPLETION_POST_REBOOT_PASS`

Classification:

`DONE / MERGED / DEPLOYED / LIVE / RECOVERABLE / POST_REBOOT_ACCEPTED`

This checkpoint closes the new post-handoff Admin-usability batch discovered on `2026-09-10`. It does not reopen or invalidate the earlier final handoff.

---

## A2) Final accepted Production identities

### Frontend

- Repo: `sajadkhavas/lbb`
- Operational branch: `fix/lbb-local-boutique-homepage`
- Admin Control implementation PR: `#94`
- Accepted implementation head: `ab8f6cf2dc06d5f34c75dfb233905dfa51e6a9d1`
- **Final active Production SHA:** `a700f20414ba4c861127ea6d29fd20a88b1b0e77`
- Runtime: `lbb.service`
- Listener: `127.0.0.1:5173`
- Runtime preset: `node-server`

### Backend

- Repo: `sajadkhavas/lbb-backend`
- Admin Control implementation PR: `#30`
- OpenAPI follow-up PR: `#31`
- **Final active Production SHA:** `d88568b7e5fee792e9231fbe701c2566bafe0f46`
- Runtime: PHP `8.3` FPM
- Database: MySQL `lbb_prod`
- Public contract remains: `2026-09-06-p3-storefront-v1`

### Commerce lock

- `CHECKOUT_ENABLED=false`
- `PAYMENT_ENABLED=false`
- `PAYMENT_PROVIDER=disabled`

These remain intentional and must not be activated from merchant presentation controls.

---

## A3) Source/CI closure

Frontend PR `#94`:

- exact implementation head: `ab8f6cf2dc06d5f34c75dfb233905dfa51e6a9d1`
- PWA/Push: PASS
- P3 contract/full-quality: PASS
- Quality full suite: PASS
- build/typecheck: PASS
- review threads: `0`
- merge/final runtime SHA: `a700f20414ba4c861127ea6d29fd20a88b1b0e77`

Backend PR `#30`:

- accepted head: `4544fdb84109e3ecd8b4d7ad7deb71aae1120207`
- SQLite: PASS
- MySQL: PASS
- full suite: `129/129` tests, `1140` assertions PASS
- Pint: PASS
- foundation/secret safety: PASS
- real oversell race: PASS
- review threads: `0`
- merge SHA: `fc4c8526d13030f45391669bfa81342474238b04`

Backend PR `#31`:

- OpenAPI contract adds `/api/v1/storefront/home-products`
- all relevant Backend gates: PASS
- final merge / Production Backend SHA: `d88568b7e5fee792e9231fbe701c2566bafe0f46`

---

## A4) Merchant-control completion

Mandatory P0 closure:

`15 / 15 ACCEPTED`

Accepted P0 controls include:

- independent Hero image/media with fallback;
- searchable Hero Product selector;
- constrained Home section enable/order manager;
- searchable/sortable Home category selector;
- Home curation `newest / featured / manual`;
- structured Announcement editor;
- structured merchant navigation editor;
- Local Store media upload;
- Gallery/Lookbook media upload;
- Journal cover upload;
- searchable Featured Story Collection selector;
- Brand Intro enabled/version controls;
- raw StoreSetting restricted to `super_admin`;
- Production File Manager removed/restricted from normal merchant use;
- automatic Footer year.

P1 closure:

`8 / 8 ACCEPTED`

Accepted P1 controls include:

- safe business-facing CTA destinations;
- Collection cover/hero media wired through storefront/story/SEO;
- page presentation for `/shop`, `/collections`, `/lookbook`, `/journal`, `/faq`;
- FAQ presentation labels;
- Journal per-article SEO fields;
- shell/Footer merchant copy controls;
- Hero alt/focal/fit controls;
- Gallery internal-or-HTTPS link policy.

Optional P2 remains:

`OPTIONAL / NON_BLOCKING`

No optional P2 item is a blocker for final merchant-control completion.

---

## A5) Production schema truth — DO NOT RERUN

New migration accepted by this batch:

`2026_09_10_080000_add_admin_control_media_and_editorial_seo_fields.php`

Final truth:

- Production migration record count: `1`
- migration rerun after successful application: `NO`
- schema change: additive only
- destructive data migration: `NO`
- disposable restore verified five new columns

Previously accepted migrations remain DO NOT RERUN as already recorded in the parent ledger.

---

## A6) Deployment sequence and incident lessons

Final activation evidence:

`/var/www/lbb/backend/shared/deploy-evidence/final-admin-control-r3-r5-20260910T101123Z`

Final activation accepted:

- Backend exact target: PASS
- Backend Health/Ready: PASS
- bootstrap: PASS
- `/home-products`: PASS
- Frontend exact target: PASS
- `lbb.service` listener/process identity: PASS
- direct Frontend routes: PASS
- Nginx origin routes: PASS
- public edge: PASS
- checkout/payment/provider stayed `false / false / disabled`

Deployment failures before final acceptance were classified as tooling/gate defects, not product regressions:

1. wrong pre-deploy baseline lock — stopped before mutation;
2. old Backend pre-gate incorrectly expected new `shell.copy` — stopped before mutation;
3. Laravel config cache frozen to `.stage-*` absolute filesystem path — repaired by rebuilding config cache from the final immutable release path;
4. evidence directory missing before `curl --output`, yielding misleading `200000` — checker corrected;
5. Frontend activation checker now waits for actual listener/process identity before Nginx acceptance.

Permanent rule:

`Never activate a Laravel release with a config cache generated from a temporary/stage path when configuration contains absolute path-derived values.`

---

## A7) Live Admin authority UAT

Final acceptance evidence directory:

`/var/www/lbb/backend/shared/deploy-evidence/final-admin-control-acceptance-20260910T102810Z`

UAT authority:

`page.presentation.shop.title`

Temporary marker:

`LBB-UAT-20260910T102810Z`

Acceptance:

- exact Production SHA lock: PASS
- temporary StoreSetting authority write: PASS
- Backend bootstrap reflected marker: PASS
- origin `/shop` SSR reflected marker: PASS
- public `/shop` SSR reflected marker: PASS
- Control Center unauthenticated request protected by redirect: PASS
- Checkout/Payment remained fail-closed: PASS
- exact prestate was `page.presentation` row ABSENT
- UAT-created row removed on restore: PASS
- public presentation exactly restored: PASS
- marker absent after restore: PASS
- business state restored: YES

Classification:

`ADMIN_AUTHORITY_UAT = PASS / REVERSIBLE / EXACT_RESTORE`

---

## A8) Final backup and disposable restore

Database backup:

`/var/www/lbb/backend/shared/deploy-backups/final-admin-control-acceptance-20260910T102810Z/lbb-final-20260910T102810Z.sql.gz`

- bytes: `79274`
- SHA256: `fd77eec3c5e847a654a9c58fe37cb421b98da32263111af240a20efbd753ab1d`
- disposable restore: PASS
- all table row counts matched Production
- migration record count in restore: `1`
- new-column count in restore: `5`

Media backup:

`/var/www/lbb/backend/shared/deploy-backups/final-admin-control-acceptance-20260910T102810Z/lbb-media-final-20260910T102810Z.tar.gz`

- bytes: `605795`
- SHA256: `d7a205acba7197843f8badec42fa05c7228164e0d5edfa3d77bb603ebb1b0d9b`
- disposable restore: PASS
- media checksums matched after extraction

Classification:

`RECOVERY = PASS / DISPOSABLE_RESTORE_VERIFIED`

---

## A9) Final real reboot / persistence acceptance

Boot proof:

- before: `36663cfb-d167-4259-9eb5-94538546fb25`
- after: `0a52da80-bc5d-4d3f-9604-dcc373822c3f`

Post-reboot:

- Nginx: active
- MySQL: active
- PHP 8.3 FPM: active
- `lbb.service`: active
- Frontend exact SHA persisted: `a700f20414ba4c861127ea6d29fd20a88b1b0e77`
- Backend exact SHA persisted: `d88568b7e5fee792e9231fbe701c2566bafe0f46`
- Frontend process CWD exact release: PASS
- Backend config cache final-path-safe: PASS
- Health/Ready/bootstrap/home-products: all HTTP `200`
- audited Frontend routes: all HTTP `200`
- public edge: PASS
- UAT restore persisted: PASS
- DB/media backup hashes verified after reboot: PASS
- migration count remained `1`
- checkout/payment/provider remained `false / false / disabled`

Final manifest:

`a9e9554949853933766a1f8bd52299770935870c8801d86e161dab8ca07ed01e`

Classification:

`POST_REBOOT_FINAL_STATUS = PASS`

---

## A10) Business truth boundary remains unchanged

Existing catalog business-data provenance rules remain unchanged:

`LEGACY_FRONTEND_CATALOG_MIGRATED / OWNER-UNVERIFIED`

This Admin completion batch did not convert sample/legacy catalog facts into merchant-approved truth. Merchant review/correction remains normal Admin operations, not unfinished engineering.

---

## A11) External activation blockers remain separate

Only merchant/external activation gates remain outside this completed engineering scope:

- Kavenegar production account/template/API credentials + real OTP activation test;
- Zarinpal merchant approval/credentials + separately controlled Checkout/Payment activation;
- Web Push may remain disabled if VAPID prerequisites are absent.

No secret should be committed to GitHub or placed in public StoreSetting.

---

## A12) Maintenance note

A prior Production Frontend build reported dependency/deprecation warnings including three high-severity npm audit findings. This is a separate dependency/security maintenance branch if later requested.

Do not run `npm audit fix --force` against the accepted Production graph merely to clear the warning.

This does not reopen Admin Control Completion.

---

## A13) DO NOT REDO

Do not redo without a real drift/failure signal:

- PR `#94` Admin Control implementation;
- Backend PRs `#30` and `#31`;
- migration `2026_09_10_080000...`;
- R3-R5 Production activation;
- config-cache final-path repair;
- live merchant-authority UAT;
- DB/media backup and disposable restore;
- final reboot/persistence acceptance.

Do not edit active releases for routine merchant changes.

---

## A14) Final operational status

`LBB_STOREFRONT_ENGINEERING = COMPLETE`

`LBB_FINAL_ADMIN_CONTROL = COMPLETE / LIVE / POST_REBOOT_ACCEPTED`

`PRODUCTION = GREEN / EXACT_SHA`

`RECOVERY = VERIFIED`

`ADMIN_DRIVEN_STOREFRONT = LIVE / REVERSIBLE_UAT_PASS`

`CHECKOUT_PAYMENT = INTENTIONALLY_DISABLED_PENDING_EXTERNAL_ACTIVATION`

`PROJECT_FINAL_HANDOFF = DONE`

---

## A15) EXACT NEXT

There is no remaining general Storefront/Admin-Control engineering phase.

`EXACT NEXT = NORMAL_ADMIN_OPERATIONS_OR_SEPARATE_EXTERNAL_ACTIVATION_GATE`

Allowed next work:

1. enter/review genuine merchant catalog/content through Admin;
2. provide Kavenegar prerequisites and run the dedicated OTP activation gate;
3. provide Zarinpal prerequisites and run the dedicated payment/Checkout activation gate;
4. open a new independently scoped engineering/maintenance branch only for a genuine new feature, dependency/security maintenance, or confirmed defect.
