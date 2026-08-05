import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useQuickView } from "@/lib/quickview";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { discountPercent, fmtToman, isSizeAvailable } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { productGallery } from "@/lib/product-images";
import { colorName } from "@/lib/color-names";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { CtaClasses, StatusTag, TechLabel } from "@/components/lbb/ui/primitives";

const MAX_QTY = 10;

export function ProductQuickView() {
  const { product, close, dismissForNavigation } = useQuickView();
  const { add, openDrawer } = useCart();
  const { has, toggle } = useWishlist();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(Boolean(product), dialogRef, close);

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (!product) return;
    setColor(product.colors[0] ?? "");
    setSize("");
    setQty(1);
    setImg(0);
    setSizeError(false);
  }, [product]);

  if (!product) return null;
  const p = product;
  const gallery = productGallery(p.slug).slice(0, 4);
  const liked = has(p.slug);
  const discount = discountPercent(p);
  const setImage = (next: number) => setImg((next + gallery.length) % gallery.length);

  const addToCart = () => {
    if (!size || !isSizeAvailable(p, size)) {
      setSizeError(true);
      dialogRef.current?.querySelector<HTMLButtonElement>("[data-available-size='true']")?.focus();
      return;
    }
    add({ slug: p.slug, name: p.name, price: p.price, color, size, qty });
    toast.success("به سبد خرید اضافه شد", { description: p.name });
    dismissForNavigation();
    requestAnimationFrame(() => openDrawer());
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-[300] flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="بستن نمای سریع"
        onClick={close}
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
        style={{ animation: "qv-fade 0.25s ease-out" }}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92svh] w-full flex-col overflow-hidden border-t border-hairline bg-obsidian shadow-2xl md:max-h-[86svh] md:max-w-4xl md:flex-row md:border"
        style={{ animation: "qv-up 0.35s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="بستن نمای سریع"
          className="tap-target absolute start-3 top-3 z-30 grid place-items-center bg-obsidian/80 text-bone backdrop-blur transition hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <span className="mx-auto mt-2 h-1 w-10 shrink-0 bg-hairline md:hidden" aria-hidden="true" />

        <div className="shrink-0 md:w-[46%]">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden bg-carbon touch-pan-y md:aspect-[3/4] md:h-full"
            onTouchStart={(event: React.TouchEvent<HTMLDivElement>) => {
              touchStart.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event: React.TouchEvent<HTMLDivElement>) => {
              if (touchStart.current === null) return;
              const end = event.changedTouches[0]?.clientX ?? touchStart.current;
              const delta = end - touchStart.current;
              touchStart.current = null;
              if (Math.abs(delta) < 45) return;
              setImage(delta > 0 ? img - 1 : img + 1);
            }}
          >
            <img
              src={gallery[img]}
              alt={`${p.name} — تصویر ${img + 1} از ${gallery.length}`}
              width={900}
              height={1200}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute end-3 top-3 flex flex-col items-end gap-1.5">
              {p.isNew ? <StatusTag tone="signal">جدید</StatusTag> : null}
              {discount > 0 ? <StatusTag tone="bone">{discount}٪ تخفیف</StatusTag> : null}
              {!p.inStock ? <StatusTag tone="out">ناموجود</StatusTag> : null}
            </div>
            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setImage(img - 1)}
                  aria-label="تصویر قبلی"
                  className="tap-target absolute start-2 top-1/2 grid -translate-y-1/2 place-items-center bg-obsidian/70 text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setImage(img + 1)}
                  aria-label="تصویر بعدی"
                  className="tap-target absolute end-2 top-1/2 grid -translate-y-1/2 place-items-center bg-obsidian/70 text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
              </>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-3">
              {gallery.map((source, index) => (
                <button
                  key={`${source}-${index}`}
                  type="button"
                  onClick={() => setImg(index)}
                  aria-label={`نمایش تصویر ${index + 1}`}
                  aria-current={index === img ? "true" : undefined}
                  className={`h-11 w-9 overflow-hidden border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                    index === img ? "border-signal" : "border-bone/40 opacity-70"
                  }`}
                >
                  <img
                    src={source}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 md:p-7">
          <TechLabel tone="signal">{CATEGORIES[p.category].nameFa}</TechLabel>
          <h2 id={titleId} className="mt-1.5 text-display-3 leading-tight text-bone">
            {p.name}
          </h2>
          <p className="mt-2 text-xs leading-6 text-metal">{p.shortDescription}</p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="num text-xl font-bold text-bone">{fmtToman(p.price)}</span>
            {p.originalPrice ? (
              <span className="num text-xs text-mute line-through">
                {fmtToman(p.originalPrice)}
              </span>
            ) : null}
          </div>

          {p.colors.length > 0 ? (
            <fieldset className="mt-5">
              <legend className="text-xs font-semibold text-bone">
                رنگ: <span className="font-normal text-metal">{colorName(color)}</span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.colors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setColor(item)}
                    aria-label={colorName(item)}
                    aria-pressed={item === color}
                    className={`h-10 w-10 rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${item === color ? "border-signal" : "border-hairline"}`}
                    style={{ background: item }}
                  />
                ))}
              </div>
            </fieldset>
          ) : null}

          {p.sizes.length > 0 ? (
            <fieldset className="mt-4">
              <legend className="text-xs font-semibold text-bone">سایز</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.sizes.map((item) => {
                  const available = isSizeAvailable(p, item);
                  return (
                    <button
                      key={item}
                      type="button"
                      disabled={!available}
                      data-available-size={available ? "true" : "false"}
                      onClick={() => {
                        setSize(item);
                        setSizeError(false);
                      }}
                      aria-pressed={item === size}
                      aria-label={available ? `انتخاب سایز ${item}` : `سایز ${item} ناموجود`}
                      className={`min-h-11 min-w-11 border px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                        !available
                          ? "cursor-not-allowed border-hairline text-mute line-through opacity-40"
                          : item === size
                            ? "border-signal bg-signal text-obsidian"
                            : "border-hairline text-bone hover:border-metal"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              {sizeError ? (
                <p role="alert" className="mt-2 text-xs font-semibold text-signal">
                  لطفاً یک سایز موجود را انتخاب کنید.
                </p>
              ) : null}
            </fieldset>
          ) : null}

          <div className="mt-4 flex items-center gap-3">
            <p className="text-xs font-semibold text-bone">تعداد</p>
            <div className="flex items-center gap-1 border border-hairline">
              <button
                type="button"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
                disabled={qty <= 1}
                aria-label="کاهش تعداد"
                className="tap-target grid place-items-center text-bone disabled:opacity-35"
              >
                <Minus size={15} aria-hidden="true" />
              </button>
              <output
                className="num w-6 text-center text-sm font-bold text-bone"
                aria-live="polite"
              >
                {qty}
              </output>
              <button
                type="button"
                onClick={() => setQty((value) => Math.min(MAX_QTY, value + 1))}
                disabled={qty >= MAX_QTY}
                aria-label="افزایش تعداد"
                className="tap-target grid place-items-center text-bone disabled:opacity-35"
              >
                <Plus size={15} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={addToCart}
              disabled={!p.inStock}
              className={`${CtaClasses("signal")} h-12 flex-1`}
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
              className="tap-target grid h-12 w-12 shrink-0 place-items-center border border-hairline transition hover:border-metal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
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
            onClick={dismissForNavigation}
            className={`${CtaClasses("line")} mt-3 w-full`}
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
          @media (prefers-reduced-motion: reduce) { [role="dialog"] { animation: none !important; } }
        `}</style>
      </div>
    </div>
  );
}
