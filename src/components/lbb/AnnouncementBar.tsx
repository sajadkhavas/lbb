import { useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * Compact technical announcement strip. Honest content only — shipping
 * threshold and the current drop; no fabricated discount-code delivery.
 */
const MESSAGES = [
  "ارسال رایگان برای سفارش‌های بالای ۲٬۰۰۰٬۰۰۰ تومان",
  "DROP 001 — موجود است",
  "مرجوعی و تعویض تا ۷ روز پس از دریافت",
];

const STORAGE_KEY = "lbb-announcement-dismissed";

export const ANNOUNCEMENT_HEIGHT = 28;

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
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 5000);
    return () => clearInterval(id);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage can be unavailable in private mode — dismissal is per-session then */
    }
    onDismiss?.();
  };

  if (!mounted || !visible) return null;

  return (
    <div
      dir="rtl"
      role="status"
      className="fixed inset-x-0 top-0 z-[110] flex items-center bg-signal text-bone"
      style={{ height: ANNOUNCEMENT_HEIGHT }}
    >
      <span aria-hidden="true" className="tech shrink-0 ps-3 opacity-70">
        LBB
      </span>
      <div className="relative min-w-0 flex-1 overflow-hidden text-center">
        {MESSAGES.map((m, i) => (
          <span
            key={m}
            className="tech absolute inset-x-0 truncate px-2 transition-all duration-500"
            style={{
              direction: "rtl",
              letterSpacing: "0.04em",
              textTransform: "none",
              opacity: i === index ? 1 : 0,
              transform: i === index ? "translateY(0)" : "translateY(6px)",
            }}
            aria-hidden={i !== index}
          >
            {m}
          </span>
        ))}
        <span
          className="tech invisible block px-2"
          style={{ textTransform: "none", letterSpacing: "0.04em" }}
        >
          {MESSAGES[0]}
        </span>
      </div>
      <button
        type="button"
        aria-label="بستن نوار اطلاعیه"
        onClick={dismiss}
        className="grid h-7 w-9 shrink-0 place-items-center text-bone/80 transition-colors hover:text-bone"
      >
        <X size={13} />
      </button>
    </div>
  );
}
