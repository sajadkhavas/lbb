# Overlay Contract

این قرارداد برای Mega Menu، Mobile Menu، Search، Cart Drawer و Quick View اجباری است.

## بازشدن

1. Trigger دارای Accessible name و `aria-haspopup="dialog"` است.
2. بازشدن یک History entry با شناسه داخلی Overlay می‌سازد.
3. Scroll صفحه قفل می‌شود.
4. Focus وارد اولین کنترل هدف یا `[data-autofocus]` می‌شود.
5. فقط یک Navigation Overlay هم‌زمان فعال می‌ماند.

## بستن

Overlay با این مسیرها بسته می‌شود:

- Escape
- Close button
- Backdrop در صورت مناسب‌بودن
- Browser Back
- انتخاب مقصد

Close عادی از `history.back()` استفاده می‌کند. انتخاب مقصد Marker را قبل از Navigation حذف می‌کند تا Back اضافی در History باقی نماند.

## Focus

- Tab و Shift+Tab داخل Overlay می‌چرخند.
- پس از Close، Focus به Trigger قبلی برمی‌گردد.
- هنگام انتقال Quick View به Cart، Overlay جدید مالک Focus می‌شود.
- هیچ عنصر پشت Overlay نباید با Keyboard قابل تعامل باشد.

## URL

- Open/Close Overlay Path را تغییر نمی‌دهد.
- مقصد Search نهایی Query را در `/search?q=` ثبت می‌کند.
- Product، Category و Editorial link URL واقعی دارند.
- State محلی مانند Recent Search وارد URL یا Structured Data نمی‌شود.

## Motion

- ورود و خروج تابع Durationهای F11 است.
- Reduced Motion اطلاعات یا قابلیت را حذف نمی‌کند.
- بسته‌شدن برای پایان Animation منتظر نمی‌ماند.

## Acceptance

- Escape closes
- Back closes
- Focus enters and restores
- No horizontal overflow
- No serious/critical Axe violation
- Touch target حداقل 44px
- Route navigation بدون History marker اضافه
- Direct reload مقصد نهایی بدون وابستگی به Overlay
