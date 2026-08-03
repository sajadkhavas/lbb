import { Link } from "@tanstack/react-router";
import { fmtToman, type Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { productImage } from "@/lib/product-images";
import { Frame, TechLabel } from "@/components/lbb/ui/primitives";
import { cn } from "@/lib/utils";

export function BigProductCard({ p, wide = false, tall = false }: { p: Product; wide?: boolean; tall?: boolean }) {
  const cat = CATEGORIES[p.category];
  return (
    <Link
      to="/product/$slug"
      params={{ slug: p.slug }}
      className="group flex shrink-0 flex-col overflow-hidden rounded-2xl border border-hairline bg-carbon transition-transform duration-300 ease-[var(--ease-lbb)] hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
      style={{ width: wide ? 320 : undefined }}
    >
      <Frame
        src={productImage(p.slug)}
        alt={p.name}
        ratio={tall ? "3/4" : "4/5"}
        className={cn("rounded-t-2xl", wide ? "h-[440px]" : undefined)}
        width={900}
        height={1200}
      >
        {p.isNew && (
          <TechLabel tone="signal" className="absolute inset-inline-end-3 top-3 rounded-lg bg-signal px-2 py-1">
            جدید
          </TechLabel>
        )}
      </Frame>
      <div className="flex flex-col gap-1.5 p-4">
        <TechLabel tone="signal">{cat.nameFa}</TechLabel>
        <h3 className="truncate text-sm font-semibold text-bone">{p.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="num text-base font-bold text-bone">{fmtToman(p.price)}</span>
          {p.originalPrice && (
            <span className="num text-xs text-mute line-through">{fmtToman(p.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
