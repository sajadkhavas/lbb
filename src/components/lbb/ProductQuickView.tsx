import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useQuickView } from "@/lib/quickview";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { fmtToman, isSizeAvailable, discountPercent } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { productGallery } from "@/lib/product-images";
import { colorName } from "@/lib/color-names";
import { CtaClasses, StatusTag, TechLabel } from "@/components/lbb/ui/primitives";

export function ProductQuickView() {
  const { product, close } = useQuickView();
  const { add, openDrawer } = useCart();
  const { has, toggle } = useWishlist();

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (!product) return;
    setColor(product.colors[0] ?? "");
    setSize("");
    setQty(1);
    setImg(0);
    setSizeError(false);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, close]);

  if (!product) return null;
  const p = product;
  const gallery = productGallery(p.slug).slice(0, 4);
  const liked = has(p.slug);
  const discount = discountPercent(p);

  const addToCart = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    add({ slug: p.slug, name: p.name, price: p.price, color, size, qty });
    toast.success("به سبد خرید اضافه شد", { description: p.name });
    close();
    openDrawer();
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-[300] flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="بستن"
        onClick={close}
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
        style={{ animation: "qv-fade 0.25s ease-out" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        className="relative z-10 flex max-h-[88svh] w-full flex-col overflow-hidden border-t border-hairline bg-obsidian shadow-2xl md:max-h-[86svh] md:max-w-4xl md:flex-row md:border md:border-hairline"
        style={{ animation: "qv-up 0.35s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="بستن"
          className="tap-target absolute start-3 top-3 z-20 grid place-items-center bg-obsidian/80 text-bone backdrop-blur transition hover:text-signal"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <span className="mx-auto mt-2 h-1 w-10 shrink-0 bg-hairline md:hidden" />

        {/* media */}
        <div className="shrink-0 md:w-[46%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-carbon md:aspect-[3/4] md:h-full">
            <img
              src={gallery[img]}
              alt={p.name}
              width={900}
              height={1200}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute end-3 top-3 flex flex-col items-end gap-1.5">
              {p.isNew && <StatusTag tone="signal">جدید</StatusTag>}
              {discount > 0 && <StatusTag tone="bone">{discount}٪ تخفیف</StatusTag>}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-3">
              {gallery.map((g, i) => (
                <button
                  key={g + i}
                  type="button"
                  onClick={() => setImg(i)}
                  aria-label={`تصویر ${i + 1}`}
                  aria-current={i === img}
                  className={`h-11 w-9 overflow-hidden border-2 transition ${
                    i === img ? "border-signal" : "border-bone/40 opacity-70"
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
          <TechLabel tone="signal">{CATEGORIES[p.category].nameFa}</TechLabel>
          <h2 className="mt-1.5 text-display-3 leading-tight text-bone">{p.name}</h2>
          <p className="mt-2 text-xs leading-6 text-metal">{p.shortDescription}</p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="num text-xl font-bold text-bone">{fmtToman(p.price)}</span>
            {p.originalPrice && (
              <span className="num text-xs text-mute line-through">{fmtToman(p.originalPrice)}</span>
            )}
          </div>

          {/* colors */}
          {p.colors.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-bone">
                رنگ: <span className="font-normal text-metal">{colorName(color)}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={colorName(c)}
                    aria-pressed={c === color}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      c === color ? "border-signal" : "border-hairline"
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
              <p className="text-xs font-semibold text-bone">سایز</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="انتخاب سایز">
                {p.sizes.map((s) => {
                  const available = isSizeAvailable(p, s);
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={!available}
                      onClick={() => {
                        setSize(s);
                        setSizeError(false);
                      }}
                      aria-pressed={s === size}
                      className={`min-w-11 border px-3 py-2 text-xs font-semibold transition ${
                        !available
                          ? "border-hairline text-mute line-through opacity-40"
                          : s === size
                            ? "border-signal bg-signal text-bone"
                            : "border-hairline text-bone hover:border-metal"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {sizeError && (
                <p role="alert" className="mt-2 text-xs font-semibold text-signal">
                  لطفاً یک سایز را انتخاب کنید.
                </p>
              )}
            </div>
          )}

          {/* qty */}
          <div className="mt-4 flex items-center gap-3">
            <p className="text-xs font-semibold text-bone">تعداد</p>
            <div className="flex items-center gap-1 border border-hairline">
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label="افزایش تعداد"
                className="tap-target grid place-items-center text-bone"
              >
                <Plus size={15} aria-hidden="true" />
              </button>
              <span className="num w-6 text-center text-sm font-bold text-bone">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="کاهش تعداد"
                className="tap-target grid place-items-center text-bone"
              >
                <Minus size={15} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={addToCart}
              disabled={!p.inStock}
              className={CtaClasses("signal") + " h-12 flex-1"}
            >
              <ShoppingBag size={17} aria-hidden="true" />
              {p.inStock ? "افزودن به سبد خرید" : "ناموجود"}
            </button>
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
              className="tap-target grid h-12 w-12 shrink-0 place-items-center border border-hairline transition hover:border-metal"
            >
              <Heart
                size={18}
                aria-hidden="true"
                className={liked ? "fill-signal text-signal" : "text-metal"}
              />
            </button>
          </div>

          <Link
            to="/product/$slug"
            params={{ slug: p.slug }}
            onClick={close}
            className={CtaClasses("line") + " mt-3 w-full"}
          >
            توضیحات بیشتر و جزئیات کامل
          </Link>

          <p className="mt-4 border-t border-hairline pt-4 text-[11px] text-mute">
            کد کالا: <span className="num">{p.sku}</span> — جنس: {p.material}
          </p>
        </div>

        <style>{`
          @keyframes qv-fade { from { opacity: 0 } to { opacity: 1 } }
          @keyframes qv-up { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: none } }
        `}</style>
      </div>
    </div>
  );
}
