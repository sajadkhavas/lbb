import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { CtaClasses, StatePanel } from "@/components/lbb/ui/primitives";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import {
  canAddSelection,
  mediaForColor,
  sizeAvailabilityForColor,
  variantForSelection,
  type ProductDecisionViewModel,
} from "@/lib/product-decision";
import { ColorSelector, SizeSelector } from "./ProductDecisionSelectors";
import { ProductIdentity } from "./ProductIdentity";
import { SizeGuideDialog } from "./SizeGuideDialog";
import { StickyBuyBar } from "./StickyBuyBar";

export function ProductPurchasePanel({
  model,
  onMediaChange,
}: {
  model: ProductDecisionViewModel;
  onMediaChange: (media: ReturnType<typeof mediaForColor>) => void;
}) {
  const initialColor = model.colors.length === 1 ? model.colors[0].id : null;
  const [colorId, setColorId] = useState<string | null>(initialColor);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const addButtonRef = useRef<HTMLDivElement>(null);
  const sizeRegionRef = useRef<HTMLDivElement>(null);
  const { add, openDrawer } = useCart();
  const { has, toggle } = useWishlist();
  const liked = has(model.slug);

  useEffect(() => {
    const next = model.colors.length === 1 ? model.colors[0].id : null;
    setColorId(next);
    setSizeId(null);
    setSelectionError(false);
    onMediaChange(mediaForColor(model, next));
  }, [model, onMediaChange]);

  useEffect(() => {
    const element = addButtonRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [model.slug]);

  const selectedColor = useMemo(
    () => model.colors.find((color) => color.id === colorId) ?? null,
    [colorId, model.colors],
  );
  const selectedVariant = variantForSelection(model, colorId, sizeId);
  const canAdd = canAddSelection(model, colorId, sizeId);

  const statusLabel = (() => {
    if (!model.readyForCommerce) return "خرید تا تأیید اطلاعات اصلی محصول غیرفعال است";
    if (model.stock.availability !== "available") return "این محصول برای خرید در دسترس نیست";
    if (model.colors.length > 1 && !colorId) return "ابتدا رنگ را انتخاب کنید";
    if (!sizeId) return "ابتدا سایز را انتخاب کنید";
    if (selectedVariant?.availability === "sold-out") return "این ترکیب رنگ و سایز ناموجود است";
    if (!canAdd) return "این ترکیب برای خرید در دسترس نیست";
    return "آماده افزودن به سبد";
  })();

  const focusDecision = () => {
    const target = sizeRegionRef.current;
    if (!target) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    requestAnimationFrame(() => target.querySelector<HTMLButtonElement>("button")?.focus());
  };

  const chooseColor = (nextColor: string) => {
    setColorId(nextColor);
    if (sizeId && sizeAvailabilityForColor(model, sizeId, nextColor) !== "available") {
      setSizeId(null);
    }
    setSelectionError(false);
    onMediaChange(mediaForColor(model, nextColor));
  };

  const onAdd = () => {
    if (!canAdd || !colorId || !sizeId) {
      setSelectionError(true);
      focusDecision();
      return;
    }
    const name = model.identity.name;
    const price = model.pricing.priceToman;
    if (!name || price === null) return;
    add({ slug: model.slug, name, price, color: colorId, size: sizeId, qty: 1 });
    toast.success("به سبد خرید اضافه شد", { description: `${name} — سایز ${sizeId}` });
    openDrawer();
  };

  return (
    <>
      <div className="flex min-w-0 flex-col gap-5 md:sticky md:top-20 md:self-start">
        <ProductIdentity model={model} />

        <div className="flex items-center justify-end border-t border-hairline pt-4">
          <button
            type="button"
            onClick={() => toggle(model.slug)}
            aria-pressed={liked}
            aria-label={liked ? "حذف محصول از علاقه‌مندی‌ها" : "افزودن محصول به علاقه‌مندی‌ها"}
            className="tap-target grid place-items-center border border-hairline text-bone hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <Heart
              size={18}
              aria-hidden="true"
              className={liked ? "fill-signal text-signal" : ""}
            />
          </button>
        </div>

        {model.colors.length > 0 ? (
          <ColorSelector colors={model.colors} selected={colorId} onSelect={chooseColor} />
        ) : null}

        <div ref={sizeRegionRef}>
          {model.sizes.length > 0 ? (
            <>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs text-metal">موجودی سایز بر اساس رنگ انتخابی</span>
                {model.measurements ? (
                  <SizeGuideDialog
                    productName={model.identity.name ?? "محصول"}
                    measurements={model.measurements}
                    model={model.model}
                    trigger={
                      <button
                        type="button"
                        className="min-h-11 text-xs font-semibold text-signal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                      >
                        راهنمای اندازه
                      </button>
                    }
                  />
                ) : null}
              </div>
              <SizeSelector
                sizes={model.sizes}
                selected={sizeId}
                availabilityFor={(candidate) => sizeAvailabilityForColor(model, candidate, colorId)}
                onSelect={(nextSize) => {
                  setSizeId(nextSize);
                  setSelectionError(false);
                }}
                describedBy={selectionError ? "pdp-selection-error" : undefined}
              />
            </>
          ) : null}
        </div>

        {!model.readyForCommerce ? (
          <StatePanel title="تصمیم خرید هنوز قابل تأیید نیست" tone="info">
            رنگ، سایز، قیمت و موجودی فقط زمانی به کنترل خرید تبدیل می‌شوند که منبع و بازبینی معتبر
            داشته باشند. این صفحه مقدار موقت را به‌عنوان واقعیت فروشگاه نمایش نمی‌دهد.
          </StatePanel>
        ) : null}

        {selectionError ? (
          <p
            id="pdp-selection-error"
            role="alert"
            className="text-xs font-semibold leading-6 text-signal"
          >
            {statusLabel}
          </p>
        ) : null}

        <div ref={addButtonRef}>
          <button
            type="button"
            onClick={onAdd}
            disabled={!canAdd}
            aria-describedby={!canAdd ? "pdp-purchase-status" : undefined}
            className={`${CtaClasses("signal")} min-h-14 w-full disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span>{canAdd ? "افزودن به سبد خرید" : "خرید در دسترس نیست"}</span>
          </button>
          <p
            id="pdp-purchase-status"
            className="mt-2 text-xs leading-6 text-metal"
            aria-live="polite"
          >
            {statusLabel}
          </p>
        </div>
      </div>

      <StickyBuyBar
        visible={stickyVisible}
        name={model.identity.name ?? "محصول"}
        price={model.pricing.priceToman}
        selectedColor={selectedColor?.label}
        selectedSize={sizeId}
        canAdd={canAdd}
        statusLabel={statusLabel}
        onAdd={onAdd}
      />
    </>
  );
}
