import { Link } from "@tanstack/react-router";
import { fmtToman, type Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";

export function ProductCard({ p }: { p: Product }) {
  const cat = CATEGORIES[p.category];
  const discount =
    p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;
  return (
    <Link
      to="/product/$slug"
      params={{ slug: p.slug }}
      dir="rtl"
      className="group flex flex-col overflow-hidden rounded-xl border border-black/[0.06] bg-white transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
        {/* Product placeholder — replace with real image */}
        <div
          aria-hidden
          className="absolute inset-4 rounded-lg"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${p.colors[0]}30 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="font-black text-black/[0.08]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 72 }}
          >
            LBB
          </span>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {p.isNew && (
            <span className="rounded bg-[var(--lbb-red)] px-2 py-0.5 text-[10px] font-bold text-white">
              جدید
            </span>
          )}
          {discount > 0 && (
            <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold text-white">
              {discount}٪ تخفیف
            </span>
          )}
          {!p.inStock && (
            <span className="rounded bg-gray-500 px-2 py-0.5 text-[10px] font-bold text-white">
              ناموجود
            </span>
          )}
        </div>
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="rounded-lg bg-white/95 px-3 py-2.5 text-center text-xs font-semibold text-black shadow-sm">
            افزودن به سبد
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <span
          className="text-[10px] uppercase tracking-wider text-[var(--lbb-red)]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {cat.nameFa}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold text-black">{p.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-bold text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {fmtToman(p.price)}
          </span>
          {p.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{fmtToman(p.originalPrice)}</span>
          )}
        </div>
        <div className="mt-1 flex gap-1.5">
          {p.colors.map((c) => (
            <span
              key={c}
              className="h-2.5 w-2.5 rounded-full border border-black/10"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
