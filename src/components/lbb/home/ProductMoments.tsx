import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { ProductCard } from "@/components/lbb/ProductCard";
import { SectionHead, Shell, StatePanel } from "@/components/lbb/ui/primitives";
import type { BackendCatalogCard } from "@/lib/backend-storefront";
import { products } from "@/lib/products";
import { useStorefrontControl } from "@/lib/storefront-control";

export function ProductMoments({ liveProducts }: { liveProducts?: BackendCatalogCard[] | null }) {
  const { source } = useStorefrontControl();

  if (source === "live") {
    const items = liveProducts ?? [];
    return (
      <section
        dir="rtl"
        aria-labelledby="home-products-title"
        className="border-t border-hairline bg-obsidian py-12 md:py-16"
      >
        <Shell>
          <SectionHead
            index="02"
            label="انتخاب‌های ال‌بی‌بی"
            title={<span id="home-products-title">تازه‌های فروشگاه</span>}
            lede="محصولات منتشرشده از کاتالوگ واقعی؛ قیمت و موجودی نمایش‌داده‌شده از Backend می‌آیند."
            action={
              <Link to="/shop" className="tech inline-flex min-h-11 items-center gap-2 text-signal">
                کاتالوگ کامل
                <ArrowUpLeft size={15} aria-hidden="true" />
              </Link>
            }
          />

          {items.length === 0 ? (
            <StatePanel className="mt-8" title="هنوز محصول واقعی برای این بخش منتشر نشده است">
              بعد از انتشار محصول در پنل مدیریت، این بخش بدون نیاز به تغییر Frontend به‌روز می‌شود.
            </StatePanel>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {items.slice(0, 4).map((product, index) => (
                <div key={product.id} className="min-w-0">
                  <ProductCard p={product} priority={index === 0} />
                </div>
              ))}
            </div>
          )}
        </Shell>
      </section>
    );
  }

  const currentSlugs = [
    "lbb-signature-tee",
    "denim-baggy-jean",
    "urban-runner-sneaker",
    "lbb-crew-socks",
  ];
  const curated = currentSlugs.flatMap((slug) => products.filter((product) => product.slug === slug));

  return (
    <section
      dir="rtl"
      aria-labelledby="home-products-title"
      className="border-t border-hairline bg-obsidian py-12 md:py-16"
    >
      <Shell>
        <SectionHead
          index="02"
          label="انتخاب‌های ال‌بی‌بی"
          title={<span id="home-products-title">تازه‌ها و انتخاب‌های این هفته</span>}
          lede="چند انتخاب آماده برای شروع؛ قیمت، رنگ و سایز موجود همین‌جا مشخص است."
          action={
            <Link to="/shop" className="tech inline-flex min-h-11 items-center gap-2 text-signal">
              کاتالوگ کامل
              <ArrowUpLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {curated.map((product, index) => (
            <div key={product.slug} className="min-w-0">
              <ProductCard p={product} priority={index === 0} />
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
}
