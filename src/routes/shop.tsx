import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductFilters } from "@/components/lbb/ProductFilters";
import { ProductGridControls } from "@/components/lbb/ProductGridControls";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import {
  activeCount,
  applyFilters,
  parseFilters,
  serializeFilters,
  type Filters,
} from "@/lib/product-filter";

const TITLE = "فروشگاه LBB | خرید پوشاک استریت‌ویر — هودی، شلوار، کتونی";
const DESC =
  "فروشگاه آنلاین LBB: خرید هودی، شلوار، تیشرت، کتونی و اکسسوری استریت‌ویر. بیش از ۵۰ مدل موجود.";

const ALL_COLORS = Array.from(new Set(products.flatMap((p) => p.colors)));
const ALL_SIZES = Array.from(new Set(products.flatMap((p) => p.sizes)));
const PRICE_CEIL = Math.max(...products.map((p) => p.price));
const PAGE_SIZE = 12;

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
  validateSearch: (s: Record<string, unknown>): Filters => parseFilters(s),
  head: ({ match: m }) => {
    const filters = m.search as Filters;
    const filtered = activeCount(filters) > 0;
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESC },
        { name: "robots", content: filtered ? "noindex, follow" : "index, follow" },
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
    };
  },
  component: ShopPage,
});

function ShopPage() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [visible, setVisible] = useState(PAGE_SIZE);

  const setFilters = (f: Filters) => {
    setVisible(PAGE_SIZE);
    navigate({ search: serializeFilters(f), replace: true });
  };

  const filtered = useMemo(() => applyFilters(products, filters), [filters]);
  const shown = filtered.slice(0, visible);

  const filterUi = (
    <ProductFilters
      filters={filters}
      onChange={setFilters}
      colors={ALL_COLORS}
      sizes={ALL_SIZES}
      priceCeil={PRICE_CEIL}
      showCategory
    />
  );

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
            <Link
              to="/shop"
              className="whitespace-nowrap border-b-2 border-[var(--lbb-red)] px-4 py-3 text-sm font-semibold text-black"
            >
              همه
            </Link>
            {CATEGORY_SLUGS.map((s) => (
              <Link
                key={s}
                to="/$category"
                params={{ category: s }}
                className="whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm text-gray-500 hover:text-black"
              >
                {CATEGORIES[s].nameFa}
              </Link>
            ))}
          </div>
        </header>

        <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24">{filterUi}</div>
            </aside>

            <div>
              <ProductGridControls
                filters={filters}
                onChange={setFilters}
                resultCount={filtered.length}
                filterSlot={filterUi}
              />

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-24 text-center">
                  <PackageSearch size={48} className="text-black/15" />
                  <p className="text-base font-semibold text-black">محصولی با این فیلترها پیدا نشد</p>
                  <p className="text-sm text-gray-500">فیلترها را تغییر بده یا همه را پاک کن.</p>
                  <Button
                    onClick={() => setFilters({ ...filters, cats: [], colors: [], sizes: [], max: 0, instock: false, sale: false })}
                    className="mt-2 bg-[var(--lbb-red)] text-white hover:bg-[var(--lbb-red)]/90"
                  >
                    پاک کردن فیلترها
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
                    {shown.map((p) => <ProductCard key={p.id} p={p} />)}
                  </div>
                  {visible < filtered.length && (
                    <div className="mt-8 flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setVisible((v) => v + PAGE_SIZE)}
                        className="h-11 rounded-lg border-black/15 px-8 text-sm font-semibold"
                      >
                        نمایش بیشتر
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
