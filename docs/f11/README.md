# F11 — Art Direction and Design System 2.0

این فاز جهت تصویری انتخاب‌شده در F10 را به یک قرارداد اجرایی تبدیل می‌کند.

## North Star

**Tehran After Dark — Editorial Utility**

- ۷۰٪ وضوح محصول و تجارت
- ۲۰٪ روایت ادیتوریال
- ۱۰٪ نمایش خلاقانه

## خروجی‌های اجرایی

- معماری سه‌سطحی Primitive / Semantic / Component tokens
- پالت سطح‌ها، متن‌ها، Actionها و Statusها
- Scale واحد برای Space، Radius، Shadow، Layer و Motion
- تایپوگرافی فارسی و Technical metadata
- Grid چهار، هشت و دوازده‌ستونه
- Primitiveهای قابل استفاده مجدد با State کامل
- صفحه زنده `/design-system` با `noindex`
- سه Composition proof برای Utility، Narrative و Reading
- قرارداد Photography و Media
- Visual Regression موبایل و دسکتاپ

## فایل‌های اصلی

- `src/styles.css`
- `src/lib/design-system.ts`
- `src/components/lbb/ui/primitives.tsx`
- `src/routes/design-system.tsx`
- `tests/design-system.spec.ts`
- `tests/visual.spec.ts`

## قوانین استفاده

1. مقدار خام رنگ در Component مجاز نیست.
2. صفحات جدید فقط Semantic token مصرف می‌کنند.
3. Signal برای CTA، Focus و State مهم است؛ رنگ تزئینی عمومی نیست.
4. Component بدون Default، Hover، Focus، Active، Disabled، Loading و Error کامل محسوب نمی‌شود.
5. Motion باید Reduced Motion pair داشته باشد.
6. سطح Narrative حق ندارد Product Truth را تغییر دهد.
7. متن فارسی و Metadata لاتین نقش‌های جدا دارند.

## مرز F11

این فاز Global Shell، Homepage، PLP یا PDP را بازطراحی نمی‌کند. زیرساخت و قرارداد آن‌ها را برای F12 تا F18 آماده می‌کند. Aliasهای قدیمی عمداً حفظ شده‌اند تا مهاجرت مرحله‌ای بدون شکست Routeها انجام شود.

## Handoff

فاز بعدی، F12، باید Navbar، Mega Menu، Mobile Navigation، Search Overlay، Footer و Overlay contract را فقط با Primitiveها و Tokenهای F11 بازسازی کند.
