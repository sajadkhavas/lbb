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
import { getPublicContactChannels } from "@/lib/store-settings";
import { contentParagraphs, resolveOptionalStorefrontPage } from "@/lib/content-page";
import { pageMeta, canonical, breadcrumbLd, ROBOTS } from "@/lib/site";

const TITLE = "حریم خصوصی | LBB";
const DESC =
  "وضعیت فعلی پردازش داده در LBB؛ سیاست منتشرشده از پنل بر رفتار عمومی سایت مقدم است و اطلاعات تأییدنشده حدس زده نمی‌شوند.";

export const Route = createFileRoute("/privacy")({
  loader: () => resolveOptionalStorefrontPage("privacy"),
  head: ({ loaderData }) => {
    const page = loaderData;
    const title = page?.metaTitle || (page ? `${page.title} | LBB` : TITLE);
    const description = page?.metaDescription || page?.excerpt || DESC;
    const breadcrumbName = page?.title || "حریم خصوصی";

    return {
      meta: pageMeta({
        title,
        description,
        path: "/privacy",
        robots: page ? undefined : ROBOTS.NOINDEX_FOLLOW,
      }),
      links: canonical("/privacy"),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: breadcrumbName, path: "/privacy" },
            ]),
          ),
        },
      ],
    };
  },
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-hairline pt-7">
      <h2 className="text-xl font-bold text-bone">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-8 text-metal">{children}</div>
    </section>
  );
}

function ManagedPrivacy({ content }: { content: string | null }) {
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

function PrivacyPage() {
  const page = Route.useLoaderData();
  const publicContacts = getPublicContactChannels();
  const publishedFromAdmin = Boolean(page);

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb
              items={[{ label: "خانه", href: "/" }, { label: page?.title || "حریم خصوصی" }]}
            />
          </Shell>
        </div>

        <header className="mx-auto max-w-[860px] px-4 py-10 md:px-8 md:py-14">
          <TechLabel tone="signal">PRIVACY / ADMIN AUTHORITY</TechLabel>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-display-2 text-bone">{page?.title || "حریم خصوصی"}</h1>
            <StatusTag tone={publishedFromAdmin ? "success" : "warning"}>
              {publishedFromAdmin ? "منتشرشده از پنل" : "سیاست نهایی منتشر نشده"}
            </StatusTag>
          </div>
          <p className="mt-4 max-w-[68ch] text-sm leading-8 text-metal">
            {page?.excerpt ||
              "تا انتشار سیاست نهایی از پنل، این صفحه فقط رفتار قابل مشاهده و فعلی سایت را توضیح می‌دهد و برای سرویس‌های فعال‌نشده هدف پردازش یا مدت نگهداری اختراع نمی‌کند."}
          </p>
        </header>

        <div className="mx-auto max-w-[860px] px-4 pb-16 md:px-8">
          {page ? (
            <ManagedPrivacy content={page.content} />
          ) : (
            <>
              <StatePanel title="سیاست نهایی پردازش داده هنوز از پنل منتشر نشده است" tone="warning">
                فعال‌شدن هر سرویس جدید باید پیش از جمع‌آوری داده جدید در سیاست عمومی منعکس شود.
              </StatePanel>

              <div className="mt-10 space-y-9">
                <Section title="داده‌های نگه‌داری‌شده در مرورگر">
                  <p>
                    سبد خرید و علاقه‌مندی‌ها می‌توانند برای حفظ تجربه همان مرورگر در Local Storage
                    نگه‌داری شوند. پاک‌کردن Storage مرورگر این داده‌های محلی را حذف می‌کند.
                  </p>
                </Section>

                <Section title="Checkout و اطلاعات هویتی">
                  <p>
                    تا زمانی که ثبت سفارش واقعی سمت سرور فعال نشده باشد، Frontend نباید اطلاعات
                    هویتی را با موفقیت ساختگی پردازش کند یا سفارش ثبت‌شده نشان دهد.
                  </p>
                </Section>

                <Section title="پرداخت و اطلاعات بانکی">
                  <p>
                    اطلاعات محرمانه درگاه یا Verify نباید وارد Bundle مرورگر یا Storage عمومی شوند و
                    بازگشت مرورگر از Callback به‌تنهایی اثبات پرداخت نیست.
                  </p>
                </Section>

                <Section title="فرم تماس و پشتیبانی">
                  <p>
                    راه‌های ارتباطی فقط از کانال‌های عمومی و تأییدشده فروشگاه نمایش داده می‌شوند.
                  </p>
                  {publicContacts.length > 0 ? (
                    <Link to="/contact" className={CtaClasses("line")}>
                      مشاهده راه‌های ارتباطی تأییدشده
                    </Link>
                  ) : null}
                </Section>

                <Section title="سرویس‌های بیرونی و ابزارهای جدید">
                  <p>
                    هر اتصال جدید مانند تحلیل، تبلیغات، خبرنامه یا CRM باید همراه با بازبینی سیاست
                    حریم خصوصی و توضیح رفتار واقعی آن منتشر شود.
                  </p>
                </Section>
              </div>
            </>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/terms" className={CtaClasses("line")}>
              شرایط استفاده
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
