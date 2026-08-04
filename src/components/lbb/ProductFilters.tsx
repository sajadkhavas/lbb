import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { colorName } from "@/lib/color-names";
import type { Filters } from "@/lib/product-filter";
import { fmtToman, type CategorySlug } from "@/lib/products";
import { TechLabel } from "@/components/lbb/ui/primitives";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  colors: string[];
  sizes: string[];
  priceCeil: number;
  showCategory?: boolean;
};

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function ProductFilters({
  filters,
  onChange,
  colors,
  sizes,
  priceCeil,
  showCategory,
}: Props) {
  const effectiveMax = filters.max > 0 ? Math.min(filters.max, priceCeil) : priceCeil;
  const [draftMax, setDraftMax] = useState<number | null>(null);
  const displayedMax = draftMax ?? effectiveMax;

  const commitMax = (value: number) => {
    setDraftMax(null);
    const normalized = value >= priceCeil ? 0 : Math.max(0, Math.floor(value));
    if (normalized !== filters.max) onChange({ ...filters, max: normalized });
  };

  return (
    <div dir="rtl" className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={15} className="text-signal" aria-hidden="true" />
        <TechLabel tone="signal">فیلترها</TechLabel>
      </div>

      {showCategory ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="tech mb-1 text-metal">دسته‌بندی</legend>
          {CATEGORY_SLUGS.map((slug: CategorySlug) => (
            <label
              key={slug}
              className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-bone"
            >
              <Checkbox
                checked={filters.cats.includes(slug)}
                onCheckedChange={() =>
                  onChange({ ...filters, cats: toggleValue(filters.cats, slug) })
                }
              />
              {CATEGORIES[slug].nameFa}
            </label>
          ))}
        </fieldset>
      ) : null}

      {colors.length > 0 ? (
        <fieldset>
          <legend className="tech mb-3 text-metal">رنگ</legend>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const active = filters.colors.includes(color);
              const label = colorName(color);
              return (
                <button
                  key={color}
                  type="button"
                  title={label}
                  aria-label={`${active ? "حذف" : "انتخاب"} رنگ ${label}`}
                  aria-pressed={active}
                  onClick={() =>
                    onChange({ ...filters, colors: toggleValue(filters.colors, color) })
                  }
                  className="tap-target relative grid place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <span
                    aria-hidden="true"
                    className="h-7 w-7 rounded-full border transition-transform hover:scale-110"
                    style={{
                      background: color,
                      borderColor: active ? "var(--lbb-signal)" : "var(--lbb-hairline)",
                      boxShadow: active ? "0 0 0 2px var(--lbb-signal)" : "none",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {sizes.length > 0 ? (
        <fieldset>
          <legend className="tech mb-3 text-metal">سایز موجود</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={active}
                  aria-label={`${active ? "حذف" : "انتخاب"} فیلتر سایز ${size}`}
                  onClick={() => onChange({ ...filters, sizes: toggleValue(filters.sizes, size) })}
                  className={`size-chip focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                    active ? "border-signal bg-signal text-obsidian" : "hover:border-bone"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="tech mb-3 flex w-full items-center justify-between gap-3 text-metal">
          <span>حداکثر قیمت</span>
          <output className="num text-bone" aria-live="polite">
            {fmtToman(displayedMax)}
          </output>
        </legend>
        <Slider
          dir="ltr"
          min={0}
          max={priceCeil}
          step={50000}
          aria-label="حداکثر قیمت"
          value={[displayedMax]}
          onValueChange={([value]) => setDraftMax(value)}
          onValueCommit={([value]) => commitMax(value)}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">وضعیت کالا</legend>
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-bone">
          <Checkbox
            checked={filters.instock}
            onCheckedChange={(value) => onChange({ ...filters, instock: value === true })}
          />
          فقط کالاهای موجود
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-bone">
          <Checkbox
            checked={filters.sale}
            onCheckedChange={(value) => onChange({ ...filters, sale: value === true })}
          />
          فقط تخفیف‌دارها
        </label>
      </fieldset>
    </div>
  );
}
