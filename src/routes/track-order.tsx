import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { DemoNotice, Shell, CtaClasses } from "@/components/lbb/ui/primitives";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const inputId = useId();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "پیگیری سفارش" }]} />
          </Shell>
        </div>

        <section className="mx-auto max-w-[640px] px-4 py-14 md:px-8">
          <h1 className="text-display-2 text-bone">پیگیری سفارش</h1>
          <p className="mt-3 text-sm leading-7 text-metal">
            کد مرجعی که بعد از ثبت سفارش نمایشی گرفتی رو اینجا وارد کن.
          </p>

          <DemoNotice className="mt-6 rounded-xl">
            پیگیری واقعی سفارش هنوز در این فروشگاه نمایشی فعال نیست؛ چون سیستم سفارش به هیچ بک‌اند یا انبار واقعی وصل نیست. کد مرجع فقط در همان لحظهٔ ثبت سفارش نمایشی معتبر بود و وضعیتی برای نمایش وجود ندارد.
          </DemoNotice>

          <form onSubmit={onSubmit} className="mt-8 flex gap-2">
            <label htmlFor={inputId} className="sr-only">کد مرجع سفارش</label>
            <input
              id={inputId}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثال: ۱۲۳۴۵۶"
              className="h-12 flex-1 rounded-xl border border-hairline bg-carbon px-4 text-sm text-bone outline-none tap-target placeholder:text-mute focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/40"
            />
            <button type="submit" className={cn("gap-2", CtaClasses("signal"))}>
              <Search size={16} /> بررسی
            </button>
          </form>

          {submitted && (
            <p className="mt-4 text-sm text-metal" role="status">
              پیگیری وضعیت سفارش در این نسخهٔ نمایشی در دسترس نیست.
            </p>
          )}
        </section>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
