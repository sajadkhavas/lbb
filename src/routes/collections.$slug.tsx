import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductCard } from "@/components/lbb/ProductCard";
import { collectionBySlug, type Collection } from "@/lib/collections";
import { products, type Product } from "@/lib/products";
import { Shell, Band, SectionHead, CtaClasses } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd, absUrl } from "@/lib/site";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }): { collection: Collection; items: Product[] } => {
    const collection = collectionBySlug(params.slug);
    if (!collection) throw notFound();
    const items = collection.productSlugs
      .map((s) => products.find((p) => p.slug === s))
      .filter((p): p is Product => Boolean(p));
    return { collection, items };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex" }] };
    const { collection: c, items } = loaderData;
    const path = `/collections/${c.slug}`;
    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: c.nameFa,
      description: c.description,
      url: absUrl(path),
    };
    const itemListLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: c.nameFa,
      numberOfItems: items.length,
      itemListElement: items.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absUrl(`/product/${p.slug}`),
        name: p.name,
      })),
    };
    return {
      meta: pageMeta({ title: c.metaTitle, description: c.metaDesc, path }),
      links: canonical(path),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: "کالکشن‌ها", path: "/collections" },
              { name: c.nameFa, path },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(collectionLd) },
        { type: "application/ld+json", children: JSON.stringify(itemListLd) },
      ],
    };
  },
  notFoundComponent: () => (
    <>
      <Navbar theme="light" />
      <main className="grid min-h-screen place-items-center bg-obsidian pt-16 text-bone">
        <div className="text-center">
          <h1 className="text-display-3">این کالکشن پیدا نشد</h1>
          <Link to="/collections" className={CtaClasses("line") + " mt-4"}>
            بازگشت به کالکشن‌ها
          </Link>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  ),
  component: CollectionDetailPage,
});

function CollectionDetailPage() {
  const { collection: c, items }: { collection: Collection; items: Product[] } = Route.useLoaderData();

  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "کالکشن‌ها", href: "/collections" }, { label: c.nameFa }]} />
        </Shell>

        <Band hairline={false} className="pb-0 pt-6">
          <Shell>
            <SectionHead label={c.slug} title={c.nameFa} lede={c.tagline} />
            <p className="mt-6 max-w-[64ch] text-sm leading-8 text-metal">{c.description}</p>
          </Shell>
        </Band>

        <Band>
          <Shell>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {items.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
