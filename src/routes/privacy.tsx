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
            این صفحه رفتار قابل مشاهدهٔ فرانت‌اند فعلی را توضیح می‌دهد. هر پردازش سمت سرور یا سرویس
            جدید باید پیش از استفاده عمومی با وضعیت واقعی همان سرویس در این صفحه و سیاست منتشرشده
            هماهنگ بماند.
          </p>
        </header>

        <div className="mx-auto max-w-[860px] px-4 pb-16 md:px-8">
          {!legal.privacyPublished ? (
            <StatePanel title="سیاست نهایی پردازش داده هنوز منتشر نشده است" tone="warning">
              این صفحه دربارهٔ سامانه‌هایی که هنوز Contract عمومی تأییدشده ندارند، هدف پردازش، مدت
              نگهداری یا اشتراک‌گذاری داده اختراع نمی‌کند. آنچه در ادامه آمده فقط رفتار فعلی
              پیاده‌سازی است.
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

            <Section title="Web App و اعلان‌های مرورگر">
              <p>
                نصب Web App اختیاری است. اعلان مرورگر نیز فقط پس از انتخاب صریح «فعال‌کردن اعلان» و
                تأیید مجوز توسط خود مرورگر فعال می‌شود؛ سایت هنگام ورود به صفحه به‌صورت خودکار مجوز
                اعلان درخواست نمی‌کند.
              </p>
              <p>
                در صورت فعال‌سازی و ورود به حساب، مرورگر یک Push Subscription شامل endpoint و
                کلیدهای فنی لازم برای تحویل اعلان ایجاد می‌کند. این اشتراک به حساب همان مشتری متصل
                می‌شود تا اعلان‌های عملیاتی مرتبط با وضعیت واقعی سفارش دریافت شود. مقادیر حساس
                subscription در Backend به‌صورت رمز‌شده نگه‌داری می‌شوند و کلید خصوصی VAPID در
                Bundle مرورگر قرار نمی‌گیرد.
              </p>
              <p>
                کاربر می‌تواند اعلان همان دستگاه را از صفحه Web App غیرفعال کند یا مجوز اعلان را از
                تنظیمات مرورگر/سیستم‌عامل لغو کند. این قابلیت برای ساخت ادعای تبلیغاتی، تخفیف یا
                موجودی ساختگی استفاده نمی‌شود.
              </p>
              <Link to="/web-app" className={CtaClasses("line")}>
                تنظیم Web App و اعلان‌ها
              </Link>
            </Section>

            <Section title="Checkout و اطلاعات هویتی">
              <p>
                در حالت Commerce زنده، اطلاعات لازم برای ثبت و پیگیری سفارش فقط از مسیرهای Backend
                تأییدشده پردازش می‌شوند. در حالت Prototype، رابط نباید ثبت سفارش یا موفقیت پرداخت
                ساختگی نشان دهد.
              </p>
              <p>
                نام، تلفن، نشانی و کدپستی نباید صرفاً برای ساخت یک پیش‌نمایش محلی جمع‌آوری شوند. هر
                مسیر واقعی باید به قرارداد Backend و وضعیت واقعی کسب‌وکار متکی بماند.
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
                رابط عمومی فقط مسیرهای تماس یا Transportهایی را نمایش می‌دهد که وضعیت آن‌ها در
                تنظیمات و Backend تأیید شده باشد و نباید موفقیت محلی ساختگی نمایش دهد.
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
                پیاده‌سازی تأییدشده‌ای ندارند، ادعای جمع‌آوری یا عدم جمع‌آوری دائمی نمی‌سازد. هر
                اتصال جدید باید همراه با بازبینی این سیاست منتشر شود.
              </p>
              <p>
                مرورگر و زیرساخت می‌توانند منابع فنی سایت را برای عملکرد یا کش نگه‌داری کنند؛ چنین
                رفتار فنی به‌تنهایی مجوزی برای ساخت پروفایل تبلیغاتی محسوب نمی‌شود.
              </p>
            </Section>

            <Section title="تغییرات و اطلاعات تکمیلی">
              <p>
                سیاست نهایی باید نوع داده، هدف پردازش، محل و مدت نگهداری، دریافت‌کنندگان و روش
                پیگیری درخواست‌های مرتبط با داده را بر اساس وضعیت واقعی کسب‌وکار مشخص کند؛ این صفحه
                جایگزین اطلاعاتی که هنوز از مالک فروشگاه تأیید نشده نیست.
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
