import { useRef, useState, type ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { colorName } from "@/lib/color-names";
import { activeCount, EMPTY_FILTERS, SORT_LABELS, type Filters, type SortKey } from "@/lib/product-filter";
import { fmtToman } from "@/lib/products";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  resultCount: number;
  filterSlot: ReactNode;
  lockedCategory?: boolean;
};

export function ProductGridControls({ filters, onChange, resultCount, filterSlot, lockedCategory }: Props) {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  useFocusTrap(open, sheetRef, close);
  const count = activeCount(filters);

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (!lockedCategory) {
    filters.cats.forEach((c) =>
      chips.push({
        key: `cat-${c}`,
        label: CATEGORIES[c as keyof typeof CATEGORIES]?.nameFa ?? c,
        onRemove: () => onChange({ ...filters, cats: filters.cats.filter((x) => x !== c) }),
      }),
    );
  }
  filters.colors.forEach((c) =>
    chips.push({
      key: `color-${c}`,
      label: colorName(c),
      onRemove: () => onChange({ ...filters, colors: filters.colors.filter((x) => x !== c) }),
    }),
  );
  filters.sizes.forEach((s) =>
    chips.push({
      key: `size-${s}`,
      label: `سایز ${s}`,
      onRemove: () => onChange({ ...filters, sizes: filters.sizes.filter((x) => x !== s) }),
    }),
  );
  if (filters.max > 0) {
    chips.push({ key: "max", label: `تا ${fmtToman(filters.max)}`, onRemove: () => onChange({ ...filters, max: 0 }) });
  }
  if (filters.instock) {
    chips.push({ key: "instock", label: "فقط موجود", onRemove: () => onChange({ ...filters, instock: false }) });
  }
  if (filters.sale) {
    chips.push({ key: "sale", label: "تخفیف‌دار", onRemove: () => onChange({ ...filters, sale: false }) });
  }

  return (
    <div dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="tech text-metal">
          {resultCount.toLocaleString("fa-IR")} محصول
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="tap-target inline-flex items-center gap-1.5 border border-hairline px-3 tech text-bone transition-colors hover:border-signal hover:text-signal lg:hidden"
          >
            <SlidersHorizontal size={14} aria-hidden="true" />
            فیلترها
            {count > 0 && (
              <span className="num grid h-4 min-w-4 place-items-center bg-signal px-1 text-[10px] text-bone">
                {count}
              </span>
            )}
          </button>

          <Select value={filters.sort} onValueChange={(v) => onChange({ ...filters, sort: v as SortKey })}>
            <SelectTrigger aria-label="مرتب‌سازی" className="h-11 w-[150px] rounded-none border-hairline bg-transparent text-xs text-bone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <SelectItem key={k} value={k} className="text-xs">
                  {SORT_LABELS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.onRemove}
              aria-label={`حذف فیلتر ${c.label}`}
              className="flex items-center gap-1.5 border border-hairline px-3 py-1.5 text-xs text-metal transition-colors hover:border-signal hover:text-signal"
            >
              {c.label}
              <X size={12} aria-hidden="true" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...EMPTY_FILTERS, sort: filters.sort })}
            className="tech text-signal underline underline-offset-4"
          >
            پاک کردن همه
          </button>
        </div>
      )}

      {open && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[220] bg-obsidian/80 backdrop-blur-md lg:hidden"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="فیلترها"
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto border-t border-hairline bg-obsidian p-5 pb-8 safe-bottom"
          >
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <TechLabel tone="signal">فیلترها</TechLabel>
              <button
                type="button"
                onClick={close}
                aria-label="بستن فیلترها"
                className="tap-target grid place-items-center text-metal hover:text-bone"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5">{filterSlot}</div>
            <button
              type="button"
              onClick={close}
              className={`${CtaClasses("signal")} mt-6 w-full`}
            >
              نمایش {resultCount.toLocaleString("fa-IR")} محصول
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
