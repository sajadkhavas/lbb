import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { BigProductCard } from "./BigProductCard";

const featured = products.filter((p) => p.isNew).concat(products.filter((p) => !p.isNew)).slice(0, 4);

export function FeaturedPinned() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;
    if (window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;
      const ctx = gsap.context(() => {
        const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
        gsap.to(track, {
          x: () => distance(),
          ease: "none",
          scrollTrigger: {
            trigger: outer,
            start: "top top",
            end: "bottom bottom",
            pin: ".pin-inner",
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        });
      }, outer);
      cleanup = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const header = (
    <div className="flex flex-col justify-center" dir="rtl">
      <span
        className="text-[11px] uppercase text-[var(--lbb-red)]"
        style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.3em" }}
      >
        محصولات جدید
      </span>
      <h2 className="mt-4 leading-[0.95] font-display">
        <span className="block text-[clamp(34px,4vw,52px)] font-black text-white">آخرین</span>
        <span className="block text-[clamp(34px,4vw,52px)] font-black text-[var(--lbb-red)]">ورودی‌ها</span>
      </h2>
      <p className="mt-3 text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
        بهترین لباس‌های استریت‌ویر برای فصل جدید
      </p>
      <div className="mt-6 flex gap-2" aria-hidden="true">
        {featured.map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-8 rounded-full transition-colors"
            style={{
              background:
                progress * featured.length >= i ? "var(--lbb-red)" : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
      <Link to="/shop" className="mt-6 text-[12px] font-bold text-[var(--lbb-red)]">
        مشاهده همه ←
      </Link>
    </div>
  );

  return (
    <>
      {/* Desktop pinned horizontal */}
      <div ref={outerRef} className="relative hidden bg-[#0A0A0A] md:block" style={{ height: "400vh" }}>
        <div className="pin-inner sticky top-0 h-[100svh] overflow-hidden">
          <div dir="rtl" className="mx-auto grid h-full max-w-[1600px] grid-cols-[30%_70%] items-center gap-8 px-10">
            {header}
            <div ref={trackRef} className="flex gap-6" style={{ transform: "translateX(0)" }}>
              {featured.map((p) => (
                <BigProductCard key={p.id} p={p} wide />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile grid */}
      <section dir="rtl" className="bg-[#0A0A0A] px-5 py-14 md:hidden" aria-label="محصولات جدید">
        {header}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {featured.map((p) => (
            <BigProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}
