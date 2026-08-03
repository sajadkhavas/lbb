import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";

const TITLE = "قوانین و مقررات | LBB";
const DESC = "قوانین و مقررات استفاده از فروشگاه اینترنتی LBB شامل شرایط خرید، پرداخت و مسئولیت‌ها.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
            { "@type": "ListItem", position: 2, name: "قوانین و مقررات", item: "/terms" },
          ],
        }),
      },
    ],
  }),
  component: TermsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
      <div className="text-sm leading-8 text-gray-700">{children}</div>
    </section>
  );
}

function TermsPage() {
  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-16 text-black" style={{ paddingBottom: 80, fontFamily: "var(--font-body)" }}>
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "قوانین و مقررات" }]} />
          </div>
        </div>

        <header className="mx-auto max-w-[820px] px-4 py-10 md:px-8">
          <h1 className="text-3xl font-bold md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            قوانین و مقررات
          </h1>
          <p className="mt-3 text-sm text-gray-600">آخرین به‌روزرسانی: ۱۴۰۵/۰۱/۰۱</p>
        </header>

        <div className="mx-auto max-w-[820px] px-4 pb-16 md:px-8">
          <Section title="پذیرش قوانین">
            <p>
              استفاده از فروشگاه اینترنتی LBB به منزله پذیرش کامل قوانین و مقررات ذکرشده در این صفحه‌ست. لطفاً قبل از ثبت سفارش، این متن رو با دقت مطالعه کن.
            </p>
          </Section>

          <Section title="ثبت سفارش و پرداخت">
            <p>
              تمامی سفارش‌ها از طریق درگاه پرداخت امن و متصل به شبکه بانکی کشور انجام می‌شن. پس از پرداخت موفق، پیامک تأیید سفارش برای مشتری ارسال می‌شه. LBB هیچ‌گونه اطلاعات کارت بانکی مشتریان رو ذخیره نمی‌کنه.
            </p>
          </Section>

          <Section title="قیمت‌ها و موجودی">
            <p>
              قیمت‌های درج‌شده در سایت به تومان و شامل مالیات بر ارزش افزوده هستن. LBB این حق رو محفوظ می‌دونه که قیمت‌ها و موجودی کالاها رو بدون اطلاع قبلی به‌روزرسانی کنه.
            </p>
          </Section>

          <Section title="حقوق مالکیت معنوی">
            <p>
              تمامی طرح‌ها، لوگو، تصاویر و محتوای متنی سایت متعلق به برند LBB هستن و هرگونه استفاده تجاری بدون اجازه کتبی ممنوعه.
            </p>
          </Section>

          <Section title="مسئولیت کاربر">
            <p>
              کاربر موظفه اطلاعات صحیح و به‌روز (آدرس، شماره تماس و کد پستی) رو در زمان ثبت سفارش وارد کنه. LBB مسئولیتی در قبال تأخیر یا عدم تحویل ناشی از اطلاعات نادرست کاربر نداره.
            </p>
          </Section>

          <Section title="تغییر قوانین">
            <p>
              LBB می‌تونه این قوانین رو در هر زمان به‌روزرسانی کنه. نسخه فعلی همیشه در همین صفحه در دسترس مشتریان قرار می‌گیره.
            </p>
          </Section>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
