import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { Chip, Container, Section, Surface } from "@/components/lbb/ui/primitives";
import { resolveStorefrontFaqs, type StorefrontFaqDto } from "@/lib/backend-storefront";
import { contentParagraphs } from "@/lib/content-page";
import { cn } from "@/lib/utils";
import { breadcrumbLd, canonical, pageMeta, ROBOTS } from "@/lib/site";

const TITLE = "سوالات متداول | LBB";
const DESC = "پاسخ سوالات پرتکرار درباره محصولات، سایزبندی، سفارش، ارسال و مرجوعی در LBB.";

type FaqItem = { question: string; answer: string };
type FaqGroup = { id: string; label: string; title: string; items: FaqItem[] };

const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "products",
    label: "PRODUCT DATA",
    title: "محصول و موجودی",
    items: [
      {
        question: "اطلاعات محصول از کجا می‌آید؟",
        answer:
          "در نسخه فروشگاهی، نام، قیمت، رنگ، سایز، موجودی و جزئیات تاییدشده محصول از داده مدیریت‌شده فروشگاه نمایش داده می‌شود.",
      },
      {
        question: "اگر یک سایز یا رنگ موجود نباشد چه می‌شود؟",
        answer:
          "فقط گزینه‌هایی که برای همان محصول و واریانت قابل فروش باشند برای انتخاب خرید در نظر گرفته می‌شوند.",
      },
    ],
  },
  {
    id: "sizing",
    label: "FIT & SIZE",
    title: "فیت و انتخاب سایز",
    items: [
      {
        question: "راهنمای سایز کجاست؟",
        answer:
          "در صفحه هر محصول، راهنمای سایز مخصوص همان محصول را بررسی کنید؛ اندازه‌ها و فیت می‌توانند بین محصولات متفاوت باشند.",
      },
      {
        question: "اگر بین دو سایز مردد باشم چه کنم؟",
        answer:
          "اندازه‌های بدن یا لباس مناسب خودتان را با جدول همان محصول مقایسه کنید و توضیح فیت همان محصول را هم در نظر بگیرید.",
      },
    ],
  },
  {
    id: "ordering",
    label: "ORDER FLOW",
    title: "قیمت و ثبت سفارش",
    items: [
      {
        question: "قیمت نهایی چه زمانی مشخص می‌شود؟",
        answer:
          "قیمت نمایش‌داده‌شده برای واریانت انتخابی مبنای سبد است و در مسیر ثبت سفارش، موجودی و مبلغ دوباره از منبع فروشگاه بررسی می‌شود.",
      },
      {
        question: "اضافه کردن به سبد یعنی موجودی قطعی رزرو شده است؟",
        answer:
          "خیر. اعتبار موجودی در مرحله ثبت سفارش دوباره بررسی می‌شود و رزرو موجودی طبق جریان خرید فروشگاه انجام می‌شود.",
      },
    ],
  },
  {
    id: "shipping",
    label: "SHIPPING",
    title: "ارسال و تحویل",
    items: [
      {
        question: "روش ارسال چگونه تعیین می‌شود؟",
        answer:
          "روش‌های قابل استفاده با توجه به استان و شهر مقصد و تنظیمات فعال فروشگاه نمایش داده می‌شوند.",
      },
      {
        question: "هزینه ارسال داخل قیمت کالا حساب شده؟",
        answer:
          "خیر. شرایط و هزینه روش ارسال مستقل از قیمت کالا و مطابق گزینه فعال فروشگاه در مسیر سفارش مشخص می‌شود.",
      },
    ],
  },
  {
    id: "returns",
    label: "RETURNS",
    title: "تعویض و مرجوعی",
    items: [
      {
        question: "برای درخواست تعویض یا مرجوعی چه کنم؟",
        answer:
          "شرایط جاری را در صفحه ارسال و مرجوعی بررسی کنید و درخواست را از مسیر پشتیبانی فروشگاه ثبت کنید.",
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
      robots:
        Array.isArray(loaderData) && loaderData.length === 0 ? ROBOTS.NOINDEX_FOLLOW : undefined,
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
  const [activeGroup, setActiveGroup] = useState(faqGroups[0]?.id ?? "");
  const refs = useRef(new Map<string, HTMLElement>());

  const allGroups = useMemo(() => faqGroups, [faqGroups]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target instanceof HTMLElement) {
          setActiveGroup(visible.target.dataset.groupId ?? "");
        }
      },
      { rootMargin: "-30% 0px -55%", threshold: [0.05, 0.25, 0.5] },
    );

    for (const element of refs.current.values()) observer.observe(element);
    return () => observer.disconnect();
  }, [allGroups]);

  return (
    <main>
      <Section className="pb-8 pt-8 sm:pb-10 sm:pt-10">
        <Container>
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "سوالات متداول" }]} />
          <div className="mt-8 max-w-3xl">
            <Chip>FAQ / SUPPORT</Chip>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              سوالات متداول
            </h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
              پاسخ کوتاه و روشن برای سوالات پرتکرار درباره محصول، سایز، سفارش و پشتیبانی.
            </p>
          </div>
        </Container>
      </Section>

      {allGroups.length === 0 ? (
        <Section className="pt-0">
          <Container>
            <Surface className="p-6 text-sm leading-7 text-muted-foreground sm:p-8">
              پرسش متداول منتشرشده‌ای وجود ندارد. برای راهنمایی می‌توانید از صفحه تماس با ما استفاده
              کنید.
            </Surface>
          </Container>
        </Section>
      ) : (
        <Section className="pt-0">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
              <aside className="hidden lg:sticky lg:top-28 lg:block">
                <nav aria-label="دسته‌بندی سوالات" className="space-y-2">
                  {allGroups.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => refs.current.get(group.id)?.scrollIntoView({ behavior: "smooth" })}
                      className={cn(
                        "block w-full rounded-xl px-4 py-3 text-right text-sm transition-colors",
                        activeGroup === group.id
                          ? "bg-foreground font-bold text-background"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {group.title}
                    </button>
                  ))}
                </nav>
              </aside>

              <div className="space-y-10">
                {allGroups.map((group) => (
                  <FaqGroupSection
                    key={group.id}
                    group={group}
                    elementRef={(element) => {
                      if (element) refs.current.set(group.id, element);
                      else refs.current.delete(group.id);
                    }}
                  />
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}
    </main>
  );
}

function FaqGroupSection({
  group,
  elementRef,
}: {
  group: FaqGroup;
  elementRef: (element: HTMLElement | null) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      ref={elementRef}
      data-group-id={group.id}
      className="scroll-mt-28"
      aria-labelledby={`faq-${group.id}`}
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{group.label}</p>
          <h2 id={`faq-${group.id}`} className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            {group.title}
          </h2>
        </div>
      </div>

      <Surface className="divide-y overflow-hidden p-0">
        {group.items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={item.question}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-right sm:px-6"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="font-bold leading-7">{item.question}</span>
                {isOpen ? <Minus className="size-4 shrink-0" /> : <Plus className="size-4 shrink-0" />}
              </button>
              {isOpen ? (
                <div className="px-5 pb-5 text-sm leading-8 text-muted-foreground sm:px-6">
                  {item.answer}
                </div>
              ) : null}
            </div>
          );
        })}
      </Surface>
    </section>
  );
}
