import { ShoppingBag } from "lucide-react";
import { fmtToman } from "@/lib/products";

export function StickyBuyBar({
  visible,
  name,
  price,
  inStock,
  onAdd,
}: {
  visible: boolean;
  name: string;
  price: number;
  inStock: boolean;
  onAdd: () => void;
}) {
  return (
    <div
      dir="rtl"
      className={`fixed inset-x-0 z-[140] border-t border-black/[0.06] bg-white/95 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        bottom: "calc(64px + env(safe-area-inset-bottom))",
        fontFamily: "'Vazirmatn', sans-serif",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-gray-500">{name}</p>
          <p className="text-sm font-bold font-display">
            {fmtToman(price)}
          </p>
        </div>
        <button
          onClick={onAdd}
          disabled={!inStock}
          className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[var(--lbb-red)] px-4 text-xs font-bold text-white disabled:opacity-50"
        >
          <ShoppingBag size={16} />
          {inStock ? "افزودن به سبد" : "ناموجود"}
        </button>
      </div>
    </div>
  );
}
