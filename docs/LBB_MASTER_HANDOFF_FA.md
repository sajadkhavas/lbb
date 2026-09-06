# LBB — Master Handoff & Business Truth

> وضعیت این سند: **Source of Truth برای ادامه پروژه**
>
> تاریخ ثبت: **2026-09-07**
>
> هدف: هر چت/مجری بعدی باید قبل از ادامه LBB این سند را بخواند تا اطلاعات کارفرما، تصمیم‌های تثبیت‌شده، وضعیت Production و NEXT پروژه از بین نرود.

---

## 1) Baseline قطعی Production

- Repository: `sajadkhavas/lbb`
- Production branch: `fix/lbb-local-boutique-homepage`
- Accepted / deployed SHA: `d78d164456dabce06dc88f3cb4e9af181c6f5e3f`
- Production URL: `https://lbbclo.com`
- Runtime target: self-hosted Node / Nitro `node-server`
- Frontend production acceptance: **PASS**
- Backend mode در storefront واقعاً Deploy‌شده: `prototype` — P3 روی GitHub کامل و Merge شده، اما هنوز روی Production Deploy/Activate نشده است.
- اصل مهم: این SHA، Baseline پذیرفته‌شده Production است و فقط با deployment/acceptance صریح تغییر می‌کند.
- Historical P1.4 `FRONTEND_FREEZE_SHA`: `2bc1347bb092172350415ac21019eb09f9dd746d` — **not deployed yet**.
- P3 frontend exact source head: `eebb9dc24f7474b7348a2f94f8e7bc7d04720be9`.
- P3 frontend source merge SHA: `ab3aa654ae7c3a19508837fa6bda383f84fa5cbc` — **not deployed yet**.
- Backend repository: `sajadkhavas/lbb-backend`.
- Historical P2 `BACKEND_RELEASE_SHA`: `dd35070ddb168833d30adabde957b86b56da0542` — **audited / frozen / not deployed**.
- P3 backend source head: `a93f21a7c2c1bb2961a722c2748cf952cb4d399f`.
- P3 backend merge SHA: `5a874d66b5d031fd1ab739a4b7bd8b7c04d4acf6` — **not deployed yet**.
- P2 frozen backend API contract: `2026-08-09-f14-be-f1`.
- P3 additive storefront contract: `2026-09-06-p3-storefront-v1`.

### Production engineering rules

- هیچ ویرایش مستقیمی روی release فعال انجام نشود.
- Branch جدا برای هر فاز/تغییر.
- Build و deploy با SHA دقیق و rollback target مشخص.
- برای VPS این پروژه build باید runtime مناسب self-hosted Node داشته باشد؛ Cloudflare preset برای Production این VPS مناسب نیست.
- قبل از activation: isolated smoke + route checks + process identity + listener + logs.
- بعد از activation: health checks + PID stability + error/warning audit.

---

# 2) Business Truth — اطلاعات تأییدشده کارفرما

این بخش «پیشنهاد ما» نیست؛ اطلاعاتی است که از کارفرما دریافت و در گفتگو نهایی شده است. در طراحی، محتوا، SEO و Backend نباید خلاف این بخش چیزی حدس زده شود.

## 2.1 هویت برند

### کلماتی که برند باید با آن‌ها شناخته شود

- ال‌بی‌بی
- LBB
- پوشاک خیابانی
- استریت‌ویر
- استایل
- پوشاک وارداتی

### شعار برند

نسخه نهایی نگارشی پیشنهادی و پذیرفته‌شده:

**LBB؛ الهام‌گرفته از ذهنی خلاق**

اصل عبارت کارفرما: «الهام گرفته از ذهن خلاق».

## 2.2 داستان برند

### عنوان

**از رگال تا فروشگاه**

### متن نهایی تأییدشده

> LBB در سال ۱۴۰۰ و پس از سال‌ها فعالیت در حوزه پوشاک، با هدف شکل‌دادن به یک برند شخصی و متفاوت آغاز شد. مسیر ما از تولید تا عرضه محصولات منتخب خارجی ادامه پیدا کرد و امروز با مجموعه‌ای محدود، خاص و انتخاب‌شده در کنار شما هستیم؛ هم در فروشگاه حضوری LBB و هم از طریق فروشگاه آنلاین LBB.

---

# 3) First-Visit Brand Intro

کارفرما می‌خواهد کاربر در اولین ورود، قبل از شروع خرید، با برند آشنا شود.

تصمیم UX نهایی:

- این قابلیت **Popup ساده نیست**.
- نام فنی/طراحی: **First-Visit Fullscreen Brand Intro / Brand Intro Experience**.
- Intro به‌صورت overlay روی Homepage واقعی اجرا شود؛ صفحه مستقل `/intro` ساخته نشود.
- Homepage واقعی باید همچنان SSR/HTML/SEO قابل دسترس باشد.
- Intro فقط در اولین بازدید یا نسخه جدید کمپین نمایش داده شود، نه در هر مراجعه.
- Seen state می‌تواند versioned باشد؛ مانند `lbb_brand_intro_v1`.
- CTAهای اصلی:
  - **داستان LBB**
  - **ورود به فروشگاه**
- محتوای Intro می‌تواند شامل نام LBB، شعار، عنوان «از رگال تا فروشگاه» و تصویر/ویدیوی سبک Campaign باشد.
- `prefers-reduced-motion` و رفتار بدون JS/WebGL باید در QA لحاظ شود.

این سیستم در آینده می‌تواند برای Drop/Campaign Intro نیز استفاده شود.

---

# 4) ارسال، رزرو و مرجوعی

## 4.1 روش‌های ارسال

1. **ارسال فوری با پیک** — کرج و تهران
2. **تیپاکس** — پس‌کرایه
3. **دکاپست** — پس‌کرایه
4. **پست پیشتاز**

## 4.2 اعتبار رزرو فاکتور

- هر فاکتور رزرو شده **۳۰ دقیقه** اعتبار دارد.
- متن UI باید روشن کند که پس از پایان این زمان، رزرو/موجودی تضمین‌شده نیست؛ منطق دقیق Backend باید همین Contract را enforce کند.

## 4.3 مرجوعی و تعویض

متن کارفرما:

- در صورت عدم تطابق محصول با عکس/مشخصات یا مناسب نبودن سایز، مشتری می‌تواند تا **۴۸ ساعت پس از تحویل** اطلاع دهد و درخواست تعویض یا مرجوعی ثبت کند.

متن پیشنهادی برای سایت:

> در صورت عدم تطابق محصول دریافتی با تصاویر یا مشخصات اعلام‌شده، یا مناسب نبودن سایز، می‌توانید حداکثر تا ۴۸ ساعت پس از تحویل سفارش موضوع را به پشتیبانی LBB اطلاع دهید و درخواست تعویض یا مرجوعی محصول را ثبت کنید.

### Legal truth gate

قبل از انتشار نهایی صفحه قوانین، موارد زیر باید با مقررات جاری تجارت الکترونیکی و سیاست واقعی کسب‌وکار تطبیق داده شوند؛ از خودمان حدس نزنیم:

- شرایط سالم/استفاده‌نشده بودن کالا
- تگ و بسته‌بندی
- هزینه ارسال تعویض/مرجوعی
- استثناهای قانونی احتمالی
- زمان و روش بازگشت وجه
- تفاوت «تعویض سایز» با «عدم تطابق کالا»

---

# 5) ارتباط با ما

- Instagram: **همان حساب رسمی فعلی موجود در سایت**؛ handle را از داده فعلی سایت نگه دارید تا کارفرما تغییر جدید اعلام کند.
- تلفن پشتیبانی: `026-3256-0477`
- WhatsApp: `0902-858-4879`

UX:

- تلفن clickable با `tel:`
- واتساپ clickable و قابل استفاده روی موبایل
- هیچ شماره/آدرس/ساعت کاری جدیدی بدون Business Truth اضافه نشود.

---

# 6) مخاطب و بازار واقعی

## 6.1 نوع مشتری

- **95٪ آقا** — بازه سنی **18 تا 30 سال**
- **5٪ خانم** — بازه سنی **18 تا 30 سال**

این نسبت باید در Tone/Visual Targeting دیده شود، اما UI نباید خرید را برای خانم‌ها مسدود یا غیرقابل استفاده کند.

## 6.2 لوکیشن مشتریان حضوری

- مهرشهر
- نبوت کرج
- عظیمیه
- تهران

## 6.3 لوکیشن مشتریان آنلاین

- تهران
- مازندران
- کرج

## 6.4 ویژگی/Positioning اصلی

اصل پیام کارفرما:

**آیتم‌های استریت‌ویر — از هر سرچ پینترستی تا فروشگاه LBB**

نسخه‌های محتوایی مجاز:

- متن معرفی: «از ایده‌هایی که در پینترست می‌بینید تا آیتم‌هایی که در LBB پیدا می‌کنید؛ مجموعه‌ای از پوشاک استریت‌ویر خاص و به‌روز را برای شما انتخاب می‌کنیم.»
- Brand/marketing short copy: **«از پینترست تا رگال LBB؛ استریت‌ویری که دنبالش بودید.»**

این عبارت نباید به ادعای تضمینی مثل «هر چیزی که در Pinterest دیدی حتماً داریم» تبدیل شود.

---

# 7) FAQ تأییدشده

## 7.1 سایزبندی محصولات به چه صورت است؟

> هر محصول دارای **جدول اندازه‌ها و راهنمای سایز اختصاصی** است تا بتوانید قبل از خرید، اندازه مناسب خود را انتخاب کنید. اطلاعات مربوط به سایز هر محصول در صفحه همان محصول در دسترس شما قرار دارد.

راهنمای سایز در سایت فعلی وجود دارد؛ redesign نباید آن را حذف کند.

## 7.2 چرا قیمت بعضی محصولات LBB بالاتر است؟

> بخش قابل‌توجهی از محصولات LBB شامل آیتم‌های وارداتی از برندهای چینی و کره‌ای است. با توجه به هزینه‌های تهیه، واردات و فرآیند تأمین این محصولات، قیمت آن‌ها ممکن است در بازه بالاتری قرار بگیرد. با این حال تلاش کرده‌ایم در مقایسه با **فروشگاه‌های هم‌رده و عرضه‌کنندگان محصولات مشابه**، قیمت مناسب‌تری برای مشتریان LBB در نظر بگیریم.

قانون محتوا:

- از ادعای «ارزان‌ترین»، «بهترین قیمت بازار» یا مقایسه قطعی بدون Evidence استفاده نشود.

---

# 8) Taxonomy / Category Truth

ساختار Category فعلی که از کارفرما استخراج و تأیید شده است:

## 8.1 تیشرت

- تیشرت اورسایز
- تیشرت باکس
- تیشرت یقه‌دار
- تیشرت آستین‌بلند / Long Sleeve
- تیشرت حلقه‌ای / Vest / Sleeveless

> نکته: نام UI فارسی باید بر اساس زبان واقعی مشتری انتخاب شود؛ اصطلاح انگلیسی صرفاً alias/attribute است.

## 8.2 سویشرت

- هودی
- دورس
- سویشرت زیپی
- بافت

## 8.3 شلوار

### جین

- بگ
- فول‌بگ
- بوت‌کات

### پارچه‌ای

- بالون
- بگ
- فول‌بگ

### اسلش

- بالون
- بگ
- فول‌بگ

### شلوارک بلند

- **Jorts / جورتز**

### Shorts

- شرت کوتاه

## 8.4 پیراهن

- کراپ‌شرت → پیراهن باکس
- اورسایز → پیراهن آزاد
- چهارخانه / راه‌راه → طرح‌دار
- ساده → Basic / بیسیک

## 8.5 جکت‌ها

- کاپشن
  - پافر
  - پافر وست
- کت

## 8.6 کتونی

کارفرما اعلام کرده تنوع کتونی زیاد است و اگر همه مدل‌ها Category شوند، ساختار بسیار شلوغ می‌شود.

### تصمیم معماری

- `کتونی` یک Category اصلی باشد.
- جزئیات از طریق **Attribute/Filter** مدیریت شوند:
  - Brand
  - Size
  - Color
  - Style/Form
  - Availability
  - Price range
- Brandهایی مانند Nike/Adidas/New Balance و ... در اصل **Brand data** باشند، نه لزوماً Category اصلی.
- Subcategory یا SEO Landing فقط زمانی ساخته شود که inventory و Search Intent واقعی آن را توجیه کند.

اصل Taxonomy:

**Category = نوع محصول**  
**Attribute/Filter = برند، رنگ، سایز، Fit، Style و مشخصات**

Filtered query stateهای کم‌ارزش نباید بی‌هدف index شوند.

---

# 9) Design / Competitor Benchmark — تحلیل ما، نه Business Truth

این بخش پیشنهاد طراحی/تحقیق است و نباید به‌عنوان گفته کارفرما نقل شود.

## Benchmark بین‌المللی پیشنهادی

- **Represent**: ساختار Commerce، Drop، New Arrivals، Category و Product presentation
- **Kith**: Editorial Commerce، Collection/Drop storytelling
- **Aimé Leon Dore**: Minimalism، Brand identity، Lookbook
- **END. / SSENSE**: Product discovery، filter، clean PLP/PDP patterns

Blend پیشنهادی LBB:

- حدود 60٪ منطق Commerce/Drop از Represent
- حدود 25٪ Editorial از Kith
- حدود 15٪ Minimal identity از ALD

این درصدها Design Direction هستند، نه الزام کپی.

## Benchmark ایران

نمونه‌های بازار ایران فقط برای فهم زبان مشتری، محتوا، Category/FAQ و local commerce بررسی شوند؛ کیفیت UI نهایی LBB نباید به سطح متوسط بازار محدود شود.

---

# 10) SEO Direction تثبیت‌شده

## معماری Intent

- `/` → Brand + Local
- `/shop` → General catalog
- `/$category` → Commercial product type
- `/product/$slug` → Exact product
- `/collections/$slug` → Drops/capsules
- `/journal/$slug` → Informational
- `/lookbook` → Visual/editorial inspiration
- `/contact` → Local/business info
- `/search` → noindex
- filtered query states → generally noindex + clean canonical unless یک SEO Landing عمدی ساخته شده باشد

## Priority keyword clusters

ترتیب استراتژیک فعلی:

1. Local / hyperlocal: کرج، مهرشهر و مناطق واقعی
2. Mid-tail product intent: بگ، فول‌بگ، کارگو، اورسایز و مدل‌های واقعی موجودی
3. Streetwear informational/commercial
4. Broad head terms در بلندمدت

### Truth rule

هیچ عدد KD/Volume تخمینی به‌عنوان داده رسمی Ahrefs/Semrush/Google معرفی نشود. برای Volume واقعی، Keyword Planner و پس از Index شدن Search Console منبع اصلی داده عملیاتی باشند.

---

# 11) Interactive 3D Outfit Configurator — Backlog F21

Feature مورد بحث و پذیرفته‌شده برای بررسی/پیاده‌سازی:

**Interactive 3D Outfit Configurator / Dressable Mannequin**

هدف:

- mannequin در UI
- کاربر روی محصول کلیک می‌کند
- انتقال بصری محصول از card به mannequin دیده می‌شود
- garment سه‌بعدی متناظر روی mannequin فعال می‌شود

معماری پیشنهادی:

- TanStack Start SSR برای HTML/SEO اصلی
- React Three Fiber + Three.js + Drei فقط client-side و lazy
- GLB/glTF asset pipeline
- slotهای `TOP`, `BOTTOM`, `OUTERWEAR`, `FOOTWEAR`, `ACCESSORY`
- mobile به‌صورت fullscreen/bottom-sheet viewer، نه فشردن Canvas کنار grid
- dynamic import، `frameloop="demand"`، adaptive quality، WebGL fallback
- no real-time cloth physics در v1

### F21 stages

1. F21.1 — UX & Technical Contract
2. F21.2 — 3D Asset Pipeline PoC
3. F21.3 — WebGL/R3F Runtime
4. F21.4 — Garment Dressing Engine
5. F21.5 — Product → Mannequin Animation
6. F21.6 — Performance / Accessibility / Mobile
7. F21.7 — Production QA & Integration

### 3D product onboarding rule

برای ورود محصول جدید نباید برنامه‌نویس لازم باشد. هدف نهایی Admin lifecycle:

`Disabled → Photos Required → Generating → Needs Review → Ready / Failed`

- same cut + new color/print → reuse base mesh + material/texture
- similar cut → template + fit + review
- new cut → AI 3D candidate + human review
- premium/critical fidelity → CLO/3D artist workflow

AI output هیچ‌وقت بدون human approval به‌عنوان truth محصول publish نشود.

### Current freeze scope

F21 در `P1.4` وارد scope نشده و در Backlog باقی می‌ماند. `FRONTEND_FREEZE_SHA` فعلی بدون F21 ثبت شده است؛ ورود F21 در آینده نیازمند بازکردن مجدد Frontend acceptance/freeze QA است.

---

# 12) Current Delivery Roadmap

## P1 — Visual + Content + SEO Final Polish

### P1.1 Business Truth Collection — **DONE 2026-08-29**

اطلاعات کارفرما در همین سند ثبت شد.

### P1.2 Visual + Content Polish — **DONE / MERGED 2026-09-03**

- PR #60 merged into `fix/lbb-local-boutique-homepage`.
- Merge SHA: `1d6fd9170788e9e765c17fc4b29987b87436d283`.
- Brand Intro، Business Truth copy، navigation/taxonomy و category landing reconciliation انجام شد.
- Exact-head quality gates برای closureهای P1.2 سبز شدند.
- Production deployment در خود P1.2 انجام نشد؛ Production baseline فقط با activation پذیرفته‌شده تغییر می‌کند.

### P1.3 SEO Semantic & Content Polish — **DONE / MERGED 2026-09-05**

- Tracking issue: #61
- PR #62: **MERGED**
- START_SHA: `1d6fd9170788e9e765c17fc4b29987b87436d283`.
- Final exact-head pre-merge SHA: `2976daab0caa13d1b288f5da0a217c895f21e3fe`.
- Merge SHA: `0e3512858b053ffe81aab05a4b6fe95a1811ca6a`.
- Final Quality Gates run `33984114023`: **SUCCESS**.
- Search-intent و route mapping بر اساس Evidence ثبت شد.
- Categoryها به intent خرید نوع محصول منتقل شدند؛ `کرج` فقط در local surfaces واقعی نگه داشته شد.
- هیچ gender modifier مانند `مردانه` بدون data contract معتبر به metadata تحمیل نشد.
- Shop/About metadata، FAQ/HowTo/SearchAction legacy markup و internal linking reconcile شدند.
- Canonical / noindex / sitemap / robots / SSR-head contracts verify شدند.
- Dedicated P1.3 regression coverage اضافه شد.
- Closure record: `docs/P1_3_SEO_CLOSURE.md`.
- Production mutation: **NO**.

### P1.4 Regression QA + Frontend Freeze — **DONE / MERGED 2026-09-06**

- Tracking issue: #64
- PR #65: **MERGED**
- START_SHA: `3dfc6340a4a204f83d6131ffcc8a35a7719992be`.
- Validated freeze-test SHA: `3b004a3b1d3f417776a1d15fbd08123167fd98f3`.
- Final exact-head pre-merge SHA: `2f8112da04fca8e787916f82931cd53c3732f6ca`.
- `FRONTEND_FREEZE_SHA`: `2bc1347bb092172350415ac21019eb09f9dd746d`.
- Final Quality Gates run `33991264286`: **SUCCESS**.
- Responsive / accessibility / SSR-hydration / performance-build / SEO / core storefront / visual regression: **PASS**.
- Dedicated freeze regression coverage added at `tests/p14-frontend-freeze.spec.ts`.
- Existing visual snapshots passed; no P1.4 snapshot update required.
- Runtime feature mutation: **NONE**.
- Production/server mutation: **NO**.

## P2 — Backend Final Audit & Release Freeze — **DONE / MERGED / BACKEND FROZEN / REGISTERED 2026-09-06**

GitHub-first audit/freeze scope P2 کامل شده است. Production deployment عمداً در این مرحله انجام نشد و تا gate صریح server deployment/activation پس از integration ادامه نمی‌یابد.

- Backend repository: `sajadkhavas/lbb-backend`.
- Tracking issue #13: **CLOSED / COMPLETED**.
- Source PR #14: **MERGED**.
- Registration PR #15: **MERGED**.
- Final closure-sync PR #16: **MERGED**.
- START_SHA: `bc6f53f9cc9b79d8e089fe35b543ad32f5c33217`.
- `BACKEND_RELEASE_SHA`: `dd35070ddb168833d30adabde957b86b56da0542`.
- Frozen API contract: `2026-08-09-f14-be-f1`.
- OpenAPI blob: `1d0c067ab23fb604c149cccfbe6273081248cfdf`.
- Source Release Freeze run `34036465285`: **SUCCESS / both jobs**.
- Registration Release Freeze run `34036696281`: **SUCCESS / both jobs**.
- Final closure-sync Release Freeze run `34037705624`: **SUCCESS / both jobs**.
- Full backend suite: **95 passed / 902 assertions / zero skips**.
- MySQL 8.4 migration/commerce/auth/Web Push: **PASS**.
- Real two-process oversell race: **PASS**.
- Composer security audit: **clean** after bounded lock-only refresh.
- Application/runtime PHP API rewrite in P2: **NONE**.
- Production/server mutation: **NO**.

### P2 freeze rule

`dd35070ddb168833d30adabde957b86b56da0542` همان P2 runtime release freeze تاریخی است و documentation-only commitها آن را redefine نمی‌کنند. P3 به‌صورت additive قرارداد storefront را روی GitHub تکمیل کرده است؛ Production storefront با این حال تا gate صریح P4 همچنان روی deployment قبلی و mode `prototype` باقی می‌ماند.

## P3 — Frontend ↔ Backend Live Integration — **DONE / MERGED 2026-09-07**

GitHub-first integration و control-surface closure کامل شد؛ هیچ Production/server mutation در P3 انجام نشد.

- Frontend tracking issue: #70.
- Frontend source PR #71: **MERGED**.
- Frontend START/base SHA: `a866fc778a29f541fbccfcffaeb53cec7360acc7`.
- Historical P1.4 `FRONTEND_FREEZE_SHA`: `2bc1347bb092172350415ac21019eb09f9dd746d`.
- Frontend exact source head: `eebb9dc24f7474b7348a2f94f8e7bc7d04720be9`.
- Frontend source merge SHA: `ab3aa654ae7c3a19508837fa6bda383f84fa5cbc`.
- P3 Live Integration run `34065175780`: **SUCCESS** (`frontend-contract` + `full-quality`).
- Quality Gates run `34065175791`: **SUCCESS**.
- F8-B PWA and Push validation run `34065175787`: **SUCCESS**.
- Unresolved review threads: **0**.
- Backend P3 source head: `a93f21a7c2c1bb2961a722c2748cf952cb4d399f`.
- Backend P3 PR #18: **MERGED** → `5a874d66b5d031fd1ab739a4b7bd8b7c04d4acf6`.
- Backend exact-head Gate `34046093131`: **SUCCESS**.
- P3 additive storefront contract: `2026-09-06-p3-storefront-v1`.
- Control-surface matrix: `docs/P3_CONTROL_SURFACE_MATRIX.md`.
- Products/catalog و merchant-editable content/config surfaces در explicit `live` mode backend-authoritative شدند.
- Announcement/navigation/home/Brand Intro/footer/contact/global SEO و journal/lookbook/FAQ/safe pages مالک Backend/Admin/API/Frontend consumer مشخص دارند.
- Auth/account/cart/checkout/order/return integration seams حفظ و regression-covered شدند.
- `prototype` همچنان mode صریح QA/frozen baseline است؛ `live` روی network/contract/backend failure fail-closed است و silently به business truth ساختگی fallback نمی‌کند.
- Visual baseline در prototype پس از P3 compatibility patch حفظ شد و full quality کاملاً سبز است.
- Production/server mutation: **NO**.

### P3 source identity rule

`ab3aa654ae7c3a19508837fa6bda383f84fa5cbc` frontend runtime-code merge پذیرفته‌شده P3 و `5a874d66b5d031fd1ab739a4b7bd8b7c04d4acf6` backend P3 merge پذیرفته‌شده هستند. Commit/mergeهای documentation-only ثبت P3 این دو runtime-code identity را redefine نمی‌کنند. Deploy/activation هنوز انجام نشده است.

## P4 — Commerce Go-Live

1. Real product/catalog/business data readiness
2. Live environment/domain/CORS/Sanctum and deploy-candidate wiring
3. Cart / checkout / shipping / reservation / inventory production readiness
4. Production payment activation behind explicit gate
5. Order / inventory / notification and real E2E commerce acceptance
6. Controlled deployment/activation + rollback + post-activation health acceptance

## P5 — SEO / Operations / Final Acceptance & Handoff

1. Search / Local / Analytics activation
2. Production engineering acceptance
3. Final full-site acceptance
4. Client handoff

---

# 13) NEXT برای هر چت جدید

هر مجری/چت جدید باید این ترتیب را رعایت کند:

1. ابتدا این سند را بخواند.
2. Production baseline را با SHA `d78d164456dabce06dc88f3cb4e9af181c6f5e3f` یا Baseline جدیدترِ صراحتاً پذیرفته‌شده تطبیق دهد.
3. از Production مستقیم edit نکند.
4. برای فاز بعدی Branch/Worktree تمیز از آخرین baseline پذیرفته‌شده بسازد.
5. Business Truth این سند را با داده ساختگی جایگزین نکند.
6. تغییرات UI و SEO را صفحه‌به‌صفحه انجام دهد و بعد QA کند.
7. Live commerce و payment را فقط از gateهای صریح P4 و با rollback/acceptance واقعی فعال کند.

### CURRENT NEXT

**`P4 — Commerce Go-Live`**

P4 باید GitHub-first از runtime-code identityهای پذیرفته‌شده P3 یعنی frontend merge `ab3aa654ae7c3a19508837fa6bda383f84fa5cbc` و backend merge `5a874d66b5d031fd1ab739a4b7bd8b7c04d4acf6` ادامه یابد؛ branch عملی می‌تواند از latest accepted base شامل registration docs ساخته شود، اما docs-only commitها runtime identity را تغییر نمی‌دهند. ابتدا real data، live env/domain/CORS/Sanctum، shipping/reservation/inventory/payment readiness و deploy candidate به‌صورت fail-closed verify شوند. هیچ Production/server mutation یا payment activation قبل از gate صریح activation انجام نشود.

---

# 14) Source classification

برای جلوگیری از اختلاف در آینده:

- **Business Truth:** بخش‌های 2 تا 8؛ فقط با تأیید صریح کارفرما تغییر کند.
- **Technical accepted truth:** بخش 1؛ فقط با deploy/acceptance جدید تغییر کند.
- **Design/SEO recommendation:** بخش‌های 9 تا 11؛ قابل بهبود با تحقیق جدید است.
- **Roadmap:** بخش 12؛ با تکمیل رسمی فازها update شود.

هر فاز جدید پس از Acceptance باید این سند را update کند تا NEXT همیشه از GitHub قابل بازیابی باشد.
