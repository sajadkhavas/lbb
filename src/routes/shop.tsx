import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { products } from "@/lib/products";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";

const TITLE = "فروشگاه LBB | خرید پوشاک استریت‌ویر — هودی، شلوار، کتونی";
const DESC =
  "فروشگاه آنلاین LBB: خرید هودی، شلوار، تیشرت، کتونی و اکسسوری استریت‌ویر. بیش از ۵۰ مدل موجود.";

const itemListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "محصولات فروشگاه LBB",
  numberOfItems: products.length,
  itemListElement: products.slice(0, 20).map((p, i) => ({
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
    { "@type": "ListItem", position: 2, name: "فروشگاه", item: "/shop" },
  ],
};

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
      { type: "application/ld+json", children: JSON.stringify(itemListLd) },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-16 text-black" style={{ paddingBottom: "80px", fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "فروشگاه" }]} />
          </div>
        </div>

        <header className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8 md:py-10">
            <h1 className="text-3xl font-bold text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              فروشگاه
            </h1>
            <p className="mt-2 text-sm text-gray-500">{products.length} محصول موجود</p>
          </div>
          <div className="mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-4 md:px-8">
            <a
              href="/shop"
              className="whitespace-nowrap border-b-2 border-[var(--lbb-red)] px-4 py-3 text-sm font-semibold text-black"
            >
              همه
            </a>
            {CATEGORY_SLUGS.map((s) => (
              <a
                key={s}
                href={`/${s}`}
                className="whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm text-gray-500 hover:text-black"
              >
                {CATEGORIES[s].nameFa}
              </a>
            ))}
          </div>
        </header>

        <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
