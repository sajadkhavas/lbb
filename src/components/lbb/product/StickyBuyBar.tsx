import { ShoppingBag } from "lucide-react";
import { fmtToman } from "@/lib/products";
import { CtaClasses } from "@/components/lbb/ui/primitives";

export function StickyBuyBar({
  visible,
  name,
  price,
  selectedColor,
  selectedSize,
  canAdd,
  statusLabel,
  onAdd,
}: {
  visible: boolean;
  name: string;
  price: number | null;
  selectedColor?: string | null;
  selectedSize?: string | null;
  canAdd: boolean;
  statusLabel: string;
  onAdd: () => void;
}) {
  return (
    <div
      dir="rtl"
      aria-hidden={!visible}
      data-testid="pdp-sticky-buy-bar"
      className={`fixed inset-x-0 z-[140] border-t border-hairline bg-obsidian/95 backdrop-blur-xl transition-transform duration-300 ease-[var(--ease-lbb)] motion-reduce:transition-none md:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
      style={{ bottom: "calc(60px + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-screen-sm items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-metal">{name}</p>
          {price !== null ? <p className="num text-sm font-bold text-bone">{fmtToman(price)}</p> : null}
          <p className={`text-[10px] leading-5 ${canAdd ? "text-metal" : "text-signal"}`}>
            {selectedColor && selectedSize ? `${selectedColor} · سایز ${selectedSize}` : statusLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={!canAdd}
          tabIndex={visible ? 0 : -1}
          className={`${CtaClasses("signal")} min-h-11 shrink-0 text-[11px] disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <ShoppingBag size={16} aria-hidden="true" />
          {canAdd ? "افزودن به سبد" : "انتخاب تکمیل نشده"}
        </button>
      </div>
    </div>
  );
}
