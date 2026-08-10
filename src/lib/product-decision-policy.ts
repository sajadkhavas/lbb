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

export type ExtensionLike<T> =
  | { state: "verified"; sourceRef: string; reviewedAt: string; value: T }
  | { state: "pending" | "missing"; value?: never };

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

export function verifiedExtensionValue<T>(extension: ExtensionLike<T> | undefined): T | null {
  if (!extension || extension.state !== "verified") return null;
  if (!extension.sourceRef.trim() || !extension.reviewedAt.trim()) return null;
  return extension.value;
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

export function chooseColorMedia<T>(
  fallback: T[],
  mediaByColor: Record<string, T[]>,
  colorId: string | null,
) {
  if (colorId && mediaByColor[colorId]?.length) return mediaByColor[colorId];
  return fallback;
}
