# LBB — Project Master Ledger (FA)

**Authoritative continuation ledger / مرجع واحد ادامه پروژه**  
Created: `2026-09-09`

در صورت تعارض، Runtime evidence و GitHub exact SHA/PR/CI جدیدتر بر متن قدیمی مقدم‌اند. بعد از هر checkpoint مهم، SHA/PR/CI/Runtime/Data mutation/Commerce state/EXACT NEXT در همین فایل ثبت می‌شود.

---

## 1) Current accepted identities

### Frontend

- Repo: `sajadkhavas/lbb`
- Operational branch: `fix/lbb-local-boutique-homepage`
- Production URL: `https://lbbclo.com`
- Current Production SHA before PR #88 deployment: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- Current Product UX branch: `hotfix/final-product-ux`
- Product UX PR: `#88`
- PR #88 accepted implementation head before base reconciliation: `2876eb83ed7a58ba937f8514d26e090bbd28ae05`

### Backend

- Repo: `sajadkhavas/lbb-backend`
- API/Admin: `https://api.lbbclo.com`
- Current Production SHA: `e69637548de98681830308291a60777068350bfa`
- Current public API contract: `2026-09-06-p3-storefront-v1`

### Commerce lock

- `checkout.enabled=false`
- `payment.enabled=false`
- `provider=disabled`

These values must stay fail-closed until the separate external activation gates.

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
- already-applied additive Backend migrations listed below

Never intentionally re-run or roll back already accepted additive migrations only to repeat evidence.

---

## 3) Final Technical Completion already merged/deployed

### Frontend PR #87

- accepted source: `7435049fcc2336fc744ff6d8d494a048705be5fd`
- merge/runtime SHA: `d5014061c1a933fd4078acc38b8fa21c5c8f628c`
- Quality #459 PASS
- P3 Live Integration #103 PASS
- PWA #55 PASS
- review threads 0

Implemented: Admin-backed taxonomy/navigation, Home category/Hero hydration, latest products, verified preview images, Contact, Track Order, account Cart/Wishlist sync, Lookbook/social hydration, no prototype leakage, FC1 mannequin card integration.

### Backend PR #28

- accepted source: `ff05d186de0d92795ac1c16bc53832947a4c91ff`
- merge/runtime SHA: `e69637548de98681830308291a60777068350bfa`

Implemented: three-level category hierarchy, Admin parent/header/home/icon controls, verified `previewImages`, Inquiry/Contact API, privacy-safe Track Order, account storefront state, Launch Readiness/Admin surfaces.

---

## 4) Production schema/cutover truth

Already Ran in Production:

- `2026_09_09_020000_add_style_mannequin_profile_to_products_table.php`
- `2026_09_09_120000_extend_categories_for_storefront_taxonomy.php`
- `2026_09_09_123000_create_customer_storefront_state_tables.php`

Cutover backup:
`/var/www/lbb/backend/shared/deploy-backups/final-cutover-20260909T135054Z/lbb-pre-final-cutover-20260909T135054Z.sql.gz`

SHA256:
`e38eaa11bf2d5c9d1227dd6cf54db0fa8fc00eb41830e0fbec12d9029b69e442`

C1 first activation failed because the FE artifact was built with Nitro `cloudflare-module` for a Node/systemd runtime. Classification: `FRONTEND_BUILD_RUNTIME_PRESET_MISMATCH`.

C1-R2 then stopped pre-build on Git dubious ownership. Classification: `GIT_SAFE_DIRECTORY_GUARD / PRECHECK_ONLY`; no global safe.directory change was accepted.

C1-R2A used scoped `git -c safe.directory=...`, explicit `NITRO_PRESET=node-server`, isolated port 5187 acceptance, and bounded activation. Final active runtime became FE `d5014061...` / BE `e6963754...`; migrations were not repeated and Commerce stayed fail-closed.

---

## 5) Current business truth

- Existing eight catalog rows are legacy/sample records and are not accepted as final employer merchandise.
- Real employer products must be entered/reviewed through Admin.
- Samples should stay Draft/Inactive by default rather than be destructively deleted.
- Only categories with real published products should become public/indexable.
- Store-facing configurable content should be Backend/Admin-driven.

---

## 6) PR #88 — Final Product UX Hotfix

Owner-required bounded recovery:

1. restore live Backend Quick View / Eye preview;
2. show real Backend product detail inside Quick View;
3. restore Backend size labels on cards;
4. preserve mobile swipe before PDP navigation and suppress accidental navigation after a swipe;
5. preserve desktop multi-image preview;
6. make card media full-width;
7. preserve FC1 2D mannequin support;
8. mildly round PDP gallery corners;
9. improve desktop PDP composition without regressing mobile.

Important implementation commits include:

- `c521db486741b87f500f90a64619aa56c91f0b2c` sizes
- `d804c64cb15375e89c5d0ccadd3ecd241e66842a` safe Quick View target model
- `d67b66805abd7afe469bf1bc018fa1b07c6aeaf7` Backend Quick View/detail
- `584a0ccb8960a46849a71e51a21553d85530489e` Eye/full-width media/mobile swipe guard
- `4009e4d1bab2c46fff106aeb22c65a3538faa2f8` Backend Quick View dispatch
- `ee07c56b806b836980c51756f18d8e18e621b38a` PDP gallery framing
- `9ebc7500af264e93836af4dc46b09e44ca398df1` desktop purchase panel
- `ab5fc72ba66b8aae8078572dd06411ba16e45fd0` desktop identity hierarchy
- `85eb046ee818f6790f6d2c9ac235dbd7be743820` focused acceptance tests
- `f156829c7bedb343cf2bc2e848ab99a5d66805e4` official-reference decision record

### Exact acceptance evidence

- Visual baseline updater run `34374342196`: PASS.
- Guard proved exactly 14 expected Playwright PNG baselines changed; no Source/Config delta.
- Exact Final Product UX Gate run `34374653797`: PASS.
- `exact-quality`: PASS, including complete repository quality suite and focused Product UX acceptance.
- `exact-p3-contract`: PASS, including format/lint/typecheck/P3 invariants.
- PR review/comments at acceptance: 0.
- PR moved from Draft to Ready.
- No Production/DB/schema/business/commerce mutation occurred during PR #88 CI remediation.

### Base reconciliation

Operational branch contains four post-PR87 documentation-only commits; compared with the PR baseline, their only changed file is this Ledger. Source code has no base conflict. Reconciliation therefore preserves the Product UX tree and the newer operational history in one two-parent merge commit before PR #88 merge.

---

## 7) Final owner request — last engineering pass

After PR #88 closes, perform one consolidated Backend/Frontend control audit before final server handoff:

- inventory every user-visible business/content surface in Frontend;
- classify each as live Backend/Admin controlled, intentionally static application UI, or remaining hardcoded business content;
- create/fix Backend models/settings/Admin resources/API fields for every remaining editable business surface;
- wire Frontend to the Backend contract with fail-closed behavior and no prototype/sample leakage;
- ensure contact/store identity, menus, banners/Hero, categories, social/Lookbook, legal/business copy, configurable section visibility/order, merchandising selections and other owner-managed values can be edited without source changes where appropriate;
- keep structural UI labels and security-critical behavior in code when they are application semantics rather than business content;
- add contract/feature/UI tests and official-reference documentation;
- do not activate Checkout/Payment/Kavenegar/WebPush without their separate real credentials/acceptance.

The completion criterion is: after this pass, normal store/business maintenance can be performed from Admin rather than by editing Frontend source.

---

## 8) External blockers, not ordinary code incompleteness

- Kavenegar production account/template/credentials + real OTP activation test
- Zarinpal merchant approval/credentials + controlled payment activation
- Web Push may remain disabled when VAPID is absent

---

## 9) Mandatory update protocol

At every important checkpoint record:

- date/time
- START/END/accepted SHA
- PR/Issue
- CI/run/evidence
- Production runtime identity if changed
- schema/business mutation YES/NO
- Commerce state
- failure classification if any
- DO NOT REDO additions
- `EXACT NEXT`

Never mark a phase Done without exact evidence.

---

## 10) EXACT NEXT

1. finish two-parent reconciliation of PR #88 with operational branch;
2. re-run exact-head Product UX gate if the accepted tree/head changes;
3. merge PR #88 with `expected_head_sha` lock;
4. start the consolidated final Backend-driven/Admin-control audit on fresh FE/BE branches from the accepted operational heads;
5. complete all real gaps in Backend + Frontend + tests/docs;
6. run exact-head CI on both repos;
7. deploy the final combined release once, then perform live real-data/admin acceptance;
8. fresh final DB backup + checksum + disposable restore;
9. exactly one final real reboot + post-reboot acceptance;
10. freeze/tag/handoff and close FE #78 / BE #21 when all evidence is green.
