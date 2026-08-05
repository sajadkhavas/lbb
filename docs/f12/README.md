# F12 — Global Shell and Navigation OS

این فاز قرارداد F11 را به پوسته سراسری و مسیرهای اصلی تجربه تبدیل می‌کند.

## هدف

کاربر باید از هر صفحه بتواند بدون حدس به این مقصدها برسد:

- فروشگاه و دسته‌های محصول
- Search و Search results
- کالکشن، لوک‌بوک و ژورنال
- علاقه‌مندی، سبد و حساب
- راهنمای سایز، ارسال، پیگیری و تماس

## خروجی‌های اجرایی

- مدل مرکزی Information Architecture
- Navbar 2.0 با Active state و Scroll state
- Mega Menu دسته‌محور دسکتاپ
- Navigation تمام‌صفحه موبایل
- Search Overlay با پیشنهاد، Keyboard navigation و Recent Search محلی
- Footer 2.0 با مقصدهای واقعی
- Mobile Bottom Navigation متصل به Overlayها
- Announcement system نسخه‌پذیر و قابل توقف
- Breadcrumb responsive
- مقصد مستقل و صادقانه `/account`
- Cart و Quick View با Browser Back
- قرارداد Global Loading / Empty / Error / Not-found

## قوانین

1. مقصد مستقل نباید به صفحه نامرتبط Redirect شود.
2. Overlay باید با Escape، Back و کنترل Close بسته شود.
3. Focus هنگام بازشدن وارد Overlay و هنگام بستن به Trigger برمی‌گردد.
4. دسته‌های محصول در Navigation موبایل و دسکتاپ قابل مشاهده‌اند.
5. Search term نهایی در URL صفحه `/search` قرار می‌گیرد.
6. Recent Search فقط روی مرورگر فعلی ذخیره می‌شود.
7. Account بدون Backend هیچ وضعیت، سفارش یا پروفایل جعلی نمایش نمی‌دهد.
8. Hover تنها مسیر دسترسی به مقصد یا اطلاعات نیست.
9. Mobile Bottom Bar و Footer مسیر جایگزین واضح دارند.
10. هیچ Overlay نباید Horizontal overflow یا Scroll lock باقی‌مانده ایجاد کند.

## فایل‌های اصلی

- `src/lib/navigation.ts`
- `src/lib/navigation-overlay.tsx`
- `src/lib/overlay-history.ts`
- `src/components/lbb/Navbar.tsx`
- `src/components/lbb/navigation/*`
- `src/components/lbb/MobileBottomBar.tsx`
- `src/components/lbb/Footer.tsx`
- `src/routes/account.tsx`
- `tests/navigation-shell.spec.ts`

## مرز فاز

F12 ساختار Global Navigation را کامل می‌کند، اما بازطراحی Narrative صفحه اصلی، Product Listing و PDP در فازهای بعد انجام می‌شود. هیچ Login، Authentication، Payment یا Order backend در این فاز ساخته نمی‌شود.
