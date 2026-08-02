import { useMemo, useState, useTransition } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductFilters } from "@/components/lbb/ProductFilters";
import { ProductGridControls } from "@/components/lbb/ProductGridControls";
import { Shell, Band, TechLabel, GridSkeleton, EmptyState, CtaClasses } from "@/components/lbb/ui/primitives";
import { products } from "@/lib/products";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";
import {
  activeCount,
  applyFilters,
  parseFilters,
  serializeFilters,
  type Filters,
} from "@/lib/product-filter";

const TITLE = "فروشگاه | خرید هودی، شلوار، تیشرت و کتونی — LBB";
const DESC = `فروشگاه آنلاین LBB: ${products.length.toLocaleString("fa-IR")} محصول استریت‌ویر شامل هودی، شلوار، تیشرت، کتونی و اکسسوری.`;

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

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Filters => parseFilters(s),
  head: ({ match: m }) => {
    const filters = m.search as Filters;
    const filtered = activeCount(filters) > 0;
    return {
      meta: pageMeta({ title: TITLE, description: DESC, path: "/shop", type: "website", noindex: filtered }),
      links: canonical("/shop"),
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd([{ name: "خانه", path: "/" }, { name: "فروشگاه", path: "/shop" }])) },
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
  const [isPending, startTransition] = useTransition();

  const setFilters = (f: Filters) => {
    startTransition(() => {
      setVisible(PAGE_SIZE);
      navigate({ search: serializeFilters(f), replace: true });
    });
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
      <Navbar theme="dark" />
      <main dir="rtl" className="min-h-screen bg-obsidian pt-[var(--lbb-nav-h)] pb-bottombar md:pb-0">
        <Shell className="border-b border-hairline py-4">
          <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "فروشگاه" }]} />
        </Shell>

        <header className="border-b border-hairline">
          <Shell className="py-10 md:py-14">
            <TechLabel tone="signal">SHOP ALL</TechLabel>
            <h1 className="text-display-2 mt-3 text-bone">فروشگاه</h1>
            <p className="tech mt-3 text-metal">{products.length.toLocaleString("fa-IR")} محصول موجود</p>
          </Shell>
          <Shell className="flex gap-1 overflow-x-auto pb-1">
            <Link to="/shop" className="tech whitespace-nowrap border-b-2 border-signal px-4 py-3 text-signal">
              همه
            </Link>
            {CATEGORY_SLUGS.map((s) => (
              <Link
                key={s}
                to="/$category"
                params={{ category: s }}
                className="tech whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-metal transition-colors hover:text-bone"
              >
                {CATEGORIES[s].nameFa}
              </Link>
            ))}
          </Shell>
        </header>

        <Band hairline={false} className="!py-10 md:!py-14">
          <Shell>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
              <aside className="hidden lg:block">
                <div className="sticky top-[calc(var(--lbb-nav-h)+24px)]">{filterUi}</div>
              </aside>

              <div>
                <ProductGridControls
                  filters={filters}
                  onChange={setFilters}
                  resultCount={filtered.length}
                  filterSlot={filterUi}
                />

                {isPending ? (
                  <div className="mt-6">
                    <GridSkeleton count={8} />
                  </div>
                ) : filtered.length === 0 ? (
                  <EmptyState
                    className="mt-6"
                    icon={<PackageSearch size={40} aria-hidden="true" />}
                    title="محصولی با این فیلترها پیدا نشد"
                    body="فیلترها را تغییر بده یا همه را پاک کن."
                    action={
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, cats: [], colors: [], sizes: [], max: 0, instock: false, sale: false })}
                        className={CtaClasses("signal")}
                      >
                        پاک کردن فیلترها
                      </button>
                    }
                  />
                ) : (
                  <>
                    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                      {shown.map((p) => (
                        <ProductCard key={p.id} p={p} />
                      ))}
                    </div>
                    {visible < filtered.length ? (
                      <div className="mt-10 flex justify-center">
                        <button
                          type="button"
                          onClick={() => setVisible((v) => v + PAGE_SIZE)}
                          className={CtaClasses("line")}
                        >
                          نمایش بیشتر
                        </button>
                      </div>
                    ) : (
                      <p className="tech mt-10 text-center text-mute">پایان نتایج</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </Shell>
        </Band>
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}
