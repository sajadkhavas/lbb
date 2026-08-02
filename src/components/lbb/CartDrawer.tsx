import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { fmtToman } from "@/lib/products";
import { productImage } from "@/lib/product-images";

export function CartDrawer() {
  const { lines, drawerOpen, closeDrawer, setQty, remove, subtotal, count } =
    useCart();

  const panelRef = useRef<HTMLDivElement>(null);
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
            <ShoppingBag size={18} strokeWidth={1.7} />
            سبد خرید
            <span className="rounded-full bg-[var(--lbb-red)] px-2 py-0.5 text-[11px] font-bold text-white">
              {count}
            </span>
          </h2>
          <button onClick={closeDrawer} aria-label="بستن" className="p-1">
            <X size={20} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={44} strokeWidth={1} className="text-black/15" />
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
                {lines.map((l, i) => (
                  <li key={`${l.slug}-${l.color}-${l.size}`} className="flex gap-3">
                    <Link
                      to="/product/$slug"
                      params={{ slug: l.slug }}
                      onClick={closeDrawer}
                      className="shrink-0"
                    >
                      <img
                        src={productImage(l.slug)}
                        alt={l.name}
                        width={80}
                        height={100}
                        loading="lazy"
                        decoding="async"
                        className="h-[100px] w-20 rounded-md border border-black/[0.06] object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-[13px] font-semibold">{l.name}</h3>
                        <button
                          onClick={() => remove(i)}
                          aria-label="حذف"
                          className="p-1 text-gray-400 hover:text-[var(--lbb-red)]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        {l.size ? `سایز ${l.size}` : ""}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-black/12">
                          <button
                            aria-label="کاهش"
                            onClick={() => setQty(i, l.qty - 1)}
                            className="grid h-7 w-7 place-items-center"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-7 text-center text-xs">{l.qty}</span>
                          <button
                            aria-label="افزایش"
                            onClick={() => setQty(i, l.qty + 1)}
                            className="grid h-7 w-7 place-items-center"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span
                          className="text-[13px] font-bold font-display"
                        >
                          {fmtToman(l.price * l.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-black/[0.07] px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">جمع کل</span>
                <span
                  className="text-lg font-bold font-display"
                >
                  {fmtToman(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-gray-400">
                هزینه ارسال در مرحله پرداخت محاسبه می‌شود
              </p>
              <Link
                to="/checkout"
                onClick={closeDrawer}
                className="mt-3 flex h-12 items-center justify-center rounded-lg bg-[var(--lbb-red)] text-sm font-bold text-white hover:brightness-110"
              >
                ادامه و پرداخت
              </Link>
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="mt-2 flex h-11 items-center justify-center rounded-lg border border-black/12 text-xs font-semibold"
              >
                مشاهده سبد خرید
              </Link>
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
