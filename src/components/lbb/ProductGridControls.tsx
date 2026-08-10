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
  filterSlot: (filters: Filters, onChange: (filters: Filters) => void) => ReactNode;
  getResultCount: (filters: Filters) => number;
  lockedCategory?: boolean;
  supportedSorts?: readonly SortKey[];
  categoryLabels?: Record<string, string>;
};

export function ProductGridControls({
  filters,
  onChange,
  resultCount,
  filterSlot,
  getResultCount,
  lockedCategory,
  supportedSorts,
  categoryLabels,
}: Props) {
  const [open, setOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetId = useId();
  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(open, sheetRef, close);
  const count = activeCount(filters);
  const draftCount = activeCount(draftFilters);
  const draftResultCount = getResultCount(draftFilters);
  const sortKeys = supportedSorts ?? (Object.keys(SORT_LABELS) as SortKey[]);

  const openFilters = () => {
    setDraftFilters(filters);
    setOpen(true);
  };

  const applyDraft = () => {
    onChange(draftFilters);
    close();
  };

  const resetDraft = () => {
    setDraftFilters({ ...EMPTY_FILTERS, sort: draftFilters.sort });
  };

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (!lockedCategory) {
    filters.cats.forEach((category) =>
      chips.push({
        key: `cat-${category}`,
        label:
          categoryLabels?.[category] ??
          CATEGORIES[category as keyof typeof CATEGORIES]?.nameFa ??
          category,
        onRemove: () =>
          onChange({ ...filters, cats: filters.cats.filter((item) => item !== category) }),
      }),
    );
  }
  filters.colors.forEach((color) =>
    chips.push({
      key: `color-${color}`,
      label: colorName(color) || color,
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
          {resultCount.toLocaleString("fa-IR")} نتیجه
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openFilters}
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
            value={sortKeys.includes(filters.sort) ? filters.sort : "newest"}
            onValueChange={(value: string) => onChange({ ...filters, sort: value as SortKey })}
          >
            <SelectTrigger
              aria-label="مرتب‌سازی محصولات"
              className="h-11 w-[158px] rounded-none border-hairline bg-transparent text-xs text-bone"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {sortKeys.map((key) => (
                <SelectItem key={key} value={key} className="text-xs">
                  {key === "best" ? "منتخب LBB" : SORT_LABELS[key]}
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
            aria-describedby={`${sheetId}-description`}
            className="absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto border-t border-hairline bg-obsidian p-5 pb-8 safe-bottom"
          >
            <div className="flex items-center justify-between gap-3 border-b border-hairline pb-4">
              <div>
                <div id={`${sheetId}-title`}>
                  <TechLabel tone="signal">فیلتر محصولات</TechLabel>
                </div>
                <p id={`${sheetId}-description`} className="mt-1 text-xs text-metal">
                  تغییرات پس از انتخاب «اعمال فیلترها» ثبت می‌شوند.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="بستن فیلترها بدون اعمال تغییرات"
                className="tap-target grid shrink-0 place-items-center text-metal hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="tech text-metal">
                {draftResultCount.toLocaleString("fa-IR")} نتیجه پیش‌نمایش
              </p>
              {draftCount > 0 ? (
                <button
                  type="button"
                  onClick={resetDraft}
                  className="min-h-10 text-xs text-signal underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  پاک کردن فیلترها
                </button>
              ) : null}
            </div>

            <div className="mt-5">{filterSlot(draftFilters, setDraftFilters)}</div>
            <div className="sticky bottom-0 mt-6 border-t border-hairline bg-obsidian pt-4">
              <button
                type="button"
                onClick={applyDraft}
                className={`${CtaClasses("signal")} w-full`}
              >
                اعمال فیلترها · {draftResultCount.toLocaleString("fa-IR")} نتیجه
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
