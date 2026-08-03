import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { DemoNotice, EmptyState } from "@/components/lbb/ui/primitives";
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
      <Navbar theme="light" />
      <main
        dir="rtl"
        className="grid min-h-screen place-items-center bg-white px-5 pb-28 pt-28 text-center"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {hasOrder ? (
          <div className="w-full max-w-[420px]">
            <h1 className="text-[24px] font-bold text-[#0A0A0A]" style={{ fontFamily: "var(--font-display)" }}>
              ثبت سفارش نمایشی انجام شد
            </h1>
            <p className="mt-2 text-[14px] font-semibold text-[var(--lbb-red)]">
              کد مرجع نمایشی: #{ref}
            </p>
            <p className="mt-1 text-[13px] text-black/60">
              {count.toLocaleString("fa-IR")} قلم کالا — مبلغ {fmtToman(totalAmount)}
            </p>
            <DemoNotice className="mt-6 text-start">
              این فروشگاه یک نمونهٔ نمایشی است. هیچ پرداختی از شما دریافت نشد، این سفارش برای هیچ سیستمی ارسال نشد و هیچ پیامک یا ایمیل تأییدی دریافت نخواهید کرد. کد مرجع فقط در همین صفحه معتبر است.
            </DemoNotice>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/track-order"
                className="inline-flex h-12 items-center rounded-xl border border-black/15 px-6 text-[13px] font-bold text-black"
              >
                پیگیری سفارش
              </Link>
              <Link
                to="/shop"
                className="inline-flex h-12 items-center rounded-xl bg-[var(--lbb-red)] px-6 text-[13px] font-bold text-white"
              >
                ادامه خرید
              </Link>
            </div>
          </div>
        ) : (
          <EmptyState
            title="سفارشی برای نمایش نیست"
            body="این صفحه فقط بعد از تکمیل فرآیند سفارش نمایشی قابل مشاهده است."
            action={
              <Link
                to="/shop"
                className="inline-flex h-12 items-center rounded-xl bg-[var(--lbb-red)] px-6 text-[13px] font-bold text-white"
              >
                رفتن به فروشگاه
              </Link>
            }
          />
        )}
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
