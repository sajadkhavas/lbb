import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { CtaClasses, StatePanel } from "@/components/lbb/ui/primitives";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "تأیید سفارش | LBB" },
      {
        name: "description",
        content: "وضعیت سفارش LBB پس از ثبت و تأیید پرداخت نمایش داده می‌شود.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OrderConfirmation,
});

// SERVER VERIFICATION REQUIRED: this fallback must never infer a successful order from browser state.
function OrderConfirmation() {
  return (
    <>
      <Navbar />
      <main
        dir="rtl"
        className="grid min-h-screen place-items-center overflow-x-clip bg-obsidian px-5 pb-28 pt-28 text-center"
      >
        <div className="w-full max-w-[560px]">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-warning/50 bg-warning/10 text-warning">
            <ShieldAlert size={24} aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-display-2 text-bone">سفارشی برای نمایش وجود ندارد</h1>
          <p className="mt-4 text-sm leading-8 text-metal">
            برای مشاهده نتیجه خرید، از مسیر تکمیل سفارش و پرداخت وارد شوید. اگر قبلاً سفارشی ثبت
            کرده‌اید، وضعیت آن را از حساب کاربری یا صفحه پیگیری سفارش بررسی کنید.
          </p>
          <StatePanel className="mt-6 text-start" title="وضعیت سفارش" tone="warning">
            تا زمانی که پرداخت سفارش تأیید نشده باشد، رسید نهایی یا وضعیت پرداخت موفق نمایش داده
            نمی‌شود.
          </StatePanel>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/account" className={CtaClasses("line")}>
              حساب کاربری
            </Link>
            <Link to="/shop" className={CtaClasses("signal")}>
              ادامه خرید
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
