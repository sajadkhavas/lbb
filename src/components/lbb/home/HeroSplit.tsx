import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { heroMain } from "@/lib/product-images";
import { MagneticButton } from "@/components/lbb/MagneticButton";

const HERO_LINES = [
  { text: "استایل", size: "clamp(56px, 11vw, 150px)", weight: 900, color: "#FFFFFF", ls: "-0.04em" },
  { text: "خودتو", size: "clamp(56px, 11vw, 150px)", weight: 900, color: "#E8001D", ls: "-0.04em" },
  { text: "تعریف کن", size: "clamp(36px, 7vw, 96px)", weight: 700, color: "rgba(255,255,255,0.5)", ls: "-0.02em" },
];

export function HeroSplit() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
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
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".hero-eyebrow", { y: 15, opacity: 0, duration: 0.5, delay: 0.1 })
          .from(".hero-line-inner", { yPercent: 110, duration: 0.7, stagger: 0.12 }, "-=0.2")
          .from(".hero-sub", { opacity: 0, duration: 0.5 }, 0.9)
          .from(".hero-ctas", { y: 16, opacity: 0, duration: 0.5 }, 1.1)
          .from(".hero-badge", { scale: 0.7, opacity: 0, duration: 0.5 }, 1.4);

        gsap.fromTo(
          ".hero-media",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power3.inOut", delay: 0.2 },
        );

        if (window.innerWidth >= 768) {
          gsap.to(".hero-media-inner", {
            y: -80,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 1 },
          });
        }
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
      ref={rootRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-[#0A0A0A]"
      style={{ minHeight: "100svh" }}
      aria-label="معرفی برند"
    >
      <div className="flex min-h-[100svh] flex-col md:flex-row">
        {/* Media panel (left in RTL flow = second) */}
        <div className="relative order-1 h-[50svh] w-full overflow-hidden bg-[#111111] md:order-2 md:h-auto md:min-h-[100svh] md:w-[45%]">
          <div className="hero-media absolute inset-0 overflow-hidden">
            <div className="hero-media-inner absolute" style={{ inset: "-10%" }}>
              <img
                src={heroMain}
                alt="مدل LBB با کالکشن جدید"
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to left, rgba(10,10,10,0.75) 0%, transparent 55%)",
            }}
          />
          <div
            className="hero-badge absolute left-6 top-24 rounded-full bg-[var(--lbb-red)] px-4 py-2 text-[11px] font-bold text-white md:top-28 font-mono"
          >
            NEW DROP ✦ 1404
          </div>
        </div>

        {/* Text panel */}
        <div
          className="relative order-2 flex w-full flex-col justify-center px-6 py-12 md:order-1 md:w-[55%] md:px-16 font-body"
        >
          <span
            className="hero-eyebrow text-[10px] uppercase text-[var(--lbb-red)] font-mono"
            style={{ letterSpacing: "0.4em" }}
          >
            کالکشن جدید ۱۴۰۵
          </span>

          <h1 className="mt-6 font-display">
            {HERO_LINES.map((l) => (
              <span key={l.text} className="block overflow-hidden">
                <span
                  className="hero-line-inner block leading-[0.92]"
                  style={{
                    fontSize: l.size,
                    fontWeight: l.weight,
                    color: l.color,
                    letterSpacing: l.ls,
                  }}
                >
                  {l.text}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="hero-sub mt-6 text-[13px]"
            style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}
          >
            هودی · شلوار · تیشرت · کتونی · اکسسوری
          </p>

          <div className="hero-ctas mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton
              href="/shop"
              className="inline-flex h-[52px] items-center justify-center rounded-lg bg-[var(--lbb-red)] px-7 text-[13px] font-bold text-white hover:brightness-110"
            >
              خرید کالکشن جدید
            </MagneticButton>
            <MagneticButton
              href="/shop"
              className="inline-flex h-[52px] items-center justify-center rounded-lg border border-white/20 px-7 text-[13px] font-bold text-white transition-colors duration-200 hover:border-[var(--lbb-red)] hover:text-[var(--lbb-red)]"
            >
              مشاهده فروشگاه
            </MagneticButton>
          </div>

          <div className="absolute bottom-8 left-8 hidden flex-col items-center gap-3 md:flex" aria-hidden="true">
            <span
              className="text-[9px] font-mono"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              اسکرول کنید
            </span>
            <span className="scroll-line block h-12 w-px bg-white/15" />
          </div>
        </div>
      </div>
    </section>
  );
}
