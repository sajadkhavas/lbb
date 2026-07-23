import { createFileRoute, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CATEGORIES, CATEGORY_SLUGS, isValidCategory } from "@/lib/categories";
import { productsByCategory } from "@/lib/products";

export const Route = createFileRoute("/$category")({
  beforeLoad: ({ params }) => {
    if (!isValidCategory(params.category)) throw notFound();
  },
  loader: ({ params }) => {
    const cat = CATEGORIES[params.category as keyof typeof CATEGORIES];
    return { cat, items: productsByCategory(cat.slug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex" }] };
    const { cat, items } = loaderData;
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
        { "@type": "ListItem", position: 2, name: "فروشگاه", item: "/shop" },
        { "@type": "ListItem", position: 3, name: cat.nameFa, item: `/${cat.slug}` },
      ],
    };
    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: cat.h1,
      description: cat.metaDesc,
      url: `/${cat.slug}`,
    };
    const itemListLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: cat.h1,
      numberOfItems: items.length,
      itemListElement: items.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `/product/${p.slug}`,
        name: p.name,
      })),
    };
    return {
      meta: [
        { title: cat.metaTitle },
        { name: "description", content: cat.metaDesc },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: cat.metaTitle },
        { property: "og:description", content: cat.metaDesc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/${cat.slug}` },
      ],
      links: [{ rel: "canonical", href: `/${cat.slug}` }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
        { type: "application/ld+json", children: JSON.stringify(collectionLd) },
        { type: "application/ld+json", children: JSON.stringify(itemListLd) },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat, items } = Route.useLoaderData();
  return (
    <>
      <Navbar theme="light" />
      <main
        dir="rtl"
        className="min-h-screen bg-white pt-16 text-black"
        style={{ paddingBottom: "80px", fontFamily: "'Vazirmatn', sans-serif" }}
      >
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb
              items={[
                { label: "خانه", href: "/" },
                { label: "فروشگاه", href: "/shop" },
                { label: cat.nameFa },
              ]}
            />
          </div>
        </div>

        {/* Hero */}
        <section className="border-b border-black/[0.06]">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[40%_60%] md:px-8 md:py-10">
            <div className="grid aspect-[4/3] place-items-center rounded-xl bg-gray-50 md:aspect-auto">
              <span
                className="font-black text-black/[0.08]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 96 }}
              >
                {cat.nameFa}
              </span>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {cat.h1}
              </h1>
              <p className="text-base text-gray-600">{cat.heroTagline}</p>
              <p className="text-sm font-semibold text-[var(--lbb-red)]">
                {items.length} محصول موجود
              </p>
            </div>
          </div>
        </section>

        {/* SEO text */}
        <section className="mx-auto max-w-[900px] px-4 py-8 md:px-8">
          <h2 className="mb-3 text-base font-semibold">{cat.nameFaPlural} استریت‌ویر LBB</h2>
          <p className="text-sm leading-8 text-gray-600">{cat.seoText}</p>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-[1280px] px-4 pb-16 md:px-8">
          {items.length === 0 ? (
            <div className="py-16 text-center text-gray-500">فعلاً محصولی در این دسته موجود نیست.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              {items.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </section>

        {/* Related categories */}
        <section className="border-t border-black/[0.06] py-10">
          <div className="mx-auto max-w-[1280px] px-4 md:px-8">
            <h3 className="mb-4 text-sm font-semibold">دسته‌بندی‌های مرتبط</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {CATEGORY_SLUGS.filter((s) => s !== cat.slug).slice(0, 4).map((s) => (
                <a
                  key={s}
                  href={`/${s}`}
                  className="grid h-24 place-items-center rounded-xl bg-gray-50 text-sm font-semibold hover:bg-gray-100"
                >
                  {CATEGORIES[s].nameFa}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
