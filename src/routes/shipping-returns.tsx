import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";

const TITLE = "ارسال و مرجوعی | LBB";
const DESC = "همه چیز درباره روش‌های ارسال، هزینه و زمان تحویل، و شرایط مرجوعی و بازگشت وجه در فروشگاه LBB.";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/shipping-returns" },
    ],
    links: [{ rel: "canonical", href: "/shipping-returns" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
            { "@type": "ListItem", position: 2, name: "ارسال و مرجوعی", item: "/shipping-returns" },
          ],
        }),
      },
    ],
  }),
  component: ShippingReturnsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      <div className="text-sm leading-8 text-gray-700">{children}</div>
    </section>
  );
}

function ShippingReturnsPage() {
  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-16 text-black" style={{ paddingBottom: 80, fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ارسال و مرجوعی" }]} />
          </div>
        </div>

        <header className="mx-auto max-w-[820px] px-4 py-10 md:px-8">
          <h1 className="text-3xl font-bold md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ارسال و مرجوعی
          </h1>
          <p className="mt-3 text-sm text-gray-600">آخرین به‌روزرسانی: ۱۴۰۵/۰۱/۰۱</p>
        </header>

        <div className="mx-auto max-w-[820px] px-4 pb-16 md:px-8">
          <Section title="روش‌های ارسال">
            <p className="mb-3">
              سفارش‌های LBB از طریق پست پیشتاز و شرکت‌های تیپاکس/باربری معتبر به سراسر ایران ارسال می‌شن. زمان تحویل بسته به شهر مقصد بین ۲ تا ۶ روز کاری متغیره.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>تهران و کرج: ۱ تا ۲ روز کاری</li>
              <li>مراکز استان‌ها: ۲ تا ۴ روز کاری</li>
              <li>سایر شهرها و مناطق دورافتاده: ۴ تا ۶ روز کاری</li>
            </ul>
          </Section>

          <Section title="هزینه ارسال">
            <p>
              هزینه ارسال بر اساس وزن سفارش و شهر مقصد در مرحله تسویه‌حساب محاسبه می‌شه. برای سفارش‌های بالای ۲٬۰۰۰٬۰۰۰ تومان، ارسال به‌صورت رایگان انجام می‌گیره.
            </p>
          </Section>

          <Section title="شرایط مرجوعی">
            <p className="mb-3">
              از تاریخ دریافت مرسوله، ۷ روز فرصت داری تا در صورت عدم رضایت، درخواست مرجوعی رو ثبت کنی. برای این کار کافیه با پشتیبانی از طریق صفحه تماس هماهنگ کنی.
            </p>
            <p className="mb-3">شرایط پذیرش مرجوعی:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>کالا استفاده نشده و برچسب اصلی روی اون باقی مونده باشه.</li>
              <li>کالا در بسته‌بندی اولیه و بدون آسیب فیزیکی برگردونده بشه.</li>
              <li>فاکتور یا کد سفارش همراه مرسوله ارسال بشه.</li>
            </ul>
          </Section>

          <Section title="بازگشت وجه">
            <p>
              پس از بررسی و تأیید مرجوعی، مبلغ پرداختی حداکثر تا ۷۲ ساعت کاری به همون شماره کارتی که سفارش با اون پرداخت شده، برگشت داده می‌شه.
            </p>
          </Section>

          <Section title="تعویض کالا">
            <p>
              اگه سایز یا رنگ دلخواهت موجود باشه، امکان تعویض مستقیم هم وجود داره. هزینه ارسال مجدد برای تعویض ناشی از اشتباه مشتری بر عهده مشتریه.
            </p>
          </Section>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
