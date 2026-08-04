import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_THRESHOLD, shippingFeeFor } from "@/lib/commerce";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { fmtToman } from "@/lib/products";
import { productImage } from "@/lib/product-images";

export function CartDrawer() {
  const { lines, drawerOpen, closeDrawer, setQty, remove, subtotal, count, hydrated } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const shipping = shippingFeeFor(subtotal);
  const total = subtotal + shipping;

  useFocusTrap(drawerOpen, panelRef, closeDrawer);
  if (!drawerOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[300] font-body"
      role="dialog"
      aria-modal="true"
      aria-label="سبد خرید"
    >
      <button
        type="button"
        aria-label="بستن سبد"
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        style={{ animation: "lbb-fade 0.2s ease" }}
      />
      <aside
        ref={panelRef}
        className="absolute inset-y-0 left-0 flex w-full max-w-[400px] flex-col bg-white text-black shadow-2xl"
        style={{ animation: "lbb-drawer-in 0.32s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <header className="flex items-center justify-between border-b border-black/[0.07] px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <ShoppingBag size={18} strokeWidth={1.7} aria-hidden="true" />
            سبد خرید
            <span className="rounded-full bg-[var(--lbb-red)] px-2 py-0.5 text-[11px] font-bold text-white">
              {hydrated ? count.toLocaleString("fa-IR") : "…"}
            </span>
          </h2>
          <button type="button" onClick={closeDrawer} aria-label="بستن" className="p-1">
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {!hydrated ? (
          <div
            className="flex flex-1 items-center justify-center text-sm text-gray-500"
            role="status"
          >
            در حال خواندن سبد…
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={44} strokeWidth={1} className="text-black/15" aria-hidden="true" />
            <p className="text-sm text-gray-500">سبد خرید شما خالی است</p>
            <Link
              to="/shop"
              onClick={closeDrawer}
              className="rounded-md bg-[var(--lbb-red)] px-6 py-3 text-xs font-bold text-white"
            >
              شروع خرید
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {lines.map((line, index) => (
                  <li
                    key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}`}
                    className="flex gap-3"
                  >
                    <Link
                      to="/product/$slug"
                      params={{ slug: line.slug }}
                      onClick={closeDrawer}
                      className="shrink-0"
                    >
                      <img
                        src={productImage(line.slug)}
                        alt={line.name}
                        width={80}
                        height={100}
                        loading="lazy"
                        decoding="async"
                        className="h-[100px] w-20 rounded-md border border-black/[0.06] object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-[13px] font-semibold">{line.name}</h3>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          aria-label={`حذف ${line.name}`}
                          className="p-1 text-gray-400 hover:text-[var(--lbb-red)]"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        {line.size ? `سایز ${line.size}` : ""}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-black/12">
                          <button
                            type="button"
                            aria-label={`کاهش تعداد ${line.name}`}
                            onClick={() => setQty(index, line.qty - 1)}
                            className="grid h-7 w-7 place-items-center"
                          >
                            <Minus size={13} aria-hidden="true" />
                          </button>
                          <span className="w-7 text-center text-xs" aria-live="polite">
                            {line.qty.toLocaleString("fa-IR")}
                          </span>
                          <button
                            type="button"
                            aria-label={`افزایش تعداد ${line.name}`}
                            onClick={() => setQty(index, line.qty + 1)}
                            className="grid h-7 w-7 place-items-center"
                          >
                            <Plus size={13} aria-hidden="true" />
                          </button>
                        </div>
                        <span className="font-display text-[13px] font-bold">
                          {fmtToman(line.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-black/[0.07] px-5 py-4">
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <span>جمع کالاها</span>
                  <span>{fmtToman(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ارسال نمایشی</span>
                  <span>{shipping === 0 ? "رایگان" : fmtToman(shipping)}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-black/[0.07] pt-3 text-sm">
                <span className="text-gray-500">جمع نمایشی</span>
                <span className="font-display text-lg font-bold">{fmtToman(total)}</span>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD ? (
                <p className="mt-1 text-[11px] leading-5 text-gray-400">
                  ارسال رایگان نمایشی از {fmtToman(FREE_SHIPPING_THRESHOLD)}
                </p>
              ) : null}
              <Link
                to="/checkout"
                onClick={closeDrawer}
                className="mt-3 flex h-12 items-center justify-center rounded-lg bg-[var(--lbb-red)] text-sm font-bold text-white hover:brightness-110"
              >
                ساخت پیش‌نمایش سفارش
              </Link>
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="mt-2 flex h-11 items-center justify-center rounded-lg border border-black/12 text-xs font-semibold"
              >
                مشاهده سبد خرید
              </Link>
              <p className="mt-3 text-center text-[10px] leading-5 text-gray-400">
                هیچ پرداخت یا سفارش واقعی در این نسخه انجام نمی‌شود.
              </p>
            </footer>
          </>
        )}
      </aside>
      <style>{`
        @keyframes lbb-drawer-in { from { transform: translateX(-100%); } to { transform: none; } }
        @keyframes lbb-fade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
