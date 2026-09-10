# LBB — Final Admin Panel Control Gap Audit

Date: `2026-09-10`  
Status: `IMPLEMENTED / DEPLOYED / LIVE ACCEPTED / POST_REBOOT PASS`  
Scope: `Frontend storefront ↔ Backend authority ↔ Filament/Admin merchant usability`

## 1) Purpose and historical context

This report started as a stricter merchant-usability audit after the earlier final storefront handoff. The earlier Admin-driven audit was correct at the architecture/API layer, but this follow-up required a stronger definition of `FULL`: normal merchant maintenance must be possible through task-specific Admin controls without editing Frontend source, raw JSON, Git, active releases, or deployment files.

The original pre-implementation audit was documentation-only and was opened as PR `#93`. That PR is historical discovery evidence only and is superseded by this implemented closure. The implementation itself was delivered in the later cross-repository Admin Control Completion batch.

The previous storefront handoff was never invalidated. This was a new post-handoff maintenance/improvement batch.

## 2) Final accepted identities

### Frontend

- Repository: `sajadkhavas/lbb`
- Operational branch: `fix/lbb-local-boutique-homepage`
- Implementation PR: `#94`
- Accepted implementation head: `ab8f6cf2dc06d5f34c75dfb233905dfa51e6a9d1`
- Implementation merge / final Production runtime SHA: `a700f20414ba4c861127ea6d29fd20a88b1b0e77`
- Exact-head gates: PWA/Push PASS, P3 contract/full-quality PASS, Quality full suite PASS
- Review threads at acceptance: `0`

### Backend

- Repository: `sajadkhavas/lbb-backend`
- Implementation PR: `#30`
- Accepted implementation head: `4544fdb84109e3ecd8b4d7ad7deb71aae1120207`
- Implementation merge SHA: `fc4c8526d13030f45391669bfa81342474238b04`
- OpenAPI follow-up PR: `#31`
- Final Production runtime / `main` SHA: `d88568b7e5fee792e9231fbe701c2566bafe0f46`
- Backend exact-head acceptance: SQLite + MySQL + full suite + Pint + foundation/secret safety + real oversell race PASS
- Full suite evidence included `129/129` tests and `1140` assertions PASS
- Review threads at acceptance: `0`

## 3) Final Production state

Accepted Production runtime:

- Frontend: `a700f20414ba4c861127ea6d29fd20a88b1b0e77`
- Backend: `d88568b7e5fee792e9231fbe701c2566bafe0f46`
- Backend Health: PASS
- Backend Ready: PASS
- Storefront bootstrap: PASS
- `/api/v1/storefront/home-products`: PASS
- Frontend direct runtime on `127.0.0.1:5173`: PASS
- Nginx origin routes: PASS
- Public edge: PASS
- Post-reboot persistence: PASS

Commerce remained intentionally fail-closed throughout:

- `CHECKOUT_ENABLED=false`
- `PAYMENT_ENABLED=false`
- `PAYMENT_PROVIDER=disabled`

No Admin presentation control can activate real commerce.

## 4) P0 closure — all mandatory merchant-control gaps accepted

| # | Original gap | Final status | Accepted implementation |
| --- | --- | --- | --- |
| 1 | Independent Hero image | `ACCEPTED` | Direct Admin media/file control with safe fallback to selected Hero product image. |
| 2 | Hero product free-text slug | `ACCEPTED` | Searchable Product selector; merchant does not need to know slugs. |
| 3 | Free-form Home section manager | `ACCEPTED` | Constrained structured enable/order manager using known section keys. |
| 4 | Home category free-text slugs | `ACCEPTED` | Searchable/sortable Category selection. |
| 5 | Home always-newest products | `ACCEPTED` | Real Backend curation modes: `newest / featured / manual`, with safe count/manual selection. |
| 6 | Announcement raw JSON only | `ACCEPTED` | Structured Announcement editor with message/link/enabled/order controls. |
| 7 | Merchant navigation raw JSON only | `ACCEPTED` | Structured navigation controls for shop/editorial/service/brand groups. |
| 8 | Local Store image URL-only | `ACCEPTED` | Direct merchant media upload/picker with safe URL fallback where appropriate. |
| 9 | Gallery/Lookbook image URL-only | `ACCEPTED` | Direct persistent upload through shared media storage. |
| 10 | Journal cover URL-only | `ACCEPTED` | Direct persistent cover upload/picker. |
| 11 | Featured Story free-text collection slug | `ACCEPTED` | Searchable published Collection selector. |
| 12 | Brand Intro enable/version missing in normal Admin | `ACCEPTED` | Merchant toggle plus version/show-again control. |
| 13 | Raw StoreSetting editor available to normal merchant | `ACCEPTED` | Restricted to `super_admin`; normal merchant uses structured control surfaces. |
| 14 | Production File Manager source/build/Git capability | `ACCEPTED` | Removed from normal Production navigation/access; cannot be used as a CMS substitute. |
| 15 | Hardcoded Footer year | `ACCEPTED` | Automatic year; intentionally not a merchant setting. |

`P0_FINAL_STATUS = 15_OF_15_ACCEPTED`

## 5) P1 closure — business-facing copy/media control accepted

| # | Original gap | Final status | Accepted implementation |
| --- | --- | --- | --- |
| 1 | Fixed business-facing CTA destinations | `ACCEPTED` | Safe internal-path-or-HTTPS destination controls added where appropriate. |
| 2 | Collection cover/hero media missing | `ACCEPTED` | Collection media added and consumed by Collection/index/Featured Story/SEO image paths. |
| 3 | `/shop`, `/collections`, `/lookbook`, `/journal`, `/faq` copy/meta hardcoded | `ACCEPTED` | `page.presentation` authority added and consumed in live SSR/metadata. |
| 4 | FAQ display category labels hardcoded | `ACCEPTED` | FAQ category presentation mapping is Admin-controlled. |
| 5 | Journal per-article SEO absent | `ACCEPTED` | `meta_title` and `meta_description` added to Admin/domain/API. |
| 6 | Footer/shell merchant copy fixed | `ACCEPTED` | Shell/Footer group headings and utility presentation controls added. |
| 7 | Hero alt/focal/fit fixed | `ACCEPTED` | Safe alt, fit and object-position/focal controls added with defaults. |
| 8 | Gallery link URL-only validation | `ACCEPTED` | Validation aligned with safe internal `/...` or HTTPS public-link policy. |

Additional P1-adjacent acceptance:

- Hero can be enabled/disabled while structural layout policy remains developer-owned.
- Live Home ProductMoments consumes the dedicated Backend `home-products` contract rather than silently hardcoding `newest 4`.
- Featured Story prefers Collection cover media and safely falls back when absent.
- Page-presentation values control both visible copy and SSR metadata on the five audited routes.

`P1_FINAL_STATUS = 8_OF_8_ACCEPTED`

## 6) Surfaces intentionally left technical

The following were not converted into merchant presentation controls and remain intentionally code/server-owned:

- Storefront logo implementation unless a separate rebranding feature is requested.
- Favicon/PWA icons/manifest install identity.
- Search/filter/cart/account/wishlist application mechanics and technical UX labels.
- Checkout/payment provider activation and secrets.
- OTP/Kavenegar/VAPID secrets.
- Structural anchors/routes that are part of application behavior rather than merchant content.

This is deliberate and does not count as an Admin-control gap.

## 7) P2 optional items — not blockers

These remain optional future enhancements, not unfinished final-control work:

- Announcement scheduling windows.
- Optional About/page hero media.
- Optional alternate Lookbook CTA destination beyond the accepted current model.
- Optional Local Store map-presentation enhancements.
- Optional local Enamad badge upload if a verified locally managed asset is later preferred.
- Optional Track Order presentation/copy expansion.

`P2_STATUS = OPTIONAL / NON_BLOCKING`

## 8) Production schema and migration acceptance

Exactly one new migration belongs to this batch:

`2026_09_10_080000_add_admin_control_media_and_editorial_seo_fields.php`

It is additive and introduced the accepted nullable/media/editorial SEO fields required by this batch.

Final Production evidence:

- migration record count: `1`
- migration rerun after first successful application: `NO`
- restored new-column count in disposable DB: `5`
- business row counts across the UAT cycle: restored/unchanged
- destructive schema/data mutation: `NO`

Do not rerun this migration merely to reproduce evidence.

## 9) Deployment incident classification and lessons learned

The final rollout exposed several deployment-tooling issues. None were accepted as product regressions:

1. `BASELINE_RUNTIME_LOCK_MISMATCH` — first script expected older runtime SHAs; failed before mutation.
2. `PRE_GATE_OVERCONSTRAINT` — pre-deploy validator incorrectly required new `shell.copy` on the old Backend; failed before mutation.
3. `DEPLOY_TOOLING_PATH_FREEZE` — Laravel config cache was initially generated in a `.stage-*` path, freezing the absolute `public` filesystem root. After promote, Spatie Media Library attempted the deleted stage path and `home-products` returned 500. The cache was rebuilt from the final immutable release path and the endpoint passed directly and over HTTP.
4. `EVIDENCE_DIR_FALSE_NEGATIVE` — an activation checker attempted `curl --output` before creating its evidence directory, producing the misleading concatenated `200000`. No Backend defect existed; the checker was corrected.
5. Frontend activation validation now waits for the actual `lbb.service` listener/process identity before Nginx origin acceptance.

Permanent release rule added by evidence:

> Any Laravel config cache that contains path-derived configuration must be generated/rebuilt only after the release is in its final immutable path. Never carry a stage-path config cache into an activated release.

## 10) Final live merchant-authority UAT

Final acceptance evidence directory:

`/var/www/lbb/backend/shared/deploy-evidence/final-admin-control-acceptance-20260910T102810Z`

A reversible Production UAT used `page.presentation.shop.title` because it is directly owned by the new Storefront Control Center and visible in SSR.

UAT marker:

`LBB-UAT-20260910T102810Z`

Acceptance:

- Production exact SHA lock: PASS
- temporary authority write: PASS
- bootstrap reflected marker: PASS
- origin `/shop` SSR reflected marker: PASS
- public `/shop` SSR reflected marker: PASS
- unauthenticated Storefront Control Center route protected/redirected: PASS
- Checkout/Payment remained fail-closed during mutation: PASS
- exact raw StoreSetting prestate was `ABSENT`
- UAT-created row removed during restore: PASS
- public presentation exactly restored: PASS
- marker absent after restore: PASS
- business state restored: `YES`

`ADMIN_AUTHORITY_UAT = PASS / REVERSIBLE / EXACT_RESTORE`

## 11) Final backup / recovery acceptance

Final database backup:

`/var/www/lbb/backend/shared/deploy-backups/final-admin-control-acceptance-20260910T102810Z/lbb-final-20260910T102810Z.sql.gz`

- bytes: `79274`
- SHA256: `fd77eec3c5e847a654a9c58fe37cb421b98da32263111af240a20efbd753ab1d`
- disposable restore: PASS
- restored migration record: `1`
- restored new columns: `5`
- all production/restored table row counts matched

Final media backup:

`/var/www/lbb/backend/shared/deploy-backups/final-admin-control-acceptance-20260910T102810Z/lbb-media-final-20260910T102810Z.tar.gz`

- bytes: `605795`
- SHA256: `d7a205acba7197843f8badec42fa05c7228164e0d5edfa3d77bb603ebb1b0d9b`
- disposable restore: PASS
- media checksum manifest matched after restore

`FINAL_ADMIN_CONTROL_RECOVERY = PASS`

## 12) Final reboot acceptance

Boot identity changed from:

`36663cfb-d167-4259-9eb5-94538546fb25`

to:

`0a52da80-bc5d-4d3f-9604-dcc373822c3f`

Post-reboot acceptance:

- Nginx: active
- MySQL: active
- PHP 8.3 FPM: active
- `lbb.service`: active
- Frontend process CWD points to exact accepted release: PASS
- Frontend SHA: `a700f20414ba4c861127ea6d29fd20a88b1b0e77`
- Backend SHA: `d88568b7e5fee792e9231fbe701c2566bafe0f46`
- migration record count: `1`
- Backend final-path config cache: PASS
- Health/Ready/bootstrap/home-products: all HTTP `200`
- audited Frontend routes: all HTTP `200`
- public Frontend/bootstrap: HTTP `200`
- UAT restore persisted: PASS
- DB/media backups re-verified by SHA after reboot: PASS
- Checkout/Payment/provider: `false / false / disabled`

Final evidence manifest SHA256:

`a9e9554949853933766a1f8bd52299770935870c8801d86e161dab8ca07ed01e`

`POST_REBOOT_FINAL_STATUS = PASS`

## 13) Final verdict

The original P0/P1 findings are no longer open gaps.

- `P0 = 15/15 IMPLEMENTED + LIVE ACCEPTED`
- `P1 = 8/8 IMPLEMENTED + LIVE ACCEPTED`
- `P2 = OPTIONAL / NON_BLOCKING`
- `RAW_STORE_SETTING = RESTRICTED`
- `PRODUCTION_FILE_MANAGER = RESTRICTED/DISABLED FOR NORMAL MERCHANT USE`
- `ADMIN_CONTROL_BOOTSTRAP = PASS`
- `HOME_PRODUCTS = PASS`
- `LIVE_ADMIN_AUTHORITY_UAT = PASS`
- `RECOVERY = PASS`
- `POST_REBOOT = PASS`
- `COMMERCE = INTENTIONALLY FAIL_CLOSED`

Final classification:

`LBB_FINAL_ADMIN_CONTROL_COMPLETION = DONE / MERGED / DEPLOYED / LIVE / RECOVERABLE / POST_REBOOT_ACCEPTED`

## 14) DO NOT REDO

Do not redo this batch without a concrete drift/failure signal:

- Hero/Admin control completion
- Home curation/section/category controls
- Announcement/navigation structured controls
- Local Store/Gallery/Journal/Collection media completion
- Brand Intro control completion
- page-presentation/FAQ/Journal SEO completion
- Raw StoreSetting/File Manager restrictions
- Footer/shell completion
- migration `2026_09_10_080000...`
- deployment/path-cache repair
- final live authority UAT
- final DB/media disposable restore
- final reboot acceptance

## 15) EXACT NEXT

There is no remaining general Admin-control engineering phase.

`EXACT NEXT = NORMAL_ADMIN_OPERATIONS_OR_SEPARATE_EXTERNAL_ACTIVATION_GATE`

Allowed future work:

1. review/enter genuine merchant catalog/content through Admin;
2. run a dedicated Kavenegar/OTP activation gate only when merchant-owned prerequisites exist;
3. run a dedicated Zarinpal Checkout/Payment activation gate only when merchant approval/credentials exist;
4. open a separately scoped maintenance branch for dependency/security maintenance or a genuinely new defect/feature.

Do not reopen this final Admin Control Completion batch merely because optional P2 enhancements exist.
