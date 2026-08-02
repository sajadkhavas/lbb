import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { colorName } from "@/lib/color-names";
import type { Filters } from "@/lib/product-filter";
import { fmtToman, type CategorySlug } from "@/lib/products";
import { TechLabel } from "@/components/lbb/ui/primitives";

export { colorName as colorLabel };

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
    <div dir="rtl" className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={15} className="text-signal" aria-hidden="true" />
        <TechLabel tone="signal">فیلترها</TechLabel>
      </div>

      {showCategory && (
        <fieldset className="flex flex-col gap-3">
          <legend className="tech mb-1 text-metal">دسته‌بندی</legend>
          {CATEGORY_SLUGS.map((s: CategorySlug) => (
            <label key={s} className="flex cursor-pointer items-center gap-2.5 text-sm text-bone">
              <Checkbox
                checked={filters.cats.includes(s)}
                onCheckedChange={() => onChange({ ...filters, cats: toggleValue(filters.cats, s) })}
              />
              {CATEGORIES[s].nameFa}
            </label>
          ))}
        </fieldset>
      )}

      <fieldset>
        <legend className="tech mb-3 text-metal">رنگ</legend>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((c) => {
            const active = filters.colors.includes(c);
            return (
              <button
                key={c}
                type="button"
                title={colorName(c)}
                aria-label={colorName(c)}
                aria-pressed={active}
                onClick={() => onChange({ ...filters, colors: toggleValue(filters.colors, c) })}
                className="tap-target relative grid place-items-center"
              >
                <span
                  className="h-7 w-7 rounded-full border transition-transform hover:scale-110"
                  style={{
                    background: c,
                    borderColor: active ? "var(--lbb-signal)" : "var(--lbb-hairline)",
                    boxShadow: active ? "0 0 0 2px var(--lbb-signal)" : "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="tech mb-3 text-metal">سایز</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = filters.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...filters, sizes: toggleValue(filters.sizes, s) })}
                className={`size-chip ${active ? "border-signal bg-signal text-bone" : "hover:border-bone"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="tech mb-3 flex w-full items-center justify-between text-metal">
          <span>حداکثر قیمت</span>
          <span className="num text-bone">
            {filters.max > 0 ? fmtToman(filters.max) : fmtToman(priceCeil)}
          </span>
        </legend>
        <Slider
          dir="ltr"
          min={0}
          max={priceCeil}
          step={50000}
          aria-label="حداکثر قیمت"
          value={[filters.max > 0 ? filters.max : priceCeil]}
          onValueChange={([v]) => onChange({ ...filters, max: v >= priceCeil ? 0 : v })}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">وضعیت موجودی</legend>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-bone">
          <Checkbox
            checked={filters.instock}
            onCheckedChange={(v) => onChange({ ...filters, instock: v === true })}
          />
          فقط کالاهای موجود
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-bone">
          <Checkbox
            checked={filters.sale}
            onCheckedChange={(v) => onChange({ ...filters, sale: v === true })}
          />
          فقط تخفیف‌دارها
        </label>
      </fieldset>
    </div>
  );
}
