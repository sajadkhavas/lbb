# Homepage Performance Contract

## Above the fold

`HeroNarrative` باید بدون JavaScript motion رندر شود.

ممنوع در Hero:

- `useEffect`
- GSAP
- ScrollTrigger
- Lenis
- Custom cursor dependency
- Client-side clip reveal برای قابل‌مشاهده‌شدن محتوا

## LCP image

تصویر اصلی Hero باید:

- در Head preload شود
- `loading="eager"` داشته باشد
- `fetchPriority="high"` داشته باشد
- Width و Height صریح داشته باشد
- `sizes` متناسب با Mobile و Desktop داشته باشد
- بدون انتظار برای Hydration قابل درخواست باشد

## Homepage runtime

Homepage نباید `SmoothScroll` یا `CustomCursor` را Mount کند. Scroll و Pointer رفتار Native مرورگر را حفظ می‌کنند.

Animationهای پایین صفحه فقط Progressive enhancement هستند و تحت `prefers-reduced-motion` باید حذف شوند.

## Image loading

- فقط Hero و Product اصلی Above-the-fold Priority می‌گیرند.
- تصاویر Category، Drop، Editorial، Instagram و Productهای پایین صفحه Lazy هستند.
- تمام تصاویر مهم Intrinsic dimensions دارند.
- اطلاعات یا Link نباید فقط داخل تصویر یا Hover قرار بگیرد.

## Layout stability

- Hero dimension ثابت دارد.
- Media frameها Aspect ratio مشخص دارند.
- Navigation و Announcement ارتفاع تعریف‌شده دارند.
- Mobile Bottom Bar از Safe area استفاده می‌کند.
- هیچ Section در عرض‌های 390، 768، 1440 و 1920 نباید Horizontal overflow ایجاد کند.

## Build budgets

Budgetهای عمومی `audit:production` همچنان Blocking هستند. F13 نباید Chunkهای Home را با کتابخانه Motion جدید یا Carousel سنگین افزایش دهد.

## Acceptance gates

- Source audit
- Production build
- Worker smoke
- Playwright narrative tests
- Axe
- Focused visual snapshots
- Full homepage snapshots در چهار عرض
- Worktree stability پس از تولید Artifactها
