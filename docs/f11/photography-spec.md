# Photography and Media Specification

## دو مسیر تصویری

### Product Truth

برای تصمیم خرید:

- پس‌زمینه و نور خنثی
- رنگ واقعی بدون Grade شدید
- Front، Back، Side و Detail
- On-body با قد، سایز و اندازه مدل
- تصویر In-scale
- Close-up بافت، دوخت و چاپ
- Crop ثابت در Grid
- Alt دقیق و غیرتبلیغاتی

### Tehran Narrative

برای Campaign، Collection و Lookbook:

- شب، فلز، شیشه، بتن، پارکینگ، تونل و آسفالت
- Flash مستقیم و Shadow قاطع
- حضور تهران به‌عنوان Context واقعی
- حرکت انسانی و Pose غیرStock
- Sequence شامل Wide، Portrait و Detail
- Caption و Credit واقعی
- لینک قابل Crawl به Look یا Product مرتبط

## ممنوعیت‌ها

- استفاده از Campaign image به‌عنوان تنها تصویر PDP
- تغییر رنگ واقعی پارچه با LUT یا Gradient
- تصویر تزئینی بدون Width/Height
- ویدئوی Auto-play با صدا
- Hero Video اجباری روی موبایل
- Lazy loading تصویر LCP
- تصویر Desktop بسیار بزرگ برای Mobile
- متن ضروری داخل تصویر
- AI Render عمومی به‌جای Context واقعی برند

## Aspect Ratio

- Product Grid: `4/5`
- Product Detail portrait: `4/5`
- Editorial portrait: `3/4`
- Editorial landscape: `16/10` یا `3/2`
- Hero: Art-directed و دارای Crop مستقل Mobile/Desktop

## Responsive Delivery

هر Media جدید در F21 باید:

- AVIF و WebP داشته باشد.
- `srcset` و `sizes` واقعی داشته باشد.
- Width و Height قطعی داشته باشد.
- برای LCP Preload شود.
- برای تصاویر خارج View lazy باشد.
- Placeholder سبک و بدون Layout shift داشته باشد.

## Grade

- Product: Contrast بسیار محدود، Saturation نزدیک واقعیت
- Campaign: Grade مجاز اما Skin tone و Garment color حفظ شود
- Journal: Grade تابع Story، نه فیلتر ثابت تمام تصاویر

## Performance Budget اولیه

- Hero mobile target: حداکثر تقریبی 220KB
- Product card mobile target: حداکثر تقریبی 90KB
- PDP primary target: حداکثر تقریبی 180KB
- Thumbnail target: حداکثر تقریبی 24KB

این اعداد در F21 با Asset واقعی و تست شبکه بازبینی می‌شوند.

## Accessibility

- Alt برای Product شامل نام و زاویه/جزئیات مفید است.
- تصویر صرفاً تزئینی Alt خالی دارد.
- Gallery Counter و کنترل Previous/Next لازم است.
- Swipe تنها روش جابه‌جایی نیست.
- Zoom باید با Keyboard و Touch قابل خروج باشد.
- Motion media تحت Reduced Motion متوقف یا ساده می‌شود.
