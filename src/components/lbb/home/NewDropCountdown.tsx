import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";
import { fmtNum } from "@/lib/products";

function getTargetDate() {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  d.setHours(20, 0, 0, 0);
  return d;
}

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function diffToParts(ms: number) {
  const total = Math.max(0, ms);
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total % 86400000) / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
  };
}

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
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const remaining = target.getTime() - Date.now();
      setParts(diffToParts(remaining));
      setEnded(remaining <= 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-obsidian px-6 py-20 md:px-10"
      aria-labelledby="drop-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--lbb-signal) 0, var(--lbb-signal) 1px, transparent 1px, transparent 24px)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-[1000px] flex-col items-center gap-8 text-center">
        <TechLabel tone="signal">DROP 002</TechLabel>
        <h2 id="drop-title" className="text-display-2 text-bone">
          {ended ? "دراپ ۰۰۲ منتشر شد" : "کالکشن بعدی به‌زودی می‌رسد"}
        </h2>
        <p className="max-w-md text-lede">
          {ended
            ? "زمان‌سنج به پایان رسید — کالکشن جدید LBB هم‌اکنون در فروشگاه در دسترس است."
            : "دراپ ۰۰۲ در حال آماده‌سازی است. زمان‌سنج زیر رو دنبال کن."}
        </p>

        {!ended && (
          <div className="mt-4 grid grid-cols-4 gap-3 md:gap-6" suppressHydrationWarning>
            {UNITS.map((u) => (
              <div
                key={u.key}
                className="flex w-[70px] flex-col items-center justify-center border border-hairline bg-carbon py-4 md:w-[110px] md:py-6"
              >
                <span className="num text-[26px] font-black text-bone md:text-[42px]">
                  {fmtNum(mounted ? parts[u.key] : 0).padStart(2, "۰")}
                </span>
                <span className="mt-1 tech text-mute">{u.label}</span>
              </div>
            ))}
          </div>
        )}

        <Link to="/shop" className={CtaClasses("signal")}>
          {ended ? "مشاهده کالکشن جدید" : "مشاهده فروشگاه"}
        </Link>
      </div>
    </section>
  );
}
