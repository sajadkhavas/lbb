import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { lifestyle1 } from "@/lib/product-images";
import { products, fmtToman } from "@/lib/products";

type Hotspot = { slug: string; x: number; y: number };

const HOTSPOTS: Hotspot[] = [
  { slug: "lbb-classic-hoodie", x: 32, y: 30 },
  { slug: "cargo-street-pants", x: 55, y: 68 },
  { slug: "urban-runner-sneaker", x: 68, y: 90 },
];

export function ShopTheLook() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section dir="rtl" className="bg-white px-5 py-16 md:px-10" aria-labelledby="stl-title">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-end justify-between">
          <h2
            id="stl-title"
            className="text-[26px] font-bold text-[#0A0A0A] md:text-[32px] font-display"
          >
            ست کامل رو بخر
          </h2>
          <Link to="/shop" className="text-[13px] font-bold text-[var(--lbb-red)] hover:underline">
            مشاهده فروشگاه →
          </Link>
        </div>

        <div className="relative mt-8 mx-auto max-w-[560px] overflow-hidden rounded-2xl">
          <img
            src={lifestyle1}
            alt="ست کامل استریت‌ویر LBB"
            loading="lazy"
            className="block w-full object-cover"
          />
          {HOTSPOTS.map((h) => {
            const product = products.find((p) => p.slug === h.slug);
            if (!product) return null;
            const isActive = active === h.slug;
            return (
              <div
                key={h.slug}
                className="absolute z-10"
                style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <button
                  aria-label={`نمایش ${product.name}`}
                  aria-expanded={isActive}
                  onClick={() => setActive(isActive ? null : h.slug)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg ring-4 ring-white/40 transition-transform hover:scale-110"
                >
                  {isActive ? <X size={16} /> : <Plus size={16} />}
                  <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-white/70" />
                </button>

                {isActive && (
                  <div
                    dir="rtl"
                    className="absolute z-20 w-48 -translate-x-1/2 rounded-xl border border-black/10 bg-white p-3 shadow-2xl"
                    style={{
                      top: h.y > 55 ? "auto" : "calc(100% + 12px)",
                      bottom: h.y > 55 ? "calc(100% + 12px)" : "auto",
                      right: "50%",
                      marginRight: "0",
                      left: "50%",
                    }}
                  >
                    <Link
                      to="/product/$slug"
                      params={{ slug: product.slug }}
                      className="flex items-center gap-3"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold text-black">{product.name}</span>
                        <span className="block text-[11px] text-[var(--lbb-red)]">{fmtToman(product.price)}</span>
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
