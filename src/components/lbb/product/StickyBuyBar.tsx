import { ShoppingBag } from "lucide-react";
import { fmtToman } from "@/lib/products";
import { CtaClasses } from "@/components/lbb/ui/primitives";

export function StickyBuyBar({
  visible,
  name,
  price,
  inStock,
  selectedSize,
  onAdd,
}: {
  visible: boolean;
  name: string;
  price: number;
  inStock: boolean;
  selectedSize?: string;
  onAdd: () => void;
}) {
  return (
    <div
      dir="rtl"
      aria-hidden={!visible}
      className={`safe-bottom fixed inset-x-0 z-[140] border-t border-hairline bg-obsidian/95 backdrop-blur-xl transition-transform duration-300 ease-[var(--ease-lbb)] md:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
      style={{ bottom: "calc(60px + env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-metal">{name}</p>
          <p className="num text-sm font-bold text-bone">{fmtToman(price)}</p>
          {inStock ? <p className={`text-[10px] ${selectedSize ? "text-metal" : "text-signal"}`}>{selectedSize ? `سایز ${selectedSize}` : "ابتدا سایز را انتخاب کنید"}</p> : null}
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={!inStock}
          tabIndex={visible ? 0 : -1}
          className={`${CtaClasses("signal")} h-11 shrink-0 text-[11px]`}
        >
          <ShoppingBag size={16} aria-hidden="true" />
          {inStock ? "افزودن به سبد" : "ناموجود"}
        </button>
      </div>
    </div>
  );
}
