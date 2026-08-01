import { useEffect, useState } from "react";

function getTargetDate() {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  d.setHours(20, 0, 0, 0);
  return d;
}

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function diffToParts(ms: number) {
  const total = Math.max(0, ms);
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

const fa = (n: number) => n.toLocaleString("fa-IR");

const UNITS: { key: keyof typeof ZERO; label: string }[] = [
  { key: "days", label: "روز" },
  { key: "hours", label: "ساعت" },
  { key: "minutes", label: "دقیقه" },
  { key: "seconds", label: "ثانیه" },
];

export function NewDropCountdown() {
  const [target] = useState(getTargetDate);
  const [parts, setParts] = useState(ZERO);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => setParts(diffToParts(target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <section dir="rtl" className="relative overflow-hidden bg-[#0A0A0A] px-6 py-20 md:px-10" aria-labelledby="drop-title">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #E8001D 0, #E8001D 1px, transparent 1px, transparent 24px)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-[1000px] flex-col items-center gap-8 text-center">
        <span
          className="text-[11px] uppercase text-[var(--lbb-red)] font-mono"
          style={{ letterSpacing: "0.35em" }}
        >
          New Drop
        </span>
        <h2
          id="drop-title"
          className="text-[30px] font-bold text-white md:text-[44px] font-display"
        >
          کالکشن بعدی به‌زودی می‌رسد
        </h2>
        <p className="max-w-md text-sm text-white/50">
          محدود، بی‌نظیر، فقط برای مشترکین اولویت خرید دارند. زمان‌سنج زیر رو دنبال کن.
        </p>

        <div className="mt-4 grid grid-cols-4 gap-3 md:gap-6" suppressHydrationWarning>
          {UNITS.map((u) => (
            <div
              key={u.key}
              className="flex w-[70px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-4 md:w-[110px] md:py-6"
            >
              <span
                className="text-[26px] font-black text-white tabular-nums md:text-[42px] font-display"
              >
                {fa(mounted ? parts[u.key] : 0).padStart(2, "۰")}
              </span>
              <span className="mt-1 text-[10px] text-white/40 md:text-xs">{u.label}</span>
            </div>
          ))}
        </div>

        <a
          href="/shop"
          className="mt-4 inline-flex h-12 items-center justify-center rounded-lg bg-[var(--lbb-red)] px-8 text-[13px] font-bold text-white transition-transform hover:scale-[1.03]"
        >
          مشاهده پیش‌نمایش
        </a>
      </div>
    </section>
  );
}
