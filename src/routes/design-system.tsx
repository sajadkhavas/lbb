import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Heart, Info, LoaderCircle, ShoppingBag, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Navbar } from "@/components/lbb/Navbar";
import {
  Band,
  Button,
  ChoiceChip,
  CtaClasses,
  FieldMessage,
  Frame,
  IconButton,
  Rule,
  SectionHead,
  Shell,
  StatePanel,
  StatusTag,
  Surface,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import {
  COLOR_TOKENS,
  DESIGN_SYSTEM_VERSION,
  EXPERIENCE_NORTH_STAR,
  MOTION_TOKENS,
  RADIUS_TOKENS,
  SPACING_TOKENS,
  TYPE_TOKENS,
} from "@/lib/design-system";
import { heroMain, lifestyle1, lifestyle2, productImage } from "@/lib/product-images";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: pageMeta({
      title: "Design System 2.0 | LBB",
      description: "مرجع داخلی توکن‌ها، حالت‌ها و زبان بصری LBB.",
      path: "/design-system",
      noindex: true,
    }),
  }),
  component: DesignSystemPage,
});

function TokenValue({ token }: { token: string }) {
  return <code className="font-mono text-[10px] text-mute">var({token})</code>;
}

function ColorSection() {
  return (
    <Band id="colors" label="رنگ‌ها">
      <Shell>
        <SectionHead
          index="01"
          label="COLOR SYSTEM"
          title="رنگ، سطح و معنا"
          lede="رنگ‌ها با نقش معنایی مصرف می‌شوند؛ Signal فقط برای اقدام، Focus و وضعیت مهم است و نباید به تزئین عمومی تبدیل شود."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {COLOR_TOKENS.map((item) => (
            <Surface key={item.token} tone="raised" className="overflow-hidden">
              <div
                data-token={item.token}
                className="h-28 border-b border-hairline"
                style={{ background: `var(${item.token})` }}
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-bone">{item.name}</p>
                  <TokenValue token={item.token} />
                </div>
                <p className="mt-2 text-xs leading-6 text-metal">{item.usage}</p>
              </div>
            </Surface>
          ))}
        </div>
      </Shell>
    </Band>
  );
}

function TypographySection() {
  return (
    <Band id="typography" label="تایپوگرافی">
      <Shell>
        <SectionHead
          index="02"
          label="TYPE SYSTEM"
          title="فارسی سنگین، متن آرام"
          lede="Estedad Variable برای نمایش و متن فارسی و JetBrains Mono برای کد، عدد، SKU و Label فنی استفاده می‌شود."
        />
        <Surface tone="subtle" className="mt-10 divide-y divide-hairline">
          {TYPE_TOKENS.map((item) => (
            <div key={item.name} className="grid gap-4 p-5 md:grid-cols-[160px_1fr] md:p-8">
              <div>
                <TechLabel tone="signal">{item.name}</TechLabel>
                <p className="mt-2 font-mono text-[10px] text-mute">.{item.className}</p>
              </div>
              <p className={`${item.className} min-w-0 text-bone`}>{item.sample}</p>
            </div>
          ))}
        </Surface>
      </Shell>
    </Band>
  );
}

function FoundationsSection() {
  return (
    <Band id="foundations" label="فاصله، شعاع و حرکت">
      <Shell>
        <SectionHead
          index="03"
          label="FOUNDATIONS"
          title="ریتم، لبه و حرکت"
          lede="فاصله‌ها از یک Scale محدود، گوشه‌ها از منطق Raw Precision و Motion از مدت‌زمان‌های دارای وظیفه استفاده می‌کنند."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Surface tone="raised" className="p-5 md:p-7">
            <h3 className="text-title text-bone">Spacing</h3>
            <div className="mt-6 space-y-4">
              {SPACING_TOKENS.map((item) => (
                <div key={item.token} className="grid grid-cols-[64px_1fr] items-center gap-4">
                  <TechLabel>{item.name}</TechLabel>
                  <div>
                    <div className="h-3 bg-signal" style={{ width: `min(var(${item.token}), 100%)` }} />
                    <p className="mt-1 text-[11px] text-mute">{item.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface tone="raised" className="p-5 md:p-7">
            <h3 className="text-title text-bone">Radius</h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {RADIUS_TOKENS.map((item) => (
                <div key={item.token}>
                  <div
                    className="aspect-square border border-hairline-strong bg-carbon"
                    style={{ borderRadius: `var(${item.token})` }}
                  />
                  <p className="mt-2 text-xs font-bold text-bone">{item.name}</p>
                  <p className="mt-1 text-[11px] leading-5 text-mute">{item.usage}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface tone="raised" className="p-5 md:p-7">
            <h3 className="text-title text-bone">Motion</h3>
            <div className="mt-6 space-y-5">
              {MOTION_TOKENS.map((item, index) => (
                <div key={item.token}>
                  <div className="flex items-center justify-between gap-3">
                    <TechLabel>{item.name}</TechLabel>
                    <TokenValue token={item.token} />
                  </div>
                  <div className="mt-2 h-2 overflow-hidden bg-obsidian">
                    <div
                      className="h-full bg-signal"
                      style={{ width: `${30 + index * 15}%`, transition: `width var(${item.token}) var(--ease-lbb)` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-mute">{item.usage}</p>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </Shell>
    </Band>
  );
}

function ComponentStatesSection() {
  const [selectedSize, setSelectedSize] = useState("L");
  const [liked, setLiked] = useState(false);

  return (
    <Band id="states" label="حالت‌های کامپوننت">
      <Shell>
        <SectionHead
          index="04"
          label="COMPONENT STATES"
          title="حالت، بازخورد و کنترل"
          lede="Default، Hover، Focus، Active، Loading، Disabled، Error و Success بخشی از قرارداد Component هستند، نه اصلاحات بعدی."
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          <Surface tone="subtle" className="p-5 md:p-8">
            <h3 className="text-title text-bone">Actions</h3>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button>اقدام اصلی</Button>
              <Button variant="bone">اقدام معکوس</Button>
              <Button variant="line">اقدام ثانویه</Button>
              <Button variant="ghost">اقدام آرام</Button>
              <Button variant="danger">حذف</Button>
              <Button loading>در حال انجام</Button>
              <Button disabled>غیرفعال</Button>
            </div>
            <Rule caption="ICON / TOGGLE" className="my-7" />
            <div className="flex flex-wrap items-center gap-3">
              <IconButton label={liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"} pressed={liked} onClick={() => setLiked((value) => !value)}>
                <Heart size={18} aria-hidden="true" className={liked ? "fill-current" : ""} />
              </IconButton>
              <IconButton label="سبد خرید">
                <ShoppingBag size={18} aria-hidden="true" />
              </IconButton>
              <IconButton label="در حال بارگذاری" disabled>
                <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
              </IconButton>
            </div>
          </Surface>

          <Surface tone="subtle" className="p-5 md:p-8">
            <h3 className="text-title text-bone">Choice and status</h3>
            <fieldset className="mt-6">
              <legend className="text-xs font-bold text-bone">سایز</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <ChoiceChip key={size} selected={selectedSize === size} onClick={() => setSelectedSize(size)}>
                    {size}
                  </ChoiceChip>
                ))}
                <ChoiceChip selected={false} disabled>
                  XXL
                </ChoiceChip>
              </div>
            </fieldset>
            <div className="mt-7 flex flex-wrap gap-2">
              <StatusTag tone="signal">DROP 02</StatusTag>
              <StatusTag tone="success">موجود</StatusTag>
              <StatusTag tone="warning">رو به اتمام</StatusTag>
              <StatusTag tone="out">ناموجود</StatusTag>
              <StatusTag tone="info">راهنما</StatusTag>
            </div>
          </Surface>

          <Surface tone="subtle" className="p-5 md:p-8">
            <h3 className="text-title text-bone">Fields</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <label className="block text-xs font-bold text-bone">
                نام نمایشی
                <input
                  type="text"
                  defaultValue="شب‌گرد"
                  className="mt-2 min-h-12 w-full border border-hairline-strong bg-obsidian px-4 text-sm text-bone outline-none placeholder:text-mute focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
                />
                <FieldMessage>متن راهنما همیشه نزدیک کنترل می‌ماند.</FieldMessage>
              </label>
              <label className="block text-xs font-bold text-bone">
                کد تخفیف
                <input
                  type="text"
                  defaultValue="INVALID"
                  aria-invalid="true"
                  aria-describedby="coupon-error"
                  className="mt-2 min-h-12 w-full border border-danger bg-obsidian px-4 text-sm text-bone outline-none focus-visible:ring-2 focus-visible:ring-danger/40"
                />
                <FieldMessage id="coupon-error" tone="error">این کد معتبر نیست.</FieldMessage>
              </label>
              <label className="block text-xs font-bold text-bone">
                ایمیل تأییدشده
                <input
                  type="email"
                  defaultValue="hello@lbb.test"
                  aria-describedby="email-success"
                  className="mt-2 min-h-12 w-full border border-success bg-obsidian px-4 text-sm text-bone outline-none focus-visible:ring-2 focus-visible:ring-success/40"
                />
                <FieldMessage id="email-success" tone="success">فرمت ایمیل صحیح است.</FieldMessage>
              </label>
              <label className="block text-xs font-bold text-mute">
                فیلد غیرفعال
                <input
                  type="text"
                  value="قابل ویرایش نیست"
                  disabled
                  readOnly
                  className="mt-2 min-h-12 w-full border border-hairline bg-carbon-2 px-4 text-sm text-mute opacity-60"
                />
              </label>
            </div>
          </Surface>

          <Surface tone="subtle" className="p-5 md:p-8">
            <h3 className="text-title text-bone">System feedback</h3>
            <div className="mt-6 space-y-3">
              <StatePanel title="اطلاعات ذخیره شد" tone="success">
                تغییر فقط در همین دستگاه نگه‌داری می‌شود.
              </StatePanel>
              <StatePanel title="انتخاب سایز لازم است" tone="warning">
                پیش از ادامه یک سایز موجود انتخاب کنید.
              </StatePanel>
              <StatePanel title="عملیات انجام نشد" tone="danger">
                وضعیت قبلی حفظ شده و می‌توان دوباره تلاش کرد.
              </StatePanel>
              <StatePanel title="این بخش پیش‌نمایش است" tone="info">
                اتصال تجاری یا Backend در این مرحله فعال نیست.
              </StatePanel>
            </div>
          </Surface>
        </div>
      </Shell>
    </Band>
  );
}

function PhotographySection() {
  const frames = [
    { src: productImage("lbb-classic-hoodie"), title: "PRODUCT TRUTH", body: "نور خنثی، رنگ واقعی و قاب قابل مقایسه" },
    { src: lifestyle1, title: "TEHRAN CONTEXT", body: "مکان و نور بخشی از داستان، نه پوشاننده محصول" },
    { src: lifestyle2, title: "MATERIAL DETAIL", body: "بافت، دوخت، فیت و مقیاس باید قابل فهم باشند" },
  ];

  return (
    <Band id="photography" label="جهت عکاسی">
      <Shell>
        <SectionHead
          index="05"
          label="PHOTOGRAPHY"
          title="تصویر برای تصمیم و روایت"
          lede="تصویر Product بدون Grade شدید و تصویر Campaign با زمینه تهران استفاده می‌شود؛ این دو نقش نباید با هم مخلوط شوند."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {frames.map((item, index) => (
            <article key={item.title} className="group">
              <Frame src={item.src} alt={item.body} priority={index === 0} sizes="(max-width: 768px) 100vw, 33vw" className="rounded-lg" />
              <TechLabel tone="signal" className="mt-4 block">{item.title}</TechLabel>
              <p className="mt-2 text-sm leading-7 text-metal">{item.body}</p>
            </article>
          ))}
        </div>
      </Shell>
    </Band>
  );
}

function CompositionSection() {
  return (
    <Band id="compositions" label="نمونه ترکیب صفحات" major>
      <Shell>
        <SectionHead
          index="06"
          label="COMPOSITION PROOFS"
          title="سه حالت، یک زبان"
          lede="Utility، Narrative و Reading باید متفاوت باشند، اما رنگ، تایپ، فاصله، Focus و State آن‌ها از یک سیستم مشترک بیاید."
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          <Surface tone="raised" as="article" className="overflow-hidden">
            <div className="border-b border-hairline p-4">
              <TechLabel tone="signal">UTILITY / PLP</TechLabel>
              <h3 className="mt-2 text-title text-bone">کشف سریع محصول</h3>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-4 p-4">
              <Frame src={productImage("graphic-tee-red")} alt="نمونه کارت محصول" ratio="4/5" zoom={false} />
              <div>
                <StatusTag tone="success">موجود</StatusTag>
                <p className="mt-3 text-sm font-bold text-bone">تیشرت گرافیک قرمز</p>
                <p className="num mt-1 text-xs text-metal">۱٬۸۹۰٬۰۰۰ تومان</p>
                <div className="mt-4 flex gap-2">
                  <span className="h-5 w-5 rounded-pill border border-hairline bg-signal" />
                  <span className="h-5 w-5 rounded-pill border border-hairline bg-obsidian" />
                </div>
              </div>
            </div>
          </Surface>

          <Surface tone="raised" as="article" className="relative min-h-[420px] overflow-hidden lbb-grain">
            <img src={heroMain} alt="نمونه روایت تصویری شب تهران" className="absolute inset-0 h-full w-full object-cover opacity-65" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-transparent" />
            <div className="relative flex min-h-[420px] flex-col justify-end p-6">
              <TechLabel tone="signal">NARRATIVE / DROP</TechLabel>
              <h3 className="mt-3 text-display-3 max-w-[10ch] text-bone">بعد از آخرین قطار</h3>
              <p className="mt-3 max-w-[34ch] text-sm leading-7 text-paper">یک Moment اصلی، متن کوتاه و مسیر مستقیم به محصول.</p>
              <Link to="/collections/drop-01-shabgard" className={`${CtaClasses("signal", "sm")} mt-5 self-start`}>مشاهده کالکشن</Link>
            </div>
          </Surface>

          <Surface tone="inverse" as="article" className="p-6 md:p-8">
            <TechLabel tone="inverse">READING / JOURNAL</TechLabel>
            <h3 className="mt-4 text-display-3 text-obsidian">لباس خیابانی چگونه خوانده می‌شود؟</h3>
            <p className="mt-5 text-sm leading-8 text-obsidian/75">صفحه خواندن از سطح روشن، عرض محدود، Heading روشن و لینک‌های قابل فهم استفاده می‌کند. هیچ افکت نمایشی نباید ریتم مطالعه را قطع کند.</p>
            <div className="mt-7 border-t border-hairline-ink pt-4">
              <p className="font-mono text-[10px] text-obsidian/60">READING WIDTH / 72CH</p>
            </div>
          </Surface>
        </div>
      </Shell>
    </Band>
  );
}

function DesignSystemPage() {
  return (
    <>
      <Navbar theme="dark" />
      <main id="main" dir="rtl" className="min-h-screen bg-obsidian pb-bottombar pt-[var(--lbb-nav-h)] md:pb-0">
        <header className="relative overflow-hidden border-b border-hairline lbb-grain grid-marks">
          <Shell className="relative py-16 md:py-24 lg:py-32">
            <div className="lbb-grid items-end">
              <div className="col-span-4 md:col-span-6 lg:col-span-8">
                <TechLabel tone="signal">LBB / DESIGN SYSTEM / {DESIGN_SYSTEM_VERSION}</TechLabel>
                <h1 className="text-display-1 mt-5 max-w-[12ch] text-bone">Tehran After Dark</h1>
                <p className="text-lede mt-6">{EXPERIENCE_NORTH_STAR} یک زبان واحد برای Utility، روایت و خواندن می‌سازد.</p>
              </div>
              <Surface tone="raised" className="col-span-4 mt-10 p-5 md:col-span-2 md:mt-0 lg:col-span-4">
                <p className="font-mono text-4xl font-bold text-signal">70</p>
                <p className="mt-1 text-xs text-metal">Commerce clarity</p>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-4">
                  <div><p className="font-mono text-xl text-bone">20</p><p className="text-[11px] text-mute">Editorial</p></div>
                  <div><p className="font-mono text-xl text-bone">10</p><p className="text-[11px] text-mute">Spectacle</p></div>
                </div>
              </Surface>
            </div>
          </Shell>
        </header>

        <nav aria-label="بخش‌های Design System" className="sticky top-[var(--lbb-nav-h)] z-30 border-b border-hairline bg-obsidian/95 backdrop-blur">
          <Shell className="flex snap-x gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[ ["colors", "رنگ"], ["typography", "تایپ"], ["foundations", "پایه"], ["states", "حالت"], ["photography", "تصویر"], ["compositions", "ترکیب"] ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="tech min-h-11 shrink-0 snap-start px-4 py-3 text-metal hover:text-signal focus-visible:text-signal">{label}</a>
            ))}
          </Shell>
        </nav>

        <ColorSection />
        <TypographySection />
        <FoundationsSection />
        <ComponentStatesSection />
        <PhotographySection />
        <CompositionSection />

        <Band hairline>
          <Shell className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <TechLabel tone="signal">F11 HANDOFF</TechLabel>
              <h2 className="text-display-3 mt-3 text-bone">سیستم آماده استفاده در F12 است</h2>
              <p className="mt-3 max-w-[58ch] text-sm leading-7 text-metal">Navbar، Search، Drawer و Global Shell در فاز بعد فقط از همین Tokenها و State Contract استفاده خواهند کرد.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/" className={CtaClasses("line")}>بازگشت به خانه</Link>
              <Link to="/shop" className={CtaClasses("signal")}>بررسی فروشگاه</Link>
            </div>
          </Shell>
        </Band>
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}
