# LBB — Current Execution Status & NEXT

> **این فایل Source of Truth اجرایی برای ادامه پروژه است.**
>
> آخرین بروزرسانی: **2026-09-07**
>
> هر چت/مجری جدید باید **اول این فایل** را بخواند، سپس `docs/LBB_MASTER_HANDOFF_FA.md` را برای Business Truth و تصمیم‌های محتوایی/برندی مطالعه کند.
>
> اگر بین Runtime/Deployment status این فایل و Runtime section قدیمی Master Handoff اختلافی بود، **این فایل جدیدتر و مقدم است**.

---

## 1) Repository و Runtime Identity قطعی

### Frontend

- Repository: `sajadkhavas/lbb`
- Production source branch: `fix/lbb-local-boutique-homepage`
- Production URL: `https://lbbclo.com`
- Runtime: self-hosted Node / Nitro `node-server`
- **Frontend فعلی Production:** `1d6fd9170788e9e765c17fc4b29987b87436d283`
- **Frontend P4 candidate آماده و buildشده:** `4e572b580a38d4fd28420c8e6d8dd69de945f76d`
- P4 exact source before merge: `6c57011146c4cf90c5ad337e81b5377b4395044f`
- P4 runtime merge SHA: `4e572b580a38d4fd28420c8e6d8dd69de945f76d`
- P4 registration/closure branch head: `5557eb3ceee13d5976a16eb2cc62f22e9a73618c`

### Backend

- Repository: `sajadkhavas/lbb-backend`
- API URL: `https://api.lbbclo.com`
- **Backend Production runtime SHA:** `0c068df2ea43c8706932a73424014c59a313fc6b`
- P4 exact source before merge: `57aa03aa8c27ce24263c5abedd6332dec254060c`
- Accepted storefront/API contract: `2026-09-06-p3-storefront-v1`

### Tracking

- Frontend Issue: `sajadkhavas/lbb#78` — **P4-ACT — Controlled Production Deployment & Activation**
- Backend Issue: `sajadkhavas/lbb-backend#21` — **P4-ACT — Backend Production Deployment & Acceptance**

---

## 2) وضعیت فازها

| Phase | Status |
|---|---|
| P1 / frontend foundation, SEO/PWA baseline | ✅ completed/merged/deployed historically |
| P2 / backend foundation | ✅ completed/merged/frozen |
| P3 / backend-authoritative storefront | ✅ DONE / MERGED / REGISTERED |
| P4 / commerce go-live implementation | ✅ DONE / MERGED / REGISTERED |
| **P4-ACT / real VPS deployment & activation** | **🟡 IN PROGRESS** |
| P5 / final SEO, QA, hardening, handoff | ⏳ NOT STARTED |

### P3 final identities

- FE source: `eebb9dc24f7474b7348a2f94f8e7bc7d04720be9`
- FE runtime merge: `ab3aa654ae7c3a19508837fa6bda383f84fa5cbc`
- FE PR #71 merged
- P3 FE registration PR #72 merged -> `44a7263254cb5f8f01db27ac941fa26258f06f44`
- BE source: `a93f21a7c2c1bb2961a722c2748cf952cb4d399f`
- BE runtime merge: `5a874d66b5d031fd1ab739a4b7bd8b7c04d4acf6`
- BE PR #18 merged

### P4 implementation final identities

- FE PR #74 merged
- FE runtime-code merge: `4e572b580a38d4fd28420c8e6d8dd69de945f76d`
- FE Quality run: `34106986013` PASS
- FE Live Integration run: `34106986019` PASS
- BE PR #20 merged
- BE runtime merge: `0c068df2ea43c8706932a73424014c59a313fc6b`
- BE final gate: `34107023080` PASS
- P4 registration PR #76 merged -> `3ea4ee261b8bcf9b9a97372f7de4144b3911784b`
- P4 closure PR #77 merged
- P4 docs/registration head: `5557eb3ceee13d5976a16eb2cc62f22e9a73618c`

---

## 3) P4 Commerce Contract نهایی

روش‌های رسمی ارسال در P4 فقط این چهار مورد هستند:

1. `immediate_courier` — پیک فوری کرج و تهران
2. `tipax` — تیپاکس، فعلاً مدل پس‌کرایه
3. `decapost` — دکاپست، فعلاً مدل پس‌کرایه
4. `express_post` — پست پیشتاز

روش‌های قدیمی `standard` و `pickup` فقط برای backward compatibility باقی مانده‌اند و برای Go-Live نباید فعال شوند.

Reservation timeout:

- `30 minutes`

Fail-closed production contract:

- `CHECKOUT_ENABLED=false`
- `PAYMENT_ENABLED=false`
- `PAYMENT_PROVIDER=disabled`
- همه shipping methodها در production فعلاً `enabled=false`
- feeهای fallback فعلاً `0`

**هیچ Checkout یا Payment activation نباید قبل از Gate مستقل خودش انجام شود.**

---

## 4) Backend Production Deployment — انجام‌شده

Backend واقعی روی VPS آماده و فعال است:

- release: `/var/www/lbb/backend/releases/0c068df2ea43c8706932a73424014c59a313fc6b`
- current: `/var/www/lbb/backend/current`
- runtime user: `lbbapi`
- PHP: `8.3`
- MySQL: `8.0.46`
- database: `lbb_prod`
- DB user: `lbb_app`
- PHP-FPM socket/pool: `lbb-backend.sock`
- Nginx API site: active
- API origin + Cloudflare edge: PASS
- TLS: PASS
- CORS main origin: PASS
- foreign origin blocked: PASS
- auth-protected commerce endpoints: PASS
- accepted contract visible at runtime: `2026-09-06-p3-storefront-v1`

### Database

- 32 migrations applied as initial production batch
- pre-migration backup:
  `/var/backups/lbb-backend/pre-migration-20260907T151251Z.sql`
- pre backup SHA256:
  `c983e031...`
- post-migration backup:
  `/var/backups/lbb-backend/post-migration-20260907T151251Z.sql`
- post backup SHA256:
  `e1d38a4b...`
- disposable restore tests: PASS

**Do not rerun migrations/backups without a new mutation reason or detected drift.**

---

## 5) API / Cloudflare / TLS — انجام‌شده

- `api.lbbclo.com` پشت Cloudflare orange-cloud است.
- Cloudflare edge IPهای مشاهده‌شده:
  - `104.21.92.225`
  - `172.67.199.42`
- Edge certificate wildcard for `*.lbbclo.com`: PASS
- direct origin HTTPS: PASS
- Cloudflare health/ready/bootstrap: PASS
- `/api/system/health`: PASS
- `/api/system/ready`: PASS
- `/api/v1/storefront/bootstrap`: PASS

S2-C final evidence:

- FE Issue #78 comment: `5573916379`
- BE Issue #21 comment: `5573917462`

---

## 6) Frontend P4 Candidate — آماده ولی هنوز Public نشده

Candidate exact release:

`/var/www/lbb/releases/4e572b580a38d4fd28420c8e6d8dd69de945f76d`

Build:

- Node `24.19`
- npm `11.17`
- `npm ci`: PASS
- production build: PASS
- Nitro preset: `node-server`
- `.output/server/index.mjs`: present
- live API binding: `https://api.lbbclo.com`
- backend mode: `live`

**Production frontend همچنان روی SHA قدیمی `1d6fd...` است.**

Rollback target باید حفظ شود.

---

## 7) SSR 500 Root Cause — مشخص و حل زیرساختی شده، Data Gate هنوز مانده

هنگام اجرای Candidate روی port جداگانه، listener سالم بود اما Home SSR `500` می‌داد.

تشخیص قطعی:

- bootstrap hero slug: `lbb-signature-tee`
- hero product API: `404`
- public product count: `0`
- public category count: `0`
- facets: empty

Root cause:

`PRODUCTION_CATALOG_EMPTY_AND_HERO_REFERENCE_MISSING`

یعنی کد Candidate crash بنیادی نداشت؛ Home loader در mode=live محصول Hero واقعی را از Backend می‌خواست اما Production DB هنوز Catalog نداشت.

Evidence:

- FE #78: `5574127162`
- BE #21: `5574128548`

---

## 8) Persistent Media Storage — CLOSED / PASS

Topology رسمی و پذیرفته‌شده:

- release `storage/app` -> `/var/www/lbb/backend/shared/storage/app`
- persistent public media:
  `/var/www/lbb/backend/shared/storage/app/public`
- release `public/storage` -> persistent public media

Final permission policy:

- media owner: `lbbapi`
- media group: `www-data`
- directory policy: `2750` + setgid
- file policy: `0640`
- `www-data` read: PASS
- `lbbapi` future write/group inheritance: PASS
- direct origin media HTTP: `200`
- Cloudflare edge media HTTP: `200`

Metadata rollback snapshot created during repair:

`/var/backups/lbb-backend/media-permission-pre-20260907T183619Z.tar`

SHA256:

`2142da16575028cbde511707a8abbd9f6195531d39d4a64c2c13e1f7e10657ca`

Final evidence:

- FE #78: `5574500793`
- BE #21: `5574502037`

**Do not redo storage topology repair. This gate is closed.**

---

## 9) آخرین Runtime Truth قبل از NEXT

آخرین state تأییدشده:

- Backend SHA: `0c068df2ea43c8706932a73424014c59a313fc6b`
- Production FE SHA: `1d6fd9170788e9e765c17fc4b29987b87436d283`
- Candidate FE SHA: `4e572b580a38d4fd28420c8e6d8dd69de945f76d`
- Backend health: PASS
- Backend ready/db: PASS
- Persistent media: PASS
- Origin media delivery: PASS
- Edge media delivery: PASS
- Public products: `0`
- Public categories: `0`
- Checkout: OFF
- Payment: OFF
- Payment provider: disabled
- Frontend atomic switch: **NOT DONE**

---

# 10) CURRENT NEXT — اینجاست که باید ادامه دهیم

## `S3-DATA-B1-R2 — Controlled Catalog Import + SSR Acceptance`

این مرحله **هنوز در آخرین checkpoint اجرا نشده است**.

هدف:

1. Exact source manifest از Frontend candidate `4e572...` استخراج شود.
2. Production catalog prestate حتماً empty قفل شود.
3. Fresh pre-import DB backup گرفته شود.
4. 5 category و 8 curated product فعلی Frontend برای بازکردن Live SSR وارد Backend شوند.
5. Product publication باید از `ApparelPublicationGuard` واقعی عبور کند؛ guard دور زده نشود.
6. Media از exact frontend source به persistent Media Library منتقل شود.
7. API products/categories/facets/hero acceptance PASS شود.
8. post-import DB backup گرفته شود.
9. همان Candidate بدون rebuild روی port isolated اجرا شود.
10. `/`, `/shop`, category pages, hero product page و checkout shell SSR باید `200` شوند.
11. Production frontend **نباید در این مرحله switch شود**.
12. Checkout/Payment همچنان OFF بمانند.

### هشدار بسیار مهم درباره Catalog اولیه

Catalog موجود در Frontend یک **curated prototype/source catalog** است، نه inventory واقعی تأییدشده فروشگاه.

در نتیجه:

- قیمت/نام/تصویر/دسته فقط به عنوان current project source برای reconciliation اولیه استفاده می‌شوند.
- موجودی‌ای که برای بازشدن Catalog/SSR ساخته می‌شود نباید به‌عنوان warehouse truth تلقی شود.
- اگر availability sentinel استفاده شد، فقط برای pre-checkout است.
- **قبل از Checkout activation، موجودی واقعی، variantهای واقعی، SKUهای واقعی و product data باید توسط کارفرما/ادمین reconcile شوند.**

### ممنوعیت

- `php artisan db:seed` در Production اجرا نشود.
- `ProductSeeder` موجود Backend مربوط به catalog ارثی/غیر LBB است و نباید روی Production اجرا شود.

---

# 11) Content & Visual Acceptance Window — قبل از Public Switch

بعد از `S3-DATA-B1-R2` یک Gate عمدی داریم تا صاحب پروژه بتواند قبل از Go-Live کامل سایت را با دیتای واقعی بررسی کند.

ترتیب رسمی:

### S3-B1 — Admin Production Ready

- Admin production access آماده شود.
- Product/category/media management بررسی شود.

### S3-B2 — Real Product & Media Entry

صاحب فروشگاه/کارفرما بتواند از Admin وارد کند:

- محصولات واقعی
- تصاویر واقعی
- قیمت واقعی
- رنگ‌ها
- سایزها
- SKU واقعی
- موجودی واقعی
- توضیحات/Material/Fit/Care در صورت وجود

### S3-B3 — Visual Acceptance

Candidate جدید با همین data واقعی بررسی شود:

- Homepage
- animated top/header bar — **نباید حذف شود**
- Navbar/Menu
- Product cards
- Product detail/gallery
- Categories
- Filters/search
- Cart
- Account/Auth shell
- Checkout shell
- Mobile/tablet/desktop
- image aspect/cropping
- empty/error/loading states

### S3-B4 — Fix Window

هر ایراد ظاهری یا منطقی که صاحب پروژه گزارش کند، قبل از Go-Live روی branch اصلاح، CI، merge و candidate جدید ساخته شود.

**قانون:** تا تأیید صاحب پروژه، `S3-C Atomic Frontend Switch` انجام نشود.

---

# 12) Auth — تصمیم قطعی فعلی

**Google Login در LBB پیاده‌سازی نشده است.**

ورود مشتری:

`Mobile number -> OTP request -> OTP verify -> customer session`

Backend routeها:

- `/api/v1/auth/otp/request`
- `/api/v1/auth/otp/verify`
- `/api/v1/auth/me`
- `/api/v1/auth/logout`

Provider پیاده‌سازی‌شده:

- `kavenegar`

Production برای Go-Live نیاز دارد:

- Kavenegar API Key
- Kavenegar approved Verify Lookup template
- active/charged account

تا credential واقعی وارد و test نشود، OTP production نباید به‌عنوان accepted ثبت شود.

---

# 13) Shipping — وضعیت و نیازهای کارفرما

Backend P4 در حال حاضر **Shipping Provider API integration ندارد**؛ اما Delivery Configuration کامل و Backend-authoritative است.

می‌توان برای province/city تنظیم کرد:

- method enabled/disabled
- fee
- minimum order
- free delivery threshold
- packaging fee
- preparation min/max days
- daily order limit

چهار method رسمی:

- پیک فوری کرج/تهران
- تیپاکس
- دکاپست
- پست پیشتاز

برای نسخه اول **API تیپاکس/دکاپست/پست اجباری نیست**.

Current intended operational model:

- Courier: منطقه‌ای/تعرفه فروشگاه
- Tipax: پس‌کرایه
- Decapost: پس‌کرایه
- Express post: policy/fee باید از کارفرما نهایی شود

اگر بعداً dynamic shipping quote لازم باشد، فاز مستقل Shipping Provider API Integration ایجاد شود. برای تیپاکس می‌توان از Web Service/eTipax استفاده کرد تا quote/registration/tracking خودکار شود.

برای dynamic quote دقیق، Product/Variant در آینده بهتر است weight و package dimensions داشته باشد.

### اطلاعاتی که هنوز باید از کارفرما گرفته شود

- آیا پیک فوری فقط کرج است یا تهران هم فعال است؟
- fee هر zone
- تیپاکس و دکاپست دقیقاً پس‌کرایه بمانند یا fee ثبت شود؟
- سیاست/هزینه پست پیشتاز
- minimum order
- free-delivery threshold
- packaging fee
- preparation time

---

# 14) بعد از Catalog/Visual Gate چه می‌ماند؟

## S3-C — Atomic Frontend Switch

بعد از Candidate acceptance و تأیید صاحب پروژه:

- `current` باید atomically از FE `1d6fd...` به exact accepted candidate switch شود.
- `lbb.service` restart/identity/PID/listener/log بررسی شود.
- rollback release `1d6fd...` حفظ شود.
- public routes/live API acceptance گرفته شود.

**Checkout و Payment بعد از frontend switch نیز می‌توانند OFF بمانند.**

## S3-D — Runtime Operations

- queue worker
- scheduler
- restart policies
- boot persistence
- logs
- permission
- process identity

## S3-E — Real Inventory + Auth + Shipping + Checkout

- reconcile real inventory
- Kavenegar OTP production test
- configure delivery zones and real fees
- cart validation
- address
- delivery quote
- checkout quote
- checkout commit
- order creation
- 30-minute reservation behavior
- E2E acceptance

فقط بعد از این Gate:

`CHECKOUT_ENABLED=true`

## S3-F — Payment Go-Live

- real payment provider credentials
- callback/verify contract
- amount/currency validation
- payment preflight
- test/controlled transaction
- idempotency/retry/error handling
- post-payment order state

فقط بعد از Gate مستقل:

`PAYMENT_ENABLED=true`

و provider واقعی فعال شود.

---

# 15) P5 — Final Acceptance & Handoff

بعد از P4-ACT فقط P5 باقی می‌ماند.

### P5-A — SEO Final

- search intent reconciliation
- semantic content polish
- Local SEO Karaj
- FAQ/schema reconciliation
- internal linking
- titles/descriptions final route audit
- canonical/noindex verification
- keyword stuffing avoidance

### P5-B — Browser / UX QA

- desktop/mobile/tablet
- critical route walkthrough
- visual regression
- animated header/ticker retained
- form/errors/empty states

### P5-C — Performance / PWA / Accessibility

- Lighthouse/Core Web Vitals
- image optimization
- font/runtime behavior
- service worker/PWA update/install
- keyboard/focus/a11y

### P5-D — Production Hardening

- security headers
- logs
- backup/restore
- service recovery
- permission audit
- pending Ubuntu kernel reboot/recovery check

Kernel note from deployment:

- running during P4-ACT: `6.8.0-53`
- newer installed kernel observed: `6.8.0-139`
- reboot intentionally deferred until final controlled hardening window

### P5-E — Freeze / Handoff

- final FE Production SHA
- final BE Production SHA
- runtime truth
- Master Handoff update
- P4-ACT Issue #78 close
- Backend Issue #21 close
- final tags/freeze
- rollback instructions
- operations/admin handoff

---

# 16) کل مسیر باقی‌مانده تا تحویل نهایی

به ترتیب:

1. `S3-DATA-B1-R2` Catalog Import + SSR acceptance
2. Admin production readiness
3. ورود تصاویر/محصولات/قیمت/variant/stock واقعی
4. Visual QA توسط صاحب پروژه
5. Fix window تا تأیید
6. Pre-activation acceptance
7. Atomic frontend switch
8. Queue/scheduler/process acceptance
9. Kavenegar production OTP setup/test
10. Delivery zones/fees configuration
11. Real inventory reconciliation
12. Checkout E2E + activation
13. Payment preflight + activation
14. P5 SEO final
15. P5 UX/browser QA
16. P5 performance/PWA/a11y
17. P5 production hardening + controlled reboot
18. Final freeze/master handoff/issue closure

---

# 17) Evidence Index — P4-ACT

Frontend Issue #78 / Backend Issue #21 evidence sequence:

- S1-B: FE `5572740205` / BE `5572741533`
- S2-A diagnostic: FE `5573501450` / BE `5573503408`
- S2-A final: FE `5573553406` / BE `5573554721`
- S2-B PASS: FE `5573793672` / BE `5573794666`
- S2-C initial edge failure: FE `5573849055` / BE `5573849990`
- proxy active: FE `5573865471` / BE `5573866337`
- wildcard diagnostic correction: FE `5573881984` / BE `5573883096`
- S2-C final PASS: FE `5573916379` / BE `5573917462`
- S3-A initial build/harness: FE `5573990726` / BE `5573991528`
- S3-A-R1: FE `5574024719` / BE `5574025475`
- S3-A-R2 SSR500 diagnosis: FE `5574062300` / BE `5574063143`
- S3-DATA-A1 empty catalog root cause: FE `5574127162` / BE `5574128548`
- media topology false-gate: FE `5574221111` / BE `5574221996`
- media temp permission failure: FE `5574271916` / BE `5574272659`
- self-referential media recovery incident: FE `5574311359` / BE `5574312747`
- recovery reached HTTP403: FE `5574344406` / BE `5574345437`
- Nginx/media root cause: FE `5574440700` / BE `5574441835`
- final media PASS: FE `5574500793` / BE `5574502037`

---

# 18) Mandatory continuation rules for next chat

یک چت جدید **نباید از اول پروژه را دوباره audit یا اجرا کند** مگر اینکه drift واقعی مشاهده شود.

قبل از هر mutation:

1. این فایل را بخواند.
2. `docs/LBB_MASTER_HANDOFF_FA.md` را برای Business Truth بخواند.
3. Frontend Issue #78 و Backend Issue #21 را بخواند.
4. exact runtime SHAها را روی VPS lock کند.
5. اگر SHA/state با این checkpoint برابر بود، از `CURRENT NEXT` ادامه دهد.

### Current NEXT marker

`NEXT=S3_DATA_B1_R2_CATALOG_IMPORT_AND_SSR_ACCEPTANCE`

### Safety boundaries

- no edit-in-place on active releases
- immutable release deployment
- preserve rollback
- no production seeder
- no invented business facts
- no checkout activation before real inventory/auth/shipping E2E
- no payment activation before explicit payment gate
- do not remove the animated top/header bar
- owner approval required before frontend public switch

---

## END CHECKPOINT

**Status:** `P4-ACT IN PROGRESS`

**Last closed gate:** `S3-DATA-MEDIA-R1 = PASS`

**Exact NEXT:** `S3-DATA-B1-R2 — Controlled Catalog Import + SSR Acceptance`
