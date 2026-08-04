import {
  discountPercent,
  isSizeAvailable,
  type CategorySlug,
  type Product,
} from "./product-catalog";

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

/** Optional URL representation. Keeping every key optional prevents catalogue links elsewhere from requiring search props. */
export type FilterSearch = {
  cats?: string;
  colors?: string;
  sizes?: string;
  max?: number;
  instock?: true;
  sale?: true;
  sort?: SortKey;
};

export type FilterScope = {
  categories?: readonly string[] | false;
  colors?: readonly string[];
  sizes?: readonly string[];
  priceCeil?: number;
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

const SORTS: readonly SortKey[] = ["newest", "best", "price-asc", "price-desc", "discount"];
const CATEGORY_ORDER: readonly CategorySlug[] = ["hoodies", "pants", "tshirts", "shoes", "socks"];

/**
 * Catalogue-wide defaults are explicit so filter module evaluation never depends on
 * product data being initialized in another Cloudflare Worker chunk.
 */
const GLOBAL_COLORS = ["#0A0A0A", "#F2EFE8", "#E6291E", "#6F6F6F", "#1a3c6e"] as const;
const GLOBAL_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "30",
  "32",
  "34",
  "36",
  "40",
  "41",
  "42",
  "43",
  "44",
  "ONE",
] as const;
const GLOBAL_PRICE_CEIL = 2_400_000;

export const SORT_LABELS: Record<SortKey, string> = {
  newest: "جدیدترین",
  best: "پرفروش‌ترین",
  "price-asc": "ارزان‌ترین",
  "price-desc": "گران‌ترین",
  discount: "بیشترین تخفیف",
};

const scalar = (value: unknown): string | undefined => {
  if (Array.isArray(value)) return scalar(value[0]);
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
};

const toArray = (value: unknown): string[] => {
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((entry) => {
    const text = scalar(entry);
    return text ? text.split(",") : [];
  });
};

const canonicalMap = (values: readonly string[]) =>
  new Map(values.map((value) => [value.trim().toLocaleLowerCase("en-US"), value]));

const normalizeList = (values: readonly string[], allowed: readonly string[]): string[] => {
  const map = canonicalMap(allowed);
  const normalized = values
    .map((value) => map.get(value.trim().toLocaleLowerCase("en-US")))
    .filter((value): value is string => Boolean(value));
  return Array.from(new Set(normalized)).sort((a, b) => {
    const aIndex = allowed.indexOf(a);
    const bIndex = allowed.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    return a.localeCompare(b, "en");
  });
};

const parseBoolean = (value: unknown) => {
  const text = scalar(value)?.trim().toLocaleLowerCase("en-US");
  return text === "true" || text === "1" || text === "yes";
};

/** Normalizes filters for a page-specific catalogue scope. */
export function normalizeFilters(filters: Filters, scope: FilterScope = {}): Filters {
  const categories =
    scope.categories === false
      ? []
      : normalizeList(filters.cats, scope.categories ?? CATEGORY_ORDER);
  const colors = normalizeList(filters.colors, scope.colors ?? GLOBAL_COLORS);
  const sizes = normalizeList(filters.sizes, scope.sizes ?? GLOBAL_SIZES);
  const priceCeil = Math.max(1, Math.floor(scope.priceCeil ?? GLOBAL_PRICE_CEIL));
  const rawMax = Number.isFinite(filters.max) ? Math.max(0, Math.floor(filters.max)) : 0;
  const max = rawMax > 0 && rawMax < priceCeil ? rawMax : 0;
  const sort = SORTS.includes(filters.sort) ? filters.sort : "newest";

  return {
    cats: categories,
    colors,
    sizes,
    max,
    instock: Boolean(filters.instock),
    sale: Boolean(filters.sale),
    sort,
  };
}

/** Parses raw URL search into a safe and deterministic internal Filters object. */
export function parseFilters(search: Record<string, unknown>): Filters {
  const rawSort = scalar(search.sort);
  const maxValue = Number(scalar(search.max));
  return normalizeFilters({
    cats: toArray(search.cats),
    colors: toArray(search.colors),
    sizes: toArray(search.sizes),
    max: Number.isFinite(maxValue) ? maxValue : 0,
    instock: parseBoolean(search.instock),
    sale: parseBoolean(search.sale),
    sort: rawSort && SORTS.includes(rawSort as SortKey) ? (rawSort as SortKey) : "newest",
  });
}

/** Strips defaults and serializes arrays as sorted comma-separated values. */
export function serializeFilters(filters: Filters): FilterSearch {
  const normalized = normalizeFilters(filters);
  const output: FilterSearch = {};
  if (normalized.cats.length) output.cats = normalized.cats.join(",");
  if (normalized.colors.length) output.colors = normalized.colors.join(",");
  if (normalized.sizes.length) output.sizes = normalized.sizes.join(",");
  if (normalized.max > 0) output.max = normalized.max;
  if (normalized.instock) output.instock = true;
  if (normalized.sale) output.sale = true;
  if (normalized.sort !== "newest") output.sort = normalized.sort;
  return output;
}

/** Safe optional URL shape used directly by TanStack validateSearch. */
export function parseFilterSearch(search: Record<string, unknown>): FilterSearch {
  return serializeFilters(parseFilters(search));
}

/** Stable query string used to clean direct/deep links without changing semantics. */
export function stableSearchString(params: object): string {
  const search = new URLSearchParams();
  Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b, "en"))
    .forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      search.set(key, String(value));
    });
  return search.toString();
}

export function isCanonicalSearch(current: string, expected: object): boolean {
  const actual = new URLSearchParams(current.startsWith("?") ? current.slice(1) : current);
  const sortedActual = new URLSearchParams();
  Array.from(actual.entries())
    .sort(([aKey, aValue], [bKey, bValue]) =>
      aKey === bKey ? aValue.localeCompare(bValue, "en") : aKey.localeCompare(bKey, "en"),
    )
    .forEach(([key, value]) => sortedActual.append(key, value));
  return sortedActual.toString() === stableSearchString(expected);
}

export function activeCount(filters: Filters) {
  return (
    filters.cats.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.max > 0 ? 1 : 0) +
    (filters.instock ? 1 : 0) +
    (filters.sale ? 1 : 0)
  );
}

/** True for any URL state that should canonicalize/noindex to the base listing. */
export function hasSearchModifiers(filters: Filters) {
  return activeCount(filters) > 0 || filters.sort !== "newest";
}

export function clearFilters(filters: Filters): Filters {
  return { ...EMPTY_FILTERS, sort: filters.sort };
}

export function applyFilters(list: Product[], filters: Filters): Product[] {
  const normalized = normalizeFilters(filters);
  const output = list.filter((product) => {
    if (normalized.cats.length && !normalized.cats.includes(product.category)) return false;
    if (
      normalized.colors.length &&
      !product.colors.some((color) => normalized.colors.includes(color))
    )
      return false;
    if (normalized.sizes.length && !normalized.sizes.some((size) => isSizeAvailable(product, size)))
      return false;
    if (normalized.max > 0 && product.price > normalized.max) return false;
    if (normalized.instock && !product.inStock) return false;
    if (normalized.sale && discountPercent(product) === 0) return false;
    return true;
  });

  switch (normalized.sort) {
    case "best":
      return [...output].sort((a, b) => a.rank - b.rank || a.slug.localeCompare(b.slug, "en"));
    case "price-asc":
      return [...output].sort((a, b) => a.price - b.price || a.rank - b.rank);
    case "price-desc":
      return [...output].sort((a, b) => b.price - a.price || a.rank - b.rank);
    case "discount":
      return [...output].sort((a, b) => discountPercent(b) - discountPercent(a) || a.rank - b.rank);
    default:
      return [...output].sort(
        (a, b) =>
          Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) ||
          a.rank - b.rank ||
          a.slug.localeCompare(b.slug, "en"),
      );
  }
}
