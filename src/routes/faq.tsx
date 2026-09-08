import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { Band, CtaClasses, Shell, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";
import { contentParagraphs } from "@/lib/content-page";
import { breadcrumbLd, canonical, pageMeta, ROBOTS } from "@/lib/site";
import { resolveStorefrontFaqs, type StorefrontFaqDto } from "@/lib/storefront-control";

const TITLE = "سوالات متداول LBB | سایز، ارسال و انتخاب محصول";
const DESC =
  "پاسخ سوالات متداول LBB درباره اطلاعات محصول، انتخاب سایز و روش‌های ارسال تأییدشده؛ در حالت live پاسخ‌ها از پنل مدیریت می‌آیند.";

type FaqGroup = {
  id: string;
  label: string;
  title: string;
  items: { question: string; answer: string }[];
};

/**
 * Prototype-only fallback. Production live mode treats the Backend list as authoritative;
 * an empty live list stays empty and must never resurrect prototype answers.
 */
const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "products",
    label: "PRODUCT DATA",
    title: "محصول و موجودی",
    items: [
      {
        question: "موجود بودن یک محصول یا سایز را از کجا بفهمم؟",
        answer:
          "صفحه همان محصول مرجع وضعیت قابل انتخاب رنگ، سایز و موجودی است. اطلاعات محصول نمونه یا غیرفعال نباید مبنای خرید قرار گیرد.",
      },
      {
        question: "اطلاعات جنس و نگهداری را از کجا بررسی کنم؟",
        answer:
          "اطلاعات همان محصول بر توصیه عمومی مقدم است. اگر جنس، تن‌خور یا روش نگهداری برای یک محصول منتشر نشده باشد، آن مورد نباید از روی حدس تکمیل شود.",
      },
    ],
  },
  {
    id: "sizing",
    label: "FIT & SIZE",
    title: "فیت و انتخاب سایز",
    items: [
      {
        question: "سایزبندی محصولات به چه صورت است؟",
        answer:
          "راهنمای اندازه باید برای همان محصول بررسی شود؛ بین مدل‌ها و برش‌های مختلف نمی‌توان یک جدول عمومی را بدون تأیید به همه محصولات تعمیم داد.",
      },
      {
        question: "اگر بین دو سایز مردد باشم چه چیزی را مقایسه کنم؟",
        answer:
          "اندازه‌های ثبت‌شده محصول و نوع تن‌خور را با یک لباس مشابه که اندازه آن برای شما مناسب است مقایسه کنید و در صورت نیاز از راه ارتباطی رسمی LBB راهنمایی بگیرید.",
      },
    ],
  },
  {
    id: "shipping",
    label: "SHIPPING",
    title: "ارسال و تحویل",
    items: [
      {
        question: "روش‌های ارسال LBB چیست؟",
        answer:
          "ارسال فوری با اسنپ یا اسنپ‌باکس برای تهران و کرج و ارسال تیپاکس یا دکاپست برای سراسر ایران فعال است. هزینه حمل این روش‌ها خارج از پرداخت آنلاین فروشگاه و به‌صورت پس‌کرایه دریافت می‌شود.",
      },
      {
        question: "برای جزئیات مرجوعی و تعویض کجا را ببینم؟",
        answer:
          "صفحه ارسال و مرجوعی وضعیت سیاست منتشرشده را نشان می‌دهد. جزئیات نهایی فقط وقتی از پنل تأیید و منتشر شوند به‌عنوان تعهد عمومی نمایش داده می‌شوند.",
      },
    ],
  },
];

const FAQ_LABELS: Record<string, { label: string; title: string }> = {
  products: { label: "PRODUCT DATA", title: "محصول و موجودی" },
  sizing: { label: "FIT & SIZE", title: "فیت و انتخاب سایز" },
  ordering: { label: "ORDER FLOW", title: "قیمت و ثبت سفارش" },
  shipping: { label: "SHIPPING", title: "ارسال و تحویل" },
  returns: { label: "RETURNS", title: "تعویض و مرجوعی" },
  editorial: { label: "EDITORIAL", title: "محتوا و راهنما" },
};

function backendFaqGroups(items: StorefrontFaqDto[]): FaqGroup[] {
  const groups = new Map<string, FaqGroup>();

  for (const item of [...items].sort((a, b) => a.sortOrder - b.sortOrder)) {
    const id = item.category?.trim() || "general";
    const meta = FAQ_LABELS[id] ?? { label: id.toUpperCase(), title: "سوالات عمومی" };
    const group = groups.get(id) ?? { id, label: meta.label, title: meta.title, items: [] };
    const answer = contentParagraphs(item.answer).join(" ") || item.answer;
    group.items.push({ question: item.question, answer });
    groups.set(id, group);
  }

  return [...groups.values()];
}

export const Route = createFileRoute("/faq")({
  loader: () => resolveStorefrontFaqs(),
  head: ({ loaderData }) => ({
    meta: pageMeta({
      title: TITLE,
      description: DESC,
      path: "/faq",
      robots: loaderData !== null && loaderData.length === 0 ? ROBOTS.NOINDEX_FOLLOW : undefined,
    }),
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
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const liveFaqs = Route.useLoaderData();
  const faqGroups = liveFaqs === null ? FAQ_GROUPS : backendFaqGroups(liveFaqs);

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
            <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">
              پاسخ‌های روشن پیش از انتخاب و ثبت سفارش
            </h1>
            <p className="text-lede mt-5 max-w-[62ch]">
              در حالت live، فقط سؤال‌های فعال ثبت‌شده در پنل مدیریت نمایش داده می‌شوند.
            </p>

            {faqGroups.length > 0 ? (
              <nav className="mt-8 flex flex-wrap gap-2" aria-label="دسته‌های سوالات متداول">
                {faqGroups.map((group) => (
                  <a
                    key={group.id}
                    href={`#${group.id}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-hairline px-4 py-2 text-xs text-metal transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    {group.title}
                  </a>
                ))}
              </nav>
            ) : null}
          </Shell>
        </Band>

        <Band>
          <Shell className="max-w-[980px]">
            {faqGroups.length === 0 ? (
              <StatePanel title="سؤال متداول فعالی از پنل منتشر نشده است" tone="info">
                تا زمان ثبت و فعال‌سازی FAQ در پنل، پاسخ نمونه یا قدیمی به‌جای داده واقعی نمایش داده
                نمی‌شود. برای پرسش فعلی از راه ارتباطی رسمی LBB استفاده کنید.
              </StatePanel>
            ) : (
              <div className="space-y-12">
                {faqGroups.map((group, groupIndex) => (
                  <section id={group.id} key={group.id} className="scroll-mt-28">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <TechLabel tone="signal">
                          {String(groupIndex + 1).padStart(2, "0")} / {group.label}
                        </TechLabel>
                        <h2 className="mt-3 text-display-3 text-bone">{group.title}</h2>
                      </div>
                      <span className="tech text-mute">
                        {group.items.length.toLocaleString("fa-IR")} پاسخ
                      </span>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-hairline bg-carbon">
                      {group.items.map((item) => (
                        <details
                          key={item.question}
                          className="group border-b border-hairline last:border-b-0"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-sm font-bold leading-7 text-bone transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal md:px-6">
                            <span>{item.question}</span>
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hairline text-metal transition-transform duration-200 group-open:rotate-45 group-open:border-signal group-open:text-signal">
                              <Plus aria-hidden="true" size={17} />
                            </span>
                          </summary>
                          <div className="px-5 pb-6 md:px-6">
                            <p className="max-w-[72ch] text-sm leading-8 text-metal">
                              {item.answer}
                            </p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            <div className="mt-12 flex flex-wrap gap-3">
              <Link to="/shipping-returns" className={CtaClasses("line")}>
                ارسال و مرجوعی
              </Link>
              <Link to="/contact" className={CtaClasses("signal")}>
                تماس با LBB
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
