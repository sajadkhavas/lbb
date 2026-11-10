# پیام آماده برای چت بعدی LBB — 2026-11-10

این پروژه فروشگاه پوشاک خیابانی LBB است. اول [وضعیت جاری پروژه](./LBB_CURRENT_EXECUTION_STATUS_FA.md) را بخوان. برای اطلاعات برند و تصمیم‌های کارفرما به `docs/LBB_MASTER_HANDOFF_FA.md` رجوع کن. بخش‌های تاریخی آن سند مبنای وضعیت فعلی سرور نیستند.

## کار فعلی و ترتیب قطعی

1. ابتدا **بقیه محصولات واقعی** را یکی‌یکی ثبت و منتشر کن. شلوار جین پرینتی طبیعت (Nature Printed Denim) طبق اعلام سجاد در سایت ثبت شده است. ادامه از اولین محصول ثبت‌نشده است. برای هر محصول فقط از مشخصات تأییدشده استفاده کن و متن مستقیم از زبان LBB، عنوان، متا، نام فایل و Alt عکس‌ها را آماده کن.
2. بعد از تکمیل محصولات، کاروسل‌های فعلی صفحهٔ اصلی را با حرکت خودکار زمان‌بندی‌شده پیاده کن. خود عکس‌های محصول هم حرکت مستقل داشته باشند. فاصلهٔ زمانی و سبک حرکت در این نقطه نهایی نشده‌اند. رفتار لمس موبایل، کنترل دستی، توقف، کاهش حرکت و هزینهٔ بارگذاری عکس‌ها را تست کن.
3. بعد یک کاروسل تازه به صفحهٔ اصلی اضافه کن. محتوا و جای نهایی آن مشخص نشده‌اند.
4. سپس سئوی بخش‌ها را یکی‌یکی بررسی کن: صفحهٔ اصلی، دسته‌ها، محصولات، لینک‌های داخلی، SSR، اسکیما، تصاویر و سرعت موبایل. برند واقعی، GTIN و MPN فقط برای کالای دارای دادهٔ معتبر بررسی شوند. عنوان و متن یکتا، لینک قابل‌خزش و Alt دقیق را کنترل کن. شمار ثابت تکرار کلمه به محصول تحمیل نکن.
5. **Search Console مرحلهٔ آخر است**. مالکیت، ثبت sitemap، URL Inspection و پایش ایندکس بعد از مراحل بالا. کالکشن تعاملی و ایدهٔ رگال فعلاً کنار گذاشته شده‌اند.

## روش کار با پنل و سرور

- سرور: FE در `/var/www/lbb/current` با `lbb.service` و Nitro `node-server`، BE در `/var/www/lbb/backend/current` با Laravel و `php8.3-fpm.service`. هر دو current پیوند به release هستند.
- اول وضعیت واقعی را بخوان. Release فعال از کپی نسخهٔ قبلی و اعمال پچ ساخته شده، بنابراین `git rev-parse HEAD` لزوماً SHA پچ فعال را نشان نمی‌دهد. وضعیت GitHub، کد اعمال‌شده و وضعیت سرویس را جدا گزارش کن. برای دسترسی SSH از محیط چت فرض نکن که دسترسی وجود دارد. اگر کاربر اجرا می‌کند، بلوک کامل Bash با پیام مرحله و تشخیص خطا بده.
- برای تغییر محتوا یا انتشار محصول از پنل یا مسیر واقعی مدل Laravel استفاده کن. تأیید جداگانهٔ عکس‌ها و `Evidence → media` لازم است. فعال‌بودن با `publication_status=published` فرق دارد. اگر برای ویرایش متن منتشرشده guard نیاز به draft دارد، ذخیره و انتشار دوباره را در تراکنش انجام بده و شناسه، اسلاگ و زمان انتشار را بررسی کن. از تغییر مستقیم دیتابیس برای دورزدن guard استفاده نکن.
- تغییر کد را در شاخهٔ جدا ثبت کن، از نسخهٔ فعال در پوشهٔ جدید کپی بگیر، پچ محدود را با `git apply --check` بررسی کن، روی candidate بیلد و smoke بگیر و بعد با برنامهٔ بازگشت فعال کن. روی این سرور `rsync` در اجرای قبلی موجود نبود. با `tar` کپی کن. Git را فقط با `git -c "safe.directory=$candidate"` برای مسیر مشخص اجرا کن. اگر کپی BE مخزن Git ندارد، پچ را در یک مخزن موقت fetch کن و روی candidate اعمال کن. تنظیم Git سراسری و ویرایش مستقیم release فعال لازم نیست.
- قبل از مایگریشن، محدوده و اثر داده‌ای و روش بازیابی را مشخص کن. دادهٔ مشترک، `.env` و رسانهٔ پایدار را از کپی جدا نکن. برای خطای گذرای 502 بعد از restart با retry محدود تست کن و نتیجه نهایی و مسیر release را ثبت کن.

### نمونه بررسی خواندنی روی سرور

```bash
bash <<'BASH'
set -euo pipefail
readlink -f /var/www/lbb/current
readlink -f /var/www/lbb/backend/current
systemctl is-active lbb.service php8.3-fpm.service

site=https://lbbclo.com
product=/product/shloar-gyn-bg-balony-tosy-roshn-mdl-layt
for path in /pants /shloar "$product" /product/lightweight-grey-baggy-balloon-jeans /sitemap.xml; do
  curl -sS --max-time 15 -o /dev/null \
    -w "$path %{http_code} %{redirect_url}\n" "$site$path"
done

html=$(mktemp)
trap 'rm -f "$html"' EXIT
curl -fsS --compressed --max-time 15 "$site$product" -o "$html"
grep -Fq '"@type":"ProductGroup"' "$html"
echo PRODUCT_GROUP_OK
BASH
```

### نمونه بیلد candidate فرانت

```bash
cd "$candidate"
npm ci --include=dev --no-audit --no-fund
NITRO_PRESET=node-server \
VITE_SITE_URL=https://lbbclo.com \
VITE_LBB_BACKEND_MODE=live \
VITE_LBB_API_BASE_URL=https://api.lbbclo.com \
npm run build
test -s .output/server/index.mjs
```

**از اولین محصول ثبت‌نشده ادامه بده.** بعد از انتشار، URL، عکس‌ها، اندازه‌ها، قیمت و وضعیت گزینه‌ها را در خروجی واقعی بررسی و وضعیت پروژه را در سند جاری ثبت کن.
