import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/lbb/ProductCard";

const bestsellers = [...products]
  .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  .slice(0, 4);

export function BestSellers() {
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
        gsap.from(".bs-card", {
          y: 60,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 75%" },
        });
      }, root);
      cleanup = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section ref={ref} dir="rtl" className="bg-white px-5 py-16 md:px-10" aria-labelledby="bestsellers-title">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-end justify-between">
          <h2
            id="bestsellers-title"
            className="text-[26px] font-bold text-[#0A0A0A] md:text-[32px]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            پرفروش‌ترین‌ها
          </h2>
          <Link to="/shop" className="text-[13px] font-bold text-[var(--lbb-red)] hover:underline">
            مشاهده همه →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <div key={p.id} className="bs-card">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
