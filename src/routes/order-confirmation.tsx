import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";

type Search = { order?: string; phone?: string };

export const Route = createFileRoute("/order-confirmation")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    order: typeof s.order === "string" ? s.order : undefined,
    phone: typeof s.phone === "string" ? s.phone : undefined,
  }),
  head: () => ({
    meta: [
      { title: "تایید سفارش | LBB" },
      { name: "description", content: "سفارش شما در فروشگاه LBB با موفقیت ثبت شد." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "تایید سفارش | LBB" },
      { property: "og:description", content: "سفارش شما در فروشگاه LBB با موفقیت ثبت شد." },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { order, phone } = Route.useSearch();
  return (
    <>
      <Navbar theme="light" />
      <main
        dir="rtl"
        className="grid min-h-screen place-items-center bg-white px-5 pb-28 pt-28 text-center"
        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
      >
        <div>
          <svg viewBox="0 0 64 64" width="88" height="88" className="mx-auto" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="none" stroke="#E8001D" strokeWidth="2" opacity="0.25" />
            <path
              d="M18 33 L28 43 L46 23"
              fill="none"
              stroke="#E8001D"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="check-draw"
            />
          </svg>
          <h1 className="mt-6 text-[28px] font-bold text-[#0A0A0A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            سفارش شما ثبت شد!
          </h1>
          <p className="mt-2 text-[16px] font-semibold text-[var(--lbb-red)]">
            کد پیگیری: #{order ?? "------"}
          </p>
          <p className="mt-3 text-[13px] text-black/60">
            یک پیامک تأیید به {phone ?? "شماره شما"} ارسال خواهد شد
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
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
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
