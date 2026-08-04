import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MessageCircleMore } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, DemoNotice, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, absUrl, breadcrumbLd } from "@/lib/site";

const TITLE = "تماس با LBB | کانال رسمی ارتباط";
const DESC =
  "راه ارتباط فعلی با LBB از طریق صفحه رسمی اینستاگرام @lbbclo است. فرم پشتیبانی و سامانه سفارش هنوز فعال نیستند.";

const contactPageLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: TITLE,
  url: absUrl("/contact"),
  inLanguage: "fa-IR",
  mainEntity: {
    "@type": "Organization",
    name: "LBB",
    url: absUrl("/"),
    sameAs: ["https://www.instagram.com/lbbclo"],
  },
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/contact" }),
    links: canonical("/contact"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "تماس", path: "/contact" },
          ]),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(contactPageLd) },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-16 text-bone">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "تماس" }]} />
          </Shell>
        </div>

        <Shell className="py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
            <section>
              <TechLabel tone="signal">OFFICIAL CONTACT</TechLabel>
              <h1 className="mt-4 max-w-[14ch] text-display-1 text-bone">ارتباط با LBB</h1>
              <p className="text-lede mt-5 max-w-[58ch]">
                در نسخه فعلی، تنها کانال عمومی و قابل‌تأیید LBB صفحه رسمی اینستاگرام است.
              </p>
              <p className="mt-5 max-w-[64ch] text-sm leading-8 text-metal">
                برای پرسش درباره محصولات، سایز یا همکاری می‌توانید پیام مستقیم ارسال کنید. زمان
                پاسخ، آدرس فیزیکی، شماره تلفن و ایمیل پشتیبانی تا زمانی که به‌صورت رسمی اعلام
                نشده‌اند در این صفحه درج نمی‌شوند.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://www.instagram.com/lbbclo"
                  target="_blank"
                  rel="noreferrer"
                  className={CtaClasses("signal")}
                >
                  <Instagram size={17} aria-hidden="true" />
                  رفتن به @lbbclo
                </a>
              </div>
            </section>

            <aside className="rounded-2xl border border-hairline bg-carbon p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-signal text-bone">
                  <MessageCircleMore size={21} aria-hidden="true" />
                </span>
                <div>
                  <p className="tech text-mute">CURRENT CHANNEL</p>
                  <h2 className="mt-1 text-lg font-bold text-bone">پیام مستقیم اینستاگرام</h2>
                </div>
              </div>

              <dl className="mt-7 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                  <dt className="text-mute">شناسه رسمی</dt>
                  <dd className="font-semibold text-bone" dir="ltr">
                    @lbbclo
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                  <dt className="text-mute">فرم سایت</dt>
                  <dd className="text-end font-semibold text-signal">هنوز متصل نیست</dd>
                </div>
                <div className="flex items-start justify-between gap-5">
                  <dt className="text-mute">پیگیری سفارش</dt>
                  <dd className="text-end font-semibold text-signal">سفارش واقعی فعال نیست</dd>
                </div>
              </dl>

              <DemoNotice className="mt-7 rounded-xl">
                هیچ پیامی از داخل این سایت ارسال یا ذخیره نمی‌شود. دکمه بالا شما را مستقیماً به
                سرویس بیرونی Instagram هدایت می‌کند و سیاست‌های همان سرویس اعمال خواهد شد.
              </DemoNotice>
            </aside>
          </div>
        </Shell>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
