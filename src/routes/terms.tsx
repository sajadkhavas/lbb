import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import {
  CtaClasses,
  Shell,
  StatePanel,
  StatusTag,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { contentParagraphs, resolveOptionalStorefrontPage } from "@/lib/content-page";
import { pageMeta, canonical, breadcrumbLd, ROBOTS } from "@/lib/site";
import { useStorefrontControl } from "@/lib/storefront-control";

const TITLE = "شرایط استفاده | LBB";
const DESC =
  "شرایط استفاده از وب‌سایت LBB و وضعیت انتشار شرایط تجاری؛ سیاست‌های منتشرنشده به‌عنوان تعهد فروش نمایش داده نمی‌شوند.";

export const Route = createFileRoute("/terms")({
  loader: () => resolveOptionalStorefrontPage("terms"),
  head: ({ loaderData }) => {
    const page = loaderData;
    const title = page?.metaTitle || (page ? `${page.title} | LBB` : TITLE);
    const description = page?.metaDescription || page?.excerpt || DESC;
    const breadcrumbName = page?.title || "شرایط استفاده";
    return {
      meta: pageMeta({
        title,
        description,
        path: "/terms",
        robots: page ? undefined : ROBOTS.NOINDEX_FOLLOW,
      }),
      links: canonical("/terms"),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: breadcrumbName, path: "/terms" },
            ]),
          ),
        },
      ],
    };
  },
  component: TermsPage,
});

function ManagedTerms({ content }: { content: string | null }) {
  const paragraphs = contentParagraphs(content);
  return (
    <section className="rounded-2xl border border-hairline bg-carbon p-6 md:p-8">
      <TechLabel tone="signal">ADMIN / PUBLISHED POLICY</TechLabel>
      <div className="mt-5 space-y-4 text-sm leading-8 text-metal">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 28)}`}>{paragraph}</p>
          ))
        ) : (
          <p>این صفحه از پنل منتشر شده است، اما هنوز متن تفصیلی برای آن ثبت نشده است.</p>
        )}
      </div>
    </section>
  );
}

function TermsPage() {
  const page = Route.useLoaderData();
  const { source, runtime, policies } = useStorefrontControl();
  const publishedFromAdmin = Boolean(page);
  const returnsPublished = policies.returns.enabled && policies.returns.verification === "verified";

  return (
    <>
      <Navbar />
      <main
        dir="rtl"
        className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16"
        data-storefront-source={source}
      >
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb
              items={[{ label: "خانه", href: "/" }, { label: page?.title || "شرایط استفاده" }]}
            />
          </Shell>
        </div>

        <header className="mx-auto max-w-[860px] px-4 py-10 md:px-8 md:py-14">
          <TechLabel tone="signal">LEGAL / ADMIN AUTHORITY</TechLabel>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-display-2 text-bone">{page?.title || "شرایط استفاده"}</h1>
            <StatusTag tone={publishedFromAdmin ? "success" : "warning"}>
              {publishedFromAdmin ? "منتشرشده از پنل" : "شرایط نهایی منتشر نشده"}
            </StatusTag>
          </div>
          <p className="mt-4 max-w-[68ch] text-sm leading-8 text-metal">
            {page?.excerpt ||
              "تا انتشار نسخه نهایی از پنل، Frontend شرط تجاری، مهلت، هزینه یا تعهد جدیدی ایجاد نمی‌کند."}
          </p>
        </header>

        <div className="mx-auto max-w-[860px] px-4 pb-16 md:px-8">
          {page ? (
            <ManagedTerms content={page.content} />
          ) : (
            <StatePanel title="شرایط تجاری فروش هنوز از پنل منتشر نشده است" tone="warning">
              نبودن نسخه منتشرشده به معنی وجود شرط یا تعهد پیش‌فرض نیست.
            </StatePanel>
          )}

          <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="وضعیت عملیاتی Backend">
            <div className="rounded-2xl border border-hairline bg-carbon p-5">
              <p className="tech text-signal">CHECKOUT / RUNTIME</p>
              <h2 className="mt-2 text-lg font-bold text-bone">ثبت سفارش</h2>
              <p className="mt-3 text-sm leading-7 text-metal">
                {runtime.checkoutEnabled
                  ? "Backend ثبت سفارش را فعال اعلام کرده است."
                  : "Backend ثبت سفارش را غیرفعال اعلام کرده است."}
              </p>
            </div>
            <div className="rounded-2xl border border-hairline bg-carbon p-5">
              <p className="tech text-signal">PAYMENT / RUNTIME</p>
              <h2 className="mt-2 text-lg font-bold text-bone">پرداخت</h2>
              <p className="mt-3 text-sm leading-7 text-metal">
                {runtime.payment.enabled
                  ? `Backend درگاه «${runtime.payment.provider}» را فعال اعلام کرده است؛ موفقیت پرداخت فقط پس از Verify سمت سرور معتبر است.`
                  : "هیچ درگاه پرداخت فعال از Backend اعلام نشده است."}
              </p>
            </div>
            <div className="rounded-2xl border border-hairline bg-carbon p-5 md:col-span-2">
              <p className="tech text-signal">RETURNS / ADMIN</p>
              <h2 className="mt-2 text-lg font-bold text-bone">مرجوعی و تعویض</h2>
              <p className="mt-3 text-sm leading-7 text-metal">
                {returnsPublished
                  ? "سیاست مرجوعی در پنل فعال و تأیید شده است. جزئیات کامل در صفحه ارسال و مرجوعی نمایش داده می‌شود."
                  : "سیاست مرجوعی هنوز در پنل به وضعیت فعال و تأییدشده نرسیده است."}
              </p>
              <Link to="/shipping-returns" className={`${CtaClasses("line")} mt-4`}>
                مشاهده ارسال و مرجوعی
              </Link>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/privacy" className={CtaClasses("line")}>
              حریم خصوصی
            </Link>
            <Link to="/contact" className={CtaClasses("signal")}>
              تماس و پشتیبانی
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
