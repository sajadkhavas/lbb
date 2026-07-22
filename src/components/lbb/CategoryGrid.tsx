import { useEffect, useRef } from "react";
import { categories } from "@/lib/products";

export function CategoryGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.default;
      gsap.registerPlugin(stMod.ScrollTrigger);
      const cards = ref.current?.querySelectorAll("[data-cat-card]");
      if (!cards) return;
      const anim = gsap.from(cards, {
        y: 80, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
      cleanup = () => { anim.scrollTrigger?.kill(); anim.kill(); };
    })();
    return () => cleanup();
  }, []);

  return (
    <section className="bg-black px-6 py-24 md:px-10 md:py-32">
      <h2 className="sr-only">Shop by category</h2>
      <div ref={ref} className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((c) => (
          <a
            key={c.n}
            href={`/${c.name.toLowerCase()}`}
            data-cat-card
            className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[4px] border border-white/[0.08] bg-black p-6 transition-all duration-200 hover:-translate-y-2 hover:border-[var(--lbb-red)] hover:shadow-[0_20px_60px_rgba(232,0,29,0.2)]"
          >
            <span className="font-display text-[72px] leading-none text-[var(--lbb-red)] transition-colors duration-200 group-hover:text-white">
              {c.n}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold uppercase tracking-wider text-white">{c.name}</h3>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">{c.count}</span>
            </div>
            <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[var(--lbb-red)] transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        ))}
      </div>
    </section>
  );
}
