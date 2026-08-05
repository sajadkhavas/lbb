import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { colorName } from "@/lib/color-names";
import type { FacetCounts } from "@/lib/catalog-discovery";
import type { Filters } from "@/lib/product-filter";
import { fmtToman, type CategorySlug } from "@/lib/products";
import { TechLabel } from "@/components/lbb/ui/primitives";

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  colors: readonly string[];
  sizes: readonly string[];
  priceCeil: number;
  showCategory?: boolean;
  facetCounts?: FacetCounts;
};

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function isUnavailable(active: boolean, count: number | undefined) {
  return !active && count === 0;
}

function FacetCount({ value }: { value: number | undefined }) {
  if (value === undefined) return null;
  return (
    <span className="num ms-auto text-[10px] text-mute" aria-hidden="true">
      {value.toLocaleString("fa-IR")}
    </span>
  );
}

export function ProductFilters({
  filters,
  onChange,
  colors,
  sizes,
  priceCeil,
  showCategory,
  facetCounts,
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
        <fieldset className="flex flex-col gap-2">
          <legend className="tech mb-1 text-metal">دسته‌بندی</legend>
          {CATEGORY_SLUGS.map((slug: CategorySlug) => {
            const active = filters.cats.includes(slug);
            const count = facetCounts?.categories[slug];
            const unavailable = isUnavailable(active, count);
            return (
              <label
                key={slug}
                className={`flex min-h-11 items-center gap-2.5 text-sm ${
                  unavailable
                    ? "cursor-not-allowed text-mute opacity-55"
                    : "cursor-pointer text-bone"
                }`}
              >
                <Checkbox
                  checked={active}
                  disabled={unavailable}
                  onCheckedChange={() =>
                    onChange({ ...filters, cats: toggleValue(filters.cats, slug) })
                  }
                />
                <span>{CATEGORIES[slug].nameFa}</span>
                <FacetCount value={count} />
              </label>
            );
          })}
        </fieldset>
      ) : null}

      {colors.length > 0 ? (
        <fieldset>
          <legend className="tech mb-3 text-metal">رنگ</legend>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const active = filters.colors.includes(color);
              const label = colorName(color);
              const count = facetCounts?.colors[color];
              const unavailable = isUnavailable(active, count);
              return (
                <button
                  key={color}
                  type="button"
                  title={`${label}${count === undefined ? "" : ` · ${count.toLocaleString("fa-IR")} نتیجه`}`}
                  aria-label={`${active ? "حذف" : "انتخاب"} رنگ ${label}${
                    count === undefined ? "" : `، ${count.toLocaleString("fa-IR")} نتیجه`
                  }`}
                  aria-pressed={active}
                  disabled={unavailable}
                  onClick={() =>
                    onChange({ ...filters, colors: toggleValue(filters.colors, color) })
                  }
                  className="tap-target relative grid place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:cursor-not-allowed disabled:opacity-30"
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
          <legend className="tech mb-3 text-metal">سایز قابل انتخاب</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = filters.sizes.includes(size);
              const count = facetCounts?.sizes[size];
              const unavailable = isUnavailable(active, count);
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={active}
                  aria-label={`${active ? "حذف" : "انتخاب"} فیلتر سایز ${size}${
                    count === undefined ? "" : `، ${count.toLocaleString("fa-IR")} نتیجه`
                  }`}
                  disabled={unavailable}
                  onClick={() => onChange({ ...filters, sizes: toggleValue(filters.sizes, size) })}
                  className={`size-chip gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal disabled:cursor-not-allowed disabled:opacity-30 ${
                    active ? "border-signal bg-signal text-obsidian" : "hover:border-bone"
                  }`}
                >
                  <span>{size}</span>
                  {count !== undefined ? (
                    <span className="num text-[9px] opacity-70" aria-hidden="true">
                      {count.toLocaleString("fa-IR")}
                    </span>
                  ) : null}
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

      <fieldset className="flex flex-col gap-2">
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
