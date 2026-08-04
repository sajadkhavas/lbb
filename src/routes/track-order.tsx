import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { DemoNotice, Shell, CtaClasses } from "@/components/lbb/ui/primitives";
import { findDemoOrder, type DemoOrderSummary } from "@/lib/commerce";
import { fmtToman } from "@/lib/products";
import { cn } from "@/lib/utils";

const TITLE = "بررسی کد سفارش نمایشی | LBB";
const DESC = "بررسی کد پیش‌نمایش سفارش در همان تب مرورگر؛ این قابلیت به سفارش واقعی متصل نیست.";

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

const toLatinDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\D/g, "")
    .slice(0, 6);

function TrackOrderPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<DemoOrderSummary | null | undefined>(undefined);
  const inputId = useId();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setResult(findDemoOrder(code) ?? null);
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "بررسی کد نمایشی" }]} />
          </Shell>
        </div>

        <section className="mx-auto max-w-[640px] px-4 py-14 md:px-8">
          <p className="tech text-signal">DEMO REFERENCE CHECK</p>
          <h1 className="mt-3 text-display-2 text-bone">بررسی کد سفارش نمایشی</h1>
          <p className="mt-3 text-sm leading-7 text-metal">
            کد شش‌رقمی ساخته‌شده در همین تب را وارد کنید تا خلاصه غیرشخصی آن نمایش داده شود.
          </p>

          <DemoNotice className="mt-6 rounded-xl">
            این صفحه به بک‌اند، انبار، شرکت حمل‌ونقل یا سامانه پرداخت متصل نیست و وضعیت سفارش واقعی
            ارائه نمی‌کند. داده پیش‌نمایش با بستن تب یا پاک‌کردن Session Storage از بین می‌رود.
          </DemoNotice>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label htmlFor={inputId} className="sr-only">
              کد مرجع شش‌رقمی
            </label>
            <input
              id={inputId}
              value={code}
              onChange={(event) => {
                setCode(toLatinDigits(event.target.value));
                setResult(undefined);
              }}
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              dir="ltr"
              autoComplete="off"
              placeholder="123456"
              className="h-12 flex-1 rounded-xl border border-hairline bg-carbon px-4 text-sm text-bone outline-none tap-target placeholder:text-mute focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/40"
              required
            />
            <button
              type="submit"
              disabled={code.length !== 6}
              className={cn(
                "gap-2 disabled:cursor-not-allowed disabled:opacity-45",
                CtaClasses("signal"),
              )}
            >
              <Search size={16} aria-hidden="true" />
              بررسی
            </button>
          </form>

          {result ? (
            <div className="mt-6 rounded-xl border border-hairline bg-carbon p-5" role="status">
              <h2 className="text-base font-bold text-bone">پیش‌نمایش #{result.ref}</h2>
              <dl className="mt-4 space-y-2 text-sm text-metal">
                <div className="flex justify-between gap-4">
                  <dt>تعداد کالا</dt>
                  <dd>{result.itemCount.toLocaleString("fa-IR")} قلم</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>جمع نمایشی</dt>
                  <dd>{fmtToman(result.total)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>وضعیت واقعی</dt>
                  <dd className="font-semibold text-signal">ثبت نشده</dd>
                </div>
              </dl>
            </div>
          ) : result === null ? (
            <p className="mt-5 text-sm leading-7 text-metal" role="status">
              این کد در sessionStorage همین تب پیدا نشد. کدهای تب یا دستگاه دیگر قابل بازیابی نیستند.
            </p>
          ) : null}
        </section>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
