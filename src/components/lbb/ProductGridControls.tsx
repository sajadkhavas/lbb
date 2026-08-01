import { useState, type ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { activeCount, EMPTY_FILTERS, SORT_LABELS, type Filters, type SortKey } from "@/lib/product-filter";
import { fmtToman } from "@/lib/products";
import { colorLabel } from "@/components/lbb/ProductFilters";

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  resultCount: number;
  filterSlot: ReactNode;
  lockedCategory?: boolean;
};

export function ProductGridControls({ filters, onChange, resultCount, filterSlot, lockedCategory }: Props) {
  const [open, setOpen] = useState(false);
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
      label: colorLabel(c),
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
    chips.push({
      key: "max",
      label: `تا ${fmtToman(filters.max)}`,
      onRemove: () => onChange({ ...filters, max: 0 }),
    });
  }
  if (filters.instock) {
    chips.push({ key: "instock", label: "فقط موجود", onRemove: () => onChange({ ...filters, instock: false }) });
  }
  if (filters.sale) {
    chips.push({ key: "sale", label: "تخفیف‌دار", onRemove: () => onChange({ ...filters, sale: false }) });
  }

  return (
    <div dir="rtl" className="font-body">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{resultCount.toLocaleString("fa-IR")} محصول</p>
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="h-10 gap-1.5 rounded-lg border-black/15 text-xs font-semibold lg:hidden"
              >
                <SlidersHorizontal size={14} />
                فیلترها
                {count > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[var(--lbb-red)] px-1 text-[10px] text-white">
                    {count}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" dir="rtl" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="text-right font-body">
                  فیلترها
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4">{filterSlot}</div>
              <SheetClose asChild>
                <Button className="mt-6 w-full bg-[var(--lbb-red)] text-white hover:bg-[var(--lbb-red)]/90">
                  نمایش {resultCount.toLocaleString("fa-IR")} محصول
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>

          <Select value={filters.sort} onValueChange={(v) => onChange({ ...filters, sort: v as SortKey })}>
            <SelectTrigger className="h-10 w-[150px] rounded-lg border-black/15 text-xs font-semibold" dir="rtl">
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
              className="flex items-center gap-1.5 rounded-full border border-black/15 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-[var(--lbb-red)] hover:text-[var(--lbb-red)]"
            >
              {c.label}
              <X size={12} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...EMPTY_FILTERS, sort: filters.sort })}
            className="text-xs font-semibold text-[var(--lbb-red)] underline underline-offset-2"
          >
            پاک کردن همه
          </button>
        </div>
      )}
    </div>
  );
}
