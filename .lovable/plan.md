
# LBB — فاز نهایی: دیزاین سطح برند + سئوی کامل + PWA

## چیزی که از تحقیق بیرون آمد
از بررسی سایت‌های شاخص پوشاک/استریت‌ویر (SOTF، Dime MTL، Represent، Fear of God، Aimé Leon Dore، Machine-A) الگوهای مشترکی هست که سایت ما هنوز ندارد:

- **گرید ادیتوریال نامتقارن** به‌جای گرید یکنواخت؛ ترکیب کارت‌های بزرگ lifestyle با کارت‌های محصول
- **تایپوگرافی خیلی درشت + فاصله‌گذاری منفی** به‌عنوان عنصر اصلی هویت
- **ریزتعامل‌های آرام**: reveal ماسک‌دار، هاور آهسته روی تصویر (scale 1.03)، ترنزیشن نرم بین صفحات
- **PDP با گالری چسبان و ستون خرید اسکرول‌شونده** در دسکتاپ
- **سرعت به‌عنوان بخشی از دیزاین**: تصویر LCP سبک، بدون CLS، بدون انیمیشن سنگین روی موبایل
- سئو در همهٔ آن‌ها: JSON-LD کامل محصول + breadcrumb، canonical تمیز، محتوای ژورنال

## بخش ۱ — کیفیت بصری (Design Polish)
- **سیستم تایپ و توکن**: انتقال همهٔ `fontFamily`های inline به توکن‌های `styles.css`؛ مقیاس تایپ برندی (display خیلی درشت با tracking منفی)
- **هیرو صفحهٔ اصلی**: reveal ماسک‌دار متن + تصویر با `fetchpriority="high"`
- **گرید ادیتوریال نامتقارن** در بخش Featured و Best Sellers (کارت بزرگ + دو کارت کوچک)
- **هاور یکدست کارت محصول**: swap تصویر + zoom ملایم + نمایش سریع سایزها
- **صفحهٔ محصول**: گالری چسبان دسکتاپ + ستون خرید اسکرول‌شونده
- **ترنزیشن صفحه‌ای نرم** و magnetic buttons روی CTAهای اصلی
- بازبینی دقیق `/lookbook`، `/collections`، `/journal` تا هم‌سطح بقیه شوند

## بخش ۲ — موبایل و ریسپانسیو کامل
- بازبینی تک‌تک روت‌ها در ۳۷۵px و ۴۳۰px با اسکرین‌شات واقعی
- رعایت الگوی گرید برای هدرها (`grid-cols-[minmax(0,1fr)_auto]` + `min-w-0` + `shrink-0`) تا هیچ متنی نشکند
- شیت فیلتر، گالری swipe، نوار خرید چسبان، و فاصلهٔ امن پایین برای `MobileBottomBar`
- هدف لمسی حداقل ۴۴px در همهٔ دکمه‌ها

## بخش ۳ — سئوی کامل (فاز ۷ نقشه)
- بازبینی `head()` هر روت: title یکتا <۶۰ کاراکتر، description <۱۶۰، og/twitter کامل، canonical فقط روی برگ
- **JSON-LD**: `Product` + `AggregateRating` + `Offer` در PDP، `BreadcrumbList` در همهٔ صفحات عمقی، `ItemList` در PLP، `Article` در ژورنال، `FAQPage` در `/faq`، `Organization`+`WebSite`+`SearchAction` در root
- `noindex` روی `/cart`، `/checkout`، `/order-confirmation`، `/search`، `/wishlist`
- canonical صفحات فیلتردار → نسخهٔ بدون پارامتر
- sitemap شامل همهٔ روت‌ها با `lastmod`/`priority`
- alt فارسی معنادار برای همهٔ تصاویر؛ یک `<h1>` در هر صفحه؛ HTML معنایی
- `lang="fa" dir="rtl"` و بررسی نهایی دسترس‌پذیری (focus ring، کیبورد در drawer/مودال، کنتراست AA)

## بخش ۴ — سرعت و پایداری
- `srcset`/`sizes` روی تصاویر بزرگ، AVIF/WebP، ابعاد ثابت برای صفر کردن CLS
- GSAP/ScrollTrigger فقط dynamic import و نزدیک viewport؛ Lenis خاموش روی `prefers-reduced-motion`
- preload فونت اصلی Vazirmatn و کاهش وزن‌ها
- تبدیل هر `<a href>` داخلی باقی‌مانده به `<Link>` + `preload="intent"`

## بخش ۵ — PWA
- `public/manifest.webmanifest` با نام، آیکن‌های ۱۹۲/۵۱۲ و maskable، `theme-color` مشکی، `display: standalone`، `dir: rtl`، `lang: fa` و shortcutهای «فروشگاه» و «سبد خرید»
- تگ‌های `manifest`، `theme-color`، `apple-touch-icon` در root
- **پشتیبانی آفلاین** با `vite-plugin-pwa` (generateSW): HTML با NetworkFirst، asset‌های هش‌دار CacheFirst، ثبت فقط از یک ماژول محافظت‌شده که در preview/iframe/dev هرگز ثبت نمی‌شود و `?sw=off` به‌عنوان کلید خاموشی
- صفحهٔ آفلاین برندشده

> توجه: حالت آفلاین فقط روی نسخهٔ منتشرشده کار می‌کند، نه در پیش‌نمایش Lovable.

## ترتیب اجرا
۱) دیزاین + گریدهای ادیتوریال → ۲) پاس کامل موبایل → ۳) سئو و JSON-LD → ۴) پرفورمنس → ۵) PWA → ۶) بازبینی نهایی با مرورگر واقعی و اسکرین‌شات همهٔ صفحات در دسکتاپ و موبایل

## جزئیات فنی
- بدون بک‌اند؛ همه‌چیز فرانت + localStorage
- پکیج‌های جدید: `vite-plugin-pwa` (و در صورت نیاز `vite-imagetools`)
- بدون تغییر در منطق سبد/علاقه‌مندی؛ فقط لایهٔ ارائه، متادیتا و PWA
