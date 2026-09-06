import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, BookOpenText } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";
import { useStorefrontControl } from "@/lib/storefront-control";

export const BRAND_INTRO_STORAGE_KEY = "lbb_brand_intro_v1_seen";

function markIntroSeen(storageKey: string) {
  try {
    window.localStorage.setItem(storageKey, "1");
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
}

export function BrandIntro() {
  const { brand, intro } = useStorefrontControl();
  const storageKey = useMemo(() => `lbb_brand_intro_${intro.version}_seen`, [intro.version]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    markIntroSeen(storageKey);
    setOpen(false);
  }, [storageKey]);

  useEffect(() => {
    if (!intro.enabled) {
      setOpen(false);
      return;
    }
    try {
      if (window.localStorage.getItem(storageKey) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [intro.enabled, storageKey]);

  useEffect(() => {
    if (!open) return;
    const previousActive =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-brand-intro-primary]")?.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
      previousActive?.focus();
    };
  }, [dismiss, open]);

  if (!intro.enabled || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lbb-brand-intro-title"
      aria-describedby="lbb-brand-intro-description"
      data-testid="lbb-brand-intro"
      data-brand-intro-version={intro.version}
      className="fixed inset-0 z-[1000] overflow-y-auto bg-obsidian text-bone"
    >
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 grid-marks opacity-50" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-28 top-1/4 size-[26rem] rounded-full bg-signal/10 blur-3xl"
      />
      <div className="relative grid min-h-[100svh] place-items-center px-[var(--lbb-gutter)] py-8 md:py-12">
        <div
          ref={panelRef}
          className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-hairline bg-obsidian shadow-overlay"
        >
          <div className="grid md:grid-cols-[1.05fr_0.95fr]">
            <div className="flex min-h-[48svh] flex-col justify-between border-b border-hairline p-6 sm:p-8 md:min-h-[620px] md:border-b-0 md:border-l md:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <TechLabel tone="signal">FIRST VISIT / {brand.name}</TechLabel>
                  <span aria-hidden="true" className="h-px w-12 bg-hairline" />
                  <TechLabel>{intro.eyebrow}</TechLabel>
                </div>
                <p
                  aria-hidden="true"
                  className="mt-10 font-display text-[clamp(5rem,17vw,12rem)] font-black leading-[0.72] tracking-[-0.08em] text-signal"
                >
                  {brand.name}
                </p>
              </div>
              <div className="mt-14">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-mute">
                  {brand.category}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
              <TechLabel tone="signal">BRAND INTRO</TechLabel>
              <h2
                id="lbb-brand-intro-title"
                className="mt-5 max-w-[12ch] text-display-1 font-black text-bone"
              >
                {intro.title}
              </h2>
              <p className="mt-5 text-display-3 font-black text-signal">{intro.body}</p>
              <p
                id="lbb-brand-intro-description"
                className="mt-6 max-w-[48ch] text-sm leading-8 text-metal"
              >
                قبل از ورود به فروشگاه، می‌توانی داستان {brand.name} را بخوانی یا مستقیم وارد مجموعه
                محصولات شوی.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                <button
                  type="button"
                  data-brand-intro-primary
                  onClick={dismiss}
                  className={CtaClasses("signal", "lg")}
                >
                  {intro.storeCta}
                  <ArrowUpLeft size={17} aria-hidden="true" />
                </button>
                <Link to="/about" onClick={() => dismiss()} className={CtaClasses("line", "lg")}>
                  {intro.storyCta}
                  <BookOpenText size={17} aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-5 text-xs leading-6 text-mute">
                این معرفی فقط در اولین بازدید این نسخه در مرورگر نمایش داده می‌شود.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
