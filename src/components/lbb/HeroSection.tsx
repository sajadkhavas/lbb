import { useEffect, useRef } from "react";
import { Hero3D } from "./Hero3D";

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    (async () => {
      const gsap = (await import("gsap")).default;
      const root = rootRef.current;
      if (!root) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(root.querySelector(".hero-eyebrow"), { y: 20, opacity: 0, duration: 0.5 })
        .from(root.querySelectorAll(".hero-h1 span"), { y: 40, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.2")
        .from(root.querySelector(".hero-sub"), { opacity: 0, duration: 0.4 }, "-=0.1")
        .from(root.querySelector(".hero-divider"), { scaleX: 0, transformOrigin: "right", duration: 0.4 }, "-=0.1")
        .from(root.querySelector(".hero-ctas"), { y: 20, opacity: 0, duration: 0.4 }, "-=0.1")
        .from(root.querySelector(".hero-3d-canvas"), { opacity: 0, duration: 1.2 }, "-=0.6");
      cleanup = () => tl.kill();
    })();
    return () => cleanup();
  }, []);

  return (
    <section
      ref={rootRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-[#0A0A0A]"
      style={{ height: "100svh" }}
      aria-label="Hero"
    >
      <div className="mx-auto grid h-full max-w-[1600px] grid-cols-1 items-center gap-8 px-6 pt-16 md:px-10 lg:grid-cols-[55%_45%]">
        {/* Text column (right in RTL = first) */}
        <div className="relative z-10 flex flex-col justify-center py-8" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
          <span
            className="hero-eyebrow text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--lbb-red)]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            کالکشن جدید ۱۴۰۵
          </span>

          <h1
            className="hero-h1 mt-6 font-black leading-[0.9] text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
          >
            <span className="block" style={{ fontSize: "clamp(48px, 7vw, 120px)" }}>استایل</span>
            <span className="block text-[var(--lbb-red)]" style={{ fontSize: "clamp(48px, 7vw, 120px)" }}>خودتو</span>
            <span
              className="block text-white/60"
              style={{ fontSize: "clamp(32px, 5vw, 80px)", fontWeight: 700 }}
            >
              تعریف کن.
            </span>
          </h1>

          <p className="hero-sub mt-6 text-sm text-white/45" style={{ letterSpacing: "0.05em" }}>
            هودی · شلوار · تیشرت · کتونی · اکسسوری
          </p>
          <span className="hero-divider mt-6 block h-px w-16 bg-[var(--lbb-red)]" />

          <div className="hero-ctas mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/shop"
              className="inline-flex h-[52px] items-center justify-center rounded-lg bg-[var(--lbb-red)] px-8 text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_8px_24px_rgba(232,0,29,0.35)]"
            >
              خرید کنید
            </a>
            <a
              href="/about"
              className="inline-flex h-[52px] items-center justify-center rounded-lg border border-white/25 bg-transparent px-8 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:border-[var(--lbb-red)] hover:text-[var(--lbb-red)]"
            >
              لوک‌بوک ما
            </a>
          </div>
        </div>

        {/* 3D column */}
        <div className="hero-3d-canvas relative h-[60svh] w-full lg:h-full">
          <Hero3D />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-center lg:block">
        <span
          className="block text-[9px] uppercase tracking-[0.25em] text-white/30"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          اسکرول کن
        </span>
        <span className="scroll-line mx-auto mt-2 block h-9 w-px bg-white/20" />
      </div>
    </section>
  );
}
