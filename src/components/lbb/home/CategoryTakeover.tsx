import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { productsByCategory } from "@/lib/products";

const BG: Record<string, string> = {
  hoodies: "linear-gradient(135deg, #1a0505 0%, #0A0A0A 70%)",
  pants: "linear-gradient(135deg, #05051a 0%, #0A0A0A 70%)",
  tshirts: "linear-gradient(135deg, #05140a 0%, #0A0A0A 70%)",
  shoes: "linear-gradient(135deg, #14050a 0%, #0A0A0A 70%)",
  accessories: "linear-gradient(135deg, #0a0a14 0%, #0A0A0A 70%)",
};

const fa = (n: number) => n.toLocaleString("fa-IR");

export function CategoryTakeover() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

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
        gsap.from(".cat-item", {
          x: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 70%" },
        });
      }, root);
      cleanup = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const cats = CATEGORY_SLUGS.map((s) => ({
    ...CATEGORIES[s],
    count: productsByCategory(s).length,
  }));
  const current = cats[active];

  return (
    <section
      ref={rootRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-[#0A0A0A] py-16 md:min-h-[100svh] md:py-0"
      aria-labelledby="cats-title"
    >
      {/* background layers */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {cats.map((c, i) => (
          <div
            key={c.slug}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: BG[c.slug], opacity: i === active ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <h2 id="cats-title" className="sr-only">
        دسته‌بندی‌ها
      </h2>

      {/* Desktop */}
      <div className="relative z-10 mx-auto hidden h-full max-w-[1600px] grid-cols-[60%_40%] items-center gap-8 px-10 md:grid md:min-h-[100svh]">
        <div className="flex flex-col justify-center">
          <span
            className="text-[11px] uppercase text-[var(--lbb-red)]"
            style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.3em" }}
          >
            {current.heroTagline}
          </span>
          <p
            className="mt-4 text-[28px] font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {fa(current.count)} محصول
          </p>
          <p className="mt-3 max-w-md text-[16px]" style={{ color: "rgba(255,255,255,0.6)" }}>
            {current.metaDesc}
          </p>
          <Link
            to="/$category"
            params={{ category: current.slug }}
            className="mt-5 text-[13px] font-bold text-[var(--lbb-red)]"
          >
            مشاهده کالکشن ←
          </Link>
        </div>

        <ul className="flex flex-col">
          {cats.map((c, i) => (
            <li key={c.slug} className="cat-item border-b border-white/[0.06]">
              <Link
                to="/$category"
                params={{ category: c.slug }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="flex items-center gap-6 py-5 transition-all duration-250"
                style={{ opacity: i === active ? 1 : 0.35 }}
              >
                <span
                  className="text-[11px]"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.2em",
                    color: i === active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[40px] font-bold transition-colors"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: "-0.02em",
                    color: i === active ? "var(--lbb-red)" : "#FFFFFF",
                  }}
                >
                  {c.nameFa}
                </span>
                <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  ({fa(c.count)})
                </span>
                <span
                  className="text-[20px] text-white transition-all duration-300"
                  style={{ opacity: i === active ? 1 : 0, transform: i === active ? "translateX(-8px)" : "none" }}
                  aria-hidden="true"
                >
                  ←
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3 px-5 md:hidden">
        {cats.map((c) => (
          <Link
            key={c.slug}
            to="/$category"
            params={{ category: c.slug }}
            className="cat-item overflow-hidden rounded-xl bg-[#141414]"
          >
            <div className="aspect-[3/4] w-full" style={{ background: BG[c.slug] }} />
            <div className="p-3">
              <p
                className="text-[18px] font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {c.nameFa}
              </p>
              <p className="text-[11px] text-[var(--lbb-red)]">{fa(c.count)} محصول</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
