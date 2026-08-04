import { useCallback, useId, useRef, useState, type ReactNode } from "react";
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
import {
  activeCount,
  EMPTY_FILTERS,
  SORT_LABELS,
  type Filters,
  type SortKey,
} from "@/lib/product-filter";
import { fmtToman } from "@/lib/products";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
  filterSlot: ReactNode;
  lockedCategory?: boolean;
};

export function ProductGridControls({
  filters,
  onChange,
  resultCount,
  filterSlot,
  lockedCategory,
}: Props) {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetId = useId();
  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(open, sheetRef, close);
  const count = activeCount(filters);

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (!lockedCategory) {
    filters.cats.forEach((category) =>
      chips.push({
        key: `cat-${category}`,
        label: CATEGORIES[category as keyof typeof CATEGORIES]?.nameFa ?? category,
        onRemove: () =>
          onChange({ ...filters, cats: filters.cats.filter((item) => item !== category) }),
      }),
    );
  }
  filters.colors.forEach((color) =>
    chips.push({
      key: `color-${color}`,
      label: colorName(color),
      onRemove: () =>
        onChange({ ...filters, colors: filters.colors.filter((item) => item !== color) }),
    }),
  );
  filters.sizes.forEach((size) =>
    chips.push({
      key: `size-${size}`,
      label: `سایز ${size}`,
      onRemove: () =>
        onChange({ ...filters, sizes: filters.sizes.filter((item) => item !== size) }),
    }),
  );
  if (filters.max > 0) {
    chips.push({
      key: "max",
      label: `تا ${fmtToman(filters.max)}`,
      onRemove: () => onChange({ ...filters, max: 0 }),
    });
  }
  if (filters.instock) {
    chips.push({
      key: "instock",
      label: "فقط موجود",
      onRemove: () => onChange({ ...filters, instock: false }),
    });
  }
  if (filters.sale) {
    chips.push({
      key: "sale",
      label: "تخفیف‌دار",
      onRemove: () => onChange({ ...filters, sale: false }),
    });
  }

  return (
    <div dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" aria-atomic="true" className="tech text-metal">
          {resultCount.toLocaleString("fa-IR")} محصول
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={sheetId}
            className="tap-target inline-flex items-center gap-1.5 border border-hairline px-3 tech text-bone transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal lg:hidden"
          >
            <SlidersHorizontal size={14} aria-hidden="true" />
            فیلترها
            {count > 0 ? (
              <span className="num grid h-4 min-w-4 place-items-center bg-signal px-1 text-[10px] text-bone">
                {count}
              </span>
            ) : null}
          </button>

          <Select
            value={filters.sort}
            onValueChange={(value: string) => onChange({ ...filters, sort: value as SortKey })}
          >
            <SelectTrigger
              aria-label="مرتب‌سازی محصولات"
              className="h-11 w-[150px] rounded-none border-hairline bg-transparent text-xs text-bone"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <SelectItem key={key} value={key} className="text-xs">
                  {SORT_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="فیلترهای فعال">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              aria-label={`حذف فیلتر ${chip.label}`}
              className="flex min-h-10 items-center gap-1.5 border border-hairline px-3 py-1.5 text-xs text-metal transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              {chip.label}
              <X size={12} aria-hidden="true" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...EMPTY_FILTERS, sort: filters.sort })}
            className="min-h-10 tech text-signal underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            پاک کردن همه
          </button>
        </div>
      ) : null}

      {open ? (
        <div
          dir="rtl"
          className="fixed inset-0 z-[220] bg-obsidian/80 backdrop-blur-md lg:hidden"
          onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            id={sheetId}
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${sheetId}-title`}
            className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto border-t border-hairline bg-obsidian p-5 pb-8 safe-bottom"
          >
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <div id={`${sheetId}-title`}>
                <TechLabel tone="signal">فیلترها</TechLabel>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="بستن فیلترها"
                className="tap-target grid place-items-center text-metal hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5">{filterSlot}</div>
            <button type="button" onClick={close} className={`${CtaClasses("signal")} mt-6 w-full`}>
              نمایش {resultCount.toLocaleString("fa-IR")} محصول
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
