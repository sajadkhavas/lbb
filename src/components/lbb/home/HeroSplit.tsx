import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { heroMain } from "@/lib/product-images";
import { PRODUCT_COUNT, fmtNum } from "@/lib/products";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";

/**
 * Full-viewport asymmetric 60/40 editorial hero. Fixed image dimensions
 * (no CLS). Entrance sequence: scanline → wordmark → image mask →
 * headline → metadata → CTA. Respects prefers-reduced-motion.
 */
export function HeroSplit() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const ctx = gsap.context(() => {
        const ease = "cubic-bezier(0.16,1,0.3,1)";
        const tl = gsap.timeline({ defaults: { ease } });
        tl.fromTo(".hero-scanline", { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.5 })
          .to(".hero-scanline", { opacity: 0, duration: 0.3 }, "-=0.05")
          .from(".hero-wordmark", { yPercent: 110, duration: 0.7 }, "-=0.35")
          .fromTo(
            ".hero-media",
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: 0.9 },
            "-=0.5",
          )
          .from(".hero-headline-line", { yPercent: 105, duration: 0.6, stagger: 0.08 }, "-=0.55")
          .from(".hero-meta-item", { y: 10, opacity: 0, duration: 0.4, stagger: 0.06 }, "-=0.25")
          .from(".hero-cta", { y: 10, opacity: 0, duration: 0.4, stagger: 0.06 }, "-=0.2");

        if (window.innerWidth >= 768) {
          gsap.to(".hero-media-img", {
            yPercent: 8,
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
      className="relative w-full overflow-hidden bg-obsidian grid-marks"
      style={{ minHeight: "100svh" }}
      aria-label="LBB — درپ ۰۰۱"
    >
      <span
        aria-hidden="true"
        className="hero-scanline pointer-events-none absolute inset-x-0 top-1/2 z-30 h-px origin-start bg-signal"
      />

      <div className="flex min-h-[100svh] flex-col md:flex-row">
        {/* Text panel — 60% */}
        <div className="relative order-2 flex w-full flex-col justify-center gap-8 px-5 py-16 md:order-1 md:w-[60%] md:px-14 md:py-10">
          <div className="overflow-hidden">
            <TechLabel tone="signal" className="hero-wordmark block">
              LBB / DROP 001 / TEHRAN
            </TechLabel>
          </div>

          <h1 className="leading-[0.9]">
            <span className="block overflow-hidden">
              <span className="hero-headline-line block text-hero text-bone">استایل</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-headline-line block text-hero text-signal">خودتو</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-headline-line block text-hero text-metal">تعریف کن</span>
            </span>
          </h1>

          <p className="hero-meta-item max-w-md text-lede">
            هودی، شلوار، تیشرت، کتونی و جوراب از اولین دراپ LBB — طراحی‌شده برای خیابان‌های تهران.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/shop" className={`hero-cta ${CtaClasses("signal")}`}>
              خرید کالکشن جدید
            </Link>
            <Link to="/shop" className={`hero-cta ${CtaClasses("line")}`}>
              مشاهده فروشگاه
            </Link>
          </div>

          <dl className="hero-meta-item mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 hairline-t pt-6">
            <div>
              <dt className="tech text-mute">مبدا</dt>
              <dd className="num text-sm text-bone">تهران</dd>
            </div>
            <div>
              <dt className="tech text-mute">دراپ</dt>
              <dd className="num text-sm text-bone">001</dd>
            </div>
            <div>
              <dt className="tech text-mute">تعداد قطعات</dt>
              <dd className="num text-sm text-bone">{fmtNum(PRODUCT_COUNT)}</dd>
            </div>
          </dl>
        </div>

        {/* Media panel — 40% */}
        <div className="relative order-1 h-[46svh] w-full overflow-hidden bg-carbon md:order-2 md:h-auto md:min-h-[100svh] md:w-[40%]">
          <div className="hero-media absolute inset-0 overflow-hidden">
            <img
              src={heroMain}
              alt="مدل LBB با کالکشن دراپ ۰۰۱"
              width={1200}
              height={1500}
              fetchPriority="high"
              decoding="sync"
              className="hero-media-img absolute inset-0 h-full w-full object-cover"
              style={{ transform: "scale(1.08)" }}
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to inline-start, rgba(5,5,5,0.65) 0%, transparent 45%)",
            }}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-6 inset-inline-start-6 hidden flex-col items-center gap-3 md:flex"
        aria-hidden="true"
      >
        <TechLabel className="[writing-mode:vertical-rl] rotate-180">اسکرول کنید</TechLabel>
        <span className="block h-12 w-px bg-hairline" />
      </div>
    </section>
  );
}
