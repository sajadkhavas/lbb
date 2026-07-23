import { useEffect, useRef, useState } from "react";
import { products, type Product } from "@/lib/products";

function ProductCard({ p }: { p: Product }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glossRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const card = cardRef.current!;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transition = "transform 0.1s ease";
    card.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    if (glossRef.current) {
      glossRef.current.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.08), transparent 45%)`;
    }
  };
  const onLeave = () => {
    const card = cardRef.current!;
    card.style.transition = "transform 0.4s ease";
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    setHover(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      data-product-card
      className="group relative overflow-hidden rounded-[6px] border border-white/[0.06] bg-black will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Image area (70%) */}
      <div className="relative aspect-square w-full overflow-hidden">
        {/* Replace with actual product image <img src="..." /> */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(232,0,29,0.85) 0%, rgba(232,0,29,0.2) 40%, #0A0A0A 100%)",
          }}
        />
        <div ref={glossRef} className="pointer-events-none absolute inset-0" />
        <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.25em] text-white/70">
          LBB / 2026
        </span>
        {/* Add to cart slide-up */}
        <button
          className={`absolute inset-x-4 bottom-4 rounded-[4px] border border-white/60 bg-black/70 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur transition-all duration-300 ${
            hover ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Add to cart
        </button>
      </div>

      <div className="flex items-end justify-between gap-3 border-t border-white/[0.06] p-5">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white">{p.name}</h3>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.25em] text-white/40">
            {p.category}
          </span>
        </div>
        <span className="shrink-0 text-xs font-medium text-[var(--lbb-red)]">{p.price.toLocaleString("fa-IR")} تومان</span>
      </div>
    </div>
  );
}

export function ProductsSection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    (async () => {
      const gsap = (await import("gsap")).default;
      const st = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(st.ScrollTrigger);
      const cards = ref.current?.querySelectorAll("[data-product-card]");
      if (!cards) return;
      const anim = gsap.from(cards, {
        y: 80, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      cleanup = () => { anim.scrollTrigger?.kill(); anim.kill(); };
    })();
    return () => cleanup();
  }, []);

  return (
    <section className="bg-black px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <h2 className="font-display text-4xl font-black leading-none text-white md:text-[56px]">
          New Arrivals <span className="text-[var(--lbb-red)]">— 2026</span>
        </h2>
        <div ref={ref} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
