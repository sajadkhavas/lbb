import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { Band, CtaClasses, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { breadcrumbLd, canonical, pageMeta } from "@/lib/site";
import { EMPTY_FILTERS } from "@/lib/product-filter";

const TITLE = "سوالات متداول LBB | محصول، سایز، موجودی و سفارش";
const DESC =
  "پاسخ سوالات رایج LBB درباره اطلاعات محصول، انتخاب سایز، موجودی، کالکشن‌ها، لوک‌بوک و جزئیات نمایش‌داده‌شده پیش از ثبت سفارش.";

type FaqGroup = {
  id: string;
  label: string;
  title: string;
  items: { question: string; answer: string }[];
};

const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "products",
    label: "PRODUCT DATA",
    title: "محصول و موجودی",
    items: [
      {
        question: "موجود بودن یک محصول یا سایز را از کجا بفهمم؟",
        answer:
          "وضعیت کلی محصول و اندازه‌های قابل‌انتخاب در صفحه همان محصول نمایش داده می‌شود. اگر یک سایز در فهرست باشد اما قابل‌انتخاب نباشد، در حال حاضر ناموجود است.",
      },
      {
        question: "رنگ‌های نمایش‌داده‌شده برای همه سایزها موجودند؟",
        answer:
          "رنگ و سایز دو انتخاب جدا هستند و موجودی نهایی باید پس از انتخاب هر دو بررسی شود. صرف دیده شدن یک رنگ به معنی موجود بودن همه اندازه‌ها در آن رنگ نیست.",
      },
      {
        question: "اطلاعات جنس و روش نگهداری کجا قرار دارد؟",
        answer:
          "جنس پارچه، توضیح محصول و نکات نگهداری در صفحه محصول ثبت شده‌اند. برای شست‌وشو، اطلاعات همان قطعه را بر توصیه‌های عمومی مقدم بدانید.",
      },
    ],
  },
  {
    id: "sizing",
    label: "FIT & SIZE",
    title: "فیت و انتخاب سایز",
    items: [
      {
        question: "اورسایز بودن یعنی باید سایز بزرگ‌تر بگیرم؟",
        answer:
          "نه لزوماً. وقتی محصول از ابتدا اورسایز طراحی شده، اندازه معمول شما می‌تواند همان فرم آزاد را ایجاد کند. توضیح فیت و راهنمای سایز همان محصول را بررسی کنید.",
      },
      {
        question: "بین دو سایز مردد باشم چه چیزی را مقایسه کنم؟",
        answer:
          "اندازه سینه، کمر یا قد لباس را با یک لباس مشابه که تن‌خورش را دوست دارید مقایسه کنید. نوع برش مثل باکسی، ریلکس یا اورسایز را هم در تصمیم لحاظ کنید.",
      },
      {
        question: "جوراب LBB چه سایزی دارد؟",
        answer:
          "مدل فعلی جوراب ساقدار به‌صورت فری‌سایز ثبت شده و در توضیح فیت محصول، بازه پیشنهادی سایز پا نوشته شده است. همان صفحه محصول مرجع نهایی است.",
      },
    ],
  },
  {
    id: "ordering",
    label: "ORDER FLOW",
    title: "قیمت و ثبت سفارش",
    items: [
      {
        question: "قیمت نهایی سفارش را چه زمانی می‌بینم؟",
        answer:
          "قیمت هر محصول روی کارت و صفحه محصول نمایش داده می‌شود. جمع نهایی اقلام و هر هزینه وابسته به سفارش باید پیش از ثبت نهایی در خلاصه سبد یا مرحله پرداخت دیده شود.",
      },
      {
        question: "زمان و هزینه ارسال ثابت است؟",
        answer:
          "زمان و هزینه می‌تواند به مقصد و روش در دسترس وابسته باشد. اطلاعاتی که پیش از ثبت نهایی سفارش نمایش داده می‌شود، ملاک همان سفارش است.",
      },
      {
        question: "محصول ناموجود را می‌توان به سبد اضافه کرد؟",
        answer:
          "محصول یا انتخاب ناموجود نباید قابل افزودن به سبد باشد. اگر وضعیت موجودی تغییر کرده باشد، صفحه را تازه‌سازی کنید و انتخاب رنگ و سایز را دوباره بررسی کنید.",
      },
    ],
  },
  {
    id: "editorial",
    label: "EDITORIAL PAGES",
    title: "کالکشن، لوک‌بوک و ژورنال",
    items: [
      {
        question: "فرق کالکشن با دسته‌بندی محصول چیست؟",
        answer:
          "دسته‌بندی بر اساس نوع محصول مثل هودی یا شلوار است. کالکشن چند محصول موجود را بر اساس رنگ، فرم یا ایده استایلینگ کنار هم می‌گذارد.",
      },
      {
        question: "آیا همه قطعه‌های داخل لوک‌بوک قابل خریدند؟",
        answer:
          "لوک‌بوک از تصاویر و محصولات فعلی کاتالوگ استفاده می‌کند، اما موجودی ممکن است تغییر کند. برای وضعیت قطعی هر قطعه به صفحه محصول بروید.",
      },
      {
        question: "مقاله‌های ژورنال جایگزین اطلاعات محصول هستند؟",
        answer:
          "خیر. ژورنال راهنمای عمومی برای استایل، پارچه و نگهداری است. جنس، فیت، سایز و دستور نگهداری صفحه محصول برای همان قطعه اولویت دارد.",
      },
    ],
  },
];

const FAQ_ITEMS = FAQ_GROUPS.flatMap((group) => group.items);
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/faq" }),
    links: canonical("/faq"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "سوالات متداول", path: "/faq" },
          ]),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(faqLd) },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "سوالات متداول" }]} />
        </Shell>

        <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
          <Shell>
            <TechLabel tone="signal">FAQ / LBB</TechLabel>
            <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">پاسخ‌های روشن پیش از انتخاب و ثبت سفارش</h1>
            <p className="text-lede mt-5 max-w-[62ch]">
              پاسخ‌ها بر اساس اطلاعات قابل‌نمایش در سایت نوشته شده‌اند و عدد یا تعهدی درباره فرایندهای تأییدنشده اضافه نمی‌کنند.
            </p>

            <nav className="mt-8 flex flex-wrap gap-2" aria-label="دسته‌های سوالات متداول">
              {FAQ_GROUPS.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="rounded-full border border-hairline px-4 py-2 text-xs text-metal transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  {group.title}
                </a>
              ))}
            </nav>
          </Shell>
        </Band>

        <Band>
          <Shell className="max-w-[980px]">
            <div className="space-y-12">
              {FAQ_GROUPS.map((group, groupIndex) => (
                <section id={group.id} key={group.id} className="scroll-mt-28">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <TechLabel tone="signal">{String(groupIndex + 1).padStart(2, "0")} / {group.label}</TechLabel>
                      <h2 className="mt-3 text-display-3 text-bone">{group.title}</h2>
                    </div>
                    <span className="tech text-mute">{group.items.length.toLocaleString("fa-IR")} پاسخ</span>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-hairline bg-carbon">
                    {group.items.map((item) => (
                      <details key={item.question} className="group border-b border-hairline last:border-b-0">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-sm font-bold leading-7 text-bone transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal md:px-6">
                          <span>{item.question}</span>
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hairline text-metal transition-transform duration-200 group-open:rotate-45 group-open:border-signal group-open:text-signal">
                            <Plus aria-hidden="true" size={17} />
                          </span>
                        </summary>
                        <div className="px-5 pb-6 md:px-6">
                          <p className="max-w-[72ch] text-sm leading-8 text-metal">{item.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </Shell>
        </Band>

        <Band>
          <Shell className="grid gap-6 rounded-2xl border border-hairline bg-carbon p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <TechLabel tone="signal">KEEP EXPLORING</TechLabel>
              <h2 className="mt-3 text-display-3 text-bone">برای انتخاب، از داده واقعی محصول شروع کنید</h2>
              <p className="mt-3 max-w-[58ch] text-sm leading-7 text-metal">
                فروشگاه برای قیمت و موجودی، و ژورنال برای راهنماهای عمومی استایل و نگهداری در دسترس‌اند.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/journal" className={CtaClasses("line")}>
                ژورنال
              </Link>
              <Link to="/shop" search={EMPTY_FILTERS} className={CtaClasses("signal")}>
                فروشگاه
              </Link>
            </div>
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
