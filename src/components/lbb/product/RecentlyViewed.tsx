import { useEffect, useState } from "react";
import { ProductCard } from "@/components/lbb/ProductCard";
import { productBySlug } from "@/lib/products";
import { getRecentlyViewed } from "@/lib/recently-viewed";

export function RecentlyViewed({ excludeSlug }: { excludeSlug: string }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(getRecentlyViewed(excludeSlug));
  }, [excludeSlug]);

  const items = slugs.map((s) => productBySlug(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) return null;

  return (
    <section className="border-t border-black/[0.06] py-10">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <h3 className="mb-4 text-lg font-semibold font-display">
          اخیراً دیده‌شده
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
