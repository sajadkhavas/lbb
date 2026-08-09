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
import type { BackendCatalogCard } from "@/lib/backend-storefront";
import { Frame, StatusTag, TechLabel } from "@/components/lbb/ui/primitives";

export type ProductCardModel = Product | BackendCatalogCard;

function isBackendCard(product: ProductCardModel): product is BackendCatalogCard {
  return "source" in product && product.source === "backend";
}

export function ProductCard({ p, priority = false }: { p: ProductCardModel; priority?: boolean }) {
  const backend = isBackendCard(p);
  const cat = backend ? null : CATEGORIES[p.category];
  const { add, openDrawer } = useCart();
  const { has, toggle } = useWishlist();
  const { open: openQuickView } = useQuickView();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const primaryImage = backend ? p.primaryImage : productImage(p.slug);
  const name = p.name;
  const categoryLabel = backend ? p.categoryLabel : cat.nameFa;
  const liked = has(p.slug);
  const discount = backend ? 0 : discountPercent(p);
  const available = backend ? p.availability : p.inStock;
  const priceFrom = backend ? p.priceFromToman : p.price;
  const priceTo = backend ? p.priceToToman : p.price;

  useEffect(() => {
    setLoaded(false);
    if (imgRef.current?.complete) setLoaded(true);
  }, [primaryImage]);

  const addWithSize = (size: string) => {
    if (backend) return;
    add({
      slug: p.slug,
      name: p.name,
      price: p.price,
      source: "prototype",
      color: p.colors[0] ?? "",
      size,
      qty: 1,
    });
    toast.success("به سبد خرید اضافه شد", { description: `${p.name} — سایز ${size}` });
    openDrawer();
  };

  const cardImage = primaryImage ? (
    <Frame
      src={primaryImage}
      alt={name}
      ratio="4/5"
      width={1024}
      height={1280}
      className="bg-carbon"
      imgClassName={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${backend ? "" : "md:group-hover:opacity-0"}`}
    >
      {!loaded ? <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" /> : null}
      <img
        ref={imgRef}
        src={primaryImage}
        alt=""
        aria-hidden="true"
        className="hidden"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      {!backend ? (
        <img
          src={productHoverImage(p.slug)}
          alt=""
          aria-hidden="true"
          width={1600}
          height={1200}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 hidden h-full w-full scale-[1.035] object-cover opacity-0 transition-opacity duration-500 ease-[var(--ease-lbb)] md:block md:group-hover:opacity-100"
        />
      ) : null}
      <CardOverlay
        p={p}
        liked={liked}
        discount={discount}
        available={available}
        onToggleWishlist={() => toggle(p.slug)}
        onQuickView={
          backend
            ? null
            : (button) => {
                openQuickView(p, button);
              }
        }
        onAddWithSize={addWithSize}
      />
    </Frame>
  ) : (
    <div className="relative aspect-[4/5] overflow-hidden bg-carbon">
      <div className="absolute inset-0 grid place-items-center px-6 text-center text-xs leading-6 text-mute">
        تصویر تأییدشده برای این محصول منتشر نشده است.
      </div>
      <CardOverlay
        p={p}
        liked={liked}
        discount={discount}
        available={available}
        onToggleWishlist={() => toggle(p.slug)}
        onQuickView={null}
        onAddWithSize={addWithSize}
      />
    </div>
  );

  return (
    <article dir="rtl" className="group relative flex min-w-0 flex-col bg-obsidian">
      {cardImage}

      <div className="flex min-w-0 flex-col gap-1 pt-3">
        <TechLabel tone="metal" className="truncate text-[10px]">
          {backend ? categoryLabel : `${categoryLabel} / ${p.latinName}`}
        </TechLabel>
        <h3 className="text-sm font-semibold leading-snug text-bone">
          <Link
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            {name}
          </Link>
        </h3>
        <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
          {priceFrom !== null ? (
            <span className="num text-sm font-bold text-bone">
              {priceTo !== null && priceTo !== priceFrom
                ? `${fmtToman(priceFrom)} تا ${fmtToman(priceTo)}`
                : fmtToman(priceFrom)}
            </span>
          ) : (
            <span className="text-xs font-semibold text-metal">قیمت عمومی منتشر نشده</span>
          )}
          {!backend && p.originalPrice ? (
            <span className="num text-xs text-mute line-through">{fmtToman(p.originalPrice)}</span>
          ) : null}
        </div>
        <div
          role="group"
          className="mt-1 flex gap-1.5"
          aria-label={`${p.colors.length} رنگ موجود`}
        >
          {backend
            ? p.colors.map((color) => (
                <span
                  key={color.publicId}
                  title={color.name}
                  className="h-2.5 w-2.5 rounded-full border border-hairline"
                  style={color.hex ? { background: color.hex } : undefined}
                  aria-label={color.name}
                />
              ))
            : p.colors.map((color) => (
                <span
                  key={color}
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full border border-hairline"
                  style={{ background: color }}
                />
              ))}
        </div>
        {backend ? (
          <Link
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 border border-hairline px-3 text-xs font-semibold text-bone transition hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            انتخاب رنگ و سایز
          </Link>
        ) : (
          <button
            type="button"
            onClick={(event) => openQuickView(p, event.currentTarget)}
            className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 border border-hairline text-xs font-semibold text-bone transition hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:hidden"
          >
            <Eye size={15} aria-hidden="true" />
            {p.inStock ? "انتخاب سایز و خرید" : "مشاهده محصول"}
          </button>
        )}
      </div>
    </article>
  );
}

function CardOverlay({
  p,
  liked,
  discount,
  available,
  onToggleWishlist,
  onQuickView,
  onAddWithSize,
}: {
  p: ProductCardModel;
  liked: boolean;
  discount: number;
  available: boolean;
  onToggleWishlist: () => void;
  onQuickView: ((button: HTMLButtonElement) => void) | null;
  onAddWithSize: (size: string) => void;
}) {
  const backend = isBackendCard(p);

  return (
    <>
      <Link
        to="/product/$slug"
        params={{ slug: p.slug }}
        aria-label={`مشاهده ${p.name}`}
        className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal"
      />

      <div className="pointer-events-none absolute start-2 top-2 z-20 flex flex-col items-start gap-1">
        {!backend && p.isNew ? <StatusTag tone="signal">جدید</StatusTag> : null}
        {discount > 0 ? <StatusTag tone="bone">{discount}٪ تخفیف</StatusTag> : null}
        {!available ? <StatusTag tone="out">ناموجود</StatusTag> : null}
        {backend && p.stockState === "low_stock" ? (
          <StatusTag tone="neutral">موجودی محدود</StatusTag>
        ) : null}
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          onToggleWishlist();
          toast(liked ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد", {
            description: p.name,
          });
        }}
        aria-label={liked ? `حذف ${p.name} از علاقه‌مندی‌ها` : `افزودن ${p.name} به علاقه‌مندی‌ها`}
        aria-pressed={liked}
        className="tap-target absolute end-1 top-1 z-20 grid place-items-center bg-obsidian/75 text-bone backdrop-blur transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
      >
        <Heart
          size={16}
          strokeWidth={1.6}
          className={liked ? "fill-signal text-signal" : ""}
          aria-hidden="true"
        />
      </button>

      {onQuickView ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            onQuickView(event.currentTarget);
          }}
          aria-label={`نمای سریع ${p.name}`}
          className="tap-target absolute end-1 top-12 z-20 grid place-items-center bg-obsidian/75 text-bone backdrop-blur transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          <Eye size={16} strokeWidth={1.6} aria-hidden="true" />
        </button>
      ) : null}

      {!backend && p.sizes.length > 0 ? (
        <div className="pointer-events-none absolute inset-x-2 bottom-2 z-20 hidden translate-y-2 flex-wrap justify-center gap-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:flex">
          {p.sizes.map((size) => {
            const sizeAvailable = isSizeAvailable(p, size);
            return (
              <button
                key={size}
                type="button"
                disabled={!sizeAvailable}
                onClick={(event) => {
                  event.preventDefault();
                  if (sizeAvailable) onAddWithSize(size);
                }}
                aria-label={sizeAvailable ? `افزودن سایز ${size} به سبد` : `سایز ${size} ناموجود`}
                className={`pointer-events-auto size-chip ${sizeAvailable ? "hover:border-signal hover:text-signal" : "size-chip-disabled"}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
