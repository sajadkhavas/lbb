import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";

const TITLE = "سوالات متداول | LBB — ارسال، مرجوعی، سفارش";
const DESC = "پاسخ سوالات رایج درباره خرید از LBB: نحوه ارسال، مرجوعی، پرداخت، سایزبندی و...";

const QA = [
  ["مدت زمان ارسال سفارش چقدره؟", "سفارشات معمولاً ۲ تا ۵ روز کاری پس از تأیید پرداخت ارسال می‌شن."],
  ["آیا امکان مرجوع کردن کالا وجود داره؟", "بله، تا ۷ روز پس از دریافت می‌تونید کالا رو مرجوع کنید، به شرطی که استفاده نشده باشه."],
  ["درگاه پرداخت LBB امنه؟", "بله، پرداخت از طریق درگاه‌های معتبر بانکی انجام می‌شه و اطلاعات کارت شما ذخیره نمی‌شه."],
  ["چطور سایز مناسب انتخاب کنم؟", "به راهنمای سایز ما مراجعه کنید. اندازه سینه و کمر خود را بگیرید و با جدول مقایسه کنید."],
  ["ارسال به شهرستان‌ها هم انجام می‌شه؟", "بله، ما به سراسر ایران ارسال داریم. هزینه ارسال بر اساس شهر مقصد محاسبه می‌شه."],
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QA.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqLd) }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-24 text-black" style={{ paddingBottom: 80, fontFamily: "var(--font-body)" }}>
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "سوالات متداول" }]} />
          <h1 className="mt-4 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>سوالات متداول</h1>
          <div className="mt-6 divide-y divide-black/[0.06] border-t border-black/[0.06]">
            {QA.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold">
                  {q}
                  <span className="transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-sm leading-8 text-gray-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
