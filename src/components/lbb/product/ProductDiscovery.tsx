import { ProductCard } from "@/components/lbb/ProductCard";
import { SectionHead } from "@/components/lbb/ui/primitives";
import type { Product } from "@/lib/products";

export function CompleteTheLook({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="complete-look-heading" data-testid="pdp-complete-look">
      <SectionHead label="COMPLETE THE LOOK" title="تکمیل استایل" className="mb-8" />
      <h2 id="complete-look-heading" className="sr-only">تکمیل استایل با محصولات تأییدشده</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} p={product} />
        ))}
      </div>
    </section>
  );
}

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="related-products-heading" data-testid="pdp-related-products">
      <SectionHead label="RELATED" title="محصولات مرتبط" className="mb-8" />
      <h2 id="related-products-heading" className="sr-only">محصولات مرتبط تأییدشده</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} p={product} />
        ))}
      </div>
    </section>
  );
}
