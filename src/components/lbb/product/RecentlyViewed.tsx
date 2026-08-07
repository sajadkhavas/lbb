import { useEffect, useState } from "react";
import { ProductCard } from "@/components/lbb/ProductCard";
import { evaluateProductEvidence } from "@/lib/product-evidence";
import { productBySlug } from "@/lib/products";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import { Band, Shell, SectionHead } from "@/components/lbb/ui/primitives";

export function RecentlyViewed({ excludeSlug }: { excludeSlug: string }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(getRecentlyViewed(excludeSlug));
  }, [excludeSlug]);

  const items = slugs
    .map((slug) => productBySlug(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
    .filter((product) => evaluateProductEvidence(product).publishable);

  if (items.length === 0) return null;

  return (
    <Band label="RECENTLY VIEWED">
      <Shell>
        <SectionHead label="اخیراً دیده‌شده" title="بازگشت به گزینه‌های قبلی" className="mb-8" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {items.map((product) => (
            <ProductCard key={product.id} p={product} />
          ))}
        </div>
      </Shell>
    </Band>
  );
}
