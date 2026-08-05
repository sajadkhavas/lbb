import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD, shippingFeeFor } from "@/lib/commerce";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { fmtToman } from "@/lib/products";
import { productImage } from "@/lib/product-images";
import { CtaClasses, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";

export function CartDrawer() {
  const {
    lines,
    drawerOpen,
    closeDrawer,
    dismissDrawer,
    setQty,
    remove,
    subtotal,
    count,
    hydrated,
  } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const shipping = shippingFeeFor(subtotal);
  const total = subtotal + shipping;

  useFocusTrap(drawerOpen, panelRef, closeDrawer);
  if (!drawerOpen) return null;

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="سبد خرید"
      className="fixed inset-0 z-[var(--z-modal)] font-body"
    >
      <button
        type="button"
        aria-label="بستن سبد"
        onClick={closeDrawer}
        className="absolute inset-0 bg-[var(--lbb-surface-overlay)] backdrop-blur-sm"
      />
      <aside
        ref={panelRef}
        className="absolute inset-y-0 left-0 flex w-full max-w-[430px] flex-col border-r border-hairline bg-obsidian text-bone shadow-overlay"
      >
        <header className="flex min-h-16 items-center justify-between border-b border-hairline px-4 md:px-6">
          <div>
            <TechLabel tone="signal">CART / LOCAL</TechLabel>
            <h2 className="mt-1 flex items-center gap-2 text-sm font-black">
              <ShoppingBag size={17} aria-hidden="true" />
              سبد خرید
              <span className="num bg-signal px-2 py-0.5 text-[10px] text-obsidian">
                {hydrated ? count.toLocaleString("fa-IR") : "…"}
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="بستن سبد خرید"
            className="tap-target grid place-items-center border border-hairline text-bone transition-colors hover:border-signal hover:text-signal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {!hydrated ? (
          <div className="flex flex-1 items-center justify-center" role="status">
            <p className="text-sm text-metal">در حال خواندن سبد…</p>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <span className="grid h-16 w-16 place-items-center border border-hairline text-mute">
              <ShoppingBag size={28} strokeWidth={1.3} aria-hidden="true" />
            </span>
            <div>
              <p className="text-title text-bone">سبد خالی است</p>
              <p className="mt-2 text-sm leading-7 text-metal">
                محصول و Variant انتخاب‌شده در همین مرورگر نگه‌داری می‌شود.
              </p>
            </div>
            <Link to="/shop" onClick={dismissDrawer} className={CtaClasses("signal")}>
              شروع خرید
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
              <ul className="space-y-5">
                {lines.map((line, index) => (
                  <li
                    key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}`}
                    className="grid grid-cols-[76px_minmax(0,1fr)] gap-3 border-b border-hairline-soft pb-5"
                  >
                    <Link
                      to="/product/$slug"
                      params={{ slug: line.slug }}
                      onClick={dismissDrawer}
                      className="overflow-hidden bg-carbon"
                    >
                      <img
                        src={productImage(line.slug)}
                        alt={line.name}
                        width={76}
                        height={95}
                        loading="lazy"
                        decoding="async"
                        className="h-[95px] w-[76px] object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="line-clamp-2 text-sm font-bold text-bone">{line.name}</h3>
                          <p className="mt-1 text-[11px] text-mute">
                            {[
                              line.size ? `سایز ${line.size}` : "",
                              line.color ? "رنگ انتخاب‌شده" : "",
                            ]
                              .filter(Boolean)
                              .join(" / ")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          aria-label={`حذف ${line.name}`}
                          className="tap-target grid shrink-0 place-items-center text-mute transition-colors hover:text-danger"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex items-center border border-hairline">
                          <button
                            type="button"
                            aria-label={`کاهش تعداد ${line.name}`}
                            onClick={() => setQty(index, line.qty - 1)}
                            disabled={line.qty <= 1}
                            className="grid h-9 w-9 place-items-center text-bone disabled:opacity-35"
                          >
                            <Minus size={13} aria-hidden="true" />
                          </button>
                          <output className="num w-8 text-center text-xs" aria-live="polite">
                            {line.qty.toLocaleString("fa-IR")}
                          </output>
                          <button
                            type="button"
                            aria-label={`افزایش تعداد ${line.name}`}
                            onClick={() => setQty(index, line.qty + 1)}
                            className="grid h-9 w-9 place-items-center text-bone"
                          >
                            <Plus size={13} aria-hidden="true" />
                          </button>
                        </div>
                        <span className="num text-sm font-bold text-bone">
                          {fmtToman(line.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-hairline bg-carbon px-4 py-5 md:px-6">
              <dl className="space-y-2 text-xs text-metal">
                <div className="flex items-center justify-between gap-4">
                  <dt>جمع کالاها</dt>
                  <dd className="num text-bone">{fmtToman(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>ارسال نمایشی</dt>
                  <dd className="num text-bone">
                    {shipping === 0 ? "رایگان" : fmtToman(shipping)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-hairline pt-3 text-sm">
                  <dt className="font-bold text-bone">جمع نمایشی</dt>
                  <dd className="num text-lg font-black text-bone">{fmtToman(total)}</dd>
                </div>
              </dl>
              {subtotal < FREE_SHIPPING_THRESHOLD ? (
                <p className="mt-2 text-[11px] leading-5 text-mute">
                  ارسال رایگان نمایشی از {fmtToman(FREE_SHIPPING_THRESHOLD)}
                </p>
              ) : null}
              <Link
                to="/checkout"
                onClick={dismissDrawer}
                className={`${CtaClasses("signal")} mt-4 w-full`}
              >
                ساخت پیش‌نمایش سفارش
              </Link>
              <Link
                to="/cart"
                onClick={dismissDrawer}
                className={`${CtaClasses("line")} mt-2 w-full`}
              >
                مشاهده صفحه سبد
              </Link>
              <StatePanel title="عملیات واقعی انجام نمی‌شود" tone="info" className="mt-4">
                پرداخت و ثبت سفارش Backend در این نسخه فعال نیست.
              </StatePanel>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
