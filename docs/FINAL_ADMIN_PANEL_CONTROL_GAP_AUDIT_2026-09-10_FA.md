# LBB — Final Admin Panel Control Gap Audit

Date: `2026-09-10`
Status: `AUDIT COMPLETE / IMPLEMENTATION NOT STARTED`
Scope: `Frontend storefront ↔ Backend authority ↔ Filament/Admin usability`

## Locked baselines

- Frontend audit source: `d85ae85f8b407b11cf574dfa02416f473f87b736`
- Backend audit source: `8482b6eda370ebe2ca32a674283f67b82eed8629`
- Existing historical authority report: `docs/FINAL_ADMIN_DRIVEN_STOREFRONT_AUDIT_FA.md`
- Governing production rule: merchant/business/content changes must not require editing Frontend source, raw JSON, active releases or deployment files.
- Checkout/payment remain fail-closed and are explicitly outside merchant presentation controls.

## Why this audit exists

The earlier Admin-driven audit correctly established Backend authority for most public Storefront data. This follow-up uses a stricter acceptance definition: a surface is not considered fully merchant-manageable merely because a `StoreSetting` JSON key exists. `FULL` now requires all of the following:

1. Backend is the live authority.
2. There is a task-specific, understandable Admin control.
3. The merchant does not need to edit raw JSON, source code, Git or active release files.
4. Media used by the surface can be uploaded/selected in Admin when merchant-owned media is expected.
5. IDs/slugs that point to domain records use a safe selector rather than free-text where practical.
6. Live Frontend consumes the value and fails safely.
7. Security/commerce secrets remain server-owned rather than being moved into presentation settings.

Status vocabulary:

- `FULL`: normal merchant maintenance is complete.
- `PARTIAL`: Backend authority exists, but Admin UX/control is incomplete.
- `MISSING`: a merchant-facing control needed by an existing Storefront surface is absent.
- `INTENTIONALLY_TECHNICAL`: should remain code/server owned.
- `REMOVE_OR_RESTRICT`: present in Admin but inappropriate/dangerous for normal Production merchant use.

## Runtime observation

The public Home currently renders the Hero copy but shows `تصویر محصول منتخب در حال تکمیل است.` when the selected Hero product has no usable image. This confirms the current Hero visual is coupled to the selected product rather than being an independent merchant Hero asset.

## Final control-surface matrix

| Surface | Current authority/control | Status | Gap / required action | Priority |
| --- | --- | --- | --- | --- |
| Brand identity and main brand copy | `brand.identity`, `brand.copy` + Site Settings | FULL | No merchant-control gap for text fields. | — |
| Hero text | Site Settings | FULL | Title/body/eyebrow/labels are editable. | — |
| Hero product selection | `home.presentation.heroProductSlug` | PARTIAL | Current Admin uses free-text product slug. Replace with searchable published-product selector. | P0 |
| Hero main image | selected Hero product `primaryImage` only | MISSING | Add independent Hero media upload/select with product-image fallback. | P0 |
| Hero image presentation | Frontend fixed `object-contain`/padding | MISSING | Add safe focal/object-position or fit mode and image alt; retain sane defaults. | P1 |
| Hero CTA labels | Site Settings | FULL | Labels editable. | — |
| Hero CTA destinations | Frontend fixed `/shop` and `/contact` | PARTIAL | Add safe internal/HTTPS destination controls for business-facing CTAs. | P1 |
| Hero category anchor | Frontend fixed `#home-categories` | INTENTIONALLY_TECHNICAL | Structural anchor should remain developer-owned unless layout model changes. | — |
| Home section order | `home.presentation.sections` | PARTIAL | Current control is free-form `TagsInput`; unknown keys are silently ignored. Replace with constrained sortable section manager. | P0 |
| Hero section enable/order | Hero rendered outside section map | PARTIAL | Hero cannot be disabled/reordered by existing section manager. Add explicit Hero enable control; keep Hero first by policy unless a future layout builder is intentionally introduced. | P1 |
| Home category ordering | `categoryOrder` | PARTIAL | Free-text slugs. Replace with selectable/sortable published categories. | P0 |
| Category content/image/icon/SEO | Category Resource with FileUpload | FULL | Image, icon, visibility, parent, order, publication and SEO are already merchant-manageable. | — |
| Home product cards data | Product API | FULL | Product card truth comes from Backend. | — |
| Home product curation | loader requests newest products only | MISSING | Product Admin has `is_featured`, but Home ignores it and always loads newest. Add mode `newest / featured / manual`, safe count, and optional manual selection. | P0 |
| Product/variant/price/stock | Product Resource | FULL | Strong domain controls already exist. | — |
| Product media/gallery | Spatie media upload | FULL | Existing product uploads are sufficient. | — |
| 2D mannequin | Product Resource + verified media | FULL | Enable/slot/preset/asset/offset/scale/layer already controlled. | — |
| Home ticker strip | Site Settings repeater | FULL | Structured editing and ordering already exist. | — |
| Announcement bar content | `announcement.messages` Backend setting | PARTIAL | No normal structured Site Settings editor; merchant must use raw StoreSetting JSON. Add repeater with text, href, enabled/order. | P0 |
| Announcement scheduling | none | OPTIONAL | Optional start/end scheduling can be added after parity; not required for current surface. | P2 |
| Trust cards | Site Settings repeater | FULL | Text/icon/link/enabled/order are structured. | — |
| Decision Support | Site Settings | FULL | Main text/checks/cards/links are structured. | — |
| Local Store copy | Site Settings | FULL | Section text and CTA labels are editable. | — |
| Local Store image | HTTPS URL text field | PARTIAL | Add FileUpload/media picker; retain HTTPS URL only as optional advanced source if desired. | P0 |
| Local Store CTA destinations | Frontend fixed `/contact`, Instagram and `/shop` | PARTIAL | Labels are editable but destinations are not. Add safe destination controls where merchant-facing. | P1 |
| Featured Story selection | free-text collection slug | PARTIAL | Replace with searchable published Collection selector. | P0 |
| Featured Story copy | Site Settings | FULL | Enabled, eyebrow, story points and CTA labels exist. | — |
| Featured Story/Collection visual | no Collection media field in Collection Admin | PARTIAL | Add Collection cover/hero media and consume it consistently for collection/index/story social metadata. | P1 |
| Brand Intro copy | Site Settings | FULL | Text and CTA labels exist. | — |
| Brand Intro enable/reset | Backend object has `enabled` + `version`, normal form does not expose them | MISSING | Add toggle and safe “show again / bump version” action. | P0 |
| Brand Intro CTA destinations | fixed `/about`; store button only dismisses | PARTIAL | Keep dismiss behavior technical; optionally expose Story destination if required. | P2 |
| Lookbook/Gallery title/caption/order | GalleryItem Resource | FULL | Text/order/active are manageable. | — |
| Lookbook/Gallery image | required external `image_url` | PARTIAL | Add direct FileUpload/media picker with persistent shared storage and generated public URL. | P0 |
| Lookbook related link | Admin uses `->url()` | PARTIAL | Frontend can render a destination, but Admin restricts it to URL form. Align with safe internal `/...` or HTTPS policy. | P1 |
| Instagram strip CTA labels | Site Settings | FULL | Labels are editable. | — |
| Instagram/Lookbook CTA destinations | brand Instagram plus fixed `/lookbook` | PARTIAL | Instagram authority is editable; Lookbook destination is fixed. Usually low-risk; expose only if business requires alternate destination. | P2 |
| Journal article content | Post Resource | FULL | Title/slug/category/tags/excerpt/body/author/status/date are manageable. | — |
| Journal cover image | external `cover_url` only | PARTIAL | Add direct FileUpload/media picker. | P0 |
| Journal per-article SEO | title + excerpt are reused | PARTIAL | Add explicit `meta_title` and `meta_description` fields/API if editorial SEO needs independent control. | P1 |
| FAQ questions/answers | FAQ Resource | FULL | Question/answer/category/order/active are manageable. | — |
| FAQ group display labels/titles | Frontend `FAQ_LABELS` constant | PARTIAL | Category key is editable but visible group title/Latin label are hardcoded. Add FAQ category presentation control or explicit mapping in Admin. | P1 |
| About page content/SEO | ContentPage + brand settings | FULL for text | Main live text/meta is Backend-owned. | — |
| About page merchant image | no ContentPage media field; live About is text-only | PARTIAL | Add optional page hero/cover media if merchant should control About imagery. | P2 |
| Contact page copy/SEO | ContentPage | FULL | ContentPage authority is available. | — |
| Contact channels/location/hours | Site Settings | FULL | Phone/WhatsApp/email/address/map/hours available; unverified fields may stay empty. | — |
| Contact form/inquiries | Inquiry backend/Admin | FULL | Operational domain remains Backend controlled. | — |
| Size Guide global page | ContentPage | FULL control surface | Production record existence is a separate data-reconciliation task, not a missing Admin capability. | — |
| Product size guides | Product/SizeGuide domain | FULL | Existing domain control. | — |
| Terms/Privacy | ContentPage | FULL control surface | Final legal truth remains owner-verified; Production record completion is separate. | — |
| Shipping methods/zones | DeliveryZone Admin + Delivery API | FULL | Immediate courier/Tipax/Decapost controls exist; unsafe legacy modes stay disabled. | — |
| Returns policy | Site Settings truth-gated | FULL | Enabled/verification/window/refund/shipping fields exist; do not invent values. | — |
| Enamad | Site Settings truth-gated | FULL for current contract | Verification/id/url/badge URL/location exist. Optional media upload is not required because verified external badge URL may be preferable. | P2 optional |
| Collections records | Collection Resource | PARTIAL | Name/description/products/status/SEO exist; cover/hero media is absent. | P1 |
| Collections index page copy/SEO | Frontend constants | MISSING | Make index heading/lede/meta merchant-manageable via ContentPage/page-presentation authority. | P1 |
| Lookbook index page copy/SEO | Frontend constants/static `heroMain` for social image | MISSING | Add page-presentation/ContentPage authority and merchant social image. | P1 |
| Journal index page copy/SEO | Frontend constants/static `heroMain` | MISSING | Add page-presentation/ContentPage authority and merchant social image. | P1 |
| FAQ index page copy/SEO | Frontend constants | MISSING | Add page-presentation/ContentPage authority. | P1 |
| Shop index page title/description/chrome | Frontend constants | MISSING | Product data is live, but route SEO/intro business copy should be manageable as page presentation. | P1 |
| Track Order page help copy/meta | Frontend constants | PARTIAL | Operational status mechanics remain technical; merchant-facing heading/help/support copy may use page-presentation authority. | P2 |
| Merchant navigation arrays | Bootstrap `navigation.*`, editable only through raw StoreSetting | PARTIAL | Add structured navigation editor for shop/editorial/service/brand: label, latin, description, href, enabled/order. | P0 |
| Desktop “فروشگاه” menu trigger label | hardcoded Frontend text | PARTIAL | Include in navigation/shell copy settings if merchant-editable shell copy is desired. | P1 |
| Footer merchant navigation | live navigation arrays | PARTIAL | Data authority exists but structured Admin editor is missing. Covered by navigation editor. | P0 |
| Footer section headings | hardcoded `خرید / کالکشن و محتوا / پشتیبانی / شخصی / برند` | PARTIAL | Add shell/footer copy settings for merchant-facing group labels if full copy control is required. | P1 |
| Footer bottom legal/contact labels/order | hardcoded Frontend | PARTIAL | Add structured utility links or keep routes fixed and expose labels/order. | P1 |
| Footer copyright year | hardcoded `2026` | TECHNICAL_DEFECT | Make year automatic from runtime/build date; do not create a merchant setting. | P0 tech |
| Storefront logo mark | code-rendered fixed LBB wordmark | INTENTIONALLY_TECHNICAL | Brand visual identity is release-level unless LBB explicitly needs rebranding capability. Do not turn this into a generic uploader by default. | — |
| Favicon/PWA icons/manifest identity | static release assets | INTENTIONALLY_TECHNICAL | Keep release-owned because of install/cache/icon lifecycle. | — |
| Search/filter/cart/account/wishlist UX labels | application behavior | INTENTIONALLY_TECHNICAL | Not normal merchant content. | — |
| Checkout/payment provider/secrets | server runtime/env | INTENTIONALLY_TECHNICAL | Must remain fail-closed and must not be activatable from presentation settings. | — |
| OTP/Kavenegar/VAPID/secrets | server runtime/secret management | INTENTIONALLY_TECHNICAL | Never expose secrets in public StoreSetting/Admin presentation form. | — |
| Raw StoreSetting editor | generic JSON/value/public editor | REMOVE_OR_RESTRICT | Merchant can break contract or expose wrong data. Restrict to developer/super-admin; normal merchant must use structured pages. | P0 security |
| File Manager page | source editor + build + Git commit from Admin | REMOVE_OR_RESTRICT | Violates immutable release rule and is not a Production CMS feature. Disable/remove from Production Admin or restrict to non-production developer-only access. | P0 security |

## Existing surfaces that are already sufficiently complete

Do not redo these merely because this audit exists:

- Products, variants, prices, stock, evidence and product media.
- Product 2D mannequin controls.
- Category hierarchy, visibility, image, icon and SEO.
- Delivery zones and currently accepted shipping methods.
- Contact channels and ContentPage-based content.
- Returns truth gate.
- Enamad truth gate.
- FAQ item CRUD.
- Inquiry/order/customer operational domains.
- Home ticker, Trust cards and Decision Support structured controls.

## Consolidated implementation batch

The recommended one-time Admin completion pass is:

### P0 — must complete before calling the merchant panel “final”

1. Independent Hero image upload/media picker with fallback to Hero product image.
2. Searchable Hero product selector; remove free-text slug UX.
3. Structured Home section manager with allowed keys, enable/order controls.
4. Searchable/sortable Home category selector instead of free-text slugs.
5. Home product curation mode: `newest`, `featured`, `manual`; wire `is_featured` to a real consumer.
6. Structured Announcement Bar editor instead of raw JSON.
7. Structured merchant navigation editor instead of raw JSON.
8. Local Store direct image upload/media picker.
9. Gallery/Lookbook direct image upload/media picker.
10. Journal cover direct image upload/media picker.
11. Searchable Featured Story collection selector.
12. Brand Intro enable toggle + safe version bump/reset action.
13. Restrict raw StoreSetting editor to developer/super-admin only.
14. Disable/remove Production File Manager source editing/build/Git actions.
15. Replace hardcoded Footer copyright year with automatic year.

### P1 — complete the “all business-facing copy/media from Admin” goal

1. Add safe CTA destination fields for merchant-facing Hero/Home/Local Store actions where destinations are business content rather than structural app routes.
2. Add Collection cover/hero media and connect it to index/detail/story/SEO image output.
3. Add page-presentation authority for `/shop`, `/collections`, `/lookbook`, `/journal`, `/faq` using existing ContentPage infrastructure where possible rather than adding many unrelated StoreSetting keys.
4. Add FAQ category display title/label control.
5. Add Journal per-article SEO fields.
6. Add Footer/shell merchant copy for group headings and utility-link labels/order.
7. Add Hero media alt + safe focal/fit controls.
8. Align Gallery related-link validation with safe internal-or-HTTPS policy.

### P2 — optional, not a blocker for final merchant control

- Announcement scheduling windows.
- Optional About/page hero media.
- Optional merchant-configurable alternate Lookbook CTA destination.
- Optional local-store map presentation enhancements.
- Optional Enamad badge FileUpload if a locally managed verified asset is later preferred.

## Architectural implementation notes

1. Prefer existing `StoreSetting` JSON and existing media infrastructure; do not add schema merely to store simple presentation settings unless a relational domain genuinely requires it.
2. For media, use persistent shared storage / existing media library patterns. Never write merchant uploads into immutable release directories.
3. Keep `prototype` data only for explicit prototype mode. Live mode must never silently resurrect local sample truth.
4. Use relational searchable selects for Product/Collection references and constrained section/category choices; no merchant should need to know a slug.
5. Continue validating editable public destinations with the internal-path-or-HTTPS rule.
6. The generic raw StoreSetting editor is not a substitute for structured Admin UX.
7. File/source editing from Production Admin is explicitly not part of the merchant CMS model.
8. Checkout/payment/OTP/push secrets remain operational/server controls and must not be merged into this batch.
9. Legal, returns, Enamad, address and hours values remain truth-gated; the implementation must not populate unknown employer facts.
10. No already-applied Production migration should be rerun merely for this Admin completion work.

## Important reconciliation with the 2026-09-09 report

`docs/FINAL_ADMIN_DRIVEN_STOREFRONT_AUDIT_FA.md` and the P3 matrix used `PASS` primarily to mean that a Backend authority/API/live consumer existed. This 2026-09-10 audit does not invalidate that work. It adds the stricter merchant-usability layer: raw JSON, free-text slugs and URL-only media fields are now explicitly `PARTIAL`, even where the underlying API authority was already correct.

## Deployment relationship

This audit is documentation-only. It does not change the locked Production runtime, does not mutate business data, does not run migrations and does not activate checkout/payment. The current pending ContentPage reconciliation/final deployment sequence remains separate from this report until the Admin completion batch is implemented and accepted.

## EXACT NEXT

`IMPLEMENT_FINAL_ADMIN_CONTROL_COMPLETION_BATCH`

Start from the locked Frontend/Backend baselines, implement P0 as one coordinated cross-repo batch, then P1 if the goal remains absolute business-facing control. Run exact-head Backend + Frontend gates, review threads = 0, merge with expected-head locks, then perform immutable Production deployment and live Admin mutation/restore acceptance. Do not use the Production File Manager for this implementation.
