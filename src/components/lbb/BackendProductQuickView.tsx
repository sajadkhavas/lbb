import { useMemo, useRef, useState, useEffect, useId } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  LoaderCircle,
  Minus,
  Plus,
  RefreshCcw,
  ShoppingBag,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useCart } from "@/lib/cart";
import { backendErrorMessage, getProduct } from "@/lib/backend-api";
import type { BackendCatalogCard } from "@/lib/backend-storefront";
import { backendDecisionModel } from "@/lib/backend-storefront";
import {
  canAddSelection,
  mediaForColor,
  sizeAvailabilityForColor,
  variantForSelection,
  type DecisionMedia,
} from "@/lib/product-decision";
import { useQuickView } from "@/lib/quickview";
import { fmtToman } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";
import { ColorSelector, SizeSelector } from "@/components/lbb/product/ProductDecisionSelectors";
import { CtaClasses, StatusTag, TechLabel } from "@/components/lbb/ui/primitives";

const MAX_QTY = 10;

function fallbackMedia(card: BackendCatalogCard): DecisionMedia[] {
  const urls = card.previewImages.length > 0 ? card.previewImages : card.primaryImage ? [card.primaryImage] : [];
  return urls.map((src, index) => ({
    id: `${card.id}:preview:${index}`,
    src,
    alt: `${card.name} — تصویر ${index + 1}`,
    width: 1024,
    height: 1280,
  }));
}

export function BackendProductQuickView({ card }: { card: BackendCatalogCard }) {
  const { close, dismissForNavigation } = useQuickView();
  const { add, openDrawer } = useCart();
  const { has, toggle } = useWishlist();
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const titleId = useId();
  useFocusTrap(true, dialogRef, close);

  const productQuery = useQuery({
    queryKey: ["product-quickview", card.slug],
    queryFn: async () => (await getProduct(card.slug)).data,
    staleTime: 60_000,
    retry: 1,
  });

  const model = useMemo(
    () => (productQuery.data ? backendDecisionModel(productQuery.data) : null),
    [productQuery.data],
  );
  const [colorId, setColorId] = useState<string | null>(null);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [selectionError, setSelectionError] = useState(false);

  useEffect(() => {
    if (!model) return;
    setColorId(model.colors.length === 1 ? model.colors[0].id : null);
    setSizeId(null);
    setQty(1);
    setImg(0);
    setSelectionError(false);
  }, [model]);

  const gallery = useMemo(() => {
    if (!model) return fallbackMedia(card);
    const selected = mediaForColor(model, colorId);
    return selected.length > 0 ? selected : model.media.length > 0 ? model.media : fallbackMedia(card);
  }, [card, colorId, model]);

  useEffect(() => {
    setImg(0);
  }, [colorId, card.slug]);

  const setImage = (next: number) => {
    if (gallery.length === 0) return;
    setImg((next + gallery.length) % gallery.length);
  };

  const selectedColor = model?.colors.find((color) => color.id === colorId) ?? null;
  const selectedSize = model?.sizes.find((size) => size.id === sizeId) ?? null;
  const selectedVariant = model ? variantForSelection(model, colorId, sizeId) : null;
  const canAdd = model ? canAddSelection(model, colorId, sizeId) : false;
  const selectedPrice =
    selectedVariant?.priceToman ?? model?.pricing.priceToman ?? model?.pricing.fromToman ?? null;
  const liked = has(card.slug);

  const chooseColor = (nextColor: string) => {
    if (!model) return;
    setColorId(nextColor);
    if (sizeId && sizeAvailabilityForColor(model, sizeId, nextColor) !== "available") {
      setSizeId(null);
    }
    setSelectionError(false);
  };

  const addToCart = () => {
    if (!model || !canAdd || !colorId || !sizeId || !selectedVariant || selectedPrice === null) {
      setSelectionError(true);
      dialogRef.current?.querySelector<HTMLButtonElement>('[data-testid="pdp-size-selector"] button:not([aria-disabled="true"])')?.focus();
      return;
    }

    const name = model.identity.name ?? card.name;
    const swatch = selectedColor?.swatch?.type === "solid" ? selectedColor.swatch.value : undefined;
    add({
      slug: model.slug,
      name,
      price: selectedPrice,
      variantId: selectedVariant.id,
      source: "backend",
      color: swatch ?? selectedColor?.label,
      colorLabel: selectedColor?.label,
      size: selectedSize?.label ?? sizeId,
      sizeLabel: selectedSize?.label ?? sizeId,
      qty,
    });
    toast.success("به سبد خرید اضافه شد", {
      description: `${name} — سایز ${selectedSize?.label ?? sizeId}`,
    });
    dismissForNavigation();
    requestAnimationFrame(() => openDrawer());
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-[300] flex items-end justify-center md:items-center md:p-5">
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
        className="relative z-10 flex max-h-[94svh] w-full flex-col overflow-hidden border-t border-hairline bg-obsidian shadow-2xl md:max-h-[88svh] md:max-w-5xl md:flex-row md:overflow-hidden md:rounded-2xl md:border"
        style={{ animation: "qv-up 0.35s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="بستن نمای سریع"
          className="tap-target absolute start-3 top-3 z-40 grid place-items-center rounded-xl bg-obsidian/80 text-bone backdrop-blur transition hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <span className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-hairline md:hidden" aria-hidden="true" />

        <div className="shrink-0 md:w-[48%]">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden bg-carbon touch-pan-y md:h-full md:min-h-[650px] md:aspect-auto"
            tabIndex={gallery.length > 1 ? 0 : -1}
            role="region"
            aria-roledescription="carousel"
            aria-label={`گالری نمای سریع ${card.name}`}
            onKeyDown={(event) => {
              if (gallery.length <= 1) return;
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                setImage(img + 1);
              } else if (event.key === "ArrowRight") {
                event.preventDefault();
                setImage(img - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                setImg(0);
              } else if (event.key === "End") {
                event.preventDefault();
                setImg(gallery.length - 1);
              }
            }}
            onTouchStart={(event) => {
              touchStart.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchCancel={() => {
              touchStart.current = null;
            }}
            onTouchEnd={(event) => {
              if (touchStart.current === null || gallery.length <= 1) return;
              const end = event.changedTouches[0]?.clientX ?? touchStart.current;
              const delta = end - touchStart.current;
              touchStart.current = null;
              if (Math.abs(delta) < 45) return;
              setImage(delta > 0 ? img - 1 : img + 1);
            }}
          >
            {gallery[img] ? (
              <img
                src={gallery[img].src}
                alt={`${card.name} — تصویر ${img + 1} از ${gallery.length}`}
                width={gallery[img].width}
                height={gallery[img].height}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full min-h-80 place-items-center px-8 text-center text-sm leading-7 text-metal">
                تصویر تأییدشده برای این محصول منتشر نشده است.
              </div>
            )}

            <div className="pointer-events-none absolute end-3 top-3 flex flex-col items-end gap-1.5">
              {!card.availability ? <StatusTag tone="out">ناموجود</StatusTag> : null}
              {card.stockState === "low_stock" ? <StatusTag tone="neutral">موجودی محدود</StatusTag> : null}
            </div>

            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setImage(img - 1)}
                  aria-label="تصویر قبلی"
                  className="tap-target absolute start-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-xl bg-obsidian/70 text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:grid"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setImage(img + 1)}
                  aria-label="تصویر بعدی"
                  className="tap-target absolute end-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-xl bg-obsidian/70 text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:grid"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:bottom-4">
                  {gallery.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setImg(index)}
                      aria-label={`نمایش تصویر ${index + 1}`}
                      aria-current={index === img ? "true" : undefined}
                      className="grid min-h-11 min-w-11 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 rounded-full transition-[width,background-color] ${index === img ? "w-6 bg-signal" : "w-3 bg-bone/55"}`}
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 md:p-8 lg:p-9">
          {productQuery.isPending ? (
            <div className="grid min-h-[420px] place-items-center text-center">
              <div>
                <LoaderCircle className="mx-auto animate-spin text-signal" size={28} aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold text-bone">در حال دریافت اطلاعات واقعی محصول…</p>
                <p className="mt-2 text-xs leading-6 text-metal">قیمت، موجودی و تنوع از Backend خوانده می‌شود.</p>
              </div>
            </div>
          ) : productQuery.isError || !model ? (
            <div className="grid min-h-[420px] place-items-center text-center">
              <div className="max-w-sm">
                <RefreshCcw className="mx-auto text-signal" size={28} aria-hidden="true" />
                <h2 id={titleId} className="mt-4 text-xl font-black text-bone">نمای سریع موقتاً در دسترس نیست</h2>
                <p className="mt-3 text-sm leading-7 text-metal">{backendErrorMessage(productQuery.error)}</p>
                <button
                  type="button"
                  onClick={() => void productQuery.refetch()}
                  className={`${CtaClasses("line")} mt-5 w-full`}
                >
                  تلاش دوباره
                </button>
                <Link
                  to="/product/$slug"
                  params={{ slug: card.slug }}
                  onClick={dismissForNavigation}
                  className={`${CtaClasses("signal")} mt-3 w-full`}
                >
                  رفتن به جزئیات محصول
                </Link>
              </div>
            </div>
          ) : (
            <>
              <TechLabel tone="signal">{model.identity.categoryLabel}</TechLabel>
              <h2 id={titleId} className="mt-2 text-display-3 leading-tight text-bone">
                {model.identity.name ?? card.name}
              </h2>
              {model.identity.shortDescription ? (
                <p className="mt-3 text-sm leading-7 text-metal">{model.identity.shortDescription}</p>
              ) : null}

              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                {selectedPrice !== null ? (
                  <span className="num text-2xl font-black text-bone">{fmtToman(selectedPrice)}</span>
                ) : (
                  <span className="text-sm font-semibold text-metal">قیمت عمومی منتشر نشده</span>
                )}
                {model.pricing.originalPriceToman ? (
                  <span className="num text-sm text-mute line-through">{fmtToman(model.pricing.originalPriceToman)}</span>
                ) : null}
              </div>

              <div className="mt-6 border-t border-hairline pt-5">
                <ColorSelector colors={model.colors} selected={colorId} onSelect={chooseColor} />
              </div>

              <div className="mt-5">
                <SizeSelector
                  sizes={model.sizes}
                  selected={sizeId}
                  availabilityFor={(candidate) => sizeAvailabilityForColor(model, candidate, colorId)}
                  onSelect={(nextSize) => {
                    setSizeId(nextSize);
                    setSelectionError(false);
                  }}
                  describedBy={selectionError ? "backend-qv-selection-error" : undefined}
                />
              </div>

              {selectionError ? (
                <p id="backend-qv-selection-error" role="alert" className="mt-3 text-xs font-semibold leading-6 text-signal">
                  لطفاً یک رنگ و سایز موجود را انتخاب کنید.
                </p>
              ) : null}

              <div className="mt-5 flex items-center gap-3">
                <p className="text-xs font-semibold text-bone">تعداد</p>
                <div className="flex items-center gap-1 rounded-xl border border-hairline">
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                    disabled={qty <= 1}
                    aria-label="کاهش تعداد"
                    className="tap-target grid place-items-center text-bone disabled:opacity-35"
                  >
                    <Minus size={15} aria-hidden="true" />
                  </button>
                  <output className="num w-7 text-center text-sm font-bold text-bone" aria-live="polite">
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

              <div className="mt-6 flex items-center gap-2">
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={!canAdd}
                  className={`${CtaClasses("signal")} h-12 flex-1 disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <ShoppingBag size={17} aria-hidden="true" />
                  {canAdd ? "افزودن به سبد خرید" : "انتخاب رنگ و سایز"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggle(card.slug);
                    toast(liked ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد", {
                      description: card.name,
                    });
                  }}
                  aria-label={liked ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
                  aria-pressed={liked}
                  className="tap-target grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-hairline transition hover:border-metal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <Heart size={18} aria-hidden="true" className={liked ? "fill-signal text-signal" : "text-metal"} />
                </button>
              </div>

              <Link
                to="/product/$slug"
                params={{ slug: card.slug }}
                onClick={dismissForNavigation}
                className={`${CtaClasses("line")} mt-3 w-full`}
              >
                توضیحات بیشتر و جزئیات کامل
              </Link>

              <p className="mt-5 border-t border-hairline pt-4 text-[11px] leading-6 text-mute">
                قیمت، موجودی، رنگ و سایز این پنجره از محصول منتشرشده Backend خوانده می‌شود.
              </p>
            </>
          )}
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
