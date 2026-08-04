import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { DemoNotice, CtaClasses } from "@/components/lbb/ui/primitives";
import { latestDemoOrder, type DemoOrderSummary } from "@/lib/commerce";
import { fmtToman } from "@/lib/products";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "پیش‌نمایش سفارش | LBB" },
      {
        name: "description",
        content: "خلاصه سفارش نمایشی LBB؛ هیچ سفارش یا پرداخت واقعی ثبت نمی‌شود.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const [order, setOrder] = useState<DemoOrderSummary | null | undefined>(undefined);

  useEffect(() => {
    setOrder(latestDemoOrder() ?? null);
  }, []);

  return (
    <>
      <Navbar />
      <main
        dir="rtl"
        className="grid min-h-screen place-items-center bg-obsidian px-5 pb-28 pt-28 text-center"
      >
        {order === undefined ? (
          <p className="text-sm text-metal" role="status">
            در حال خواندن پیش‌نمایش…
          </p>
        ) : order ? (
          <div className="w-full max-w-[460px]">
            <p className="tech text-signal">DEMO ORDER PREVIEW</p>
            <h1 className="mt-3 text-display-2 text-bone">پیش‌نمایش سفارش ساخته شد</h1>
            <p className="mt-3 text-sm font-semibold text-signal">کد مرجع نمایشی: #{order.ref}</p>
            <div className="mt-5 rounded-xl border border-hairline bg-carbon p-4 text-start text-sm">
              <div className="flex justify-between gap-4 py-1 text-metal">
                <span>تعداد کالا</span>
                <span>{order.itemCount.toLocaleString("fa-IR")} قلم</span>
              </div>
              <div className="flex justify-between gap-4 py-1 text-metal">
                <span>جمع کالاها</span>
                <span>{fmtToman(order.subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4 py-1 text-metal">
                <span>ارسال نمایشی</span>
                <span>{order.shipping === 0 ? "رایگان" : fmtToman(order.shipping)}</span>
              </div>
              <div className="mt-2 flex justify-between gap-4 border-t border-hairline pt-3 font-bold text-bone">
                <span>جمع نمایشی</span>
                <span>{fmtToman(order.total)}</span>
              </div>
            </div>
            <DemoNotice className="mt-6 text-start">
              این صفحه رسید خرید نیست. هیچ پرداختی دریافت نشده، هیچ سفارش واقعی ثبت یا برای انبار
              ارسال نشده و کد بالا فقط در sessionStorage همین تب وجود دارد. نام، تلفن و آدرس واردشده
              در مرحله قبل ذخیره نشده‌اند.
            </DemoNotice>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/track-order" className={CtaClasses("line")}>
                بررسی کد نمایشی
              </Link>
              <Link to="/shop" className={CtaClasses("signal")}>
                ادامه مرور محصولات
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex w-full max-w-[520px] flex-col items-center gap-4 rounded-2xl border border-hairline bg-carbon px-6 py-16">
            <p className="tech text-signal">NO DEMO PREVIEW</p>
            <h1 className="text-display-3 text-bone">پیش‌نمایشی برای نمایش نیست</h1>
            <p className="max-w-[46ch] text-sm leading-7 text-metal">
              هیچ خلاصه‌ای در sessionStorage همین تب پیدا نشد؛ ممکن است صفحه در تب دیگری باز شده یا
              داده‌های مرورگر پاک شده باشند.
            </p>
            <Link to="/shop" className={CtaClasses("signal")}>
              رفتن به فروشگاه
            </Link>
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
