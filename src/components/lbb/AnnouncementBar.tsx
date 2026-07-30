import { useEffect, useState } from "react";
import { X } from "lucide-react";

const MESSAGES = [
  "ارسال رایگان برای خریدهای بالای ۲٬۰۰۰٬۰۰۰ تومان 🚚",
  "کد تخفیف ۱۰٪ برای اولین خرید: LBB10",
  "کالکشن جدید ۱۴۰۵ رسید — همین حالا ببین ✦",
];

const STORAGE_KEY = "lbb-announcement-dismissed";

export function AnnouncementBar({ onDismiss }: { onDismiss?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(id);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    onDismiss?.();
  };

  if (!mounted || !visible) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-x-0 top-0 z-[110] flex h-9 items-center justify-center bg-[var(--lbb-red)] px-4 text-white"
      role="status"
    >
      <div className="relative flex-1 overflow-hidden text-center">
        {MESSAGES.map((m, i) => (
          <span
            key={m}
            className="absolute inset-x-0 text-[11px] font-semibold transition-all duration-500 md:text-xs"
            style={{
              opacity: i === index ? 1 : 0,
              transform: i === index ? "translateY(0)" : "translateY(8px)",
            }}
            aria-hidden={i !== index}
          >
            {m}
          </span>
        ))}
        <span className="invisible text-[11px] font-semibold md:text-xs">{MESSAGES[0]}</span>
      </div>
      <button
        aria-label="بستن پیام"
        onClick={dismiss}
        className="absolute left-2 rounded p-1 text-white/80 hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export const ANNOUNCEMENT_HEIGHT = 36;
