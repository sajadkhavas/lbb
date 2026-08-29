# LBB — Master Handoff & Business Truth

> وضعیت این سند: **Source of Truth برای ادامه پروژه**
>
> تاریخ ثبت: **2026-08-29**
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
- Backend mode در storefront فعلی: `prototype`
- اصل مهم: این SHA، Baseline پذیرفته‌شده Frontend است و نباید بدون دلیل QA قبلی دوباره باز شود.

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

---

# 12) Current Delivery Roadmap

## P1 — Visual + Content + SEO Final Polish

### P1.1 Business Truth Collection — **DONE 2026-08-29**

اطلاعات کارفرما در همین سند ثبت شد.

### P1.2 Visual Polish — NEXT

- اجرای Brand Intro
- spacing / typography / hierarchy / cards / hero / header / mobile
- استفاده از Business Truth واقعی
- عدم حذف Size Guide یا اطلاعات فعلی معتبر

### P1.3 SEO Semantic & Content Polish

- rewrite محتوا بر اساس Business Truth و Search Intent
- local / category / FAQ / schema reconciliation
- بدون keyword stuffing

### P1.4 Regression QA + Frontend Freeze

- responsive
- accessibility
- SSR/hydration
- performance
- SEO contracts
- final frontend baseline

> اگر F21 در scope همین تحویل باشد، قبل از Frontend Freeze و ترجیحاً در Branch مستقل PoC/feature انجام شود.

## P2 — Backend Final Audit & Production Deployment

1. Backend final reconciliation audit
2. Final backend release freeze
3. Production infrastructure
4. Immutable backend deploy

Backend موجود باید audit/reconcile شود؛ از صفر بازنویسی یا blind deploy نشود.

## P3 — Frontend ↔ Backend Live Integration

1. prototype → live mode switch
2. Catalog integration
3. Auth/account integration
4. Integration QA

## P4 — Commerce Go-Live

1. Real product data
2. Cart / checkout / shipping
3. Production payment activation
4. Order / inventory / notification
5. Real E2E commerce acceptance

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
4. برای P1.2 یک Branch/Worktree تمیز از Baseline پذیرفته‌شده بسازد.
5. Business Truth این سند را با داده ساختگی جایگزین نکند.
6. تغییرات UI و SEO را صفحه‌به‌صفحه انجام دهد و بعد QA کند.
7. Backend و commerce را فقط پس از audit و contract reconciliation به live ببرد.

### CURRENT NEXT

**`P1.2 — Visual + Content Polish`**

با این قاعده که SEO همان صفحه در زمان redesign همان صفحه لحاظ شود تا دوباره‌کاری کم شود؛ سپس P1.3 برای reconciliation نهایی semantic/technical SEO اجرا شود.

---

# 14) Source classification

برای جلوگیری از اختلاف در آینده:

- **Business Truth:** بخش‌های 2 تا 8؛ فقط با تأیید صریح کارفرما تغییر کند.
- **Technical accepted truth:** بخش 1؛ فقط با deploy/acceptance جدید تغییر کند.
- **Design/SEO recommendation:** بخش‌های 9 تا 11؛ قابل بهبود با تحقیق جدید است.
- **Roadmap:** بخش 12؛ با تکمیل رسمی فازها update شود.

هر فاز جدید پس از Acceptance باید این سند را update کند تا NEXT همیشه از GitHub قابل بازیابی باشد.
