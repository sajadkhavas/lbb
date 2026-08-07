export type PublicEvidenceEntry = {
  state: "verified" | "pending" | "missing";
  source: string | null;
  reviewedAt: string | null;
};

export type VariantAvailability = "available" | "sold-out" | "unavailable" | "unknown";

export type VariantLike = {
  colorId: string;
  sizeId: string;
  availability: VariantAvailability;
};

export function isEvidenceFieldPublic(
  publication: "draft" | "published" | "archived" | "untracked",
  entry: PublicEvidenceEntry | undefined,
) {
  return (
    publication === "published" &&
    entry?.state === "verified" &&
    Boolean(entry.source?.trim()) &&
    Boolean(entry.reviewedAt)
  );
}

export function selectedVariantAvailability(
  variants: VariantLike[],
  colorId: string | null,
  sizeId: string | null,
): VariantAvailability {
  if (!colorId || !sizeId) return "unknown";
  return (
    variants.find((variant) => variant.colorId === colorId && variant.sizeId === sizeId)
      ?.availability ?? "unavailable"
  );
}

export function canPurchaseVariant({
  commerceReady,
  productAvailability,
  variantAvailability,
}: {
  commerceReady: boolean;
  productAvailability: VariantAvailability;
  variantAvailability: VariantAvailability;
}) {
  return (
    commerceReady && productAvailability === "available" && variantAvailability === "available"
  );
}
