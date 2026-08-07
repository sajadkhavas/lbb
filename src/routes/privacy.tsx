import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, Shell, StatePanel, StatusTag, TechLabel } from "@/components/lbb/ui/primitives";
import { STORE_SETTINGS, getPublicContactChannels } from "@/lib/store-settings";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "حریم خصوصی | LBB";
const DESC =
  "وضعیت فعلی پردازش داده در فرانت‌اند LBB؛ داده‌های محلی مرورگر و سرویس‌های منتشرنشده بدون ادعای ساختگی توضیح داده می‌شوند.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/privacy" }),
    links: canonical("/privacy"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "حریم خصوصی", path: "/privacy" },
          ]),
        ),
      },
    ],
  }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-7">
      <h2 className="text-xl font-bold text-bone">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-8 text-metal">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  const { legal } = STORE_SETTINGS;
  const publicContacts = getPublicContactChannels();

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "حریم خصوصی" }]} />
          </Shell>
        </div>

        <header className="mx-auto max-w-[860px] px-4 py-10 md:px-8 md:py-14">
          <TechLabel tone="signal">PRIVACY / CURRENT FRONTEND</TechLabel>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-display-2 text-bone">حریم خصوصی</h1>
            <StatusTag tone={legal.privacyPublished ? "success" : "warning"}>
              {legal.privacyPublished ? "سیاست منتشرشده" : "سیاست تجاری نهایی منتشر نشده"}
            </StatusTag>
          </div>
          <p className="mt-4 max-w-[68ch] text-sm leading-8 text-metal">
            این صفحه رفتار قابل مشاهدهٔ فرانت‌اند فعلی را توضیح می‌دهد. فعال‌شدن حساب کاربری، ثبت
            سفارش، پرداخت، خبرنامه، تحلیل یا پشتیبانی سمت سرور باید پیش از جمع‌آوری دادهٔ جدید در
            سیاست منتشرشده منعکس شود.
          </p>
        </header>

        <div className="mx-auto max-w-[860px] px-4 pb-16 md:px-8">
          {!legal.privacyPublished ? (
            <StatePanel title="سیاست نهایی پردازش داده هنوز منتشر نشده است" tone="warning">
              این صفحه دربارهٔ سامانه‌هایی که هنوز Contract عمومی تأییدشده ندارند، هدف پردازش، مدت
              نگهداری یا اشتراک‌گذاری داده اختراع نمی‌کند. آنچه در ادامه آمده فقط رفتار فعلی
              فرانت‌اند است.
            </StatePanel>
          ) : null}

          <div className="mt-10 space-y-9">
            <Section title="داده‌های نگه‌داری‌شده در مرورگر">
              <p>
                برای حفظ تجربه در همان مرورگر، سبد خرید در Local Storage نگه‌داری می‌شود. اقلام سبد
                می‌توانند شامل شناسه مسیر محصول، نام، قیمت کاتالوگ، انتخاب رنگ، سایز و تعداد باشند.
              </p>
              <p>
                فهرست علاقه‌مندی‌ها نیز شناسه مسیر محصولات را در Local Storage نگه می‌دارد. برخی
                قابلیت‌های رابط مانند جست‌وجوهای اخیر یا وضعیت اجزای رابط ممکن است دادهٔ محلی مشابهی
                ذخیره کنند.
              </p>
              <p>
                این داده‌های محلی به‌خودی‌خود حساب کاربری نیستند و با پاک‌کردن Storage مرورگر قابل
                حذف‌اند.
              </p>
            </Section>

            <Section title="Checkout و اطلاعات هویتی">
              <p>
                تا زمانی که Transport و پردازش سمت سرور تأییدشده برای ثبت سفارش وجود نداشته باشد،
                Checkout نباید فرم اطلاعات هویتی را با موفقیت ساختگی پردازش کند. صفحهٔ فعلی وضعیت
                آماده‌بودن سفارش را نشان می‌دهد و ثبت سفارش واقعی انجام نمی‌دهد.
              </p>
              <p>
                نام، تلفن، نشانی و کدپستی نباید فقط برای ساخت یک پیش‌نمایش محلی جمع‌آوری شوند. هر
                فرم واقعی آینده باید همراه با مقصد پردازش، هدف استفاده و سیاست نگهداری مشخص شود.
              </p>
            </Section>

            <Section title="پرداخت و اطلاعات بانکی">
              <p>
                تنظیمات عمومی پرداخت فقط شامل داده‌های قابل نمایش است. Merchant ID محرمانه، API Key،
                Client Secret، Private Key، Webhook Secret و دادهٔ Verify نباید در Bundle مرورگر یا
                Storage عمومی قرار گیرند.
              </p>
              <p>
                بازگشت مرورگر از یک درگاه یا وجود پارامترهای Callback به‌تنهایی اثبات پرداخت نیست؛
                نتیجه فقط پس از Verify سمت سرور می‌تواند معتبر شود.
              </p>
            </Section>

            <Section title="فرم تماس و پشتیبانی">
              <p>
                این فرانت‌اند Transport تأییدشده‌ای برای فرم تماس ندارد و به همین دلیل فرم با پیام
                موفقیت محلی ارائه نمی‌شود. راه‌های ارتباطی فقط از فهرست عمومی و تأییدشده Store
                Settings نمایش داده می‌شوند.
              </p>
              {publicContacts.length > 0 ? (
                <Link to="/contact" className={CtaClasses("line")}>
                  مشاهده راه‌های ارتباطی تأییدشده
                </Link>
              ) : null}
            </Section>

            <Section title="سرویس‌های بیرونی">
              <p>
                بازکردن یک لینک بیرونی مانند شبکه اجتماعی، شما را از دامنه LBB خارج می‌کند و پردازش
                داده در مقصد تابع سیاست همان سرویس است. لینک خارجی تنها زمانی در رابط تماس نمایش
                داده می‌شود که در تنظیمات عمومی تأیید شده باشد.
              </p>
            </Section>

            <Section title="کوکی، تحلیل و سرویس‌های جدید">
              <p>
                این صفحه برای ابزار تحلیل، تبلیغات رفتاری، خبرنامه یا CRM که Contract عمومی و
                پیاده‌سازی تأییدشده‌ای در فرانت‌اند فعلی ندارند، ادعای جمع‌آوری یا عدم جمع‌آوری دائمی
                نمی‌سازد. هر اتصال جدید باید همراه با بازبینی این سیاست منتشر شود.
              </p>
              <p>
                مرورگر و زیرساخت می‌توانند منابع فنی سایت را برای عملکرد یا کش نگه‌داری کنند؛ چنین
                رفتار فنی به‌تنهایی مجوزی برای ساخت پروفایل تبلیغاتی محسوب نمی‌شود.
              </p>
            </Section>

            <Section title="تغییرات و اطلاعات تکمیلی">
              <p>
                هنگام فعال‌شدن پردازش سمت سرور، سیاست نهایی باید نوع داده، هدف پردازش، محل و مدت
                نگهداری، دریافت‌کنندگان و روش پیگیری درخواست‌های مرتبط با داده را بر اساس وضعیت واقعی
                کسب‌وکار مشخص کند.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/terms" className={CtaClasses("line")}>
                  شرایط استفاده
                </Link>
                <Link to="/contact" className={CtaClasses("signal")}>
                  تماس و پشتیبانی
                </Link>
              </div>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
