# P4 — Commerce Go-Live Candidate

وضعیت این سند: **PRE-ACTIVATION CANDIDATE**

## Baseline

- Frontend P3 registration baseline: `44a7263254cb5f8f01db27ac941fa26258f06f44`
- Backend P3 merge baseline: `5a874d66b5d031fd1ab739a4b7bd8b7c04d4acf6`
- Accepted API contract: `2026-09-06-p3-storefront-v1`

## P4 invariants

- روش‌های رسمی ارسال: `immediate_courier`, `tipax`, `decapost`, `express_post`
- روش‌های ارسال در Live Checkout فقط از Backend API دریافت می‌شوند.
- قیمت، موجودی، Quote، Order و Payment state سمت Backend authoritative هستند.
- مدت رزرو موجودی: ۳۰ دقیقه.
- Checkout و Payment در تنظیمات نمونه و پیش‌فرض Backend خاموش می‌مانند.
- فعال‌سازی هر روش ارسال مستقل و fail-closed است.
- موفقیت پرداخت فقط بعد از Verify سمت Backend پذیرفته می‌شود.
- Frontend در حالت live بدون Backend معتبر fallback تراکنشی ندارد.

## Activation boundary

این candidate به‌تنهایی به معنی استقرار یا فعال‌سازی نیست.

- Production/server mutation: **NO**
- Production deployment: **NO**
- Checkout activation: **NO**
- Payment activation: **NO**

فعال‌سازی فقط پس از سبزشدن Gateهای Frontend و Backend، آماده‌سازی runtime واقعی، بررسی domain/TLS/CORS/Sanctum، داده واقعی، shipping configuration و payment preflight مجاز است.
