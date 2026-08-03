import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";

const TITLE = "حریم خصوصی | LBB";
const DESC = "سیاست حفظ حریم خصوصی LBB درباره جمع‌آوری، استفاده و نگهداری از اطلاعات مشتریان.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
            { "@type": "ListItem", position: 2, name: "حریم خصوصی", item: "/privacy" },
          ],
        }),
      },
    ],
  }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
      <div className="text-sm leading-8 text-gray-700">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-16 text-black" style={{ paddingBottom: 80, fontFamily: "var(--font-body)" }}>
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "حریم خصوصی" }]} />
          </div>
        </div>

        <header className="mx-auto max-w-[820px] px-4 py-10 md:px-8">
          <h1 className="text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            حریم خصوصی
          </h1>
          <p className="mt-3 text-sm text-gray-600">آخرین به‌روزرسانی: ۱۴۰۵/۰۱/۰۱</p>
        </header>

        <div className="mx-auto max-w-[820px] px-4 pb-16 md:px-8">
          <Section title="اطلاعاتی که جمع‌آوری می‌کنیم">
            <p>
              برای ثبت و ارسال سفارش، اطلاعاتی مثل نام، شماره تماس، آدرس و ایمیل شما جمع‌آوری می‌شه. این اطلاعات فقط برای پردازش سفارش و ارتباط با شما استفاده می‌شن.
            </p>
          </Section>

          <Section title="نحوه استفاده از اطلاعات">
            <p>
              اطلاعات شما صرفاً برای موارد زیر استفاده می‌شن: پردازش و ارسال سفارش، اطلاع‌رسانی وضعیت سفارش، پاسخ‌گویی به پشتیبانی و در صورت عضویت در خبرنامه، ارسال اطلاعیه‌های تخفیف و کالای جدید.
            </p>
          </Section>

          <Section title="اشتراک‌گذاری اطلاعات">
            <p>
              LBB اطلاعات شخصی مشتریان رو به هیچ شخص یا شرکت ثالثی نمی‌فروشه یا اجاره نمی‌ده. اطلاعات آدرس فقط برای هماهنگی ارسال با شرکت‌های حمل‌ونقل معتبر به اشتراک گذاشته می‌شه.
            </p>
          </Section>

          <Section title="امنیت پرداخت">
            <p>
              تمامی تراکنش‌های مالی از طریق درگاه‌های بانکی رسمی و رمزنگاری‌شده انجام می‌شن. اطلاعات کارت بانکی هرگز روی سرورهای LBB ذخیره نمی‌شه.
            </p>
          </Section>

          <Section title="کوکی‌ها">
            <p>
              سایت LBB از کوکی برای بهبود تجربه کاربری، به‌خاطر سپردن سبد خرید و تحلیل ترافیک استفاده می‌کنه. با ادامه استفاده از سایت، با استفاده از این کوکی‌ها موافقت می‌کنید.
            </p>
          </Section>

          <Section title="حقوق کاربران">
            <p>
              هر زمان می‌تونید درخواست مشاهده، اصلاح یا حذف اطلاعات شخصی خودتون رو از طریق صفحه تماس با ما ثبت کنید.
            </p>
          </Section>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
