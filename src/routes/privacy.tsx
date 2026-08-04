import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { DemoNotice, Shell } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "حریم خصوصی نسخه نمایشی | LBB";
const DESC =
  "توضیح داده‌های ذخیره‌شده در مرورگر نسخه نمایشی LBB؛ اطلاعات Checkout به سرور ارسال یا ذخیره نمی‌شوند.";

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
    <section className="mb-9">
      <h2 className="mb-3 text-xl font-bold text-bone">{title}</h2>
      <div className="text-sm leading-8 text-metal">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "حریم خصوصی" }]} />
          </Shell>
        </div>

        <header className="mx-auto max-w-[820px] px-4 py-10 md:px-8">
          <p className="tech text-signal">CURRENT DATA PRACTICES</p>
          <h1 className="mt-3 text-display-2 text-bone">حریم خصوصی</h1>
          <p className="mt-3 text-sm leading-7 text-metal">
            این صفحه رفتار فعلی فرانت‌اند نمایشی را توضیح می‌دهد؛ نه سامانه فروش یا حساب کاربری آینده.
          </p>
        </header>

        <div className="mx-auto max-w-[820px] px-4 pb-16 md:px-8">
          <DemoNotice className="mb-10 rounded-xl">
            این نسخه به بک‌اند سفارش، درگاه پرداخت، CRM، خبرنامه یا سامانه پشتیبانی متصل نیست. نام،
            شماره تلفن، آدرس و کد پستی واردشده در Checkout از مرورگر ارسال یا در Storage ذخیره
            نمی‌شوند.
          </DemoNotice>

          <Section title="داده‌های ذخیره‌شده در Local Storage">
            <p className="mb-3">
              برای ادامه تجربه در همان مرورگر، داده‌های زیر ممکن است روی دستگاه شما ذخیره شوند:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>اقلام سبد خرید شامل شناسه محصول، نام، قیمت نمایشی، رنگ، سایز و تعداد</li>
              <li>فهرست علاقه‌مندی‌ها</li>
              <li>جست‌وجوهای اخیر و برخی انتخاب‌های رابط مانند بستن نوار اعلان</li>
            </ul>
            <p className="mt-3">
              این داده‌ها به حساب کاربری متصل نیستند و با پاک‌کردن Storage مرورگر حذف می‌شوند.
            </p>
          </Section>

          <Section title="داده‌های Session Storage">
            <p>
              پس از ساخت پیش‌نمایش سفارش، فقط کد شش‌رقمی، تعداد کالا، جمع کالا، هزینه ارسال نمایشی،
              جمع نهایی و زمان ایجاد در همان تب ذخیره می‌شوند. نام، تلفن، آدرس و کد پستی در این خلاصه
              وجود ندارند و داده با بسته‌شدن تب از بین می‌رود.
            </p>
          </Section>

          <Section title="اطلاعات Checkout">
            <p>
              فیلدهای Checkout برای آزمایش اعتبارسنجی فرم هستند. مقدار آن‌ها فقط در حافظه موقت React
              همان صفحه قرار دارد و با Refresh یا خروج از صفحه پاک می‌شود. هیچ API برای ارسال این
              اطلاعات فراخوانی نمی‌شود.
            </p>
          </Section>

          <Section title="پرداخت و اطلاعات بانکی">
            <p>
              پرداخت فعال نیست و سایت هیچ اطلاعات بانکی دریافت نمی‌کند. در نتیجه شماره کارت، رمز،
              CVV2، تاریخ انقضا یا نتیجه تراکنش در این نسخه پردازش یا ذخیره نمی‌شود.
            </p>
          </Section>

          <Section title="کوکی، تحلیل و تبلیغات">
            <p>
              در پیاده‌سازی فعلی ابزار تحلیل ترافیک، تبلیغات رفتاری یا Consent Platform متصل نشده
              است. Service Worker و فایل‌های فنی سایت ممکن است برای عملکرد و کش آفلاین استفاده شوند،
              اما به‌تنهایی پروفایل تبلیغاتی کاربر ایجاد نمی‌کنند.
            </p>
          </Section>

          <Section title="لینک‌های بیرونی">
            <p>
              بازکردن صفحه Instagram شما را از این سایت خارج می‌کند و پردازش داده در آن سرویس تابع
              سیاست حریم خصوصی همان پلتفرم است. LBB کنترل مستقیمی بر Storage یا داده‌های آن سرویس
              ندارد.
            </p>
          </Section>

          <Section title="پس از راه‌اندازی بک‌اند">
            <p>
              پیش از فعال‌شدن حساب کاربری، سفارش، پرداخت، خبرنامه یا تحلیل، این صفحه باید با فهرست
              دقیق داده‌ها، هدف پردازش، مدت نگهداری، ارائه‌دهندگان خدمت و روش درخواست حذف یا اصلاح
              به‌روزرسانی شود.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
