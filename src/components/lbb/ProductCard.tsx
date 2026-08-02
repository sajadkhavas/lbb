import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Eye } from "lucide-react";
import { toast } from "sonner";
import { fmtToman, discountPercent, isSizeAvailable, type Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { productImage, productHoverImage } from "@/lib/product-images";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useQuickView } from "@/lib/quickview";
import { Frame, StatusTag, TechLabel } from "@/components/lbb/ui/primitives";

export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const cat = CATEGORIES[p.category];
  const { add, openDrawer } = useCart();
  const { has, toggle } = useWishlist();
  const { open: openQuickView } = useQuickView();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const liked = has(p.slug);
  const discount = discountPercent(p);

  const addWithSize = (size: string) => {
    add({ slug: p.slug, name: p.name, price: p.price, color: p.colors[0], size, qty: 1 });
    toast.success("به سبد خرید اضافه شد", { description: `${p.name} — سایز ${size}` });
    openDrawer();
  };

  return (
    <article dir="rtl" className="group relative flex flex-col bg-obsidian">
      <Frame
        src={productImage(p.slug)}
        alt={p.name}
        ratio="4/5"
        priority={priority}
        width={1024}
        height={1280}
        className="bg-carbon"
        imgClassName={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} group-hover:opacity-0`}
      >
        {!loaded && <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" />}
        {/* preload flag via hidden img for onLoad tracking */}
        <img
          ref={imgRef}
          src={productImage(p.slug)}
          alt=""
          aria-hidden="true"
          className="hidden"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
        <img
          src={productHoverImage(p.slug)}
          alt=""
          aria-hidden="true"
          width={1600}
          height={1200}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.035] object-cover opacity-0 transition-opacity duration-500 ease-[var(--ease-lbb)] group-hover:opacity-100"
        />

        <Link
          to="/product/$slug"
          params={{ slug: p.slug }}
          aria-label={`مشاهده ${p.name}`}
          className="absolute inset-0 z-10"
        />

        <div className="pointer-events-none absolute start-2 top-2 z-20 flex flex-col items-start gap-1">
          {p.isNew && <StatusTag tone="signal">جدید</StatusTag>}
          {discount > 0 && <StatusTag tone="bone">{discount}٪ تخفیف</StatusTag>}
          {!p.inStock && <StatusTag tone="out">ناموجود</StatusTag>}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(p.slug);
            toast(liked ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد", { description: p.name });
          }}
          aria-label={liked ? `حذف ${p.name} از علاقه‌مندی‌ها` : `افزودن ${p.name} به علاقه‌مندی‌ها`}
          aria-pressed={liked}
          className="tap-target absolute end-1 top-1 z-20 grid place-items-center bg-obsidian/70 text-bone backdrop-blur transition-colors hover:text-signal"
        >
          <Heart size={16} strokeWidth={1.6} className={liked ? "fill-signal text-signal" : ""} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            openQuickView(p);
          }}
          aria-label={`نمای سریع ${p.name}`}
          className="tap-target absolute end-1 z-20 grid place-items-center bg-obsidian/70 text-bone backdrop-blur transition-colors hover:text-signal"
          style={{ top: 44 }}
        >
          <Eye size={16} strokeWidth={1.6} aria-hidden="true" />
        </button>

        {p.sizes.length > 0 && (
          <div className="pointer-events-none absolute inset-x-2 bottom-2 z-20 hidden flex-wrap justify-center gap-1 opacity-0 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:flex">
            {p.sizes.map((s) => {
              const available = isSizeAvailable(p, s);
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!available}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!available) return;
                    addWithSize(s);
                  }}
                  aria-label={available ? `افزودن سایز ${s} به سبد` : `سایز ${s} ناموجود`}
                  className={`pointer-events-auto size-chip ${available ? "hover:border-signal hover:text-signal" : "size-chip-disabled"}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}
      </Frame>

      <div className="flex flex-col gap-1 pt-3">
        <TechLabel tone="metal" className="text-[10px]">
          {cat.nameFa} / {p.latinName}
        </TechLabel>
        <h3 className="text-sm font-semibold leading-snug text-bone">
          <Link to="/product/$slug" params={{ slug: p.slug }}>
            {p.name}
          </Link>
        </h3>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="num text-sm font-bold text-bone">{fmtToman(p.price)}</span>
          {p.originalPrice && (
            <span className="num text-xs text-mute line-through">{fmtToman(p.originalPrice)}</span>
          )}
        </div>
        <div className="mt-1 flex gap-1.5" aria-hidden="true">
          {p.colors.map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-full border border-hairline" style={{ background: c }} />
          ))}
        </div>
      </div>
    </article>
  );
}
