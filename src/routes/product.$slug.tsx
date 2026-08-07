import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpLeft } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { Gallery } from "@/components/lbb/product/Gallery";
import { ProductFacts } from "@/components/lbb/product/ProductFacts";
import { ProductPurchasePanel } from "@/components/lbb/product/ProductPurchasePanel";
import { CompleteTheLook, RelatedProducts } from "@/components/lbb/product/ProductDiscovery";
import { RecentlyViewed } from "@/components/lbb/product/RecentlyViewed";
import { CATEGORIES } from "@/lib/categories";
import {
  buildProductDecisionViewModel,
  type DecisionMedia,
} from "@/lib/product-decision";
import { evaluateProductEvidence } from "@/lib/product-evidence";
import { productImage } from "@/lib/product-images";
import { fmtToman, productBySlug, productsByCategory, type Product } from "@/lib/products";
import { recordRecentlyViewed } from "@/lib/recently-viewed";
import {
  absAsset,
  absUrl,
  breadcrumbLd as buildBreadcrumbLd,
  canonical,
  pageMeta,
  ROBOTS,
} from "@/lib/site";
import { Band, CtaClasses, Shell, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = productBySlug(params.slug);
    if (!product) throw notFound();
    const related = productsByCategory(product.category)
      .filter((item) => item.slug !== product.slug)
      .filter((item) => evaluateProductEvidence(item).publishable)
      .slice(0, 4);
    return { product, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "پیدا نشد" }, { name: "robots", content: ROBOTS.NOINDEX_NOFOLLOW }],
      };
    }

    const product = loaderData.product;
    const evidence = evaluateProductEvidence(product);
    const category = CATEGORIES[product.category];
    const path = `/product/${product.slug}`;

    if (!evidence.publishable) {
      const crumbs = buildBreadcrumbLd([
        { name: "خانه", path: "/" },
        { name: "فروشگاه", path: "/shop" },
        { name: "محصول", path },
      ]);
      return {
        meta: pageMeta({
          title: "محصول در انتظار تأیید | LBB",
          description:
            "این صفحه تا زمان تأیید هویت و داده‌های محصول، اطلاعات تجاری تأییدنشده را منتشر نمی‌کند.",
          path,
          robots: ROBOTS.NOINDEX_NOFOLLOW,
        }),
        links: canonical(path),
        scripts: [{ type: "application/ld+json", children: JSON.stringify(crumbs) }],
      };
    }

    const image = absAsset(productImage(product.slug));
    const title = `${product.name} | خرید از LBB — ${category.nameFa}`.slice(0, 59);
    const description = `${product.shortDescription} قیمت: ${fmtToman(product.price)}.`.slice(0, 159);
    const productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      sku: product.sku,
      brand: { "@type": "Brand", name: "LBB" },
      description: product.description,
      image: [image],
      size: product.sizes.join("، "),
      offers: {
        "@type": "Offer",
        url: absUrl(path),
        priceCurrency: "IRR",
        price: product.price * 10,
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    };
    const crumbs = buildBreadcrumbLd([
      { name: "خانه", path: "/" },
      { name: "فروشگاه", path: "/shop" },
      { name: category.nameFa, path: `/${category.slug}` },
      { name: product.name, path },
    ]);

    return {
      meta: pageMeta({ title, description, path, image, type: "product", robots: ROBOTS.INDEX_FOLLOW }),
      links: canonical(path),
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productLd) },
        { type: "application/ld+json", children: JSON.stringify(crumbs) },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const p: Product = product;
  const relatedItems: Product[] = related;
  const cat = CATEGORIES[p.category];
  const model = useMemo(() => buildProductDecisionViewModel(p), [p]);
  const [galleryMedia, setGalleryMedia] = useState<DecisionMedia[]>(model.media);

  const updateGallery = useCallback((media: DecisionMedia[]) => setGalleryMedia(media), []);

  useEffect(() => {
    recordRecentlyViewed(p.slug);
  }, [p.slug]);

  useEffect(() => {
    setGalleryMedia(model.media);
  }, [model]);

  const completeTheLook = model.completeTheLookSlugs
    .map((slug) => productBySlug(slug))
    .filter((item): item is Product => Boolean(item))
    .filter((item) => evaluateProductEvidence(item).publishable)
    .slice(0, 4);

  const breadcrumbName = model.identity.name ?? "محصول";

  return (
    <>
      <Navbar theme="light" />
      <main
        dir="rtl"
        className="min-h-screen overflow-x-clip bg-obsidian pb-[calc(9rem+env(safe-area-inset-bottom))] pt-16 md:pb-0"
      >
        <Shell className="py-4">
          <Breadcrumb
            items={[
              { label: "خانه", to: "/" },
              { label: "فروشگاه", to: "/shop" },
              { label: cat.nameFa, to: "/$category", params: { category: cat.slug } },
              { label: breadcrumbName },
            ]}
          />
        </Shell>

        <Shell
          as="section"
          aria-label="تصمیم‌گیری محصول"
          className="grid grid-cols-1 gap-8 pb-12 md:grid-cols-[minmax(0,60%)_minmax(0,40%)] md:gap-10"
        >
          <Gallery media={galleryMedia} name={model.identity.name ?? "محصول"} />
          <ProductPurchasePanel model={model} onMediaChange={updateGallery} />
        </Shell>

        <Band label="PRODUCT DECISION FACTS">
          <Shell className="max-w-[980px]">
            <div className="mb-8">
              <TechLabel tone="signal">SHOW TRUTH / HIDE UNCERTAINTY</TechLabel>
              <h2 className="mt-2 text-display-3 text-bone">اطلاعات تصمیم‌گیری</h2>
              <p className="mt-3 max-w-[68ch] text-sm leading-8 text-metal">
                هر بخش فقط زمانی نمایش داده می‌شود که داده همان محصول منبع قابل استناد و وضعیت تأییدشده داشته باشد.
              </p>
            </div>
            <ProductFacts model={model} />

            {!model.readyForCommerce ? (
              <div className="mt-8">
                <StatePanel title="این رکورد هنوز برای تجارت عمومی منتشر نشده است" tone="warning">
                  داده‌های موجود در کد برای توسعه رابط نگه داشته شده‌اند و تا تکمیل Evidence به‌عنوان قیمت، موجودی، سایز، رنگ یا مشخصات قطعی فروشگاه استفاده نمی‌شوند.
                </StatePanel>
              </div>
            ) : null}

            <div className="mt-8 border-t border-hairline pt-6">
              <p className="text-sm leading-7 text-metal">
                وضعیت ارسال، مرجوعی و راه‌های پشتیبانی مستقل از مشخصات محصول نگهداری می‌شوند.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/shipping-returns" className={CtaClasses("line")}>
                  ارسال و مرجوعی
                  <ArrowUpLeft size={16} aria-hidden="true" />
                </Link>
                <Link to="/contact" className={CtaClasses("line")}>
                  تماس و پشتیبانی
                  <ArrowUpLeft size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Shell>
        </Band>

        {completeTheLook.length > 0 ? (
          <Band label="COMPLETE THE LOOK">
            <Shell>
              <CompleteTheLook products={completeTheLook} />
            </Shell>
          </Band>
        ) : null}

        {relatedItems.length > 0 ? (
          <Band label="RELATED PRODUCTS">
            <Shell>
              <RelatedProducts products={relatedItems} />
            </Shell>
          </Band>
        ) : null}

        <RecentlyViewed excludeSlug={p.slug} />
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
