# F14 — Product Listing & Discovery 2.0

F14 مسیر کشف محصول را در سه سطح `/shop`، `/$category` و `/search` یکپارچه می‌کند.

## هدف

کاربر باید بتواند:

1. کل کاتالوگ یا یک دسته مشخص را ببیند.
2. نتیجه را با دسته، رنگ، سایز، قیمت و وضعیت موجودی محدود کند.
3. ترتیب نمایش را تغییر دهد بدون اینکه URL یا History نامعتبر شود.
4. لینک فیلترشده را Share، Refresh یا با Back/Forward بازیابی کند.
5. قبل از اعمال فیلترهای موبایل تعداد نتیجه را ببیند.
6. تفاوت تعداد قطعات کاتالوگ با تعداد محصولات موجود را بفهمد.
7. در حالت بدون نتیجه مسیر بازگشت مشخص داشته باشد.

## قرارداد Discovery

`src/lib/catalog-discovery.ts` مسئول این موارد است:

- ساخت Scope مجاز برای هر Listing
- محاسبه تعداد نتایج
- محاسبه Facet count برای دسته، رنگ و سایز
- خلاصه شفاف موجودی کاتالوگ

Routeها داده و URL state را مدیریت می‌کنند؛ Componentهای فیلتر فقط UI و Interaction را کنترل می‌کنند.

## Mobile Filter Transaction

فیلترهای Mobile به‌صورت Transactional کار می‌کنند:

1. بازشدن Drawer یک Draft از فیلترهای فعلی می‌سازد.
2. تغییر Draft فقط Preview count را عوض می‌کند.
3. بستن Drawer تغییرات را لغو می‌کند.
4. «اعمال فیلترها» Draft را به URL و Grid منتقل می‌کند.
5. Escape و Focus restoration باید حفظ شوند.

## Truth Contract

- تعداد کل کاتالوگ از تعداد موجود جداست.
- Sort مبتنی بر `rank` با عنوان «منتخب LBB» نمایش داده می‌شود، نه «پرفروش‌ترین».
- دسته‌ها «پرطرفدار» معرفی نمی‌شوند مگر داده واقعی وجود داشته باشد.
- تعداد کنار Facetها از نتیجه واقعی همان Scope محاسبه می‌شود.
- گزینه بدون نتیجه Disabled است، مگر اینکه همان گزینه از قبل Active باشد.

## SEO

- URLهای فیلترشده و Sort شده `noindex` هستند.
- Canonical همیشه به Route پایه `/shop` یا Category پایه اشاره می‌کند.
- Search همیشه `noindex` و Canonical آن `/search` است.
- Query و Filter state همچنان در URL قابل اشتراک باقی می‌مانند.

## فایل‌های اصلی

- `src/lib/catalog-discovery.ts`
- `src/lib/product-filter.ts`
- `src/components/lbb/ProductFilters.tsx`
- `src/components/lbb/ProductGridControls.tsx`
- `src/routes/shop.tsx`
- `src/routes/$category.tsx`
- `src/routes/search.tsx`
- `tests/catalog-discovery.spec.ts`

## مرز فاز

F14 داده واقعی Backend، موجودی Server-side، Search service یا Pagination API اضافه نمی‌کند. کاتالوگ فعلی هشت قطعه دارد و همه نتایج در یک Grid نمایش داده می‌شوند؛ Load More تنها وقتی فعال می‌شود که تعداد نتیجه از ظرفیت صفحه بیشتر باشد.
