import { Link } from "@tanstack/react-router";
import { fmtToman, type Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";

export function BigProductCard({ p, wide = false }: { p: Product; wide?: boolean }) {
  const cat = CATEGORIES[p.category];
  return (
    <Link
      to="/product/$slug"
      params={{ slug: p.slug }}
      dir="rtl"
      className="group flex shrink-0 flex-col overflow-hidden rounded-2xl bg-white"
      style={{ width: wide ? 400 : undefined, height: wide ? 560 : undefined }}
    >
      <div className="relative flex-1 overflow-hidden bg-white" style={{ minHeight: wide ? 0 : 220 }}>
        <div
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center transition-transform duration-400 group-hover:scale-105"
          style={{ background: `radial-gradient(circle at 50% 40%, ${p.colors[0]}25 0%, #ffffff 70%)` }}
        >
          <span
            className="font-black text-black/[0.07]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: wide ? 96 : 64 }}
          >
            LBB
          </span>
        </div>
        {p.isNew && (
          <span className="absolute right-3 top-3 rounded bg-[var(--lbb-red)] px-2 py-0.5 text-[10px] font-bold text-white">
            جدید
          </span>
        )}
      </div>
      <div className="p-4">
        <span
          className="text-[9px] uppercase text-[var(--lbb-red)]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {cat.nameFa}
        </span>
        <h3
          className="truncate text-[15px] font-semibold text-[#0A0A0A]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {p.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[17px] font-bold text-[#0A0A0A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {fmtToman(p.price)}
          </span>
          {p.originalPrice && (
            <span className="text-[13px] text-gray-400 line-through">{fmtToman(p.originalPrice)}</span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            {p.colors.map((c) => (
              <span key={c} className="h-2 w-2 rounded-full border border-black/10" style={{ background: c }} />
            ))}
          </div>
          <span className="translate-y-2 rounded-full bg-[var(--lbb-red)] px-3 py-1 text-[10px] font-bold text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            افزودن
          </span>
        </div>
      </div>
    </Link>
  );
}
