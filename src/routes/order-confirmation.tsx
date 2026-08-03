import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { DemoNotice, EmptyState, CtaClasses } from "@/components/lbb/ui/primitives";
import { fmtToman } from "@/lib/products";

type Search = { ref?: string; itemCount?: string; total?: string };

export const Route = createFileRoute("/order-confirmation")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ref: typeof s.ref === "string" && /^\d{4,}$/.test(s.ref) ? s.ref : undefined,
    itemCount: typeof s.itemCount === "string" ? s.itemCount : undefined,
    total: typeof s.total === "string" ? s.total : undefined,
  }),
  head: () => ({
    meta: [
      { title: "ثبت سفارش نمایشی | LBB" },
      { name: "description", content: "این یک فروشگاه نمایشی است؛ سفارش واقعی ثبت نمی‌شود." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { ref, itemCount, total } = Route.useSearch();
  const count = itemCount ? Number(itemCount) : NaN;
  const totalAmount = total ? Number(total) : NaN;
  const hasOrder = Boolean(ref) && Number.isFinite(count) && Number.isFinite(totalAmount);

  return (
    <>
      <Navbar />
      <main dir="rtl" className="grid min-h-screen place-items-center bg-obsidian px-5 pb-28 pt-28 text-center">
        {hasOrder ? (
          <div className="w-full max-w-[420px]">
            <h1 className="text-display-2 text-bone">ثبت سفارش نمایشی انجام شد</h1>
            <p className="mt-2 text-sm font-semibold text-signal">کد مرجع نمایشی: #{ref}</p>
            <p className="mt-1 text-[13px] text-metal">
              {count.toLocaleString("fa-IR")} قلم کالا — مبلغ {fmtToman(totalAmount)}
            </p>
            <DemoNotice className="mt-6 text-start">
              این فروشگاه یک نمونهٔ نمایشی است. هیچ پرداختی از شما دریافت نشد، این سفارش برای هیچ سیستمی ارسال نشد و هیچ پیامک یا ایمیل تأییدی دریافت نخواهید کرد. کد مرجع فقط در همین صفحه معتبر است.
            </DemoNotice>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/track-order" className={CtaClasses("line")}>
                پیگیری سفارش
              </Link>
              <Link to="/shop" className={CtaClasses("signal")}>
                ادامه خرید
              </Link>
            </div>
          </div>
        ) : (
          <EmptyState
            title="سفارشی برای نمایش نیست"
            body="این صفحه فقط بعد از تکمیل فرآیند سفارش نمایشی قابل مشاهده است."
            action={
              <Link to="/shop" className={CtaClasses("signal")}>
                رفتن به فروشگاه
              </Link>
            }
          />
        )}
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
