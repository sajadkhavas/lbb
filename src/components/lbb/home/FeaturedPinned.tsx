import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { BigProductCard } from "./BigProductCard";
import { TechLabel } from "@/components/lbb/ui/primitives";

const featured = products.filter((p) => p.isNew).concat(products.filter((p) => !p.isNew)).slice(0, 4);

/** Desktop-only horizontal pin; a plain grid ships on mobile — no long pinning there. */
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
          x: () => -distance(),
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
    <div className="flex flex-col justify-center">
      <TechLabel tone="signal">03 / NEW ARRIVALS</TechLabel>
      <h2 className="mt-4 text-display-1 text-bone">آخرین ورودی‌ها</h2>
      <p className="mt-3 text-lede">بهترین لباس‌های استریت‌ویر دراپ ۰۰۱</p>
      <div className="mt-6 flex gap-2" aria-hidden="true">
        {featured.map((_, i) => (
          <span
            key={i}
            className="h-1 w-8 transition-colors"
            style={{ background: progress * featured.length >= i ? "var(--lbb-signal)" : "var(--lbb-hairline)" }}
          />
        ))}
      </div>
      <Link to="/shop" className="mt-6 tech text-signal">
        مشاهده همه ←
      </Link>
    </div>
  );

  return (
    <>
      <div ref={outerRef} className="relative hidden bg-obsidian md:block" style={{ height: "400vh" }}>
        <div className="pin-inner sticky top-0 h-[100svh] overflow-hidden">
          <div className="mx-auto grid h-full max-w-[1600px] grid-cols-[30%_70%] items-center gap-8 px-10">
            {header}
            <div ref={trackRef} className="flex gap-6" style={{ transform: "translateX(0)" }}>
              {featured.map((p) => (
                <BigProductCard key={p.id} p={p} wide />
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-obsidian px-5 py-14 md:hidden" aria-label="محصولات جدید">
        {header}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {featured.map((p, i) => (
            <div key={p.id} className={i === 0 ? "col-span-2" : ""}>
              <BigProductCard p={p} tall={i === 0} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
