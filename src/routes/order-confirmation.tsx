import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { CtaClasses, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "تأیید سفارش | LBB" },
      {
        name: "description",
        content:
          "تأیید سفارش LBB فقط پس از پاسخ معتبر سمت سرور ممکن است؛ وضعیت مرورگر به‌تنهایی رسید خرید نیست.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OrderConfirmation,
});

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
          <TechLabel tone="signal" className="mt-5">
            SERVER VERIFICATION REQUIRED
          </TechLabel>
          <h1 className="mt-3 text-display-2 text-bone">سفارشی برای تأیید معتبر وجود ندارد</h1>
          <p className="mt-4 text-sm leading-8 text-metal">
            این Route از Session Storage، Query String، شناسهٔ ساخته‌شده در مرورگر یا پارامتر
            Callback برای اعلام موفقیت استفاده نمی‌کند. رسید و وضعیت موفق فقط باید از Order API و
            Verify معتبر سمت سرور بیایند.
          </p>
          <StatePanel className="mt-6 text-start" title="مرز اعتماد سفارش" tone="warning">
            تا زمانی که Backend سفارش و تأیید پرداخت متصل نشده‌اند، نمایش «پرداخت موفق»، «سفارش ثبت
            شد» یا کد رهگیری واقعی در این صفحه ممنوع است.
          </StatePanel>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/cart" className={CtaClasses("line")}>
              مشاهده سبد
            </Link>
            <Link to="/shop" className={CtaClasses("signal")}>
              ادامه مرور محصولات
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
