import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/commerce";
import { fmtToman } from "@/lib/products";

const MESSAGES = [
  "نسخه نمایشی — پرداخت و ارسال واقعی غیرفعال است",
  "DROP 001 — کاتالوگ نمایشی فعال",
  `ارسال رایگان نمایشی از ${fmtToman(FREE_SHIPPING_THRESHOLD)}`,
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
    const id = setInterval(() => setIndex((current) => (current + 1) % MESSAGES.length), 5000);
    return () => clearInterval(id);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage can be unavailable; dismissal then lasts only for this render session.
    }
    onDismiss?.();
  };

  if (!mounted || !visible) return null;

  return (
    <div
      dir="rtl"
      role="status"
      className="fixed inset-x-0 top-0 z-[110] flex items-center bg-signal text-obsidian"
      style={{ height: ANNOUNCEMENT_HEIGHT }}
    >
      <span aria-hidden="true" className="tech shrink-0 ps-3">
        LBB
      </span>
      <div className="relative min-w-0 flex-1 overflow-hidden text-center">
        {MESSAGES.map((message, messageIndex) => (
          <span
            key={message}
            className="tech absolute inset-x-0 truncate px-2 transition-all duration-500"
            style={{
              direction: "rtl",
              letterSpacing: "0.04em",
              textTransform: "none",
              opacity: messageIndex === index ? 1 : 0,
              transform: messageIndex === index ? "translateY(0)" : "translateY(6px)",
            }}
            aria-hidden={messageIndex !== index}
          >
            {message}
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
        className="grid h-7 w-9 shrink-0 place-items-center text-obsidian/80 transition-colors hover:text-obsidian"
      >
        <X size={13} aria-hidden="true" />
      </button>
    </div>
  );
}
