import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { DemoNotice, Shell } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "شرایط استفاده از نسخه نمایشی | LBB";
const DESC =
  "شرایط استفاده از نسخه نمایشی LBB؛ پرداخت، سفارش، ارسال و حساب کاربری واقعی هنوز فعال نیستند.";

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="mb-3 text-xl font-bold text-bone">{title}</h2>
      <div className="text-sm leading-8 text-metal">{children}</div>
    </section>
  );
}

function TermsPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "شرایط استفاده" }]} />
          </Shell>
        </div>

        <header className="mx-auto max-w-[820px] px-4 py-10 md:px-8">
          <p className="tech text-signal">DEMO TERMS</p>
          <h1 className="mt-3 text-display-2 text-bone">شرایط استفاده</h1>
          <p className="mt-3 text-sm leading-7 text-metal">
            این شرایط وضعیت فعلی نسخه نمایشی سایت را توضیح می‌دهد و جایگزین شرایط فروش آینده نیست.
          </p>
        </header>

        <div className="mx-auto max-w-[820px] px-4 pb-16 md:px-8">
          <DemoNotice className="mb-10 rounded-xl">
            استفاده از سبد، Checkout و کد مرجع فقط برای آزمایش تجربه کاربری است. هیچ خرید، پرداخت،
            رزرو موجودی، پیامک، ایمیل، ارسال یا قرارداد فروش از طریق این نسخه ایجاد نمی‌شود.
          </DemoNotice>

          <Section title="ماهیت نسخه فعلی">
            <p>
              محصولات، قیمت‌ها، موجودی‌ها و فرایند سفارش برای نمایش و ارزیابی رابط کاربری ارائه
              شده‌اند. تا پیش از اعلام رسمی شروع فروش، دکمه‌های سایت تعهدی برای عرضه کالا یا پذیرش
              سفارش ایجاد نمی‌کنند.
            </p>
          </Section>

          <Section title="سبد و پیش‌نمایش سفارش">
            <p>
              سبد خرید در حافظه مرورگر نگه‌داری می‌شود. مرحله Checkout فقط اطلاعات را در همان صفحه
              بررسی می‌کند و یک خلاصه غیرشخصی و موقت در همان تب می‌سازد. این خلاصه رسید، فاکتور یا
              کد سفارش واقعی نیست.
            </p>
          </Section>

          <Section title="پرداخت و اطلاعات بانکی">
            <p>
              هیچ درگاه بانکی، انتقال وجه یا پرداخت در محل فعال نیست. سایت شماره کارت، رمز، CVV2 یا
              سایر داده‌های بانکی درخواست و ذخیره نمی‌کند. هر درخواست پرداخت خارج از سامانه رسمی
              آینده باید نامعتبر تلقی شود.
            </p>
          </Section>

          <Section title="قیمت و موجودی">
            <p>
              اعداد نمایش‌داده‌شده تا پیش از راه‌اندازی فروش، قیمت نهایی یا موجودی تضمین‌شده محسوب
              نمی‌شوند. قیمت، مالیات، تخفیف، هزینه ارسال و موجودی نهایی باید هنگام فعال‌شدن سامانه
              فروش بازبینی و منتشر شوند.
            </p>
          </Section>

          <Section title="محتوا و علائم تجاری">
            <p>
              نام، طراحی رابط، نوشته‌ها و تصاویر منتشرشده در سایت برای معرفی تجربه LBB استفاده
              می‌شوند. استفاده مجدد تجاری از محتوای اختصاصی بدون اجازه صاحب آن مجاز نیست؛ حقوق منابع
              ثالث نیز متعلق به صاحبان همان منابع است.
            </p>
          </Section>

          <Section title="تغییر وضعیت سرویس">
            <p>
              با اتصال بک‌اند، پرداخت و عملیات ارسال، این صفحه باید پیش از پذیرش سفارش واقعی با
              اطلاعات کسب‌وکار، روش پرداخت، ارسال، مرجوعی و پشتیبانی نهایی به‌روزرسانی شود.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
