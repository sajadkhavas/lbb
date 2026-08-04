# قرارداد Tokenهای LBB Design System 2.0

## سه سطح Token

### Primitive

مقادیر خام فقط در `src/styles.css` تعریف می‌شوند:

- Palette
- Space
- Duration
- Easing
- Layer
- Shadow

Primitive مستقیماً در Component مصرف نمی‌شود.

### Semantic

Semantic token نقش را توضیح می‌دهد:

- `--lbb-surface-canvas`
- `--lbb-surface-raised`
- `--lbb-text-primary`
- `--lbb-action-primary`
- `--lbb-status-warning`
- `--lbb-focus`

تغییر Theme یا Art Direction باید با تغییر همین لایه انجام شود.

### Component

Component contract از Semantic token و State ساخته می‌شود:

- Button Primary
- Button Secondary
- Field Error
- Panel Elevated
- Status Success
- Choice Selected

صفحه‌ها نباید Stateهای این Componentها را دوباره پیاده‌سازی کنند.

## رنگ

Signal Red حداکثر حدود ۱۰ تا ۱۲ درصد View عادی را اشغال می‌کند. موارد مجاز:

- CTA اصلی
- Focus ring
- Selected state
- خطای مهم
- Campaign accent محدود

موارد غیرمجاز:

- متن طولانی
- پس‌زمینه چند Section پشت سر هم
- تزئین عمومی Borderها
- جایگزین Hierarchy تایپوگرافی

## تایپوگرافی

- Estedad Variable: Display، Heading، Body و UI فارسی
- JetBrains Mono Variable: SKU، Code، Number، Technical label
- متن فارسی نباید Uppercase یا Letter spacing لاتین بگیرد.
- متن خواندنی حداکثر ۷۲ کاراکتر تقریبی عرض دارد.
- Headingها از `text-wrap: balance` و Body از `text-wrap: pretty` استفاده می‌کنند.

## Grid

- Mobile: چهار ستون
- Tablet: هشت ستون
- Desktop: دوازده ستون
- Gutter و Gap Fluid هستند.
- Composition نامتقارن باید همچنان روی Grid قابل توضیح باشد.

## Radius

Raw Precision به معنی حذف کامل Radius نیست:

- Label و Status: Sharp
- Control: Control radius
- Panel: Panel radius
- Media: Media radius
- Hero/Feature: Feature radius
- Swatch: Pill

استفاده تصادفی از Radiusهای بزرگ ممنوع است.

## Motion

- Instant: تغییر کوچک State
- Micro: Hover و Press
- State: Accordion، Filter و Drawer
- Enter: ورود Component
- Reveal: Moment اصلی صفحه

هیچ Action کاربر نباید برای پایان Animation منتظر بماند. Reduced Motion باید اطلاعات و قابلیت کامل را حفظ کند.

## Layer

- Base
- Raised
- Sticky
- Navigation
- Overlay
- Modal
- Toast

عدد Z-index مستقیم در Component جدید مجاز نیست.

## Migration

Aliasهای `obsidian`, `carbon`, `bone`, `signal`, `metal` و `mute` در F11 حفظ شده‌اند. استفاده جدید باید Semantic باشد و Aliasها در پایان F22 قابل حذف خواهند بود.
