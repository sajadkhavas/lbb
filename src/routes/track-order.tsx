import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { Package, Truck, CheckCircle2, Search } from "lucide-react";

const TITLE = "پیگیری سفارش | LBB";
const DESC = "با وارد کردن کد پیگیری، وضعیت سفارش خودت رو از LBB چک کن.";

const STAGES = [
  { icon: Package, label: "ثبت سفارش" },
  { icon: Package, label: "آماده‌سازی" },
  { icon: Truck, label: "ارسال شده" },
  { icon: CheckCircle2, label: "تحویل شده" },
];

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/track-order" },
    ],
    links: [{ rel: "canonical", href: "/track-order" }],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<number | null>(null);
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed.length < 4) {
      setError("کد پیگیری معتبر نیست. لطفاً کد سفارش خودتو دوباره بررسی کن.");
      setStage(null);
      return;
    }
    setError("");
    // Fake deterministic staging based on code length/chars
    const sum = trimmed.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    setStage(sum % 4);
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
            کد پیگیری‌ای که بعد از ثبت سفارش دریافت کردی رو وارد کن تا وضعیت آخرین به‌روزرسانی سفارشت رو ببینی.
          </p>

          <form onSubmit={onSubmit} className="mt-8 flex gap-2">
            <label htmlFor="order-code" className="sr-only">کد پیگیری</label>
            <input
              id="order-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثال: LBB-2938471"
              className="h-12 flex-1 rounded-lg border border-black/15 px-4 text-sm outline-none focus:border-[var(--lbb-red)]"
            />
            <button
              type="submit"
              className="flex h-12 items-center gap-2 rounded-lg bg-[var(--lbb-red)] px-6 text-sm font-bold text-white hover:brightness-110"
            >
              <Search size={16} /> پیگیری
            </button>
          </form>

          {error && <p className="mt-3 text-xs text-[var(--lbb-red)]">{error}</p>}

          {stage !== null && (
            <div className="mt-10 rounded-xl border border-black/[0.06] p-6">
              <p className="mb-6 text-sm text-gray-600">
                کد <span className="font-bold text-black">{code}</span> پیدا شد. وضعیت فعلی:
              </p>
              <div className="flex items-center justify-between">
                {STAGES.map((s, i) => {
                  const Icon = s.icon;
                  const done = i <= stage;
                  return (
                    <div key={s.label} className="flex flex-1 flex-col items-center gap-2 text-center">
                      <div
                        className={`grid h-11 w-11 place-items-center rounded-full border-2 ${
                          done ? "border-[var(--lbb-red)] bg-[var(--lbb-red)] text-white" : "border-black/15 text-gray-400"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className={`text-[11px] ${done ? "font-semibold text-black" : "text-gray-400"}`}>{s.label}</span>
                      {i < STAGES.length - 1 && (
                        <span className="absolute mt-5 hidden h-0.5 w-full translate-x-1/2 bg-transparent md:block" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
