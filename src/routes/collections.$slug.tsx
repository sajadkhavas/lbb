import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowUpLeft, Layers3 } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductCard } from "@/components/lbb/ProductCard";
import { collectionBySlug, type Collection } from "@/lib/collections";
import { products, type Product } from "@/lib/products";
import { productImage } from "@/lib/product-images";
import {
  Band,
  CtaClasses,
  EmptyState,
  Frame,
  SectionHead,
  Shell,
  StatusTag,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd, absUrl } from "@/lib/site";
import { EMPTY_FILTERS } from "@/lib/product-filter";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }): { collection: Collection; items: Product[] } => {
    const collection = collectionBySlug(params.slug);
    if (!collection) throw notFound();

    const items = collection.productSlugs
      .map((slug) => products.find((product) => product.slug === slug))
      .filter((product): product is Product => Boolean(product));

    return { collection, items };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "کالکشن پیدا نشد" }, { name: "robots", content: "noindex, nofollow" }],
      };
    }

    const { collection, items } = loaderData;
    const path = `/collections/${collection.slug}`;
    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: collection.nameFa,
      description: collection.description,
      url: absUrl(path),
      inLanguage: "fa-IR",
    };
    const itemListLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: collection.nameFa,
      numberOfItems: items.length,
      itemListElement: items.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absUrl(`/product/${product.slug}`),
        name: product.name,
      })),
    };

    return {
      meta: pageMeta({
        title: collection.metaTitle,
        description: collection.metaDesc,
        path,
        image: productImage(collection.productSlugs[0]),
      }),
      links: canonical(path),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: "کالکشن‌ها", path: "/collections" },
              { name: collection.nameFa, path },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(collectionLd) },
        { type: "application/ld+json", children: JSON.stringify(itemListLd) },
      ],
    };
  },
  notFoundComponent: CollectionNotFound,
  component: CollectionDetailPage,
});

function CollectionNotFound() {
  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16">
        <Shell className="py-3">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "کالکشن‌ها", href: "/collections" },
              { label: "پیدا نشد" },
            ]}
          />
        </Shell>
        <Band hairline={false}>
          <Shell>
            <EmptyState
              icon={<Layers3 aria-hidden="true" size={34} />}
              title="این کالکشن پیدا نشد"
              body="آدرس کالکشن معتبر نیست یا این صفحه دیگر در فهرست کالکشن‌های LBB قرار ندارد."
              action={
                <Link to="/collections" className={CtaClasses("signal")}>
                  بازگشت به کالکشن‌ها
                </Link>
              }
            />
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}

function CollectionDetailPage() {
  const { collection, items }: { collection: Collection; items: Product[] } = Route.useLoaderData();
  const heroProduct = items[0];

  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16">
        <Shell className="py-3">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "کالکشن‌ها", href: "/collections" },
              { label: collection.nameFa },
            ]}
          />
        </Shell>

        <Band hairline={false} className="pb-10 pt-8 md:pb-14 md:pt-12">
          <Shell className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="flex flex-col justify-center">
              <TechLabel tone="signal">{collection.latinName}</TechLabel>
              <h1 className="mt-5 text-display-1 text-bone">{collection.nameFa}</h1>
              <p className="text-lede mt-5 max-w-[52ch]">{collection.tagline}</p>
              <p className="mt-6 max-w-[64ch] text-sm leading-8 text-metal">
                {collection.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {collection.storyPoints.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-hairline px-3 py-1.5 text-[11px] text-metal"
                  >
                    {point}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#collection-products" className={CtaClasses("signal")}>
                  مشاهده قطعه‌ها
                </a>
                <Link to="/collections" className={CtaClasses("line")}>
                  همه کالکشن‌ها
                </Link>
              </div>
            </div>

            {heroProduct ? (
              <Frame
                src={productImage(heroProduct.slug)}
                alt={`محصول اصلی ${collection.nameFa}: ${heroProduct.name}`}
                ratio="4/5"
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="rounded-2xl border border-hairline"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-transparent to-transparent" />
                <StatusTag
                  tone="neutral"
                  className="absolute inset-inline-end-4 top-4 rounded-lg backdrop-blur"
                >
                  {items.length.toLocaleString("fa-IR")} قطعه
                </StatusTag>
                <div className="absolute inset-x-5 bottom-5">
                  <TechLabel tone="bone">FEATURED PIECE</TechLabel>
                  <p className="mt-2 text-lg font-bold text-bone">{heroProduct.name}</p>
                </div>
              </Frame>
            ) : null}
          </Shell>
        </Band>

        <Band id="collection-products" label={`محصولات ${collection.nameFa}`}>
          <Shell>
            <SectionHead
              index="PIECES"
              label={collection.latinName}
              title="قطعه‌های این کالکشن"
              lede="هر کارت به صفحه واقعی محصول می‌رود؛ رنگ، سایز و موجودی را پیش از افزودن به سبد بررسی کنید."
            />

            {items.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
                {items.map((product) => (
                  <ProductCard key={product.id} p={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                className="mt-8"
                icon={<Layers3 aria-hidden="true" size={32} />}
                title="محصولی برای این کالکشن ثبت نشده"
                body="فهرست این کالکشن در حال حاضر به محصول فعالی متصل نیست."
                action={
                  <Link to="/shop" search={EMPTY_FILTERS} className={CtaClasses("signal")}>
                    رفتن به فروشگاه
                  </Link>
                }
              />
            )}
          </Shell>
        </Band>

        <Band>
          <Shell className="grid gap-6 rounded-2xl border border-hairline bg-carbon p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <TechLabel tone="signal">EDITORIAL NOTE</TechLabel>
              <h2 className="mt-3 text-display-3 text-bone">یادداشت استایلینگ</h2>
              <p className="mt-3 max-w-[68ch] text-sm leading-8 text-metal">
                {collection.editorialNote}
              </p>
            </div>
            <Link to="/lookbook" className={CtaClasses("line")}>
              دیدن لوک‌بوک
              <ArrowUpLeft aria-hidden="true" size={16} />
            </Link>
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
