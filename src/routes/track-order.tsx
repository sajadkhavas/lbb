import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { DemoNotice } from "@/components/lbb/ui/primitives";
import { Search } from "lucide-react";

const TITLE = "پیگیری سفارش | LBB";
const DESC = "پیگیری سفارش در فروشگاه نمایشی LBB — این قابلیت هنوز به سامانهٔ واقعی وصل نیست.";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-16 text-black" style={{ paddingBottom: 80, fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "پیگیری سفارش" }]} />
          </div>
        </div>

        <section className="mx-auto max-w-[640px] px-4 py-14 md:px-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            پیگیری سفارش
          </h1>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            کد مرجعی که بعد از ثبت سفارش نمایشی گرفتی رو اینجا وارد کن.
          </p>

          <DemoNotice className="mt-6 rounded-xl">
            پیگیری واقعی سفارش هنوز در این فروشگاه نمایشی فعال نیست؛ چون سیستم سفارش به هیچ بک‌اند یا انبار واقعی وصل نیست. کد مرجع فقط در همان لحظهٔ ثبت سفارش نمایشی معتبر بود و وضعیتی برای نمایش وجود ندارد.
          </DemoNotice>

          <form onSubmit={onSubmit} className="mt-8 flex gap-2">
            <label htmlFor="order-code" className="sr-only">کد مرجع سفارش</label>
            <input
              id="order-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثال: ۱۲۳۴۵۶"
              className="h-12 flex-1 rounded-lg border border-black/15 px-4 text-sm outline-none focus:border-[var(--lbb-red)]"
            />
            <button
              type="submit"
              className="flex h-12 items-center gap-2 rounded-lg bg-[var(--lbb-red)] px-6 text-sm font-bold text-white hover:brightness-110"
            >
              <Search size={16} /> بررسی
            </button>
          </form>

          {submitted && (
            <p className="mt-4 text-sm text-gray-600" role="status">
              پیگیری وضعیت سفارش در این نسخهٔ نمایشی در دسترس نیست.
            </p>
          )}
        </section>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
