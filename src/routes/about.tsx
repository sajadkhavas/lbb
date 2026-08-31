import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpLeft, BookOpenText, Grid2X2, MapPin, ScanSearch } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { BRAND, BRAND_COPY } from "@/lib/brand";
import { COLLECTIONS } from "@/lib/collections";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import { products } from "@/lib/products";
import { lifestyle1 } from "@/lib/product-images";
import {
  Band,
  CtaClasses,
  Frame,
  SectionHead,
  Shell,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "درباره LBB | از رگال تا فروشگاه | استریت‌ویر کرج";
const DESC =
  "داستان LBB؛ برند پوشاک خیابانی و استریت‌ویر در کرج، از شروع مسیر در سال ۱۴۰۰ تا فروشگاه حضوری و فروش آنلاین.";

const PRINCIPLES = [
  {
    icon: ScanSearch,
    title: "اطلاعات پیش از انتخاب",
    body: "نام، تن‌خور، جنس، رنگ، اندازه، موجودی و روش نگهداری باید در صفحهٔ محصول روشن و قابل‌بررسی باشد.",
  },
  {
    icon: Grid2X2,
    title: "کاتالوگ متمرکز",
    body: "دسته‌ها و کالکشن‌ها مسیر پیدا کردن محصول را ساده می‌کنند و هر مسیر به اطلاعات همان قطعه می‌رسد.",
  },
  {
    icon: BookOpenText,
    title: "محتوای کاربردی",
    body: "لوک‌بوک و ژورنال برای مقایسهٔ فرم، رنگ، پارچه و روش نگهداری ساخته می‌شوند؛ نه برای جایگزین‌کردن اطلاعات محصول.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/about", image: lifestyle1 }),
    links: canonical("/about"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "درباره LBB", path: "/about" },
          ]),
        ),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const categoryCount = new Set(products.map((product) => product.category)).size;

  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "درباره LBB" }]} />
        </Shell>

        <Band hairline={false} className="pb-10 pt-8 md:pb-14 md:pt-12">
          <Shell className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div>
              <TechLabel tone="signal">ABOUT / FROM RACK TO STORE</TechLabel>
              <h1 className="mt-5 max-w-[14ch] text-display-1 text-bone">از رگال تا فروشگاه</h1>
              <p className="text-lede mt-5 max-w-[58ch]">{BRAND.slogan}</p>
              <p className="mt-6 max-w-[62ch] text-sm leading-8 text-metal">
                LBB در سال ۱۴۰۰ و پس از سال‌ها فعالیت در حوزه پوشاک، با هدف شکل‌دادن به یک برند شخصی
                و متفاوت آغاز شد.
              </p>
              <p className="mt-4 max-w-[62ch] text-sm leading-8 text-metal">
                مسیر ما از تولید تا عرضه محصولات منتخب خارجی ادامه پیدا کرد و امروز با مجموعه‌ای
                محدود، خاص و انتخاب‌شده در کنار شما هستیم؛ هم در فروشگاه حضوری LBB و هم از طریق
                فروشگاه آنلاین LBB.
              </p>
              <p className="mt-4 max-w-[62ch] text-sm leading-8 text-metal">
                پوشاک خیابانی، استریت‌ویر، استایل و آیتم‌های وارداتی بخش اصلی هویت انتخاب‌های LBB
                هستند.
              </p>
              <p className="mt-4 flex items-start gap-2 text-sm leading-7 text-bone">
                <MapPin size={17} className="mt-1 shrink-0 text-signal" aria-hidden="true" />
                <span>{BRAND_COPY.storeLocationLabel}</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/shop" search={{}} className={CtaClasses("signal")}>
                  مشاهده فروشگاه
                </Link>
                <Link to="/collections" className={CtaClasses("line")}>
                  مرور کالکشن‌ها
                </Link>
              </div>
            </div>

            <Frame
              src={lifestyle1}
              alt="دو استایل اورسایز LBB در فضای شهری شبانه"
              ratio="4/5"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="rounded-2xl border border-hairline"
              zoom={false}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
              <TechLabel tone="bone" className="absolute inset-x-5 bottom-5">
                PRODUCT / EDITORIAL / GUIDANCE
              </TechLabel>
            </Frame>
          </Shell>
        </Band>

        <Band>
          <Shell>
            <SectionHead
              index="01"
              label="WORKING PRINCIPLES"
              title="سه اصل برای انتخاب روشن"
              lede="اطلاعات محصول باید پیش از توصیف تبلیغاتی در دسترس باشد و هر ادعا به دادهٔ واقعی تکیه کند."
            />
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {PRINCIPLES.map(({ icon: Icon, title, body }) => (
                <section key={title} className="rounded-2xl border border-hairline bg-carbon p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-signal/40 bg-signal/10 text-signal">
                    <Icon aria-hidden="true" size={21} />
                  </span>
                  <h2 className="mt-5 text-xl font-bold text-bone">{title}</h2>
                  <p className="mt-3 text-sm leading-8 text-metal">{body}</p>
                </section>
              ))}
            </div>
          </Shell>
        </Band>

        <Band>
          <Shell className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <TechLabel tone="signal">CONTENT MAP</TechLabel>
              <h2 className="mt-4 text-display-2 text-bone">آنچه در LBB پیدا می‌کنید</h2>
              <p className="mt-4 text-sm leading-8 text-metal">
                عددها مستقیماً از دادهٔ کاتالوگ و محتوای سایت خوانده می‌شوند و با تغییر محتوا به‌روز
                می‌مانند.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-4">
              {[
                { value: products.length, label: "محصول" },
                { value: categoryCount, label: "دسته محصول" },
                { value: COLLECTIONS.length, label: "کالکشن" },
                { value: JOURNAL_ARTICLES.length, label: "مقاله ژورنال" },
              ].map((item) => (
                <div key={item.label} className="bg-carbon p-5 text-center md:p-6">
                  <dd className="font-display text-4xl font-black text-bone">
                    {item.value.toLocaleString("fa-IR")}
                  </dd>
                  <dt className="tech mt-2 text-metal">{item.label}</dt>
                </div>
              ))}
            </dl>
          </Shell>
        </Band>

        <Band>
          <Shell>
            <SectionHead
              index="02"
              label="A CLEAR PATH"
              title="از کشف تا صفحهٔ محصول"
              lede="هر بخش نقش مشخصی دارد؛ برای اطلاعات پایه نباید میان چند صفحه سرگردان شوید."
            />
            <ol className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {
                  index: "01",
                  title: "کشف",
                  body: "از فروشگاه، دسته‌ها یا کالکشن‌ها برای محدودکردن انتخاب استفاده کنید.",
                  to: "/collections" as const,
                  action: "مرور کالکشن‌ها",
                },
                {
                  index: "02",
                  title: "مقایسه",
                  body: "در لوک‌بوک فرم و رنگ قطعه‌ها را کنار هم ببینید و در ژورنال دربارهٔ کاربردشان بخوانید.",
                  to: "/lookbook" as const,
                  action: "دیدن لوک‌بوک",
                },
                {
                  index: "03",
                  title: "بررسی نهایی",
                  body: "برای قیمت، موجودی، اندازه، جنس و نگهداری به صفحهٔ همان محصول بروید.",
                  to: "/shop" as const,
                  action: "رفتن به فروشگاه",
                },
              ].map((step) => (
                <li
                  key={step.index}
                  className="flex flex-col rounded-2xl border border-hairline bg-carbon p-6"
                >
                  <TechLabel tone="signal">STEP {step.index}</TechLabel>
                  <h3 className="mt-4 text-display-3 text-bone">{step.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-8 text-metal">{step.body}</p>
                  <Link
                    to={step.to}
                    className="tech mt-6 inline-flex items-center gap-2 text-bone transition-colors hover:text-signal"
                  >
                    {step.action}
                    <ArrowUpLeft aria-hidden="true" size={14} />
                  </Link>
                </li>
              ))}
            </ol>
          </Shell>
        </Band>

        <Band>
          <Shell className="grid gap-6 rounded-2xl border border-hairline bg-carbon p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <TechLabel tone="signal">NEED A QUICK ANSWER?</TechLabel>
              <h2 className="mt-3 text-display-3 text-bone">پاسخ پرسش‌های رایج را یک‌جا ببینید</h2>
              <p className="mt-3 max-w-[58ch] text-sm leading-7 text-metal">
                بخش پرسش‌های رایج دربارهٔ موجودی، اندازه، کالکشن، لوک‌بوک و مراحل خرید توضیح می‌دهد.
              </p>
            </div>
            <Link to="/faq" className={CtaClasses("signal")}>
              پرسش‌های رایج
            </Link>
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
