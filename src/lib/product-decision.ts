import { CATEGORIES } from "@/lib/categories";
import { colorName } from "@/lib/color-names";
import { productImage } from "@/lib/product-images";
import {
  PRODUCT_EVIDENCE,
  type ProductEvidenceField,
  type ProductEvidenceRecord,
} from "@/lib/product-evidence";
import { FIT_LABELS, type Product } from "@/lib/products";
import {
  canPurchaseVariant,
  chooseColorMedia,
  isEvidenceFieldPublic,
  selectedVariantAvailability,
  verifiedExtensionValue,
  type ExtensionLike,
  type VariantAvailability,
} from "./product-decision-policy";

export type DecisionAvailability = VariantAvailability;

export type DecisionMedia = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type DecisionSwatch =
  | { type: "solid"; value: string }
  | { type: "multi"; values: string[] }
  | { type: "pattern"; label: string };

export type DecisionColor = {
  id: string;
  label: string;
  swatch?: DecisionSwatch;
  availability: DecisionAvailability;
};

export type DecisionSize = {
  id: string;
  label: string;
};

export type DecisionVariant = {
  id: string;
  colorId: string;
  sizeId: string;
  availability: DecisionAvailability;
  mediaIds: string[];
  /** Present for backend-backed variants. Prototype variants deliberately leave this unset. */
  priceToman?: number;
  originalPriceToman?: number | null;
};

export type GarmentMeasurementRow = {
  size: string;
  values: Record<string, number | null>;
};

export type GarmentMeasurements = {
  unit: "cm";
  columns: Array<{ key: string; label: string }>;
  rows: GarmentMeasurementRow[];
};

export type ModelMeasurements = {
  heightCm?: number;
  wornSize?: string;
  body?: Record<string, number>;
};

export type VerifiedExtension<T> = ExtensionLike<T>;

export type ProductDecisionEnhancements = {
  variants?: VerifiedExtension<DecisionVariant[]>;
  mediaByColor?: VerifiedExtension<Record<string, DecisionMedia[]>>;
  measurements?: VerifiedExtension<GarmentMeasurements>;
  model?: VerifiedExtension<ModelMeasurements>;
  completeTheLookSlugs?: VerifiedExtension<string[]>;
};

export type ProductDecisionViewModel = {
  slug: string;
  publication: ProductEvidenceRecord["publication"] | "untracked";
  readyForCommerce: boolean;
  identity: {
    name: string | null;
    latinName: string | null;
    categoryLabel: string;
    collection: string | null;
    sku: string | null;
    description: string | null;
    shortDescription: string | null;
  };
  pricing: {
    priceToman: number | null;
    originalPriceToman: number | null;
    fromToman?: number | null;
    toToman?: number | null;
  };
  stock: {
    availability: DecisionAvailability;
  };
  colors: DecisionColor[];
  sizes: DecisionSize[];
  variants: DecisionVariant[];
  media: DecisionMedia[];
  mediaByColor: Record<string, DecisionMedia[]>;
  facts: {
    material: string | null;
    fit: string | null;
    fitNote: string | null;
    care: string[];
  };
  measurements: GarmentMeasurements | null;
  model: ModelMeasurements | null;
  completeTheLookSlugs: string[];
  pendingFields: ProductEvidenceField[];
};

function solidSwatch(value: string): DecisionSwatch | undefined {
  return /^#[0-9a-f]{6}$/i.test(value) || /^#[0-9a-f]{3}$/i.test(value)
    ? { type: "solid", value }
    : undefined;
}

function buildFallbackVariants(
  product: Product,
  colors: DecisionColor[],
  sizes: DecisionSize[],
): DecisionVariant[] {
  return colors.flatMap((color) =>
    sizes.map((size) => ({
      id: `${color.id}:${size.id}`,
      colorId: color.id,
      sizeId: size.id,
      availability:
        !product.inStock || (product.soldOutSizes ?? []).includes(size.id)
          ? ("sold-out" as const)
          : ("available" as const),
      mediaIds: [],
    })),
  );
}

export function buildProductDecisionViewModel(
  product: Product,
  enhancements: ProductDecisionEnhancements = {},
): ProductDecisionViewModel {
  const record = PRODUCT_EVIDENCE[product.slug];
  const publication = record?.publication ?? "untracked";
  const has = (field: ProductEvidenceField) =>
    isEvidenceFieldPublic(publication, record?.fields[field]);

  const colors = has("colors")
    ? product.colors.map((value, index) => ({
        id: value || `color-${index + 1}`,
        label: colorName(value) || `رنگ ${index + 1}`,
        swatch: solidSwatch(value),
        availability: (has("stock") && product.inStock
          ? "available"
          : "unknown") as DecisionAvailability,
      }))
    : [];

  const sizes = has("sizes") ? product.sizes.map((label) => ({ id: label, label })) : [];

  const extensionVariants = verifiedExtensionValue(enhancements.variants);
  const variants =
    extensionVariants ??
    (has("colors") && has("sizes") && has("stock")
      ? buildFallbackVariants(product, colors, sizes)
      : []);

  const baseMedia = has("media")
    ? [
        {
          id: `${product.slug}:primary`,
          src: productImage(product.slug),
          alt: has("name") ? product.name : "تصویر تأییدشده محصول",
          width: 1024,
          height: 1280,
        },
      ]
    : [];

  const mediaByColor = verifiedExtensionValue(enhancements.mediaByColor) ?? {};
  const measurements = verifiedExtensionValue(enhancements.measurements);
  const model = verifiedExtensionValue(enhancements.model);
  const completeTheLookSlugs = verifiedExtensionValue(enhancements.completeTheLookSlugs) ?? [];

  const requiredForCommerce: ProductEvidenceField[] = [
    "name",
    "media",
    "price",
    "colors",
    "sizes",
    "stock",
  ];
  const readyForCommerce = requiredForCommerce.every((field) => has(field));

  return {
    slug: product.slug,
    publication,
    readyForCommerce,
    identity: {
      name: has("name") ? product.name : null,
      latinName: has("name") ? product.latinName : null,
      categoryLabel: CATEGORIES[product.category].nameFa,
      collection: has("collection") ? product.drop : null,
      sku: has("sku") ? product.sku : null,
      description: has("description") ? product.description : null,
      shortDescription: has("description") ? product.shortDescription : null,
    },
    pricing: {
      priceToman: has("price") ? product.price : null,
      originalPriceToman: has("originalPrice") ? (product.originalPrice ?? null) : null,
      fromToman: has("price") ? product.price : null,
      toToman: has("price") ? product.price : null,
    },
    stock: {
      availability: has("stock") ? (product.inStock ? "available" : "sold-out") : "unknown",
    },
    colors,
    sizes,
    variants,
    media: baseMedia,
    mediaByColor,
    facts: {
      material: has("material") ? product.material : null,
      fit: has("fit") ? FIT_LABELS[product.fit] : null,
      fitNote: has("fit") ? product.fitNote : null,
      care: has("care") ? product.care : [],
    },
    measurements,
    model,
    completeTheLookSlugs,
    pendingFields: record
      ? (Object.entries(record.fields)
          .filter(([, entry]) => entry.state !== "verified")
          .map(([field]) => field) as ProductEvidenceField[])
      : [],
  };
}

export function mediaForColor(model: ProductDecisionViewModel, colorId: string | null) {
  return chooseColorMedia(model.media, model.mediaByColor, colorId);
}

export function variantForSelection(
  model: ProductDecisionViewModel,
  colorId: string | null,
  sizeId: string | null,
) {
  if (!colorId || !sizeId) return null;
  return (
    model.variants.find((variant) => variant.colorId === colorId && variant.sizeId === sizeId) ??
    null
  );
}

export function sizeAvailabilityForColor(
  model: ProductDecisionViewModel,
  sizeId: string,
  colorId: string | null,
): DecisionAvailability {
  return selectedVariantAvailability(model.variants, colorId, sizeId);
}

export function canAddSelection(
  model: ProductDecisionViewModel,
  colorId: string | null,
  sizeId: string | null,
) {
  return canPurchaseVariant({
    commerceReady: model.readyForCommerce,
    productAvailability: model.stock.availability,
    variantAvailability: selectedVariantAvailability(model.variants, colorId, sizeId),
  });
}
