import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import type { Filters } from "@/lib/product-filter";
import { fmtToman, type CategorySlug } from "@/lib/products";

export const COLOR_LABELS: Record<string, string> = {
  "#0A0A0A": "مشکی",
  "#FFFFFF": "سفید",
  "#E8001D": "قرمز",
  "#888": "طوسی",
  "#1a3c6e": "سرمه‌ای",
};

export function colorLabel(hex: string) {
  return COLOR_LABELS[hex] ?? hex;
}

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  colors: string[];
  sizes: string[];
  priceCeil: number;
  showCategory?: boolean;
};

function toggleValue(list: string[], v: string): string[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export function ProductFilters({ filters, onChange, colors, sizes, priceCeil, showCategory }: Props) {
  return (
    <div dir="rtl" className="flex flex-col gap-7 font-body">
      <div className="flex items-center gap-2 text-sm font-bold text-black">
        <SlidersHorizontal size={16} className="text-[var(--lbb-red)]" />
        فیلترها
      </div>

      {showCategory && (
        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">دسته‌بندی</h3>
          <div className="flex flex-col gap-2.5">
            {CATEGORY_SLUGS.map((s: CategorySlug) => (
              <label key={s} className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
                <Checkbox
                  checked={filters.cats.includes(s)}
                  onCheckedChange={() => onChange({ ...filters, cats: toggleValue(filters.cats, s) })}
                />
                {CATEGORIES[s].nameFa}
              </label>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">رنگ</h3>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((c) => {
            const active = filters.colors.includes(c);
            return (
              <button
                key={c}
                type="button"
                title={colorLabel(c)}
                aria-label={colorLabel(c)}
                aria-pressed={active}
                onClick={() => onChange({ ...filters, colors: toggleValue(filters.colors, c) })}
                className="relative h-8 w-8 rounded-full border border-black/15 transition-transform hover:scale-110"
                style={{ background: c, outline: active ? "2px solid var(--lbb-red)" : "none", outlineOffset: 2 }}
              />
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">سایز</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = filters.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ ...filters, sizes: toggleValue(filters.sizes, s) })}
                className={`h-9 min-w-[36px] rounded-lg border px-2.5 text-xs font-semibold transition-colors ${
                  active
                    ? "border-[var(--lbb-red)] bg-[var(--lbb-red)] text-white"
                    : "border-black/15 text-gray-700 hover:border-black/40"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-gray-500">
          <span>حداکثر قیمت</span>
          <span className="text-black normal-case font-display">
            {filters.max > 0 ? fmtToman(filters.max) : fmtToman(priceCeil)}
          </span>
        </h3>
        <Slider
          dir="ltr"
          min={0}
          max={priceCeil}
          step={50000}
          value={[filters.max > 0 ? filters.max : priceCeil]}
          onValueChange={([v]) => onChange({ ...filters, max: v >= priceCeil ? 0 : v })}
        />
      </section>

      <section className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
          <Checkbox
            checked={filters.instock}
            onCheckedChange={(v) => onChange({ ...filters, instock: v === true })}
          />
          فقط کالاهای موجود
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
          <Checkbox
            checked={filters.sale}
            onCheckedChange={(v) => onChange({ ...filters, sale: v === true })}
          />
          فقط تخفیف‌دارها
        </label>
      </section>
    </div>
  );
}
