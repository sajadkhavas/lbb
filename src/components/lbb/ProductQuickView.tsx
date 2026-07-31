import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, Heart, ShoppingBag, Minus, Plus, Star, Truck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useQuickView } from "@/lib/quickview";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { fmtToman } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { productGallery } from "@/lib/product-images";
import { colorName } from "@/lib/color-names";

const fa = (n: number) => n.toLocaleString("fa-IR");

export function ProductQuickView() {
  const { product, close } = useQuickView();
  const { add, openDrawer } = useCart();
  const { has, toggle } = useWishlist();

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);

  useEffect(() => {
    if (!product) return;
    setColor(product.colors[0] ?? "");
    setSize(product.sizes[0] ?? "");
    setQty(1);
    setImg(0);
  }, [product]);

  if (!product) return null;
  const p = product;
  const gallery = productGallery(p.slug).slice(0, 4);
  const liked = has(p.slug);
  const discount =
    p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;

  const addToCart = () => {
    add({ slug: p.slug, name: p.name, price: p.price, color, size, qty });
    toast.success("به سبد خرید اضافه شد", { description: p.name });
    close();
    openDrawer();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[300] flex items-end justify-center md:items-center"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      <button
        aria-label="بستن"
        onClick={close}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ animation: "qv-fade 0.25s ease-out" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        className="relative z-10 flex max-h-[88svh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl md:max-h-[86svh] md:max-w-4xl md:flex-row md:rounded-2xl"
        style={{ animation: "qv-up 0.35s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <button
          onClick={close}
          aria-label="بستن"
          className="absolute left-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur transition hover:bg-black hover:text-white"
        >
          <X size={18} />
        </button>

        {/* drag handle (mobile) */}
        <span className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-black/15 md:hidden" />

        {/* media */}
        <div className="shrink-0 md:w-[46%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f2f2f2] md:aspect-[3/4] md:h-full">
            <img
              src={gallery[img]}
              alt={p.name}
              width={900}
              height={1200}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="absolute right-3 top-3 flex flex-col gap-1.5">
              {p.isNew && (
                <span className="rounded bg-[var(--lbb-red)] px-2 py-0.5 text-[10px] font-bold text-white">
                  جدید
                </span>
              )}
              {discount > 0 && (
                <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                  {fa(discount)}٪ تخفیف
                </span>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-3">
              {gallery.map((g, i) => (
                <button
                  key={g + i}
                  onClick={() => setImg(i)}
                  aria-label={`تصویر ${fa(i + 1)}`}
                  className={`h-11 w-9 overflow-hidden rounded border-2 transition ${
                    i === img ? "border-[var(--lbb-red)]" : "border-white/70 opacity-70"
                  }`}
                >
                  <img src={g} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* info */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 md:p-7">
          <span
            className="text-[10px] uppercase tracking-widest text-[var(--lbb-red)]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {CATEGORIES[p.category].nameFa}
          </span>
          <h2 className="mt-1.5 text-[19px] font-bold leading-tight text-black md:text-[24px]">
            {p.name}
          </h2>

          {p.avgRating && (
            <div className="mt-2 flex items-center gap-1.5 text-[12px] text-gray-500">
              <Star size={14} className="fill-[var(--lbb-red)] text-[var(--lbb-red)]" />
              <span className="font-semibold text-black">{fa(p.avgRating)}</span>
              <span>({fa(p.reviewCount ?? 0)} نظر)</span>
            </div>
          )}

          <div className="mt-3 flex items-baseline gap-2">
            <span
              className="text-[22px] font-bold text-black"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {fmtToman(p.price)}
            </span>
            {p.originalPrice && (
              <span className="text-[13px] text-gray-400 line-through">
                {fmtToman(p.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-3 text-[13px] leading-6 text-gray-600">{p.shortDescription}</p>

          {/* colors */}
          {p.colors.length > 0 && (
            <div className="mt-5">
              <p className="text-[12px] font-semibold text-black">
                رنگ: <span className="text-gray-500">{colorName(color)}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={colorName(c)}
                    aria-pressed={c === color}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      c === color ? "border-[var(--lbb-red)]" : "border-black/10"
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* sizes */}
          {p.sizes.length > 0 && (
            <div className="mt-4">
              <p className="text-[12px] font-semibold text-black">سایز</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    aria-pressed={s === size}
                    className={`min-w-11 rounded-lg border px-3 py-2 text-[12px] font-semibold transition ${
                      s === size
                        ? "border-black bg-black text-white"
                        : "border-black/15 text-black hover:border-black/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* qty */}
          <div className="mt-4 flex items-center gap-3">
            <p className="text-[12px] font-semibold text-black">تعداد</p>
            <div className="flex items-center gap-1 rounded-lg border border-black/15">
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label="افزایش"
                className="grid h-9 w-9 place-items-center text-black"
              >
                <Plus size={15} />
              </button>
              <span className="w-6 text-center text-[13px] font-bold text-black">{fa(qty)}</span>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="کاهش"
                className="grid h-9 w-9 place-items-center text-black"
              >
                <Minus size={15} />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={addToCart}
              disabled={!p.inStock}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--lbb-red)] text-[13px] font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingBag size={17} />
              {p.inStock ? "افزودن به سبد خرید" : "ناموجود"}
            </button>
            <button
              onClick={() => {
                toggle(p.slug);
                toast(liked ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد", {
                  description: p.name,
                });
              }}
              aria-label={liked ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
              aria-pressed={liked}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-black/15 transition hover:border-black/40"
            >
              <Heart
                size={18}
                className={liked ? "fill-[var(--lbb-red)] text-[var(--lbb-red)]" : "text-black/60"}
              />
            </button>
          </div>

          <Link
            to="/product/$slug"
            params={{ slug: p.slug }}
            onClick={close}
            className="mt-3 block rounded-xl border border-black/15 py-3 text-center text-[13px] font-bold text-black transition hover:bg-black hover:text-white"
          >
            توضیحات بیشتر و جزئیات کامل ←
          </Link>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-black/[0.07] pt-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <Truck size={14} /> ارسال سریع به سراسر ایران
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw size={14} /> ۷ روز ضمانت بازگشت
            </span>
            <span className="col-span-2 text-gray-400">
              کد کالا: {p.sku} — جنس: {p.material}
            </span>
          </div>
        </div>

        <style>{`
          @keyframes qv-fade { from { opacity: 0 } to { opacity: 1 } }
          @keyframes qv-up { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: none } }
        `}</style>
      </div>
    </div>
  );
}