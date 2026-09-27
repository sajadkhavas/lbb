import { expect, test } from "@playwright/test";
import type { FacetsDto } from "../src/lib/backend-api";
import {
  backendCatalogQuery,
  backendFacetVisuals,
  normalizeCatalogFilters,
} from "../src/lib/backend-storefront";
import { EMPTY_FILTERS, parseBackendFilters } from "../src/lib/product-filter";

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
