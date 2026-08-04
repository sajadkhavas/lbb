# فرصت‌ها و اولویت اجرای Frontend Excellence

## روش امتیازدهی

برای جلوگیری از اولویت‌گذاری بر اساس سلیقه، هر فرصت با مدل ساده‌شده RICE سنجیده شد:

> Priority Score = Reach × Impact × Confidence ÷ Effort

- Reach: دامنه کاربر یا صفحه تحت‌تأثیر، از ۱ تا ۵
- Impact: اثر بر تجربه و هدف پروژه، از ۱ تا ۵
- Confidence: اطمینان از تحقیق و شواهد، از ۰٫۵ تا ۱
- Effort: تلاش نسبی طراحی، توسعه و QA، از ۱ تا ۸

امتیاز، ترتیب شروع را تعیین می‌کند و جایگزین وابستگی فنی نیست.

## P0 — زیرساخت تجربه

### ۱. Design System 2.0

- Reach: ۵
- Impact: ۵
- Confidence: ۰٫۹۵
- Effort: ۴
- Score: ۵٫۹۴
- Owner Phase: F11

خروجی:

- Tokenهای رنگ، Typography، Space، Radius، Border، Layer و Motion
- Component State Matrix
- Photography و Media Specification
- صفحه مرجع Componentها

دلیل اولویت: تمام بازطراحی‌های بعدی به این قرارداد وابسته‌اند.

### ۲. Global Shell و Mobile Navigation

- Reach: ۵
- Impact: ۵
- Confidence: ۰٫۹۵
- Effort: ۴
- Score: ۵٫۹۴
- Owner Phase: F12

خروجی:

- Navbar و Mega Menu
- Mobile Navigation و Bottom Bar
- Global Search Entry
- Breadcrumb و Footer
- Overlay Contract

دلیل اولویت: تمام Journeyها از Shell عبور می‌کنند.

### ۳. Media Pipeline و Performance Budget

- Reach: ۵
- Impact: ۵
- Confidence: ۰٫۹۵
- Effort: ۵
- Score: ۴٫۷۵
- Owner Phase: F21

خروجی:

- AVIF/WebP
- Responsive Images
- Art Direction و Sizes
- Hero Preload
- Animation و Third-party Budget

دلیل اولویت: بدون آن، افزایش کیفیت بصری مستقیماً Performance را تهدید می‌کند.

### ۴. Product Decision Content

- Reach: ۵
- Impact: ۵
- Confidence: ۰٫۹
- Effort: ۵
- Score: ۴٫۵
- Owner Phase: F15

خروجی:

- On-body، In-scale و Detail Media
- Model Measurement
- Fit، Material و Care
- Complete the Look
- Share و Variant State

### ۵. Catalog Discovery System

- Reach: ۵
- Impact: ۵
- Confidence: ۰٫۹
- Effort: ۵
- Score: ۴٫۵
- Owner Phase: F14

خروجی:

- Applied Filter Overview
- Multi-select Filter
- Density Toggle
- Size، Color، Price، Availability و Collection
- Position Restoration
- Empty Result Recovery

### ۶. Mobile، RTL و Accessibility Contract

- Reach: ۵
- Impact: ۵
- Confidence: ۱
- Effort: ۶
- Score: ۴٫۱۷
- Owner Phase: F19

خروجی:

- Thumb Reach
- Touch Target
- RTL Carousel
- Focus و Zoom
- Drag Alternative
- Reduced Motion

## P1 — تمایز و رشد تجربه

### ۷. Search Intelligence فارسی

- Reach: ۴
- Impact: ۵
- Confidence: ۰٫۸۵
- Effort: ۵
- Score: ۳٫۴
- Owner Phase: F14

خروجی:

- Normalization فارسی و لاتین
- Synonym Map
- Typo Tolerance
- Query Suggestion
- Category Intent
- Recent و Trending Search

### ۸. Homepage Narrative 2.0

- Reach: ۵
- Impact: ۴
- Confidence: ۰٫۸
- Effort: ۶
- Score: ۲٫۶۷
- Owner Phase: F13

خروجی:

- حذف Sectionهای تکراری
- Hero و Drop Story
- Product Discovery
- Editorial Rhythm
- پایان‌بندی به‌یادماندنی

### ۹. Editorial-to-Commerce Linking

- Reach: ۳
- Impact: ۴
- Confidence: ۰٫۸۵
- Effort: ۴
- Score: ۲٫۵۵
- Owner Phase: F17

خروجی:

- Shoppable Lookbook
- Product Annotation
- Related Product/Collection
- Article Topic Cluster
- Position Restoration

### ۱۰. Motion Language

- Reach: ۵
- Impact: ۳
- Confidence: ۰٫۸
- Effort: ۵
- Score: ۲٫۴
- Owner Phase: F18

خروجی:

- Entrance، State، Navigation و Feedback Motion
- Reduced Motion Pair
- Animation Budget
- Cleanup و Lifecycle Contract

### ۱۱. Cart و Wishlist Continuity

- Reach: ۴
- Impact: ۴
- Confidence: ۰٫۹
- Effort: ۶
- Score: ۲٫۴
- Owner Phase: F16

خروجی:

- Undo Remove
- Persistent Wishlist
- Safe Storage Migration
- Recently Viewed Continuity
- Cart State Consistency

### ۱۲. SEO Information Architecture 2.0

- Reach: ۴
- Impact: ۴
- Confidence: ۰٫۹
- Effort: ۶
- Score: ۲٫۴
- Owner Phase: F20

خروجی:

- Keyword-to-Page Map
- Category/Collection Hierarchy
- Faceted Navigation Policy
- Internal Linking Contract
- Image SEO و Social Preview

### ۱۳. Full Visual Regression Coverage

- Reach: ۵
- Impact: ۴
- Confidence: ۰٫۹۵
- Effort: ۸
- Score: ۲٫۳۸
- Owner Phase: F22

خروجی:

- تمام خانواده‌های Route
- Mobile، Tablet، Desktop و Wide
- Empty، Error، Loading و Invalid
- Reduced Motion و Zoom
- Chrome، Firefox و WebKit

## P2 — قابلیت‌های ارزشمند پس از پایه

### ۱۴. My Sizes و Fit Preference

- Reach: ۳
- Impact: ۴
- Confidence: ۰٫۷۵
- Effort: ۵
- Score: ۱٫۸
- Owner Phase: F15/F16

نیازمند تحقیق بیشتر درباره حریم خصوصی، ذخیره‌سازی و ارزش واقعی برای Catalogue محدود است.

### ۱۵. Global Command Search

- Reach: ۳
- Impact: ۳
- Confidence: ۰٫۷
- Effort: ۵
- Score: ۱٫۲۶
- Owner Phase: F12/F14

برای کاربر حرفه‌ای مفید است، اما نباید جای Search استاندارد را بگیرد.

### ۱۶. Compare Products

- Reach: ۲
- Impact: ۳
- Confidence: ۰٫۶۵
- Effort: ۶
- Score: ۰٫۶۵
- Owner Phase: Backlog

برای Catalogue فعلی احتمالاً ارزش کمتر از بهبود Card و PDP دارد.

### ۱۷. 3D Garment یا WebGL Scene

- Reach: ۲
- Impact: ۳
- Confidence: ۰٫۴۵
- Effort: ۸
- Score: ۰٫۳۴
- Owner Phase: F18 Experimental

فقط پس از پاس Performance Budget و اثبات ارزش روایی اجرا می‌شود.

### ۱۸. Sound Design

- Reach: ۱
- Impact: ۲
- Confidence: ۰٫۴
- Effort: ۵
- Score: ۰٫۱۶
- Owner Phase: Reject by Default

Auto-play یا Sound ضروری با North Star سازگار نیست.

## Backlog بر اساس سطح فعلی پروژه

### Homepage

- Audit و حذف Sectionهای تکراری
- تعریف یک Story Arc
- جایگزینی Countdown با Drop Status قابل مدیریت
- افزودن Product Context به Shop the Look
- ساخت پایان‌بندی قوی قبل از Footer

### Shop و Category

- Applied Filter Chips بالای Grid
- Density Toggle با حفظ اطلاعات حیاتی
- Position Restoration
- Product Count پس از هر Filter
- Mobile Bottom Sheet با Summary و Apply State
- توضیح Empty Result بر اساس Filter فعال

### Search

- Synonymهای فارسی و انگلیسی
- تحمل فاصله و نیم‌فاصله
- پیشنهاد Category و Product
- نمایش Query Correction
- Keyboard Active Descendant
- Search Analytics بدون داده شخصی

### PDP

- Model Measurement
- Fit Scale
- Material Story
- Care Icons و متن
- Share
- Complete the Look
- تصویر In-scale و On-body
- Media Counter و Caption

### Editorial

- Look Annotation
- Product Link داخل Journal
- Table of Contents
- Related Article و Collection
- Read Progress فقط در صورت عدم مزاحمت

### Quality

- تمام Route Familyها در Visual Regression
- Browser Matrix
- Slow 4G و CPU Throttling
- Zoom و Text Spacing
- RTL Swipe Regression

## ترتیب پیشنهادی شروع

1. F11 — Design System 2.0
2. F12 — Global Shell
3. F13 و F17 — Homepage و Brand Universe
4. F14 و F15 و F16 — Discovery، PDP و Commerce State
5. F18 — Motion
6. F19 و F20 و F21 — Hardening
7. F22 — Final Lab و Registration

## معیار توقف

کار یک فاز نباید وارد Merge شود اگر:

- با Experience Constitution تعارض دارد.
- Mobile و RTL فقط بعداً قرار است اصلاح شوند.
- Stateهای Loading، Empty، Error یا Disabled تعریف نشده‌اند.
- Feature فقط با Mouse یا Motion کامل کار می‌کند.
- Performance Cost نامشخص است.
- Test یا معیار قبولی ندارد.
- محتوای تجاری غیرواقعی ایجاد می‌کند.

## تصمیم F10

پس از این اولویت‌گذاری، فاز اجرایی بعدی باید **F11 — Art Direction and Design System 2.0** باشد. شروع هم‌زمان بازطراحی صفحه‌ها پیش از تثبیت Token و Component Contract مجاز نیست.
