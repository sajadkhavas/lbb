import { useEffect, useRef } from "react";

export function BrandStatement() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".statement-inner",
          { scale: 0.7, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "center center",
              scrub: 0.5,
            },
          },
        );
      }, root);
      cleanup = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section
      ref={ref}
      dir="rtl"
      className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-[var(--lbb-red)] px-6"
      aria-label="بیانیه برند"
    >
      <div className="statement-inner text-center font-display">
        <span className="block text-[9vw] font-black leading-[0.95] text-white">پوشاک</span>
        <span
          className="block font-black leading-[0.95] text-white"
          style={{ fontSize: "13vw", letterSpacing: "-0.04em" }}
        >
          یه حرف
        </span>
        <span
          className="block text-[9vw] font-bold leading-[0.95]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          می‌زنه.
        </span>
      </div>
      <span
        className="absolute bottom-8 left-8 text-[11px]"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.4)" }}
      >
        LBB ✦ استریت‌ویر ایران
      </span>
    </section>
  );
}
