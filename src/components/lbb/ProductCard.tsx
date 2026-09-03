import { Link } from "@tanstack/react-router";
import { Heart, Eye } from "lucide-react";
import { toast } from "sonner";
import { fmtToman, discountPercent, isSizeAvailable, type Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { productImage } from "@/lib/product-images";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useQuickView } from "@/lib/quickview";
import type { BackendCatalogCard } from "@/lib/backend-storefront";
import { isLiveBackend } from "@/lib/backend-api";
import { colorName } from "@/lib/color-names";
import { Frame, StatusTag, TechLabel } from "@/components/lbb/ui/primitives";

export type ProductCardModel = Product | BackendCatalogCard;

function isBackendCard(product: ProductCardModel): product is BackendCatalogCard {
  return "source" in product && product.source === "backend";
}

export function ProductCard({ p, priority = false }: { p: ProductCardModel; priority?: boolean }) {
  const backend = isBackendCard(p);
  const { add, openDrawer } = useCart();
  const { has, toggle } = useWishlist();
  const { open: openQuickView } = useQuickView();

  const primaryImage = backend ? p.primaryImage : productImage(p.slug);
  const name = p.name;
  const categoryLabel = backend ? p.categoryLabel : CATEGORIES[p.category].nameFa;
  const liked = has(p.slug);
  const discount = backend ? 0 : discountPercent(p);
  const available = backend ? p.availability : p.inStock;
  const priceFrom = backend ? p.priceFromToman : p.price;
  const priceTo = backend ? p.priceToToman : p.price;

  if (!backend && isLiveBackend()) {
    return (
      <article className="flex min-h-72 flex-col justify-between border border-hairline bg-carbon p-5">
        <div>
          <TechLabel tone="metal">BACKEND PRODUCT ONLY</TechLabel>
          <p className="mt-4 text-sm leading-7 text-metal">
            این جایگاه هنوز به محصول منتشرشده Backend متصل نشده است؛ داده نمونه در حالت live نمایش
            داده نمی‌شود.
          </p>
        </div>
        <Link
          to="/shop"
          search={{}}
          className="mt-6 inline-flex min-h-11 items-center justify-center border border-hairline px-3 text-xs font-semibold text-bone transition hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          مشاهده کاتالوگ زنده
        </Link>
      </article>
    );
  }

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
      ratio="1/1"
      width={1024}
      height={1280}
      priority={priority}
      zoom={false}
      className="product-card__media bg-white"
      imgClassName="object-contain p-4 sm:p-7"
    >
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
    <div className="product-card__media relative aspect-square overflow-hidden bg-white">
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
    <article
      dir="rtl"
      className="product-card group relative flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#111113] shadow-[0_14px_42px_rgba(0,0,0,0.3)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-signal/55 hover:shadow-[0_24px_60px_rgba(0,0,0,0.46)]"
    >
      {cardImage}

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <TechLabel tone="metal" className="truncate text-[9px] sm:text-[10px]">
          {backend ? categoryLabel : `${categoryLabel} / ${p.latinName}`}
        </TechLabel>
        <h3 className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-[13px] font-extrabold leading-[1.55] text-bone sm:text-base">
          <Link
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            {name}
          </Link>
        </h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          {priceFrom !== null ? (
            <span className="num text-[13px] font-bold text-bone sm:text-sm">
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
        {!backend && p.sizes.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5 md:hidden" aria-label="سایزهای محصول">
            {p.sizes.map((size) => {
              const sizeAvailable = isSizeAvailable(p, size);
              return (
                <span
                  key={size}
                  className={`grid min-h-7 min-w-8 place-items-center rounded-lg px-1.5 text-[10px] font-black ${
                    sizeAvailable
                      ? "bg-signal text-obsidian"
                      : "border border-white/10 bg-white/5 text-mute line-through"
                  }`}
                >
                  {size}
                </span>
              );
            })}
          </div>
        ) : null}
        <div
          role="group"
          className="mt-3 flex gap-2"
          aria-label={`رنگ‌های موجود: ${
            backend
              ? p.colors.map((color) => color.name).join("، ")
              : p.colors.map(colorName).join("، ")
          }`}
        >
          {backend
            ? p.colors.map((color) => (
                <span
                  key={color.publicId}
                  title={color.name}
                  className="h-3 w-3 rounded-full border border-white/30 ring-1 ring-black"
                  style={color.hex ? { background: color.hex } : undefined}
                  aria-hidden="true"
                />
              ))
            : p.colors.map((color) => (
                <span
                  key={color}
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full border border-white/30 ring-1 ring-black"
                  style={{ background: color }}
                />
              ))}
        </div>
        {backend ? (
          <Link
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-hairline px-3 text-xs font-semibold text-bone transition hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            انتخاب رنگ و سایز
          </Link>
        ) : (
          <button
            type="button"
            onClick={(event) => openQuickView(p, event.currentTarget)}
            className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-signal/40 bg-signal/10 px-2 text-[11px] font-bold text-signal transition hover:bg-signal hover:text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:hidden"
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
        className="tap-target absolute end-2 top-2 z-20 grid place-items-center rounded-xl border border-white/10 bg-obsidian/75 text-bone shadow-raised backdrop-blur transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
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
          className="tap-target absolute end-2 top-14 z-20 grid place-items-center rounded-xl border border-white/10 bg-obsidian/75 text-bone shadow-raised backdrop-blur transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          <Eye size={16} strokeWidth={1.6} aria-hidden="true" />
        </button>
      ) : null}

      {!backend && p.sizes.length > 0 ? (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 hidden translate-y-3 flex-wrap justify-center gap-1.5 rounded-2xl border border-white/15 bg-obsidian/88 p-2.5 opacity-0 shadow-raised backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:flex">
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
                className={`pointer-events-auto grid min-h-9 min-w-10 place-items-center rounded-xl border px-2 text-[11px] font-black transition ${sizeAvailable ? "border-signal bg-signal text-obsidian hover:bg-bone" : "size-chip-disabled border-white/10 bg-white/5 text-mute"}`}
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
