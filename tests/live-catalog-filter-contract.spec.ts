import { expect, test } from "@playwright/test";
import type { FacetsDto } from "../src/lib/backend-api";
import {
  backendCatalogQuery,
  backendFacetVisuals,
  normalizeCatalogFilters,
} from "../src/lib/backend-storefront";
import {
  EMPTY_FILTERS,
  parseBackendFilters,
  serializeBackendFilters,
} from "../src/lib/product-filter";

const facets = {
  categories: [],
  colors: [
    { slug: "black", code: "BLK", hex: "#000000", name: "مشکی" },
    { slug: "charcoal", code: "CHR", hex: "#000000", name: "ذغالی" },
  ],
  sizes: [],
  price: { min: null, max: { amount: 8_000_000, currency: "TOMAN" } },
} as FacetsDto;

test("catalog filters distinguish colors that share a swatch and accept existing color links", () => {
  const visuals = backendFacetVisuals(facets);
  expect(visuals.colors).toEqual(["black", "charcoal"]);

  const scope = { colors: visuals.colors, sizes: [], priceCeil: visuals.priceCeil };
  const olderLink = normalizeCatalogFilters(
    parseBackendFilters({ colors: "#000000" }),
    facets,
    scope,
  );
  expect(olderLink.colors).toEqual(["black"]);

  const selected = { ...EMPTY_FILTERS, colors: ["charcoal"] };
  expect(backendCatalogQuery(selected, facets).color).toBe("charcoal");
});

test("backend size codes containing spaces survive a shared filter link", () => {
  const parsed = parseBackendFilters({ sizes: "ONE SIZE" });
  expect(parsed.sizes).toEqual(["ONE SIZE"]);
  expect(serializeBackendFilters(parsed).sizes).toBe("ONE SIZE");
  expect(backendCatalogQuery(parsed).size).toBe("ONE SIZE");
});

test("two selected colors survive the URL and API query, and clearing removes both", () => {
  const selected = { ...EMPTY_FILTERS, colors: ["black", "charcoal"] };
  const search = serializeBackendFilters(selected);
  expect(search.colors).toBe("black,charcoal");
  const restored = parseBackendFilters(search);
  expect(restored.colors).toEqual(["black", "charcoal"]);
  expect(backendCatalogQuery(restored, facets).color).toBe("black,charcoal");
  expect(serializeBackendFilters(EMPTY_FILTERS).colors).toBeUndefined();
});
