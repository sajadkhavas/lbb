import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, Shell, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";

const TITLE = "پیگیری سفارش | LBB";
const DESC =
  "وضعیت قابلیت پیگیری سفارش LBB؛ بدون اتصال معتبر به Order API هیچ کد یا وضعیت سفارش ساختگی نمایش داده نمی‌شود.";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "پیگیری سفارش" }]} />
          </Shell>
        </div>

        <section className="mx-auto max-w-[640px] px-4 py-14 md:px-8">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-hairline bg-carbon text-signal">
            <SearchX size={21} aria-hidden="true" />
          </span>
          <TechLabel tone="signal" className="mt-5">
            ORDER TRACKING / SERVER REQUIRED
          </TechLabel>
          <h1 className="mt-3 text-display-2 text-bone">
            پیگیری سفارش هنوز به Order API متصل نیست
          </h1>
          <p className="mt-4 text-sm leading-8 text-metal">
            پیگیری معتبر باید وضعیت را از منبع سمت سرور بخواند. این صفحه کد محلی، Session Storage یا
            دادهٔ ساخته‌شده در مرورگر را به‌عنوان سفارش واقعی جست‌وجو نمی‌کند.
          </p>

          <StatePanel className="mt-7" title="فرم پیگیری عمداً غیرفعال است" tone="info">
            تا زمانی که Transport معتبر برای جست‌وجوی سفارش وجود نداشته باشد، فرم ورود کد نمایش داده
            نمی‌شود؛ در نتیجه هیچ پاسخ «پیدا شد» یا «ثبت شده» به‌صورت ساختگی تولید نمی‌شود.
          </StatePanel>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/contact" className={CtaClasses("signal")}>
              تماس و پشتیبانی
            </Link>
            <Link to="/shop" className={CtaClasses("line")}>
              بازگشت به فروشگاه
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
