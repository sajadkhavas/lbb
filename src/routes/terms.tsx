import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, Shell, StatePanel, StatusTag, TechLabel } from "@/components/lbb/ui/primitives";
import {
  STORE_SETTINGS,
  canPublishReturns,
  canPublishShipping,
  getPublicPaymentSettings,
} from "@/lib/store-settings";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "شرایط استفاده | LBB";
const DESC =
  "شرایط استفاده از وب‌سایت LBB و وضعیت انتشار شرایط تجاری؛ سیاست‌ها و اطلاعات عملیاتی تأییدنشده به‌عنوان تعهد فروش نمایش داده نمی‌شوند.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/terms" }),
    links: canonical("/terms"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "شرایط استفاده", path: "/terms" },
          ]),
        ),
      },
    ],
  }),
  component: TermsPage,
});

function Section({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-hairline pt-7">
      <h2 className="text-xl font-bold text-bone">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-8 text-metal">{children}</div>
    </section>
  );
}

function TermsPage() {
  const { legal, payment } = STORE_SETTINGS;
  const shippingPublished = canPublishShipping();
  const returnsPublished = canPublishReturns();
  const publicPayment = getPublicPaymentSettings();

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "شرایط استفاده" }]} />
          </Shell>
        </div>

        <header className="mx-auto max-w-[860px] px-4 py-10 md:px-8 md:py-14">
          <TechLabel tone="signal">LEGAL / PUBLIC STATUS</TechLabel>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-display-2 text-bone">شرایط استفاده</h1>
            <StatusTag tone={legal.termsPublished ? "success" : "warning"}>
              {legal.termsPublished ? "منتشرشده" : "شرایط تجاری نهایی منتشر نشده"}
            </StatusTag>
          </div>
          <p className="mt-4 max-w-[68ch] text-sm leading-8 text-metal">
            این صفحه مرزهای فعلی استفاده از وب‌سایت را روشن می‌کند. جزئیات فروش، ارسال، مرجوعی یا
            پرداخت فقط زمانی به‌عنوان شرط تجاری نمایش داده می‌شوند که منبع عمومی تأییدشده داشته
            باشند.
          </p>
        </header>

        <div className="mx-auto max-w-[860px] px-4 pb-16 md:px-8">
          {!legal.termsPublished ? (
            <StatePanel title="شرایط تجاری فروش هنوز نهایی نشده است" tone="warning">
              این وضعیت به معنی وجود مهلت، هزینه، روش پرداخت یا تعهد پیش‌فرض نیست. تا انتشار نسخهٔ
              تأییدشده، این صفحه هیچ سیاست تجاری نامشخصی را اختراع نمی‌کند.
            </StatePanel>
          ) : null}

          <nav
            aria-label="بخش‌های شرایط استفاده"
            className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-hairline bg-carbon p-4"
          >
            <a href="#website-use" className="min-h-11 px-3 py-2 text-xs text-metal hover:text-signal">
              استفاده از سایت
            </a>
            <a href="#commerce" className="min-h-11 px-3 py-2 text-xs text-metal hover:text-signal">
              فروش و پرداخت
            </a>
            <a href="#policies" className="min-h-11 px-3 py-2 text-xs text-metal hover:text-signal">
              سیاست‌های عملیاتی
            </a>
            <a href="#support" className="min-h-11 px-3 py-2 text-xs text-metal hover:text-signal">
              پشتیبانی
            </a>
          </nav>

          <div className="mt-10 space-y-9">
            <Section id="website-use" title="استفاده از وب‌سایت">
              <p>
                صفحات عمومی LBB برای مرور محتوای فروشگاه، اطلاعات محصول و مسیرهای پشتیبانی در دسترس
                هستند. رابط کاربری نباید از وجود یک مقدار داخلی، وضعیت تجاری عمومی نتیجه‌گیری کند؛
                تنها دادهٔ تأییدشده و فعال مبنای ادعای عمومی است.
              </p>
              <p>
                اطلاعات نمایش‌داده‌شده در هر صفحه باید در همان زمینه خوانده شوند. نبودن اطلاعات
                عملیاتی به معنی اعمال یک مقدار عرفی یا سیاست خودکار نیست.
              </p>
            </Section>

            <Section id="commerce" title="ثبت سفارش و پرداخت">
              {publicPayment ? (
                <p>
                  روش پرداخت عمومی فعال با عنوان «{publicPayment.displayName}» در تنظیمات فروشگاه
                  تأیید شده است. با این حال نتیجهٔ پرداخت تنها پس از Verify معتبر سمت سرور می‌تواند
                  موفق تلقی شود؛ پارامترهای مرورگر یا Callback به‌تنهایی تأیید پرداخت نیستند.
                </p>
              ) : (
                <p>
                  در حال حاضر هیچ روش پرداخت عمومیِ فعال و تأییدشده‌ای برای نمایش در این فرانت‌اند
                  وجود ندارد. نام درگاه، روش پرداخت یا شناسهٔ پذیرنده از روی حدس نمایش داده نمی‌شود.
                </p>
              )}
              <p>
                اطلاعات محرمانهٔ پرداخت مانند Merchant ID محرمانه، API Key، Client Secret، Private
                Key و Webhook Secret بخشی از رابط عمومی نیستند و نباید به Bundle مرورگر وارد شوند.
              </p>
              {payment.verification === "pending" ? (
                <p>تنظیمات عمومی پرداخت در حال بررسی است و تا تأیید نهایی منتشر نمی‌شود.</p>
              ) : null}
            </Section>

            <Section id="policies" title="ارسال، تعویض، مرجوعی و بازپرداخت">
              <p>
                وضعیت عمومی ارسال در حال حاضر {shippingPublished ? "منتشرشده" : "منتشرنشده"} و
                وضعیت سیاست مرجوعی/تعویض {returnsPublished ? "منتشرشده" : "منتشرنشده"} است. این
                برچسب‌ها از Store Settings می‌آیند و جای سیاست واقعی را نمی‌گیرند.
              </p>
              <p>
                مبلغ ارسال، ارسال رایگان، زمان تحویل، مهلت مرجوعی و زمان بازپرداخت فقط در صفحهٔ
                سیاست عملیاتی و تنها در صورت تأیید نمایش داده می‌شوند.
              </p>
              <Link to="/shipping-returns" className={CtaClasses("line")}>
                مشاهده وضعیت ارسال و مرجوعی
              </Link>
            </Section>

            <Section title="حریم خصوصی">
              <p>
                داده‌هایی که فرانت‌اند فعلی در مرورگر نگه می‌دارد، مسیرهای خارجی و وضعیت اتصال
                سرویس‌های سمت سرور در صفحهٔ حریم خصوصی توضیح داده شده‌اند. فعال‌شدن هر سرویس جدید
                باید قبل از جمع‌آوری دادهٔ جدید در همان صفحه منعکس شود.
              </p>
              <Link to="/privacy" className={CtaClasses("line")}>
                مطالعه حریم خصوصی
              </Link>
            </Section>

            <Section id="support" title="پشتیبانی و اطلاعات رسمی">
              <p>
                برای ارتباط، فقط کانال‌هایی که در صفحه تماس به‌عنوان عمومی و تأییدشده نمایش داده
                می‌شوند معتبرند. این صفحه شماره تلفن، ایمیل، ساعت کاری یا نشانی تکمیلی تأییدنشده
                تولید نمی‌کند.
              </p>
              <Link to="/contact" className={CtaClasses("signal")}>
                تماس و پشتیبانی
              </Link>
            </Section>

            <Section title="به‌روزرسانی این صفحه">
              <p>
                هنگام تأیید سیاست‌های واقعی کسب‌وکار، محتوای عمومی باید از تنظیمات منتشرشده تغذیه
                شود. تا آن زمان، وضعیت «منتشر نشده» عمداً به‌جای متن حقوقی یا تعهد ساختگی نمایش داده
                می‌شود.
              </p>
              {legal.lastReviewedAt ? (
                <p>
                  آخرین بازبینی ثبت‌شده: <span dir="ltr">{legal.lastReviewedAt}</span>
                </p>
              ) : null}
            </Section>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
