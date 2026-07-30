import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductCard } from "@/components/lbb/ProductCard";
import { collectionBySlug, type Collection } from "@/lib/collections";
import { products, type Product } from "@/lib/products";

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
    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: c.nameFa,
      description: c.description,
      url: `/collections/${c.slug}`,
    };
    const itemListLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: c.nameFa,
      numberOfItems: items.length,
      itemListElement: items.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `/product/${p.slug}`,
        name: p.name,
      })),
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
        { "@type": "ListItem", position: 2, name: "کالکشن‌ها", item: "/collections" },
        { "@type": "ListItem", position: 3, name: c.nameFa, item: `/collections/${c.slug}` },
      ],
    };
    return {
      meta: [
        { title: c.metaTitle },
        { name: "description", content: c.metaDesc },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: c.metaTitle },
        { property: "og:description", content: c.metaDesc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/collections/${c.slug}` },
      ],
      links: [{ rel: "canonical", href: `/collections/${c.slug}` }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
        { type: "application/ld+json", children: JSON.stringify(collectionLd) },
        { type: "application/ld+json", children: JSON.stringify(itemListLd) },
      ],
    };
  },
  notFoundComponent: () => (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="grid min-h-screen place-items-center bg-white pt-16 text-black" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold">این کالکشن پیدا نشد</h1>
          <Link to="/collections" className="mt-4 inline-block text-[var(--lbb-red)]">بازگشت به کالکشن‌ها</Link>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  ),
  component: CollectionDetailPage,
});

function CollectionDetailPage() {
  const { collection: c, items }: { collection: Collection; items: Product[] } =
    Route.useLoaderData();

  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-16 text-black" style={{ paddingBottom: 80, fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "کالکشن‌ها", href: "/collections" }, { label: c.nameFa }]} />
          </div>
        </div>

        <header className="relative flex h-[35vh] items-center justify-center overflow-hidden bg-black text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--lbb-red)]/40 via-transparent to-black" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-3xl font-black md:text-5xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {c.nameFa}
            </h1>
            <p className="mt-3 text-sm text-white/70">{c.tagline}</p>
          </div>
        </header>

        <section className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
          <p className="max-w-[720px] text-sm leading-8 text-gray-600">{c.description}</p>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pb-16 md:px-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {items.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
