import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { DemoNotice, Shell } from "@/components/lbb/ui/primitives";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/commerce";
import { fmtToman } from "@/lib/products";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "وضعیت ارسال و مرجوعی | LBB";
const DESC =
  "توضیح وضعیت فعلی ارسال و مرجوعی در نسخه نمایشی LBB؛ فروش، ارسال و بازگشت وجه هنوز فعال نیستند.";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/shipping-returns" }),
    links: canonical("/shipping-returns"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "ارسال و مرجوعی", path: "/shipping-returns" },
          ]),
        ),
      },
    ],
  }),
  component: ShippingReturnsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="mb-3 text-xl font-bold text-bone">{title}</h2>
      <div className="text-sm leading-8 text-metal">{children}</div>
    </section>
  );
}

function ShippingReturnsPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ارسال و مرجوعی" }]} />
          </Shell>
        </div>

        <header className="mx-auto max-w-[820px] px-4 py-10 md:px-8">
          <p className="tech text-signal">PRE-LAUNCH POLICY</p>
          <h1 className="mt-3 text-display-2 text-bone">ارسال و مرجوعی</h1>
          <p className="mt-3 text-sm leading-7 text-metal">
            وضعیت فعلی این صفحه مربوط به نسخه نمایشی فروشگاه است و قرارداد فروش فعال محسوب نمی‌شود.
          </p>
        </header>

        <div className="mx-auto max-w-[820px] px-4 pb-16 md:px-8">
          <DemoNotice className="mb-10 rounded-xl">
            در حال حاضر هیچ سفارش، پرداخت، بسته‌بندی، ارسال، تعویض، مرجوعی یا بازگشت وجه واقعی از
            طریق این سایت انجام نمی‌شود. سیاست نهایی پیش از فعال‌شدن فروش با اطلاعات عملیاتی واقعی
            منتشر خواهد شد.
          </DemoNotice>

          <Section title="محاسبه فعلی در رابط نمایشی">
            <p>
              برای تست رابط کاربری، هزینه ارسال ثابت {fmtToman(STANDARD_SHIPPING_FEE)} در نظر گرفته
              می‌شود و سبدهای نمایشی از {fmtToman(FREE_SHIPPING_THRESHOLD)} به بالا، ارسال رایگان
              نمایش می‌دهند. این اعداد فعلاً هزینه قابل پرداخت یا تعهد ارسال نیستند.
            </p>
          </Section>

          <Section title="روش و زمان تحویل">
            <p>
              شرکت حمل‌ونقل، محدوده ارسال، زمان پردازش، زمان تحویل و کد رهگیری هنوز تعیین و به
              سامانه متصل نشده‌اند. بنابراین هیچ بازه زمانی یا پوشش جغرافیایی در این نسخه تضمین
              نمی‌شود.
            </p>
          </Section>

          <Section title="مرجوعی و تعویض">
            <p>
              چون خرید واقعی فعال نیست، درخواست مرجوعی یا تعویض نیز از سایت قابل ثبت نیست. شرایط
              نهایی شامل مهلت درخواست، وضعیت قابل‌قبول کالا، هزینه حمل و کالاهای استثنا باید پیش از
              شروع فروش به‌صورت شفاف اعلام شود.
            </p>
          </Section>

          <Section title="بازگشت وجه">
            <p>
              هیچ مبلغی در نسخه فعلی دریافت نمی‌شود؛ در نتیجه فرایند بازگشت وجه هم وجود ندارد. پس از
              اتصال پرداخت، شیوه و زمان‌بندی بازپرداخت باید مطابق درگاه و فرایند مالی واقعی ثبت شود.
            </p>
          </Section>

          <Section title="مرجع اطلاعات">
            <p>
              تا پیش از راه‌اندازی فروش، تنها اطلاعیه‌های رسمی منتشرشده در همین سایت و صفحه
              Instagram با شناسه <span dir="ltr">@lbbclo</span> معتبرند. از ارسال اطلاعات بانکی یا
              پرداخت از طریق پیام مستقیم خودداری کنید.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
