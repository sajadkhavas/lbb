import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { fmtToman, type Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { productImage, productHoverImage } from "@/lib/product-images";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useQuickView } from "@/lib/quickview";

export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const cat = CATEGORIES[p.category];
  const { add, openDrawer } = useCart();
  const { has, toggle } = useWishlist();
  const { open: openQuickView } = useQuickView();
  const liked = has(p.slug);
  const discount =
    p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;

  const quickAdd = () => {
    add({
      slug: p.slug,
      name: p.name,
      price: p.price,
      color: p.colors[0],
      size: p.sizes[0],
      qty: 1,
    });
    toast.success("به سبد خرید اضافه شد", { description: p.name });
    openDrawer();
  };

  return (
    <article
      dir="rtl"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-black/[0.06] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] font-body"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f2f2f2]">
        <img
          src={productImage(p.slug)}
          alt={p.name}
          width={1024}
          height={1280}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-0"
        />
        <img
          src={productHoverImage(p.slug)}
          alt=""
          aria-hidden
          width={1600}
          height={1200}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* whole-card link overlay */}
        <Link
          to="/product/$slug"
          params={{ slug: p.slug }}
          aria-label={`نمایش سریع ${p.name}`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            openQuickView(p);
          }}
          className="absolute inset-0 z-10"
        />

        <div className="pointer-events-none absolute right-3 top-3 z-20 flex flex-col gap-1.5">
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
            <span className="rounded bg-gray-600 px-2 py-0.5 text-[10px] font-bold text-white">
              ناموجود
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            toggle(p.slug);
            toast(liked ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد", {
              description: p.name,
            });
          }}
          aria-label={liked ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
          aria-pressed={liked}
          className="absolute left-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart
            size={16}
            strokeWidth={1.8}
            className={liked ? "fill-[var(--lbb-red)] text-[var(--lbb-red)]" : "text-black/60"}
          />
        </button>

        {p.inStock && (
          <button
            type="button"
            onClick={quickAdd}
            className="absolute inset-x-3 bottom-3 z-20 flex h-11 items-center justify-center gap-1.5 rounded-lg bg-white/95 text-xs font-bold text-black opacity-100 shadow-sm backdrop-blur transition-all duration-300 hover:bg-[var(--lbb-red)] hover:text-white md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
          >
            <Plus size={15} /> افزودن سریع
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <span
          className="text-[10px] uppercase tracking-wider text-[var(--lbb-red)] font-mono"
        >
          {cat.nameFa}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold text-black">
          <Link to="/product/$slug" params={{ slug: p.slug }}>
            {p.name}
          </Link>
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span
            className="text-base font-bold text-black font-display"
          >
            {fmtToman(p.price)}
          </span>
          {p.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {fmtToman(p.originalPrice)}
            </span>
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
    </article>
  );
}
