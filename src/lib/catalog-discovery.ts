import { CATEGORY_SLUGS } from "./categories";
import {
  applyFilters,
  normalizeFilters,
  type FilterScope,
  type Filters,
} from "./product-filter";
import { isSizeAvailable, type Product } from "./product-catalog";

export type FacetCounts = {
  categories: Record<string, number>;
  colors: Record<string, number>;
  sizes: Record<string, number>;
};

export type DiscoveryScope = FilterScope & {
  categories: readonly string[] | false;
  colors: readonly string[];
  sizes: readonly string[];
  priceCeil: number;
};

export function createDiscoveryScope(
  list: readonly Product[],
  includeCategories: boolean,
): DiscoveryScope {
  return {
    categories: includeCategories ? CATEGORY_SLUGS : false,
    colors: Array.from(new Set(list.flatMap((product) => product.colors))),
    sizes: Array.from(new Set(list.flatMap((product) => product.sizes))),
    priceCeil: Math.max(1, ...list.map((product) => product.price)),
  };
}

export function countDiscoveryResults(
  list: readonly Product[],
  filters: Filters,
  scope: DiscoveryScope,
) {
  return applyFilters([...list], normalizeFilters(filters, scope)).length;
}

function addOption(current: string[], option: string) {
  return current.includes(option) ? current : [...current, option];
}

export function createFacetCounts(
  list: readonly Product[],
  filters: Filters,
  scope: DiscoveryScope,
): FacetCounts {
  const normalized = normalizeFilters(filters, scope);
  const count = (next: Filters) => countDiscoveryResults(list, next, scope);

  const categories =
    scope.categories === false
      ? {}
      : Object.fromEntries(
          scope.categories.map((category) => [
            category,
            count({ ...normalized, cats: addOption(normalized.cats, category) }),
          ]),
        );

  const colors = Object.fromEntries(
    scope.colors.map((color) => [
      color,
      count({ ...normalized, colors: addOption(normalized.colors, color) }),
    ]),
  );

  const sizes = Object.fromEntries(
    scope.sizes.map((size) => [
      size,
      applyFilters(
        [...list],
        normalizeFilters({ ...normalized, sizes: addOption(normalized.sizes, size) }, scope),
      ).filter((product) => isSizeAvailable(product, size) || normalized.sizes.includes(size))
        .length,
    ]),
  );

  return { categories, colors, sizes };
}

export function catalogueInventorySummary(list: readonly Product[]) {
  const available = list.filter((product) => product.inStock).length;
  const unavailable = list.length - available;
  return {
    total: list.length,
    available,
    unavailable,
    label: `${list.length.toLocaleString("fa-IR")} قطعه در کاتالوگ · ${available.toLocaleString(
      "fa-IR",
    )} موجود${unavailable ? ` · ${unavailable.toLocaleString("fa-IR")} ناموجود` : ""}`,
  };
}
