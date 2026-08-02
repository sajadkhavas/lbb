import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { lifestyle1 } from "@/lib/product-images";
import { products, fmtToman } from "@/lib/products";
import { Band, SectionHead, Frame } from "@/components/lbb/ui/primitives";

type Hotspot = { slug: string; x: number; y: number };

const HOTSPOTS: Hotspot[] = [
  { slug: "lbb-classic-hoodie", x: 32, y: 30 },
  { slug: "cargo-street-pants", x: 55, y: 68 },
  { slug: "urban-runner-sneaker", x: 68, y: 90 },
];

export function ShopTheLook() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Band label="ست کامل" className="bg-obsidian px-5 md:px-10">
      <SectionHead
        index="06"
        label="SHOP THE LOOK"
        title="ست کامل رو بخر"
        action={
          <Link to="/shop" className="tech text-bone transition-colors hover:text-signal">
            مشاهده فروشگاه →
          </Link>
        }
      />

      <div className="relative mx-auto mt-8 max-w-[560px]">
        <Frame src={lifestyle1} alt="ست کامل استریت‌ویر LBB" ratio="4/5" zoom={false} width={1200} height={1500}>
          {HOTSPOTS.map((h) => {
            const product = products.find((p) => p.slug === h.slug);
            if (!product) return null;
            const isActive = active === h.slug;
            return (
              <div
                key={h.slug}
                className="absolute z-10"
                style={{ insetInlineStart: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <button
                  type="button"
                  aria-label={`نمایش ${product.name}`}
                  aria-expanded={isActive}
                  onClick={() => setActive(isActive ? null : h.slug)}
                  className="tap-target relative flex h-9 w-9 items-center justify-center rounded-full bg-bone text-obsidian shadow-lg ring-4 ring-bone/30 transition-transform hover:scale-110"
                >
                  {isActive ? <X size={16} /> : <Plus size={16} />}
                </button>

                {isActive && (
                  <div
                    className="absolute z-20 w-48 border border-hairline bg-carbon p-3 shadow-2xl"
                    style={{
                      top: h.y > 55 ? "auto" : "calc(100% + 12px)",
                      bottom: h.y > 55 ? "calc(100% + 12px)" : "auto",
                      insetInlineStart: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <Link to="/product/$slug" params={{ slug: product.slug }} className="flex items-center gap-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold text-bone">{product.name}</span>
                        <span className="num block text-xs text-signal">{fmtToman(product.price)}</span>
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </Frame>
      </div>
    </Band>
  );
}
