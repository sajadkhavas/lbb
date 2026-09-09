# LBB — Project Master Ledger (FA)

**Authoritative project ledger / مرجع واحد ادامه پروژه**

Created: `2026-09-09`

این فایل بعد از هر checkpoint مهم، PR/CI/Merge/Deploy/Incident/Acceptance و تغییر
`EXACT NEXT` به‌روزرسانی می‌شود.

در صورت تعارض، Runtime evidence و GitHub exact SHA/PR/CI جدیدتر بر متن قدیمی مقدم‌اند.

---

## 1) Repositories / Runtime

### Frontend

- Repo: `sajadkhavas/lbb`
- Production URL: `https://lbbclo.com`
- Operational branch: `fix/lbb-local-boutique-homepage`
- Current Production SHA: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- Current Product UX hotfix branch: `hotfix/final-product-ux`
- Current Product UX PR: `#88`
- PR #88 state at this checkpoint: `DRAFT / OPEN / NOT MERGED / NOT DEPLOYED`

### Backend

- Repo: `sajadkhavas/lbb-backend`
- API/Admin: `https://api.lbbclo.com`
- Current Production SHA: `e69637548de98681830308291a60777068350bfa`
- Backend code change in PR #88: `NO`
- API contract: `2026-09-06-p3-storefront-v1`

### Commerce lock

- Checkout: `false`
- Payment: `false`
- Provider: `disabled`

PR #88 must not change these values.

---

## 2) Closed / DO NOT REDO

Do not repeat these without a real drift signal:

- F0–F20 Frontend foundation/design/catalog/commerce/editorial/performance/a11y/RTL/SEO
- P1.2 / P1.3 / P1.4 SEO/content/freeze
- P2 Backend final audit/freeze
- P3 Live Integration
- P4/P4-ACT release architecture and immutable `releases/current/shared`
- Nginx / TLS / Cloudflare acceptance
- Node SSR / PHP-FPM / MySQL / health / readiness
- persistent media/shared storage + permissions
- Admin login/role/navigation
- Admin dashboard repair + owner browser UAT
- Shipping production contract + Admin configuration
- Admin Catalog/Media/Inventory UAT
- Admin Owner Product UAT
- Catalog provenance audit
- Content/legal and SEO final gates
- FC1 Backend PR #27 and Frontend PR #86 code implementation
- Final Technical Completion Backend PR #28 and Frontend PR #87 code implementation
- previously applied additive Backend migrations from the final cutover

Existing migrations must not be rolled back or intentionally re-run for PR #88.

---

## 3) Current Production business truth

- Current eight catalog records are legacy/sample Frontend-origin records.
- They are not accepted as final employer merchandise.
- Real employer products must be entered and reviewed through Admin.
- Samples should be Draft/Inactive rather than destructively deleted by default.
- Only categories with real published products should be public/indexable.
- Header/category hierarchy is Admin-driven.
- Home category/Hero/social surfaces are Backend/Admin controlled.
- Checkout and Payment remain OFF until separate external activation gates.

---

## 4) Final Technical Completion already merged

### Frontend PR #87

- Accepted source head: `7435049fcc2336fc744ff6d8d494a048705be5fd`
- Merge SHA: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- Current Production uses this exact Frontend merge SHA.

Implemented scope included:

- Admin-backed taxonomy/navigation
- Home categories and Hero controls
- live latest products
- verified preview images
- Contact and Track Order wiring
- account Cart/Wishlist synchronization
- Admin Lookbook/social hydration
- fail-closed live behavior without prototype leakage

### Backend PR #28

- Accepted source head: `ff05d186de0d92795ac1c16bc53832947a4c91ff`
- Merge SHA: `e69637548de98681830308291a60777068350bfa`
- Current Production uses this exact Backend merge SHA.

Implemented scope included:

- three-level category hierarchy
- Admin parent/header/home/icon controls
- verified `previewImages`
- inquiry/contact API
- privacy-safe public order tracking
- account Cart/Wishlist persistence contracts
- Launch Readiness/Admin control surfaces

---

## 5) Production cutover history — DO NOT REPEAT

The first final cutover applied three additive migrations and later rolled application releases back.
The schema intentionally remained forward-migrated because the migrations are additive and
backward compatible.

Already-applied migrations:

- `2026_09_09_020000_add_style_mannequin_profile_to_products_table.php`
- `2026_09_09_120000_extend_categories_for_storefront_taxonomy.php`
- `2026_09_09_123000_create_customer_storefront_state_tables.php`

Cutover backup:

- file:
  `/var/www/lbb/backend/shared/deploy-backups/final-cutover-20260909T135054Z/lbb-pre-final-cutover-20260909T135054Z.sql.gz`
- SHA-256:
  `e38eaa11bf2d5c9d1227dd6cf54db0fa8fc00eb41830e0fbec12d9029b69e442`

The final successful Frontend deployment required an explicit Nitro `node-server` build.
The earlier failure was classified as `FRONTEND_BUILD_RUNTIME_PRESET_MISMATCH`.

Current active Production after recovery:

- Frontend: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- Backend: `e69637548de98681830308291a60777068350bfa`

---

## 6) Owner-required Product UX recovery

After live review, Final Technical Completion was accepted as technically deployed but not as final
Product UX acceptance.

Required bounded recovery:

1. restore Quick View for live Backend product cards;
2. preserve mobile card swipe before PDP navigation;
3. prevent a real swipe from accidentally opening the PDP;
4. preserve desktop multi-image card preview;
5. show Backend size labels on product cards again;
6. make card product media edge-to-edge/full-width;
7. preserve the FC1 2D mannequin implementation;
8. prove mannequin visibility later with valid Admin-backed product data;
9. mildly round PDP product gallery corners;
10. polish Desktop PDP composition;
11. preserve the currently-good Mobile PDP behavior.

Hard rule:

`MOBILE_CURRENT_GOOD_UX = PRESERVE`

---

## 7) PR #88 — Final Product UX Hotfix

Branch:

`hotfix/final-product-ux`

PR:

`#88 — Hotfix: restore final product UX on live backend`

Production baseline:

`d5014061c1a933fd4078acc38b8fa21c5c8f628c`

### Registered implementation commits before formatting remediation

- `c521db486741b87f500f90a64619aa56c91f0b2c`
  - restore Backend size labels on product cards;
  - card size chips remain informational at summary level.
- `d804c64cb15375e89c5d0ccadd3ecd241e66842a`
  - Quick View context accepts Prototype or Backend targets safely.
- `d67b66805abd7afe469bf1bc018fa1b07c6aeaf7`
  - dedicated Backend Quick View with real Product Detail fetching and exact variant state.
- `584a0ccb8960a46849a71e51a21553d85530489e`
  - restore Backend Preview/Eye action;
  - full-width 4:5 card media;
  - mobile swipe click-suppression guard.
- `4009e4d1bab2c46fff106aeb22c65a3538faa2f8`
  - dispatch Backend targets to the new live Quick View;
  - preserve legacy Prototype Quick View.
- `ee07c56b806b836980c51756f18d8e18e621b38a`
  - soften PDP gallery/thumb corners and desktop gallery framing.
- `9ebc7500af264e93836af4dc46b09e44ca398df1`
  - Desktop-only purchase panel surface/sticky composition.
- `ab5fc72ba66b8aae8078572dd06411ba16e45fd0`
  - Desktop-only product identity hierarchy polish.
- `85eb046ee818f6790f6d2c9ac235dbd7be743820`
  - focused Product UX contract/layout tests.
- `f156829c7bedb343cf2bc2e848ab99a5d66805e4`
  - official-reference implementation decision document.

### Official reference evidence

Tracked document:

`docs/FINAL_PRODUCT_UX_HOTFIX_RESEARCH.md`

It records the official Tailwind CSS, TanStack Query, TanStack Router, W3C WAI-ARIA and Playwright
documentation used for the hotfix decisions.

### CI incident before formatting remediation

At head `ee07c56b806b836980c51756f18d8e18e621b38a`:

- Quality Gates `#465`: `FAIL`
- P3 Live Integration `#109`: `FAIL`
- failure reached `prettier --check` before build/typecheck/e2e;
- Quality log identified formatting drift in:
  - `docs/LBB_PROJECT_MASTER_LEDGER_FA.md`
  - `src/components/lbb/BackendProductQuickView.tsx`

Classification:

`FORMAT_GATE_ONLY / LOGIC_GATES_NOT_REACHED`

This is not accepted as green implementation evidence.

### Mutation state

- Production mutation: `NO`
- Backend code mutation: `NO`
- Database/schema mutation: `NO`
- Business/product data mutation: `NO`
- Checkout/payment mutation: `NO`

---

## 8) PR #88 acceptance requirements

Do not merge PR #88 until all are true:

- exact head Prettier PASS;
- lint PASS;
- build PASS;
- typecheck PASS;
- Quality Gates PASS;
- P3 Live Integration PASS;
- focused Product UX tests PASS;
- existing accessibility/interaction suites PASS;
- intentional visual snapshot changes are reviewed and bounded;
- review threads = 0;
- PR is no longer Draft;
- exact accepted head is recorded before merge.

Do not deploy until the accepted merge SHA exists.

---

## 9) Live acceptance after PR #88 merge

The immutable Frontend release must be built with explicit Node runtime preset.
Backend remains unchanged unless a new, evidenced Backend defect is discovered.

Required live checks:

- Backend Quick View Eye/Preview visible and functional;
- real Product Detail data visible in Quick View;
- Backend size labels visible on product cards;
- mobile multi-image swipe works before opening PDP;
- swipe does not accidentally navigate;
- normal tap still navigates;
- card media is full-width;
- PDP corners are mildly rounded;
- Desktop PDP hierarchy/layout is polished;
- Mobile PDP remains correct;
- one controlled Admin-configured product proves 2D mannequin visibility when valid data exists;
- Checkout/Payment remain OFF.

If Production has no product with multiple verified images or no valid mannequin profile, those are
business-data acceptance prerequisites and must not be falsely reported as code PASS.

---

## 10) Remaining path to final handoff

1. close PR #88 formatting/build/typecheck/test gates;
2. review exact diff and zero review threads;
3. merge PR #88 with exact-head lock;
4. immutable Frontend Production release and narrow live Product UX acceptance;
5. final GitHub reconciliation and stale-state cleanup;
6. enter real employer data through Admin;
7. real-data acceptance across Admin/API/Frontend;
8. fresh final MySQL backup + checksum + disposable restore;
9. exactly one final real server reboot + post-reboot acceptance;
10. final freeze/tag/handoff and close Frontend #78 / Backend #21.

---

## 11) External blockers

These are not normal code incompleteness:

- Kavenegar production credentials/template/account and real OTP activation test;
- Zarinpal merchant approval/credentials and controlled payment activation;
- Web Push may remain disabled if VAPID credentials are not supplied.

---

## 12) Mandatory update protocol

After every important action, register at least:

- date/time;
- gate/phase/incident;
- START SHA(s);
- END/accepted SHA(s);
- PR/Issue numbers;
- CI workflow/run result;
- Production runtime identity when changed;
- data/schema/business mutation YES/NO;
- Commerce state;
- evidence/hash when applicable;
- failure classification;
- DO NOT REDO additions;
- `EXACT NEXT`.

Never register a phase only with «انجام شد».
SHA/PR/CI/evidence are required.

---

## 13) Change Log

### 2026-09-09 — Master Ledger established

- authoritative ledger created;
- historical Production and closure truth registered.

### 2026-09-09 — Final Technical Completion merged and deployed

- Frontend Production: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`;
- Backend Production: `e69637548de98681830308291a60777068350bfa`;
- explicit Node server rebuild solved the Frontend runtime preset mismatch;
- Checkout/Payment remained fail-closed.

### 2026-09-09 — Product UX live-review gap identified

- Backend Quick View not wired to live cards;
- card sizes hidden for Backend cards despite summary data;
- swipe/mannequin required real live-data acceptance;
- card/PDP visual polish requested by owner;
- Final Technical Completion retained as technical baseline, not final UX acceptance.

### 2026-09-09 — PR #88 implementation checkpoint

- branch: `hotfix/final-product-ux`;
- Production baseline: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`;
- Backend Production remains `e69637548de98681830308291a60777068350bfa`;
- official-reference document added;
- focused Hotfix tests added;
- no Production/DB/business/commerce mutation;
- current CI blocker classification: `FORMAT_GATE_ONLY / LOGIC_GATES_NOT_REACHED`;
- **EXACT NEXT:** apply repository-exact Prettier output, remove temporary formatting mechanism,
  then obtain fresh exact-head Quality/P3 results before reviewing visual snapshots and merge readiness.
