# Product-first Information Architecture

## سطح اول

### Product

- همه محصولات
- هودی
- شلوار
- تیشرت
- کتونی
- جوراب

### Editorial

- کالکشن‌ها
- لوک‌بوک
- ژورنال

### Personal

- حساب کاربری
- علاقه‌مندی‌ها
- سبد خرید

### Service

- راهنمای سایز
- ارسال و مرجوعی
- پیگیری سفارش
- سوالات متداول
- تماس

### Brand

- درباره LBB
- قوانین
- حریم خصوصی

## اولویت بر اساس سطح

- Desktop Navbar: Product entry، Editorial و Actions
- Desktop Mega Menu: دسته‌ها در مرکز، Editorial/Service/Personal در ستون پشتیبان
- Mobile Menu: دسته‌ها قبل از تمام مقصدهای دیگر
- Mobile Bottom Bar: Home، Shop، Search، Wishlist و Cart
- Footer: نسخه کامل IA برای Recovery و Crawl path

## Active State

- Active state فقط با رنگ منتقل نمی‌شود؛ `aria-current="page"` نیز ثبت می‌شود.
- دسته‌های Dynamic از Path واقعی شناسایی می‌شوند.
- مسیرهای تو در تو مانند Product و Collection باید Parent context واضح داشته باشند.

## اصول نام‌گذاری

- Label فارسی برای تصمیم کاربر
- Latin label کوتاه برای هویت Technical
- متن مقصد باید با H1 صفحه هدف هم‌راستا باشد.
- نام مبهم مانند «بیشتر» یا «اکسپلور» بدون توضیح استفاده نمی‌شود.

## SEO و Crawlability

- مقصد اصلی با Link واقعی و URL پایدار ارائه می‌شود.
- Search Overlay جای صفحه Search را نمی‌گیرد.
- Filter یا State موقت Navigation URL مستقل جعلی نمی‌سازد.
- `/account` به دلیل نبود Backend دارای `noindex, nofollow` است.
- Footer مسیر جایگزین Crawlable برای دسته، Editorial و Service فراهم می‌کند.
