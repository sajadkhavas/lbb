# F13 — Homepage Narrative 2.0

F13 صفحه اصلی را از مجموعه‌ای از Sectionهای مستقل به یک مسیر تصمیم‌گیری Product-first تبدیل می‌کند.

## هدف

کاربر در اولین بازدید باید بدون حدس این پاسخ‌ها را بگیرد:

1. LBB چیست؟
2. چه محصولاتی دارد؟
3. از کدام دسته یا قطعه شروع کند؟
4. فیت، متریال و موجودی را کجا بررسی کند؟
5. Drop، Lookbook و Journal چه نقشی در انتخاب دارند؟
6. کدام قابلیت‌ها در نسخه فعلی واقعی نیستند؟

## ترتیب Narrative

1. Identity و Primary CTA
2. وضعیت شفاف نسخه نمایشی
3. Category Gateway
4. Product Moments
5. Drop 01 Story
6. Shop the Look
7. Decision Support
8. Editorial Paths
9. Brand Close
10. Official Updates و Community

## خروجی‌های اجرایی

- Hero بدون JavaScript motion در Above-the-fold
- LCP image preload، eager و dimensioned
- CTA مستقیم Shop و Hoodies
- دسترسی سریع به پنج دسته
- Category Gateway با تعداد محصول و URL واقعی
- چهار Product Moment براساس Merchandising rank
- Drop 01 story متصل به Collection و PDP
- Shop the Look با Product Index همیشه قابل مشاهده
- Decision Support برای Size، Shipping و Material
- Editorial Gateway برای Collection، Lookbook و Journal
- Brand statement با CTA نهایی
- حذف SmoothScroll و Custom Cursor از Homepage
- حذف Countdown و بخش‌های محصول تکراری از Composition

## مرز فاز

F13 صفحه Home را بازطراحی می‌کند و وارد بازطراحی کامل Listing، Search results یا PDP نمی‌شود. داده‌های محصول، سفارش و پرداخت همچنان Frontend-only هستند. هیچ تاریخ انتشار، فروش، نظر مشتری، کمیابی یا Social proof ساختگی اضافه نمی‌شود.

## فایل‌های اصلی

- `src/routes/index.tsx`
- `src/lib/homepage.ts`
- `src/components/lbb/home/HeroNarrative.tsx`
- `src/components/lbb/home/CategoryGateway.tsx`
- `src/components/lbb/home/ProductMoments.tsx`
- `src/components/lbb/home/DropStory.tsx`
- `src/components/lbb/home/DecisionSupport.tsx`
- `src/components/lbb/home/EditorialGateway.tsx`
- `src/components/lbb/home/ShopTheLook.tsx`
- `tests/homepage-narrative.spec.ts`
- `tests/homepage-visual.spec.ts`
