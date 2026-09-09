import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, Shell, StatePanel, StatusTag, TechLabel } from "@/components/lbb/ui/primitives";
import { contentParagraphs, resolveOptionalStorefrontPage } from "@/lib/content-page";
import { pageMeta, canonical, breadcrumbLd, ROBOTS } from "@/lib/site";
import { useStorefrontControl } from "@/lib/storefront-control";

const TITLE = "حریم خصوصی | LBB";
const DESC = "سیاست حریم خصوصی LBB؛ نسخه منتشرشده از پنل مدیریت مرجع عمومی سایت است.";

export const Route = createFileRoute("/privacy")({
  loader: () => resolveOptionalStorefrontPage("privacy"),
  head: ({ loaderData }) => {
    const page = loaderData;
    const title = page?.metaTitle || (page ? `${page.title} | LBB` : TITLE);
    const description = page?.metaDescription || page?.excerpt || DESC;
    const breadcrumbName = page?.title || "حریم خصوصی";
    return {
      meta: pageMeta({ title, description, path: "/privacy", robots: page ? undefined : ROBOTS.NOINDEX_FOLLOW }),
      links: canonical("/privacy"),
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbLd([
          { name: "خانه", path: "/" },
          { name: breadcrumbName, path: "/privacy" },
        ])),
      }],
    };
  },
  component: PrivacyPage,
});

function ManagedPrivacy({ content }: { content: string | null }) {
  const paragraphs = contentParagraphs(content);
  return (
    <section className="rounded-2xl border border-hairline bg-carbon p-6 md:p-8">
      <TechLabel tone="signal">ADMIN / PUBLISHED POLICY</TechLabel>
      <div className="mt-5 space-y-4 text-sm leading-8 text-metal">
        {paragraphs.length > 0
          ? paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 28)}`}>{paragraph}</p>)
          : <p>این صفحه از پنل منتشر شده است، اما هنوز متن تفصیلی برای آن ثبت نشده است.</p>}
      </div>
    </section>
  );
}

function PrivacyPage() {
  const page = Route.useLoaderData();
  const { source, contact, runtime } = useStorefrontControl();
  const publishedFromAdmin = Boolean(page);

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16" data-storefront-source={source}>
        <div className="hairline-b"><Shell className="py-3"><Breadcrumb items={[{ label: "خانه", href: "/" }, { label: page?.title || "حریم خصوصی" }]} /></Shell></div>

        <header className="mx-auto max-w-[860px] px-4 py-10 md:px-8 md:py-14">
          <TechLabel tone="signal">PRIVACY / ADMIN AUTHORITY</TechLabel>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-display-2 text-bone">{page?.title || "حریم خصوصی"}</h1>
            <StatusTag tone={publishedFromAdmin ? "success" : "warning"}>{publishedFromAdmin ? "منتشرشده از پنل" : "سیاست نهایی منتشر نشده"}</StatusTag>
          </div>
          <p className="mt-4 max-w-[68ch] text-sm leading-8 text-metal">{page?.excerpt || "تا انتشار سیاست نهایی از پنل، Frontend درباره هدف پردازش، مدت نگهداری یا سرویس‌های فعال‌نشده ادعایی ایجاد نمی‌کند."}</p>
        </header>

        <div className="mx-auto max-w-[860px] px-4 pb-16 md:px-8">
          {page ? (
            <ManagedPrivacy content={page.content} />
          ) : (
            <StatePanel title="سیاست نهایی پردازش داده هنوز از پنل منتشر نشده است" tone="warning">
              متن عمومی این صفحه فقط پس از انتشار ContentPage توسط مدیر فروشگاه نمایش داده می‌شود.
            </StatePanel>
          )}

          <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="وضعیت عمومی سرویس‌ها">
            <div className="rounded-2xl border border-hairline bg-carbon p-5">
              <p className="tech text-signal">CONTACT / BACKEND</p>
              <h2 className="mt-2 text-lg font-bold text-bone">راه ارتباط عمومی</h2>
              <p className="mt-3 text-sm leading-7 text-metal">{contact.email || contact.phone || contact.instagramHandle}</p>
              <Link to="/contact" className={`${CtaClasses("line")} mt-4`}>مشاهده راه‌های ارتباطی</Link>
            </div>
            <div className="rounded-2xl border border-hairline bg-carbon p-5">
              <p className="tech text-signal">COMMERCE / RUNTIME</p>
              <h2 className="mt-2 text-lg font-bold text-bone">وضعیت سرویس‌های تجاری</h2>
              <p className="mt-3 text-sm leading-7 text-metal">Checkout: {runtime.checkoutEnabled ? "فعال" : "غیرفعال"} — Payment: {runtime.payment.enabled ? "فعال" : "غیرفعال"}</p>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-3"><Link to="/terms" className={CtaClasses("line")}>شرایط استفاده</Link><Link to="/contact" className={CtaClasses("signal")}>تماس و پشتیبانی</Link></div>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
