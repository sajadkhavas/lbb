import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/lib/backend-api";
import { backendDecisionModel } from "@/lib/backend-storefront";
import type { CartLine } from "@/lib/cart";
import { mediaForColor } from "@/lib/product-decision";
import { productImage } from "@/lib/product-images";

export function CartProductImage({ line, className }: { line: CartLine; className: string }) {
  const isBackend = line.source === "backend";
  const { data: model } = useQuery({
    queryKey: ["product-quickview", line.slug],
    queryFn: async () => (await getProduct(line.slug)).data,
    select: backendDecisionModel,
    enabled: isBackend && !line.imageUrl,
    staleTime: 60_000,
  });
  const colorId = model?.variants.find((variant) => variant.id === line.variantId)?.colorId;
  const media = model && mediaForColor(model, colorId ?? null)[0];
  const src = line.imageUrl || (isBackend ? media?.src : productImage(line.slug));

  if (!src) {
    return (
      <span
        className={`tech grid place-items-center bg-carbon-2 text-xs text-signal/50 ${className}`}
      >
        LBB
      </span>
    );
  }

  return <img src={src} alt={line.name} loading="lazy" decoding="async" className={className} />;
}
