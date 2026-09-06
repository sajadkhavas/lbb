import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useStorefrontControl } from "@/lib/storefront-control";

const STORAGE_KEY = "lbb-announcement-seasonal-v2-dismissed";
export const ANNOUNCEMENT_HEIGHT = 32;

export function AnnouncementBar({
  onDismiss,
  onVisibilityChange,
}: {
  onDismiss?: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}) {
  const { announcements, brand } = useStorefrontControl();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        onVisibilityChange?.(false);
        onDismiss?.();
        return;
      }
    } catch {
      // Storage can be unavailable; the announcement remains visible.
    }
    setVisible(announcements.length > 0);
    onVisibilityChange?.(announcements.length > 0);
  }, [announcements.length, onDismiss, onVisibilityChange]);

  useEffect(() => {
    if (!visible || paused || announcements.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % announcements.length),
      5200,
    );
    return () => window.clearInterval(id);
  }, [announcements.length, paused, visible]);

  useEffect(() => {
    if (index >= announcements.length) setIndex(0);
  }, [announcements.length, index]);

  const dismiss = () => {
    setVisible(false);
    onVisibilityChange?.(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Dismissal then lasts only for this render session.
    }
    onDismiss?.();
  };

  if (!mounted || !visible || announcements.length === 0) return null;
  const current = announcements[index] ?? announcements[0];

  return (
    <aside
      dir="rtl"
      aria-label={`اطلاعیه‌های ${brand.nameFa}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="fixed inset-x-0 top-0 z-[calc(var(--z-nav)+1)] grid grid-cols-[auto_minmax(0,1fr)_auto] items-center bg-signal text-obsidian"
      style={{ height: ANNOUNCEMENT_HEIGHT }}
    >
      <span aria-hidden="true" className="tech ps-3 text-obsidian">
        {brand.nameFa} / خبر
      </span>
      <a
        href={current.href}
        className="tech flex min-w-0 items-center justify-center gap-3 truncate px-3 text-center text-obsidian focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-obsidian"
      >
        <span aria-live="polite" className="truncate">
          {current.text}
        </span>
        <span aria-hidden="true" className="hidden gap-1 sm:flex">
          {announcements.map((message, messageIndex) => (
            <span
              key={`${message.href}-${message.text}`}
              className={`h-1 w-3 ${messageIndex === index ? "bg-obsidian" : "bg-obsidian/30"}`}
            />
          ))}
        </span>
      </a>
      <button
        type="button"
        aria-label="بستن نوار اطلاعیه"
        onClick={dismiss}
        className="grid h-8 w-10 place-items-center text-obsidian/75 transition-colors hover:text-obsidian"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </aside>
  );
}
