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

      const eyebrow = root.querySelector("[data-hero-eyebrow]");
      const letters = root.querySelectorAll("[data-hero-letter]");
      const sub = root.querySelector("[data-hero-sub]");
      const ctas = root.querySelectorAll("[data-hero-cta]");
      const canvas = root.querySelector("[data-hero-canvas]");
      const scroll = root.querySelector("[data-hero-scroll]");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.6 }, 0)
        .from(letters, { y: 60, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.15)
        .from(sub, { y: 20, opacity: 0, duration: 0.6 }, 0.6)
        .from(ctas, { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, 0.8)
        .from(canvas, { opacity: 0, duration: 0.8 }, 1.0)
        .from(scroll, { opacity: 0, duration: 0.6 }, 1.2);

      cleanup = () => tl.kill();
    })();
    return () => cleanup();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      aria-label="Hero"
    >
      <div data-hero-canvas className="absolute inset-0">
        <Hero3D />
      </div>

      {/* gradient overlay for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0) 30%, rgba(10,10,10,0) 60%, rgba(10,10,10,0.8) 100%)",
        }}
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span
          data-hero-eyebrow
          className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50"
        >
          New Collection 2026
        </span>

        <h1
          className="mt-6 font-display font-black leading-[0.85] text-white"
          style={{ fontSize: "22vw", letterSpacing: "-0.04em" }}
        >
          {["L", "B", "B"].map((c, i) => (
            <span key={i} data-hero-letter className="inline-block">
              {c}
            </span>
          ))}
        </h1>

        <div data-hero-sub className="mt-6 flex flex-col items-center">
          <span className="block h-px w-20 bg-[var(--lbb-red)]" />
          <p className="mt-4 text-sm text-white/60">Premium Iranian Streetwear</p>
        </div>

        <div className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            data-hero-cta
            href="/shop"
            className="inline-flex h-12 items-center justify-center rounded-[4px] bg-[var(--lbb-red)] px-8 text-[13px] font-bold uppercase tracking-[0.15em] text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            Shop Now
          </a>
          <a
            data-hero-cta
            href="/lookbook"
            className="inline-flex h-12 items-center justify-center rounded-[4px] border border-white/70 bg-transparent px-8 text-[13px] font-bold uppercase tracking-[0.15em] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:border-white"
          >
            See Lookbook
          </a>
        </div>
      </div>

      <div
        data-hero-scroll
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <span className="scroll-line mx-auto block h-12 w-px bg-white" />
        <span className="mt-3 block text-[9px] uppercase tracking-[0.3em] text-white/80">
          Scroll
        </span>
      </div>
    </section>
  );
}
