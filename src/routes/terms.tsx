import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
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
import {
  STORE_SETTINGS,
  canPublishReturns,
  canPublishShipping,
  getPublicPaymentSettings,
} from "@/lib/store-settings";
import { contentParagraphs, resolveOptionalStorefrontPage } from "@/lib/content-page";
import { pageMeta, canonical, breadcrumbLd, ROBOTS } from "@/lib/site";

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

function Section({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-hairline pt-7">
      <h2 className="text-xl font-bold text-bone">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-8 text-metal">{children}</div>
    </section>
  );
}

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
  const { payment } = STORE_SETTINGS;
  const shippingPublished = canPublishShipping();
  const returnsPublished = canPublishReturns();
  const publicPayment = getPublicPaymentSettings();
  const publishedFromAdmin = Boolean(page);

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16">
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
              {publishedFromAdmin ? "منتشرشده از پنل" : "شرایط تجاری نهایی منتشر نشده"}
            </StatusTag>
          </div>
          <p className="mt-4 max-w-[68ch] text-sm leading-8 text-metal">
            {page?.excerpt ||
              "تا زمانی که نسخه نهایی از پنل مدیریت منتشر نشود، این صفحه فقط مرزهای امن و فعلی استفاده از سایت را توضیح می‌دهد و شرط تجاری جدیدی اختراع نمی‌کند."}
          </p>
        </header>

        <div className="mx-auto max-w-[860px] px-4 pb-16 md:px-8">
          {page ? (
            <ManagedTerms content={page.content} />
          ) : (
            <>
              <StatePanel title="شرایط تجاری فروش هنوز از پنل منتشر نشده است" tone="warning">
                نبودن نسخه منتشرشده به معنی وجود مهلت، هزینه، روش پرداخت یا تعهد پیش‌فرض نیست.
              </StatePanel>

              <StatePanel
                className="mt-4"
                title="مهلت ۴۸ ساعت، حقوق قانونی را محدود نمی‌کند"
                tone="info"
              >
                درخواست LBB برای اعلام سریع مغایرت با عکس یا مشخصات، ایراد کالا یا مشکل مربوط به
                سایز حداکثر تا ۴۸ ساعت پس از تحویل، یک مسیر رسیدگی داخلی است. در معامله از راه دور،
                حقوق قانونی مصرف‌کننده از جمله حق انصراف مقرر در قانون تجارت الکترونیکی مستقل است و
                این بازه ۴۸ ساعته آن را حذف یا محدود نمی‌کند.
              </StatePanel>

              <div className="mt-10 space-y-9">
                <Section id="website-use" title="استفاده از وب‌سایت">
                  <p>
                    صفحات عمومی LBB برای مرور محتوای فروشگاه، اطلاعات محصول و مسیرهای پشتیبانی در
                    دسترس هستند. تنها داده فعال و تأییدشده باید مبنای ادعای عمومی قرار گیرد.
                  </p>
                </Section>

                <Section id="commerce" title="ثبت سفارش و پرداخت">
                  {publicPayment ? (
                    <p>
                      روش پرداخت عمومی با عنوان «{publicPayment.displayName}» تأیید شده است؛ با این
                      حال موفقیت پرداخت فقط پس از Verify معتبر سمت سرور قابل پذیرش است.
                    </p>
                  ) : (
                    <p>
                      در حال حاضر هیچ روش پرداخت عمومی فعال و تأییدشده‌ای برای نمایش وجود ندارد و
                      Frontend نباید از روی حدس نام درگاه یا وضعیت موفقیت بسازد.
                    </p>
                  )}
                  {payment.verification === "pending" ? (
                    <p>تنظیمات عمومی پرداخت در حال بررسی است و تا تأیید نهایی منتشر نمی‌شود.</p>
                  ) : null}
                </Section>

                <Section id="policies" title="ارسال، تعویض، مرجوعی و بازپرداخت">
                  <p>
                    وضعیت ارسال {shippingPublished ? "منتشرشده" : "منتشرنشده"} است و سیاست کامل
                    مرجوعی/تعویض {returnsPublished ? "منتشرشده" : "هنوز منتشرنشده"} است.
                  </p>
                  <Link to="/shipping-returns" className={CtaClasses("line")}>
                    مشاهده ارسال و مرجوعی
                  </Link>
                </Section>

                <Section title="حریم خصوصی">
                  <p>
                    جزئیات پردازش داده و وضعیت سرویس‌های فعال در صفحه حریم خصوصی توضیح داده می‌شود.
                  </p>
                  <Link to="/privacy" className={CtaClasses("line")}>
                    مطالعه حریم خصوصی
                  </Link>
                </Section>
              </div>
            </>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shipping-returns" className={CtaClasses("line")}>
              ارسال و مرجوعی
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
