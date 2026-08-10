import type {
  CatalogQuery,
  FacetsDto,
  ProductDetailDto,
  ProductSummaryDto,
} from "@/lib/backend-api";
import type {
  DecisionColor,
  DecisionMedia,
  DecisionSize,
  DecisionVariant,
  GarmentMeasurements,
  ProductDecisionViewModel,
} from "@/lib/product-decision";
import type { Filters, SortKey } from "@/lib/product-filter";

export type BackendCatalogCard = {
  source: "backend";
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  categorySlug: string;
  categoryLabel: string;
  priceFromToman: number | null;
  priceToToman: number | null;
  availability: boolean;
  stockState: ProductSummaryDto["stockState"];
  colors: ProductSummaryDto["colors"];
  sizes: ProductSummaryDto["sizes"];
  primaryImage: string | null;
};

export function backendCard(product: ProductSummaryDto): BackendCatalogCard {
  return {
    source: "backend",
    id: product.publicId,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    categorySlug: product.category.slug,
    categoryLabel: product.category.name,
    priceFromToman: product.price.from?.amount ?? null,
    priceToToman: product.price.to?.amount ?? null,
    availability: product.availability,
    stockState: product.stockState,
    colors: product.colors,
    sizes: product.sizes,
    primaryImage: product.primaryImage,
  };
}

const decisionAvailability = (available: boolean) =>
  available ? ("available" as const) : ("sold-out" as const);

function toMeasurements(product: ProductDetailDto): GarmentMeasurements | null {
  const guide = product.sizeGuide;
  if (!guide || guide.unit.toLowerCase() !== "cm") return null;

  const rows = guide.sizes.map((entry) => ({
    size: entry.size.code || entry.size.name,
    values: Object.fromEntries(
      guide.definitions.map((definition) => {
        const measurement = entry.measurements.find(
          (value) => value.definitionPublicId === definition.publicId,
        );
        const parsed = measurement ? Number(measurement.value) : Number.NaN;
        return [definition.code, Number.isFinite(parsed) ? parsed : null];
      }),
    ),
  }));

  return {
    unit: "cm",
    columns: guide.definitions.map((definition) => ({
      key: definition.code,
      label: definition.label,
    })),
    rows,
  };
}

function normalizeCare(value: ProductDetailDto["care"]): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function validMedia(media: ProductDetailDto["media"]): DecisionMedia[] {
  return media
    .filter((item) => Boolean(item.url))
    .map((item) => ({
      id: item.publicId,
      src: item.url,
      alt: item.alt?.trim() || "تصویر محصول",
      width: item.width && item.width > 0 ? item.width : 1200,
      height: item.height && item.height > 0 ? item.height : 1500,
    }));
}

export function backendDecisionModel(product: ProductDetailDto): ProductDecisionViewModel {
  const variants: DecisionVariant[] = product.variants
    .filter((variant) => variant.color && variant.size)
    .map((variant) => ({
      id: variant.publicId,
      colorId: variant.color!.publicId,
      sizeId: variant.size!.publicId,
      availability: decisionAvailability(variant.availability),
      mediaIds: variant.mediaPublicIds,
      priceToman: variant.price.amount,
      originalPriceToman: variant.compareAtPrice?.amount ?? null,
    }));

  const colors: DecisionColor[] = product.colors.map((color) => ({
    id: color.publicId,
    label: color.name,
    swatch:
      color.hex && /^#[0-9a-f]{3,8}$/i.test(color.hex)
        ? { type: "solid" as const, value: color.hex }
        : undefined,
    availability: variants.some(
      (variant) => variant.colorId === color.publicId && variant.availability === "available",
    )
      ? "available"
      : "sold-out",
  }));

  const sizes: DecisionSize[] = product.sizes.map((size) => ({
    id: size.publicId,
    label: size.code || size.name,
  }));

  const media = validMedia(product.media);
  const mediaByColor = Object.fromEntries(
    product.colors.map((color) => {
      const ids = new Set(
        product.media
          .filter((item) => item.colorPublicId === color.publicId)
          .map((item) => item.publicId),
      );
      return [color.publicId, media.filter((item) => ids.has(item.id))];
    }),
  );

  const visibleVariants = product.variants.filter((variant) => variant.isActive);
  const commonPrice =
    visibleVariants.length > 0 &&
    visibleVariants.every((variant) => variant.price.amount === visibleVariants[0].price.amount)
      ? visibleVariants[0].price.amount
      : null;
  const commonPrevious =
    visibleVariants.length > 0 &&
    visibleVariants[0].compareAtPrice &&
    visibleVariants.every(
      (variant) => variant.compareAtPrice?.amount === visibleVariants[0].compareAtPrice?.amount,
    )
      ? (visibleVariants[0].compareAtPrice?.amount ?? null)
      : null;

  return {
    slug: product.slug,
    publication: "published",
    readyForCommerce:
      product.publication === "published" &&
      product.variants.length > 0 &&
      product.colors.length > 0 &&
      product.sizes.length > 0,
    identity: {
      name: product.name,
      latinName: null,
      categoryLabel: product.category.name,
      collection: product.collections[0]?.name ?? product.drops[0]?.name ?? null,
      sku: product.variants.length === 1 ? product.variants[0].sku : null,
      description: product.description,
      shortDescription: product.shortDescription,
    },
    pricing: {
      priceToman: commonPrice,
      originalPriceToman: commonPrevious,
      fromToman: product.price.from?.amount ?? null,
      toToman: product.price.to?.amount ?? null,
    },
    stock: {
      availability: product.availability ? "available" : "sold-out",
    },
    colors,
    sizes,
    variants,
    media,
    mediaByColor,
    facts: {
      material: product.material ?? product.fabricComposition,
      fit: product.fit,
      fitNote: null,
      care: normalizeCare(product.care),
    },
    measurements: toMeasurements(product),
    model: null,
    completeTheLookSlugs: [],
    pendingFields: [],
  };
}

const backendSort = (sort: SortKey): CatalogQuery["sort"] => {
  if (sort === "price-asc") return "price_asc";
  if (sort === "price-desc") return "price_desc";
  return "newest";
};

export const BACKEND_SUPPORTED_SORTS: SortKey[] = ["newest", "price-asc", "price-desc"];

export function backendCatalogQuery(filters: Filters, facets?: FacetsDto): CatalogQuery {
  const colorSlugByVisual = new Map<string, string>();
  for (const color of facets?.colors ?? []) {
    if (color.hex) colorSlugByVisual.set(color.hex.toLowerCase(), color.slug);
    colorSlugByVisual.set(color.slug.toLowerCase(), color.slug);
    colorSlugByVisual.set(color.code.toLowerCase(), color.slug);
  }

  const colors = filters.colors
    .map((value) => colorSlugByVisual.get(value.toLowerCase()) ?? value)
    .filter(Boolean);

  return {
    category: filters.cats.length ? filters.cats.join(",") : undefined,
    color: colors.length ? colors.join(",") : undefined,
    size: filters.sizes.length ? filters.sizes.join(",") : undefined,
    max_price: filters.max > 0 ? filters.max : undefined,
    availability: filters.instock ? "in_stock" : undefined,
    sort: backendSort(filters.sort),
    page: 1,
    per_page: 48,
  };
}

export function backendFacetVisuals(facets: FacetsDto) {
  return {
    colors: facets.colors
      .map((color) => color.hex || color.slug)
      .filter((value): value is string => Boolean(value)),
    sizes: facets.sizes.map((size) => size.code || size.name),
    priceCeil: facets.price.max?.amount ?? 1,
  };
}
