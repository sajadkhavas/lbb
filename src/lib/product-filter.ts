import { discountPercent, type Product } from "./products";

export type SortKey = "newest" | "best" | "price-asc" | "price-desc" | "discount";

export type Filters = {
  cats: string[];
  colors: string[];
  sizes: string[];
  max: number;
  instock: boolean;
  sale: boolean;
  sort: SortKey;
};

export const EMPTY_FILTERS: Filters = {
  cats: [],
  colors: [],
  sizes: [],
  max: 0,
  instock: false,
  sale: false,
  sort: "newest",
};

const SORTS: SortKey[] = ["newest", "best", "price-asc", "price-desc", "discount"];

export const SORT_LABELS: Record<SortKey, string> = {
  newest: "جدیدترین",
  best: "پرفروش‌ترین",
  "price-asc": "ارزان‌ترین",
  "price-desc": "گران‌ترین",
  discount: "بیشترین تخفیف",
};

const toArray = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string")
    : typeof v === "string" && v
      ? v.split(",").filter(Boolean)
      : [];

/** Parses raw URL search into a safe Filters object. */
export function parseFilters(s: Record<string, unknown>): Filters {
  const sort =
    typeof s.sort === "string" && SORTS.includes(s.sort as SortKey)
      ? (s.sort as SortKey)
      : "newest";
  const max = Number(s.max);
  return {
    cats: toArray(s.cats),
    colors: toArray(s.colors),
    sizes: toArray(s.sizes),
    max: Number.isFinite(max) && max > 0 ? max : 0,
    instock: s.instock === true || s.instock === "true",
    sale: s.sale === true || s.sale === "true",
    sort,
  };
}

/** Strips defaults so clean URLs stay clean (`/shop`, `/hoodies`). */
export function serializeFilters(f: Filters): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (f.cats.length) out.cats = f.cats;
  if (f.colors.length) out.colors = f.colors;
  if (f.sizes.length) out.sizes = f.sizes;
  if (f.max > 0) out.max = f.max;
  if (f.instock) out.instock = true;
  if (f.sale) out.sale = true;
  if (f.sort !== "newest") out.sort = f.sort;
  return out;
}

export function activeCount(f: Filters) {
  return (
    f.cats.length +
    f.colors.length +
    f.sizes.length +
    (f.max > 0 ? 1 : 0) +
    (f.instock ? 1 : 0) +
    (f.sale ? 1 : 0)
  );
}

export function clearFilters(f: Filters): Filters {
  return { ...EMPTY_FILTERS, sort: f.sort };
}

export function applyFilters(list: Product[], f: Filters): Product[] {
  const out = list.filter((p) => {
    if (f.cats.length && !f.cats.includes(p.category)) return false;
    if (f.colors.length && !p.colors.some((c) => f.colors.includes(c))) return false;
    if (f.sizes.length && !p.sizes.some((s) => f.sizes.includes(s))) return false;
    if (f.max > 0 && p.price > f.max) return false;
    if (f.instock && !p.inStock) return false;
    if (f.sale && discountPercent(p) === 0) return false;
    return true;
  });

  switch (f.sort) {
    case "best":
      return [...out].sort((a, b) => a.rank - b.rank);
    case "price-asc":
      return [...out].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...out].sort((a, b) => b.price - a.price);
    case "discount":
      return [...out].sort((a, b) => discountPercent(b) - discountPercent(a));
    default:
      return [...out].sort(
        (a, b) => Number(!!b.isNew) - Number(!!a.isNew) || Number(a.id) - Number(b.id),
      );
  }
}
