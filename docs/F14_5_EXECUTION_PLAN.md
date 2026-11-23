# F14.5 — Production Store Foundation

این موج پیش از F15 اجرا می‌شود تا LBB از یک فرانت‌اند نمایشی به فرانت‌اند یک فروشگاه واقعی، منسجم و آمادهٔ اتصال به پنل و بک‌اند تبدیل شود.

## ترتیب اجرا

1. **F14A — Brand & Commerce Constitution**
   - تثبیت هویت محلی: کرج، پاساژ مهستان
   - لحن، شعار، واژگان، قواعد ادعا و مرجع محتوایی
   - حذف تهران از هویت برند

2. **F14B — Store Settings Architecture**
   - Brand, Contact, SEO, Shipping, Returns, Payment, Trust, Legal settings
   - جایگاه کنترل‌شدهٔ اینماد و درگاه
   - Launch Readiness Guard

3. **F14C — Production Content & Product Data**
   - بازنویسی همهٔ صفحات و حالت‌های رابط
   - ممیزی دادهٔ محصولات و حذف ادعاهای تأییدنشده
   - نقشهٔ کلیدواژه و Metadata

4. **F14D — Commerce Frontend Contract**
   - حذف Demo Order و Session Storage order flow از Production
   - Cart, Checkout, Payment, Confirmation, Tracking, Account contracts
   - Adapter تست جدا از رابط Production

5. **F14E — Trust, Legal & Support**
   - ارسال، تعویض، مرجوعی، پرداخت، حریم خصوصی، قوانین و تماس
   - نمایش ادعاها فقط پس از فعال‌سازی تنظیمات واقعی

6. **F14F — Production Content Acceptance**
   - Source audit برای جلوگیری از بازگشت متن‌های Demo
   - تست محتوایی، سئو، دسترس‌پذیری، RTL و مسیر خرید

## خط‌مشی مکان

هویت و سئوی محلی LBB بر این دادهٔ تأییدشده بنا می‌شود:

- شهر: کرج
- مکان حضوری: پاساژ مهستان

تهران نباید در معرفی برند، شعار، Metadata یا Schema فروشگاه به‌عنوان شهر LBB استفاده شود.

## خط‌مشی داده

شماره واحد، طبقه، نشانی کامل، تلفن، ایمیل، ساعت کاری، شرایط ارسال، مهلت مرجوعی، اطلاعات اینماد و تنظیمات درگاه تا زمان دریافت دادهٔ رسمی حدس زده نمی‌شوند. معماری باید جای آن‌ها را آماده کند، اما UI عمومی فقط دادهٔ تأییدشده را نمایش می‌دهد.
