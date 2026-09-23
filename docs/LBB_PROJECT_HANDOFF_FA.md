# تحویل وضعیت و نقشه ادامه پروژه LBB

> آخرین به‌روزرسانی: ۲۰۲۶-۰۹-۲۳  
> زبان سند: فارسی  
> وضعیت: مرجع ادامه کار پس از انتشار PR #101

## ۱. هدف این سند

این فایل خلاصه کامل اقداماتی است که در مرحله اخیر انجام شد، وضعیت واقعی Production و Backend را ثبت می‌کند و نقشه مرحله بعد را مشخص می‌سازد. در ادامه پروژه، این سند باید پیش از هر تغییر جدی خوانده و با نتیجه کار به‌روز شود.

## ۲. مرجع‌های قطعی Git و Production

| مورد | مقدار |
|---|---|
| مخزن Frontend | `sajadkhavas/lbb` |
| شاخه مبنای Production | `fix/lbb-local-boutique-homepage` |
| شاخه Hotfix تکمیل‌شده | `fix/final-home-customer-copy-20260917` |
| Commit هات‌فیکس | `7f976777f4f735e30751c53d0127081b9b4230da` |
| Pull Request | [#101](https://github.com/sajadkhavas/lbb/pull/101) |
| Merge SHA و نسخه فعال | `199931b5b43a8e564f7ae5a21d39a0410063bef6` |
| Release فعال | `/var/www/lbb/releases/199931b5b43a8e564f7ae5a21d39a0410063bef6` |
| Release آماده Rollback | `/var/www/lbb/releases/58d3fbc037f7381846f3e43ba88a2074aaa1fc18` |
| Backend فعال در زمان کار | `ee83534bf28d0367a5547f02406bfec50f58b109` |
| سرویس Frontend | `lbb.service` |
| دامنه Frontend | `https://lbbclo.com` |
| API عمومی | `https://api.lbbclo.com` |

نکته مهم: هنگام ایجاد این سند، شاخه `main` عقب‌تر از نسخه Production بود. بنابراین مبنای این مستند و PR آن، شاخه واقعی Production یعنی `fix/lbb-local-boutique-homepage` است. تا وقتی ساختار شاخه‌ها رسماً یکپارچه نشده، نباید صرفاً با فرض اینکه `main` مرجع انتشار است کار کرد.

## ۳. کارهای انجام‌شده

### ۳.۱. اصلاح Header و Hero

- مشکل Header در نمایش اولیه بررسی و نسخه اصلاح‌شده وارد Production شد.
- برچسب‌های SSR هدر برای «فروشگاه»، «کالکشن‌ها»، «لوک‌بوک» و «ژورنال» تأیید شدند.
- تنظیم تصویر Hero از پنل مدیریت تثبیت شد:
  - `heroImageFit=cover`
  - `heroImagePosition=center center`
  - متن جایگزین: «نمای داخلی فروشگاه پوشاک LBB در پاساژ مهستان کرج»
- نتیجه نهایی انتشار:
  - `HEADER_FIX=LIVE`
  - `HERO_FIX=LIVE`

### ۳.۲. اصلاح متن‌های مشتری‌محور Frontend

در ۱۳ فایل Frontend، ۳۱ خط اضافه و ۲۸ خط حذف شد. هدف، حذف متن‌های فنی و تبدیل آن‌ها به متن قابل‌فهم برای مشتری بود.

فایل‌های تغییرکرده:

- `src/components/lbb/home/CategoryGateway.tsx`
- `src/components/lbb/home/LocalStoreVisit.tsx`
- `src/components/lbb/home/ProductMoments.tsx`
- `src/components/lbb/navigation/CatalogTaxonomyMenu.tsx`
- `src/components/ui/sonner.tsx`
- `src/lib/storefront-presentation.tsx`
- `src/routes/contact.tsx`
- `src/routes/lookbook.tsx`
- `src/routes/privacy.tsx`
- `src/routes/search.tsx`
- `src/routes/shipping-returns.tsx`
- `src/routes/shop.tsx`
- `src/routes/terms.tsx`

نمونه تبدیل‌ها:

- متن‌هایی مانند `Backend`، `Frontend`، `Delivery API` و `ADMIN / PUBLISHED POLICY` از مسیرهای ممیزی‌شده حذف شدند.
- توضیح کالکشن از متن فنی انتشار داده به متن مرور مجموعه‌ها تبدیل شد.
- توضیح ژورنال به متن مشتری‌محور درباره خواندن مطالب LBB تبدیل شد.
- متن FAQ درباره وضعیت Live و پنل مدیریت به متن ساده فروشگاهی تبدیل شد.
- عنوان‌های فنی فرم تماس، سیاست‌ها، روش‌های ارسال و جستجو به عبارات قابل‌فهم برای مشتری تبدیل شدند.
- پیام‌های خطای قابل مشاهده نیز از اصطلاحات داخلی سیستم فاصله گرفتند.

### ۳.۳. اصلاح محتوای مدیریت‌شده Backend

محتواهای زیر مستقیماً در داده‌های مدیریت‌شده فروشگاه اصلاح شدند:

- presentation صفحه‌های:
  - Collections
  - Journal
  - FAQ
- صفحه «شرایط استفاده»
- صفحه «حریم خصوصی»
- صفحه «ارسال، تعویض و مرجوعی»

در این محتواها عبارت‌های فنی مانند `Backend`، `Frontend`، `Delivery API`، «در حالت live» و «پنل مدیریت» حذف و با توضیحات مناسب مشتری جایگزین شدند.

Backupهای JSON ثبت‌شده پیش از تغییر محتوای مدیریت‌شده و تنظیمات فروشگاه:

- `/var/backups/lbb/store-settings/final-customer-copy-before-20260919T084138Z.json`
- `/var/backups/lbb/store-settings/shipping-copy-before-20260919T090428Z.json`

این دو فایل، Backup کامل دیتابیس نیستند؛ Exportهای JSON مربوط به محتوای مدیریت‌شده و تنظیمات فروشگاه‌اند. تغییرات Backend داخل Commit فرانت‌اند نیستند؛ بنابراین هنگام بازیابی یا انتقال محیط باید این فایل‌ها و وضعیت واقعی دیتابیس جداگانه بررسی شوند.

### ۳.۴. یکپارچه‌سازی فونت Estedad

- فونت اصلی صفحه، عنوان‌ها، متن‌ها، اعداد و برچسب‌های فنی روی `Estedad Variable` تثبیت شد.
- چهار Asset فونت Estedad در Build تأیید شد.
- ارجاع JetBrains در خروجی هدف باقی نماند.
- کامپوننت Sonner چون CSS داخلی خودش Font Stack سیستم داشت، به‌صورت صریح با این مقدار اصلاح شد:

```tsx
fontFamily: '"Estedad Variable", "Vazirmatn", sans-serif'
```

نتیجه نهایی انتشار:

- `ESTEDAD_TYPOGRAPHY=LIVE`
- `CUSTOMER_COPY=LIVE`

## ۴. تست‌ها و شواهد پذیرش

موارد زیر قبل و بعد از انتشار تأیید شدند:

- `npm run typecheck`: موفق
- Build با Nitro preset برابر `node-server`: موفق
- Canary مستقل: HTTP 200
- تست ۱۳ مسیر Canary: موفق
- تست همان ۱۳ مسیر روی Public Production: موفق
- `nginx -t`: موفق
- CWD سرویس Production با Release فعال یکسان
- سرویس Production در وضعیت `active`
- صفحه اصلی عمومی HTTP 200

مسیرهای پذیرش‌شده:

1. `/`
2. `/shop`
3. `/collections`
4. `/faq`
5. `/contact`
6. `/shipping-returns`
7. `/terms`
8. `/privacy`
9. `/account`
10. `/wishlist`
11. `/checkout`
12. `/search`
13. `/lookbook`

## ۵. خطاهای مهمی که رخ داد و درس آن‌ها

### ۵.۱. Paste شدن خودکار دستورات Shell

در برخی ترمینال‌ها Paste چندخطی بلافاصله اجرا شد و باعث مخلوط شدن دستورات یا اجرای ناقص Here Document شد. برای دستورات بعدی باید از فرم زیر استفاده شود تا کاربر کل متن را Paste کند و بعد با Enter اجرا شود:

```bash
bash <<'BASH'
set -Eeuo pipefail

# commands
BASH
```

### ۵.۲. انتقال Base64/Gzip بزرگ

یک Payload بزرگ Base64/Gzip ناقص Paste شد و خطاهای CRC و Length ایجاد کرد. برای تغییرهای مهم ترجیح داده شود:

- Here Document خوانا؛
- Patch کوچک و قابل ممیزی؛
- یا Script موقت با Hash/Length کنترل‌شده.

از Payload فشرده بزرگ برای عملیات حساس Production استفاده نشود مگر اینکه صحت کامل داده قبل از اجرا کنترل شود.

### ۵.۳. URLهای Markdown داخل Command

در یک دستور، URL به شکل Markdown یعنی `[https://...](https://...)` وارد Shell شد. URL داخل دستور باید همیشه URL خام باشد.

### ۵.۴. مسیر اشتباه JSON در Bootstrap

یک Verification اولیه به دلیل فرض اشتباه درباره مسیر `page` با `KeyError` متوقف شد. مسیر واقعی داده با Walk بازگشتی کشف شد:

`root.data.settings.page.page.presentation`

در Verificationهای بعدی ابتدا کلیدهای واقعی Response بررسی شود و سپس Assertion انجام شود.

### ۵.۵. Build اشتباه برای Canary

یک Build با preset برابر `cloudflare-module` تولید شد. فایل `.output/server/index.mjs` در آن حالت به‌عنوان Node Server دائمی مناسب نبود و سرویس Canary بلافاصله خارج شد. راه‌حل:

- Build سروری با `NITRO_PRESET=node-server`
- سپس اجرای `.output/server/index.mjs`
- بعد Readiness loop و Route audit

## ۶. وضعیت فعلی و محدودیت ممیزی قبلی

مرحله اخیر با موفقیت منتشر شد، اما ممیزی متن‌های فنی فقط مسیرهای اصلی و متن SSR قابل مشاهده آن‌ها را پوشش داد. این ممیزی اثبات نمی‌کند که تمام حالت‌های تعاملی پاک شده‌اند.

مکان‌هایی که هنوز باید عمیق بررسی شوند:

- صفحه جزئیات محصول
- پیش‌نمایش سریع محصول / Quick View
- Modalها و Drawerها
- Toastها پس از عملیات
- پیام‌های خطای API
- حالت بدون موجودی یا Variant نامعتبر
- گالری، انتخاب رنگ و سایز
- سبد خرید و Checkout در حالت‌های شکست
- حساب کاربری، آدرس‌ها، سفارش‌ها و لغو سفارش
- پاسخ خطاهای Backend که ممکن است مستقیماً به UI نشت کنند
- متون Panel/Admin که نباید به Storefront برسند
- Metadata، JSON-LD، `aria-label` و متن‌های فقط Client-side

بنابراین عبارت «متن‌های فنی حذف شدند» فقط برای محدوده ممیزی‌شده مرحله قبل صحیح است، نه کل پروژه در همه Stateها.

## ۷. هدف مرحله بعد

هدف اصلی مرحله بعد دیگر یک اصلاح متن کوچک نیست؛ باید اطلاعات واقعی کارفرما و کاتالوگ واقعی وارد شوند، Backend به‌طور جامع بررسی و اصلاح شود و سپس ادیت نهایی انجام گیرد.

ترتیب قطعی کار:

### فاز A — دریافت و تثبیت اطلاعات واقعی کارفرما

- نام و هویت برند
- لوگو، Favicon و تصاویر رسمی
- آدرس دقیق فروشگاه
- شماره تلفن و واتساپ
- اینستاگرام و شبکه‌های اجتماعی
- ساعات کاری
- اطلاعات تماس و پشتیبانی
- روش‌های ارسال و هزینه‌ها
- سیاست تعویض، مرجوعی و بازپرداخت
- وضعیت واقعی پرداخت آنلاین
- متن درباره ما، FAQ و صفحات حقوقی
- اطلاعات SEO پایه برند

هیچ ادعای تجاری یا حقوقی نباید بدون تأیید کارفرما منتشر شود.

### فاز B — بارگذاری محصولات واقعی

برای هر محصول حداقل این داده‌ها لازم است:

- عنوان و Slug
- SKU یا کد محصول
- دسته‌بندی و کالکشن
- توضیح کوتاه و کامل
- قیمت عادی و قیمت فروش ویژه
- موجودی واقعی
- وضعیت انتشار
- تصاویر اصلی و Gallery
- Alt تصاویر
- رنگ‌ها، سایزها و Variantها
- موجودی هر Variant
- جنس، فیت، راهنمای سایز و نگهداری
- وزن یا اطلاعات ارسال در صورت نیاز
- SEO Title و Meta Description
- محصول‌های مرتبط
- وضعیت Featured/New/Sale فقط بر اساس داده واقعی

ورود داده باید ابتدا روی محیط کنترل‌شده یا با Backup و Transaction انجام شود. تصاویر باید پیش از انتشار از نظر نام فایل، ابعاد، فرمت، حجم و Alt استاندارد شوند.

### فاز C — ممیزی جامع Backend

Backend باید مشابه یک پروژه Production کامل بررسی شود، نه فقط Endpointهای ظاهری. محدوده بررسی:

- مدل‌ها، Migrationها و Constraintها
- API Contract و Versioning
- Resource/Serializerها
- Validation درخواست‌ها
- سطح دسترسی و Authorization
- Filament/Admin UX
- آپلود، حذف و ترتیب تصاویر
- Product، Category، Collection و Variant
- قیمت، تخفیف و موجودی
- Race condition موجودی
- جستجو، مرتب‌سازی و Filter
- Wishlist و Cart
- OTP و حساب کاربری
- آدرس‌ها و سفارش‌ها
- لغو سفارش
- ارسال و محاسبه هزینه
- پرداخت، Callback و Idempotency
- Queue، Scheduler و Retry
- Rate limiting
- Log، Monitoring و Error handling
- Cache و invalidation
- CORS، Cookie و Security headerها
- Backup و Restore
- تست‌های Feature/Integration
- نشت پیام فنی Backend به Storefront

### فاز D — تست جریان واقعی فروشگاه

سناریوهای اصلی:

1. مشاهده فهرست محصول
2. جستجو و فیلتر
3. بازکردن Quick View
4. ورود به جزئیات محصول
5. انتخاب رنگ و سایز
6. افزودن به Wishlist
7. افزودن و ویرایش Cart
8. ورود با OTP
9. ثبت یا انتخاب آدرس
10. انتخاب روش ارسال
11. Checkout
12. پرداخت موفق، ناموفق و Callback تکراری
13. نمایش سفارش در حساب
14. لغو سفارش طبق قانون واقعی
15. بررسی رفتار محصول ناموجود و Variant نامعتبر

### فاز E — ادیت نهایی Frontend و Copy

پس از تثبیت داده و Backend:

- Sweep کامل عبارت‌های فنی در Source، Build و Runtime
- بررسی جزئیات محصول و Quick View
- یکپارچه‌سازی لحن فارسی
- رفع متن‌های آزمایشی و Placeholder
- اصلاح Layout، Responsive و RTL
- Accessibility و Keyboard
- SEO و Structured Data
- Performance تصاویر و Bundle
- مرور نهایی موبایل و دسکتاپ
- بررسی Font در Componentهای Third-party

### فاز F — انتشار نهایی

- Branch مستقل برای هر Scope
- Commitهای کوچک و قابل بازبینی
- Pull Request بدون Force Push یا بازنویسی تاریخچه
- CI، Typecheck، Build و Test
- Build با `NITRO_PRESET=node-server`
- Canary روی Port مستقل
- ممیزی مسیرها و جریان خرید
- Backup قبل از تغییر دیتابیس
- ساخت Release تغییرناپذیر
- جابه‌جایی اتمیک Symlink
- Restart و Readiness
- پذیرش Public
- نگه‌داشتن Rollback
- ثبت SHA نهایی در همین سند

## ۸. قواعد ایمنی ادامه پروژه

- ابتدا کشف و Backup؛ سپس Mutation.
- Production فعال مستقیماً ویرایش نشود.
- هر Release باید مسیر مستقل مبتنی بر SHA داشته باشد.
- هیچ Deployment بدون Canary انجام نشود.
- هیچ Migration یا تغییر داده بدون Backup و برنامه Restore اجرا نشود.
- از `git reset --hard`، Force Push و بازنویسی تاریخچه منتشرشده استفاده نشود.
- تغییرات موجود کاربر در Worktree نباید ناخواسته حذف یا Stage شوند.
- URL داخل Bash خام باشد، نه Markdown.
- دستورات چندخطی برای کاربر با `bash <<'BASH'` ارسال شوند.
- هر Assertion باید بر اساس Contract واقعی API باشد، نه مسیر حدسی JSON.
- متن خطای فنی Backend نباید مستقیماً برای مشتری نمایش داده شود.
- اطلاعات واقعی محصول و سیاست فروشگاه بر داده نمونه یا حدس اولویت دارند.

## ۹. ورودی‌های لازم برای شروع مرحله بعد

پیش از شروع بارگذاری محصولات، باید از کارفرما یا منبع معتبر دریافت شود:

- فایل محصولات: Excel/CSV یا خروجی سیستم موجود
- پوشه تصاویر اصلی
- جدول قیمت و موجودی
- جدول رنگ و سایز
- دسته‌بندی و کالکشن موردنظر
- قوانین ارسال و مرجوعی
- وضعیت قطعی درگاه پرداخت
- مشخصات تماس و برند
- تأیید متن‌های حقوقی و تجاری

اگر فایل ساختاریافته وجود ندارد، ابتدا یک Template استاندارد Import ساخته شود و اطلاعات پراکنده مستقیماً وارد دیتابیس نشوند.

## ۱۰. معیار پایان واقعی پروژه

پروژه زمانی «نهایی» محسوب می‌شود که:

- اطلاعات کارفرما واقعی و تأییدشده باشد؛
- محصولات و موجودی واقعی بارگذاری شده باشند؛
- تمام Variantها و تصاویر درست کار کنند؛
- Backend و Admin ممیزی و اصلاح شده باشند؛
- جریان کامل خرید با داده واقعی تست شده باشد؛
- هیچ متن فنی داخلی در UI مشتری دیده نشود؛
- SEO، Accessibility و Performance بررسی شده باشند؛
- Canary و Public acceptance موفق باشند؛
- Release و Rollback هر دو قابل شناسایی و عملیاتی باشند؛
- SHA نهایی و Backupهای نهایی در این سند ثبت شده باشند.

## ۱۱. نقطه شروع جلسه بعد

جلسه بعد از «کشف منبع اطلاعات محصولات واقعی» آغاز شود. نخست مشخص شود محصولات و تصاویر در کدام منبع قرار دارند:

- Excel/CSV
- پوشه تصاویر
- سایت یا فروشگاه قبلی
- اینستاگرام
- اطلاعات دستی کارفرما

پس از آن، Schema واقعی Product/Variant/Media در Backend خوانده و Template ورود اطلاعات مطابق همان Contract ساخته شود. قبل از این مرحله نباید Import گسترده یا ادیت نهایی Copy انجام شود.


## ۱۲. راستی‌آزمایی ثبت GitHub پس از PR #102

این بخش در ۲۰۲۶-۰۹-۲۰ برای ثبت نتیجه تطبیق سند با GitHub افزوده شد. موارد زیر درباره نسخه اولیه این سند و PR #102 تأیید شده‌اند:

- سند اصلی در مسیر `docs/LBB_PROJECT_HANDOFF_FA.md` قرار دارد.
- Pull Request شماره [#102](https://github.com/sajadkhavas/lbb/pull/102) با وضعیت `MERGED` بسته شده است.
- Merge Commit مربوط به PR #102 برابر `ecfa5c4b22663b8e9a60f9bd2bd1caf3e73fcc3b` است.
- PR #102 فقط یک فایل مستنداتی اضافه کرد.
- آمار نسخه اولیه PR #102 دقیقاً `389 additions` و `0 deletions` بود.
- Base آن PR شاخه `fix/lbb-local-boutique-homepage` بود.
- PR #102 هیچ فایل Frontend، Backend، تنظیمات اجرایی یا Production را تغییر نداد.
- اصلاحات Header، Hero، Estedad و متن‌های مشتری‌محور در سند ثبت شده‌اند.
- PR #101 و Production SHA برابر `199931b5b43a8e564f7ae5a21d39a0410063bef6` ثبت شده‌اند.
- Rollback SHA برابر `58d3fbc037f7381846f3e43ba88a2074aaa1fc18` ثبت شده است.
- Backend SHA مشاهده‌شده برابر `ee83534bf28d0367a5547f02406bfec50f58b109` ثبت شده است.
- تغییرات Frontend و محتوای مدیریت‌شده Backend به‌صورت جداگانه توضیح داده شده‌اند.
- نتایج Typecheck، Build، Canary، Nginx و تست ۱۳ مسیر ثبت شده‌اند.
- خطاهای Shell، Base64/Gzip، URL مارک‌داون، مسیر اشتباه JSON و Nitro preset ثبت شده‌اند.
- محدودیت ممیزی Product Detail، Quick View، Modal، Toast، خطاهای API، Cart و Checkout ثبت شده است.
- برنامه تکمیل اطلاعات کارفرما، ورود محصولات واقعی، ممیزی Backend، تست خرید و انتشار نهایی وجود دارد.
- قواعد Backup، Branch، Canary، Release و Rollback و معیار پایان واقعی پروژه ثبت شده‌اند.
- در زمان ثبت PR #102، شاخه Production از `main` جلوتر بود؛ بنابراین مرجع ادامه کار `fix/lbb-local-boutique-homepage` تعیین شد.

### تصحیح واژگان Backup

عبارت درست در این سند «Backupهای محتوای مدیریت‌شده و تنظیمات فروشگاه» است. دو فایل JSON ثبت‌شده نباید به‌عنوان Backup کامل دیتابیس معرفی شوند. اگر در مراحل بعد Backup کامل دیتابیس تهیه شود، باید مسیر، زمان، روش Restore و سطح پوشش آن جداگانه در همین سند ثبت گردد.


## ۱۳. به‌روزرسانی عملیاتی پنل، کاتالوگ و Production — ۲۰۲۶-۰۹-۲۳

> این بخش ادامه‌ی مستقیم checkpoint قبلی است و وضعیت مشاهده‌شده در دیتابیس Production، API عمومی و پنل مدیریت را ثبت می‌کند. تغییرهای داده‌ای این مرحله مستقیماً در Backend Production انجام شده‌اند و بخشی از Commit فرانت‌اند نیستند.

### ۱۳.۱. مرجع‌های فعلی

| مورد | مقدار |
|---|---|
| شاخه مرجع ادامه | `fix/lbb-local-boutique-homepage` |
| سند تحویل | `docs/LBB_PROJECT_HANDOFF_FA.md` |
| Backend فعال مشاهده‌شده | `/var/www/lbb/backend/releases/ee83534bf28d0367a5547f02406bfec50f58b109` |
| Frontend Production ثبت‌شده در checkpoint قبل | `/var/www/lbb/releases/199931b5b43a8e564f7ae5a21d39a0410063bef6` |
| API عمومی | `https://api.lbbclo.com` |
| Storefront | `https://lbbclo.com` |

قبل از هر Deployment بعدی، SHA و Symlink واقعی Frontend و Backend دوباره به‌صورت Read-only بررسی شوند؛ مقادیر بالا آخرین وضعیت ثبت‌شده‌اند، نه مجوز فرض‌کردن وضعیت آینده.

### ۱۳.۲. محصولات واقعی منتشرشده

چهار محصول واقعی زیر منتشر، فعال و Featured شده‌اند. `ApparelPublicationGuard::issues()` برای هر چهار محصول آرایه خالی برگردانده است.

| محصول | کد | Slug | دسته | موجودی | Variant فعال | Media | ردیف راهنمای سایز |
|---|---|---|---|---:|---:|---:|---:|
| کتونی Vans Knu Skool مشکی سفید | `LBB-SHOE-VANS-KNU-BW` | `ktony-vans-knu-skool-mshky-sfyd` | `shoes` | 160 | 8 | 3 | 8 |
| جوراب Wake Up ایسی | `LBB-SOCK-EASY-WAKEUP-BL` | `gorab-wake-up-aysy` | `socks` | 40 | 2 | 1 | 4 |
| تیشرت باکسی Dupu ذغالی | `LBB-TSHIRT-DUPU-BOX-CH` | `tyshrt-baksy-dupu-thghaly` | `tshirts` | 80 | 4 | 4 | 12 |
| شلوار جین پرینتی Acne Studios | `LBB-JEANS-ACNE-PRINT-BAG` | `shloar-gyn-prynty-acne-studios` | `pants` | 60 | 3 | 4 | 12 |

- API صفحه اصلی هر چهار محصول را برمی‌گرداند.
- صفحه عمومی هر چهار محصول HTTP 200 دارد.
- محصولات نمونه قدیمی با IDهای ۱ تا ۸ همچنان `archived`، غیرفعال و غیرفیچر هستند.
- Mediaهای واقعی به `product_media_assets` منتقل شدند.
- Evidenceهای `media` و `size_guide` برای انتشار تأیید شدند.
- دسته canonical تیشرت از `tyshrt` به `tshirts` اصلاح شد؛ مسیر `/tshirts` اکنون 200 و مسیر قدیمی `/tyshrt` به‌طور مورد انتظار 404 است.
- دسته‌های عمومی فعال: `tshirts`، `pants`، `shoes` و `socks`.
- دسته هودی عمداً از Header و Home مخفی مانده است.

### ۱۳.۳. راهنماهای سایز

- راهنمای سایز و Measurementهای ساختاریافته برای هر چهار محصول متصل شده‌اند.
- کتونی: سایزهای ۳۷ تا ۴۴ و طول پا:
  - ۳۷ = ۲۳٫۵
  - ۳۸ = ۲۴
  - ۳۹ = ۲۵
  - ۴۰ = ۲۶
  - ۴۱ = ۲۶٫۵
  - ۴۲ = ۲۷
  - ۴۳ = ۲۸
  - ۴۴ = ۲۸٫۵ سانتی‌متر
- ترتیب سایزهای عددی کفش روی `sort_order`های ۱۰۰ تا ۱۰۷ تثبیت شد.
- تیشرت: S/M/L/XL با سرشانه، عرض سینه و قد؛ ۱۲ ردیف.
- شلوار: XL/XXL/XXXL با اندازه‌های تأییدشده؛ ۱۲ ردیف.
- جوراب: M/L و بازه شماره کفش؛ ۴ ردیف.
- جدول راهنمای سایز در Storefront اکنون داده دارد.

مشکل باقی‌مانده Frontend: عنوان عمومی «اندازه خود لباس» برای کتونی مناسب نیست. در Deployment نهایی باید عنوان براساس نوع محصول نمایش داده شود؛ برای کفش عبارتی مانند «راهنمای سایز کفش / طول پا» استفاده شود.

### ۱۳.۴. Backupهای داده‌ای این مرحله

- `/var/www/lbb/backend/shared/backups/size-guides/before-size-guides-20260921-101734.json`
- `/var/www/lbb/backend/shared/backups/product-publish/vans-before-publish-20260921-105814.json`
- `/var/www/lbb/backend/shared/backups/size-guide-measurements/vans-before-measurements-20260921-112635.json`
- `/var/www/lbb/backend/shared/backups/final-product-publish/before-final-three-products-20260921-125652.json`

این فایل‌ها Backupهای موضوعی JSON هستند، نه Backup کامل دیتابیس.

### ۱۳.۵. تنظیمات فروشگاه و صفحات عمومی

اطلاعات زیر در تنظیمات عمومی ثبت و از Bootstrap API تأیید شده‌اند:

- آدرس: کرج، پاساژ مهستان، واحد ۳۰
- تلفن: `026-3256-0477`
- واتساپ: `0902-858-4879`
- اینستاگرام: `https://www.instagram.com/lbbclo`
- ساعات کاری:
  - همه‌روزه ۱۰:۳۰ تا ۱۴:۰۰
  - همه‌روزه ۱۶:۰۰ تا ۲۲:۰۰
- Hero Product: کتونی Vans
- ترتیب دسته‌ها: `tshirts`، `pants`، `shoes`، `socks`
- Home Product Curation: جدیدترین‌ها، تعداد ۴

صفحات `about`، `contact`، `terms` و `privacy` منتشر شده‌اند و مسیرهای عمومی آن‌ها HTTP 200 دارند. Endpointهای `bootstrap`، `faqs`، `lookbook` و `home-products` نیز HTTP 200 دارند.

URL Integrity دوباره بررسی شد و URL مارک‌داونی در مقادیر authoritative زیر باقی نمانده است:

- `brand.identity`
- `contact.public`
- `home.local_store`
- `seo.defaults`
- URLهای Gallery

تنظیم‌های scalar قدیمی `contact.phone`، `contact.email` و `contact.address` خالی‌اند؛ منبع authoritative فعلی `contact.public` است.

### ۱۳.۶. پرداخت، ارسال و سفارش‌ها

- پرداخت توسط کاربر تست شده است.
- ارسال طبق خواسته کارفرما پیاده‌سازی شده است.
- سفارش تست پرداخت‌شده `LBB-260915-K6OCLKRH`:
  - `payment_status=paid`
  - `status=ready`
  - روش ارسال: Tipax
  - جریان `confirmed → preparing → ready` طی شده است.
- یک سفارش تست منقضی و پرداخت‌نشده با شماره `LBB-260915-YGCVYLFJ` هنوز در وضعیت `awaiting_payment/pending` باقی مانده است.
- در `schedule:list` فرمان‌های زیر هر دقیقه ثبت‌اند:
  - `inventory:release-expired`
  - `commerce:expire-reservations`
  - `notifications:dispatch --limit=100`

کار باقی‌مانده: ابتدا بدون Mutation بررسی شود آیا OS cron/Systemd Scheduler واقعاً اجرا می‌شود یا فرمان Expiration آن سفارش قدیمی را طبق منطق خود نادیده می‌گیرد. تا پایان تشخیص، `schedule:run` یا فرمان Expiration دستی اجرا نشود.

### ۱۳.۷. گالری و Instagram

پنج ردیف Gallery برای Reelهای زیر ساخته شده‌اند و فعلاً همگی `is_active=false` هستند:

1. `https://www.instagram.com/reel/DcGtXpCM7NY/`
2. `https://www.instagram.com/reel/DaYWPa6s__B/`
3. `https://www.instagram.com/reel/Db6OhugyOlC/`
4. `https://www.instagram.com/reel/DbWBUn3yVWB/`
5. `https://www.instagram.com/reel/DZ2MB2GsRhv/`

وضعیت فعلی:

| شماره | عنوان | تصویر | فعال |
|---:|---|---|---|
| ۱ | استایل‌های منتخب LBB — شماره ۱ | موجود | خیر |
| ۲ | هنوز عنوان قدیمی دارد | فاقد `image_path` | خیر |
| ۳ | استایل‌های منتخب LBB — شماره ۳ | موجود | خیر |
| ۴ | هنوز عنوان قدیمی دارد | موجود | خیر |
| ۵ | استایل‌های منتخب LBB — شماره ۵ | موجود | خیر |

کارهای باقی‌مانده Gallery:

- تصویر شماره ۲ بارگذاری شود.
- عنوان شماره ۲ و ۴ به الگوی «استایل‌های منتخب LBB — شماره N» اصلاح شود.
- تا اصلاح و پذیرش Crop در Frontend، همه ردیف‌ها غیرفعال بمانند.
- در کارت‌ها پوشش لباس مرکز کادر باشد و سر/صورت مدل داخل Crop اصلی نیفتد.
- `object-fit: cover` همراه با Position مناسب و تست Responsive موبایل/دسکتاپ پیاده شود.
- لینک هر کارت به Reel صحیح باز شود.
- ناسازگاری Schema/Form رفع شود: ستون `gallery_items.image_url` در دیتابیس `NOT NULL` است، ولی فرم Filament آن را اختیاری فرض می‌کند.

### ۱۳.۸. رخداد Production و بازیابی

هنگام بررسی مشکل Upload، اجرای `php artisan optimize:clear` باعث حذف Config Cache شد. Release فعال در آن لحظه Symlink معتبر `.env` نداشت؛ در نتیجه تنظیمات دیتابیس خالی شد و Admin/API پاسخ 500 دادند.

بازیابی انجام‌شده:

- Symlink فایل `.env` به `/var/www/lbb/backend/shared/.env` بازگردانده شد.
- `php artisan config:cache` اجرا شد.
- مالکیت و Permission فایل Config Cache روی `root:lbbapi` و `640` قرار گرفت.
- Production environment، وجود تنظیمات DB، اتصال PDO، API عمومی و Admin Login تأیید شدند.
- نتیجه نهایی: API HTTP 200 و Admin Login HTTP 200.

قانون قطعی جدید:

- روی Production از `php artisan optimize:clear` به‌صورت معمول استفاده نشود.
- فقط Cache هدفمند و با تشخیص قبلی پاک شود.
- اسکریپت Deployment باید پیش از Cache Build، Symlinkهای shared `.env` و shared storage را تضمین کند.
- Release فعال هرگز in-place ویرایش نشود.

### ۱۳.۹. Upload پنل

برای Livewire temp upload:

- مسیر `/var/www/lbb/backend/shared/storage/app/public/livewire-tmp` ایجاد و قابل نوشتن شد.
- مالکیت `lbbapi:www-data` و Mode برابر `2775` ثبت شد.
- Write test با کاربر `www-data` موفق بود.
- چهار تصویر Gallery بارگذاری شدند؛ تصویر شماره ۲ هنوز باقی مانده است.

### ۱۳.۱۰. وضعیت موارد باز

| اولویت | مورد | وضعیت/اقدام بعدی |
|---:|---|---|
| P0 | Scheduler و سفارش منقضی | تشخیص Read-only cron/systemd و منطق command؛ سپس اقدام کنترل‌شده |
| P1 | تصویر Gallery شماره ۲ | Upload، بررسی فایل و حفظ حالت غیرفعال |
| P1 | Crop کارت‌های Instagram | اصلاح Frontend، تست موبایل/دسکتاپ، سپس فعال‌سازی |
| P1 | `image_url` Gallery | هماهنگ‌کردن Migration/Schema با Form |
| P1 | عنوان راهنمای سایز | Product-type aware برای کفش و پوشاک |
| P1 | FAQ | جدول فعلاً خالی است؛ فقط پاسخ‌های تأییدشده کارفرما منتشر شوند |
| P2 | Slug محصولات | Slugهای لاتین خواناتر + Redirect 301 از Slugهای فعلی |
| P2 | اینماد | `trust.enamad_enabled=0` و Badge خالی؛ وابسته به اطلاعات کارفرما |
| P2 | عنوان Gallery ۲ و ۴ | هماهنگ‌سازی با الگوی نهایی |
| P2 | QA نهایی | Runtime، Responsive، Checkout failure states، SEO و Accessibility |

### ۱۳.۱۱. مسیر پیشنهادی جلسه بعد

1. این سند و آخرین PRهای باز خوانده شوند.
2. SHA و Symlink واقعی Frontend/Backend و Health سرویس‌ها Read-only بررسی شوند.
3. Scheduler/cron و سفارش منقضی تشخیص داده شوند؛ هیچ فرمان Mutating قبل از نتیجه اجرا نشود.
4. تصویر Gallery شماره ۲ و عنوان‌های ۲ و ۴ تکمیل شوند، اما Gallery غیرفعال بماند.
5. تغییرهای کدی باقی‌مانده در Branch مستقل انجام شوند:
   - Crop/Focal Position گالری
   - عنوان هوشمند راهنمای سایز
   - Nullable contract برای `image_url`
   - Redirectهای Slug
6. Typecheck، Test، Build با `NITRO_PRESET=node-server`، Canary و Route/Flow QA اجرا شوند.
7. با Backup و Rollback مشخص، Release تغییرناپذیر ساخته و Symlink اتمیک جابه‌جا شود.
8. پس از پذیرش Public، SHAها و وضعیت نهایی در همین سند ثبت شوند.

### ۱۳.۱۲. پیام آماده برای شروع چت بعدی

> پروژه LBB را از روی GitHub ادامه بده. ابتدا فایل `docs/LBB_PROJECT_HANDOFF_FA.md` را کامل بخوان و وضعیت واقعی شاخه `fix/lbb-local-boutique-homepage`، PRهای باز، SHAهای Production Frontend/Backend، Symlinkهای Release و Health سرویس‌ها را بدون تغییر بررسی کن. آخرین checkpoint: چهار محصول واقعی منتشر، فعال و guard-clean هستند؛ Media/Evidence و راهنماهای سایز تکمیل شده‌اند؛ صفحات و APIهای اصلی HTTP 200 هستند؛ پنج آیتم Gallery غیرفعال‌اند و شماره ۲ تصویر ندارد؛ عنوان شماره‌های ۲ و ۴ هنوز اصلاح نشده؛ FAQ خالی است؛ یک سفارش پرداخت‌نشده منقضی هنوز `awaiting_payment/pending` است. اول Scheduler/cron و منطق Expiration را Read-only تشخیص بده و نتیجه را گزارش کن. سپس برای موارد باقی‌مانده Plan اجرایی بده. روی Production هرگز `php artisan optimize:clear` اجرا نکن، Release فعال را in-place تغییر نده و هیچ عملیات Expiration دستی را قبل از تشخیص اجرا نکن. تمام تغییرات کد باید Branch/PR، تست، Backup، Canary و Rollback مشخص داشته باشند.
