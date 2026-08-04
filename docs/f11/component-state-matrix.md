# Component State Matrix

هر Component تعاملی باید پیش از Merge حالت‌های زیر را تعریف و تست کند.

| Component | Default | Hover | Focus | Active/Selected | Loading | Disabled | Error | Empty |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Button | Label و هدف واضح | تغییر محدود Surface | Focus ring واضح | Feedback فوری | Spinner و `aria-busy` | غیرقابل کلیک و کم‌رنگ | پیام نزدیک Action | — |
| IconButton | Accessible name | Border/Color | Focus ring | `aria-pressed` | Spinner | Disabled | — | — |
| Input | Label و Hint | Border قوی‌تر | Ring و Border | Value واضح | در صورت Remote validation | Disabled surface | `aria-invalid` و Alert | Placeholder کمک‌کننده |
| ChoiceChip | گزینه قابل فهم | Border قوی‌تر | Focus ring | `aria-pressed=true` | — | وضعیت ناموجود | پیام گروه | — |
| Product Card | Media و اطلاعات تصمیم | Media zoom محدود | Link focus | Wishlist state | Skeleton | Variant disabled | Media fallback | — |
| Filter | Label و Count | Highlight | Focus | Applied state | Pending results | Option disabled | Invalid URL normalized | Recovery action |
| Drawer/Dialog | بسته | — | Trigger focus | Focus trap | Loading body | Trigger disabled | Error panel | Empty body |
| Toast/Feedback | پیام کوتاه | Pause اختیاری | Close focus | — | — | — | Alert role | — |
| Gallery | تصویر و Counter | Control highlight | Control focus | Current item | Skeleton | Control disabled | Fallback | No media state |
| Accordion | Trigger و summary | Highlight | Trigger focus | `aria-expanded` | — | Disabled trigger | — | — |

## قرارداد عمومی

- Accessible name برای تمام کنترل‌های Icon-only اجباری است.
- Focus Indicator باید روی سطح تیره و روشن قابل مشاهده باشد.
- Loading نباید Layout را جابه‌جا کند یا Label Action را مبهم کند.
- Disabled و Sold-out دو مفهوم جدا هستند.
- Error باید دلیل و راه اصلاح داشته باشد.
- State فقط با رنگ منتقل نمی‌شود؛ متن، Icon یا Pattern نیز لازم است.
- Hover هیچ‌گاه تنها مسیر کشف اطلاعات یا Action نیست.
- Drag و Swipe جایگزین Button یا Tap دارند.
- Stateهای Local Storage باید در برابر داده خراب مقاوم باشند.

## Primitiveهای ثبت‌شده در F11

- `Surface`
- `Button`
- `IconButton`
- `ChoiceChip`
- `StatusTag`
- `StatePanel`
- `FieldMessage`
- `Frame`
- `Skeleton`
- `EmptyState`

## Gate پذیرش Component جدید

1. استفاده از Semantic token
2. تست Keyboard
3. تست Touch target
4. Focus visible
5. Reduced Motion pair
6. Stateهای Loading/Disabled/Error در صورت ارتباط
7. Axe بدون Serious/Critical violation
8. Visual baseline برای Component یا Template تأثیرپذیرفته
