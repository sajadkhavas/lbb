import { ProductCard } from "@/components/lbb/ProductCard";
import { MerchantNavigationLink } from "@/components/lbb/navigation/MerchantNavigationLink";
import { SectionHead, Shell, StatePanel } from "@/components/lbb/ui/primitives";
import type { BackendCatalogCard } from "@/lib/backend-storefront";
import { products } from "@/lib/products";
import { useStorefrontControl } from "@/lib/storefront-control";
import { useStorefrontPresentation } from "@/lib/storefront-presentation";
import { ArrowUpLeft } from "lucide-react";

export function ProductMoments({ liveProducts }: { liveProducts?: BackendCatalogCard[] | null }) {
  const { source, sectionCopy } = useStorefrontControl();
  const presentation = useStorefrontPresentation();

  if (source === "live") {
    const items = liveProducts ?? [];
    const copy = sectionCopy.products;
    return (
      <section
        dir="rtl"
        aria-labelledby="home-products-title"
        className="border-t border-hairline bg-obsidian py-12 md:py-16"
      >
        <Shell>
          <SectionHead
            index="02"
            label={copy.label}
            title={<span id="home-products-title">{copy.title}</span>}
            lede={copy.lede}
            action={
              <MerchantNavigationLink
                item={{ label: copy.actionLabel, latin: "CATALOG", href: presentation.sectionLinks.products }}
                className="tech inline-flex min-h-11 items-center gap-2 text-signal"
              >
                {copy.actionLabel}
                <ArrowUpLeft size={15} aria-hidden="true" />
              </MerchantNavigationLink>
            }
          />

          {items.length === 0 ? (
            <StatePanel className="mt-8" title="هنوز محصول واقعی برای این بخش منتشر نشده است">
              بعد از انتشار/انتخاب محصول در پنل مدیریت، این بخش بدون نیاز به تغییر Frontend به‌روز می‌شود.
            </StatePanel>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {items.map((product, index) => (
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
  const curated = currentSlugs.flatMap((slug) =>
    products.filter((product) => product.slug === slug),
  );

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
