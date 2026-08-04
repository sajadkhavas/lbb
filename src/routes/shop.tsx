import { useEffect, useMemo, useState, useTransition } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductFilters } from "@/components/lbb/ProductFilters";
import { ProductGridControls } from "@/components/lbb/ProductGridControls";
import {
  Band,
  CtaClasses,
  EmptyState,
  GridSkeleton,
  Shell,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { products } from "@/lib/product-catalog";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { absUrl, breadcrumbLd, canonical, pageMeta } from "@/lib/site";
import {
  applyFilters,
  hasSearchModifiers,
  isCanonicalSearch,
  normalizeFilters,
  parseFilterSearch,
  parseFilters,
  serializeFilters,
  stableSearchString,
  type FilterScope,
  type Filters,
} from "@/lib/product-filter";

const TITLE = "فروشگاه | خرید هودی، شلوار، تیشرت و کتونی — LBB";
const DESC =
  "فروشگاه آنلاین LBB برای مشاهده مجموعه استریت‌ویر شامل هودی، شلوار، تیشرت، کتونی و جوراب.";
const PAGE_SIZE = 12;

function createFilterScope(): Required<Pick<FilterScope, "colors" | "sizes" | "priceCeil">> {
  return {
    colors: Array.from(new Set(products.flatMap((product) => product.colors))),
    sizes: Array.from(new Set(products.flatMap((product) => product.sizes))),
    priceCeil: Math.max(1, ...products.map((product) => product.price)),
  };
}

function createItemListLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "محصولات فروشگاه LBB",
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absUrl(`/product/${product.slug}`),
      name: product.name,
    })),
  };
}

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => parseFilterSearch(search),
  head: ({ match }) => {
    const filters = parseFilters(match.search as unknown as Record<string, unknown>);
    return {
      meta: pageMeta({
        title: TITLE,
        description: DESC,
        path: "/shop",
        type: "website",
        noindex: hasSearchModifiers(filters),
      }),
      links: canonical("/shop"),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: "فروشگاه", path: "/shop" },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(createItemListLd()) },
      ],
    };
  },
  component: ShopPage,
});

function ShopPage() {
  const routeFilters = Route.useSearch();
  const filterScope = useMemo(() => createFilterScope(), []);
  const filters = useMemo(
    () =>
      normalizeFilters(
        parseFilters(routeFilters as unknown as Record<string, unknown>),
        filterScope,
      ),
    [filterScope, routeFilters],
  );
  const navigate = useNavigate({ from: "/shop" });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();
  const searchKey = stableSearchString(serializeFilters(filters));

  useEffect(() => setVisible(PAGE_SIZE), [searchKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const expected = serializeFilters(filters);
    if (!isCanonicalSearch(window.location.search, expected)) {
      navigate({ search: expected, replace: true });
    }
  }, [filters, navigate]);

  const setFilters = (nextFilters: Filters) => {
    const normalized = normalizeFilters(nextFilters, filterScope);
    startTransition(() => navigate({ search: serializeFilters(normalized), replace: false }));
  };

  const filtered = useMemo(() => applyFilters(products, filters), [filters]);
  const shown = filtered.slice(0, visible);
  const filterUi = (
    <ProductFilters
      filters={filters}
      onChange={setFilters}
      colors={filterScope.colors}
      sizes={filterScope.sizes}
      priceCeil={filterScope.priceCeil}
      showCategory
    />
  );

  return (
    <>
      <Navbar theme="dark" />
      <main
        dir="rtl"
        className="min-h-screen bg-obsidian pb-bottombar pt-[var(--lbb-nav-h)] md:pb-0"
      >
        <Shell className="border-b border-hairline py-4">
          <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "فروشگاه" }]} />
        </Shell>

        <header className="border-b border-hairline">
          <Shell className="py-10 md:py-14">
            <TechLabel tone="signal">SHOP ALL</TechLabel>
            <h1 className="text-display-2 mt-3 text-bone">فروشگاه</h1>
            <p className="tech mt-3 text-metal">
              {products.length.toLocaleString("fa-IR")} محصول موجود
            </p>
          </Shell>
          <Shell className="flex snap-x gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link
              to="/shop"
              className="tech min-h-11 shrink-0 snap-start whitespace-nowrap border-b-2 border-signal px-4 py-3 text-signal"
            >
              همه
            </Link>
            {CATEGORY_SLUGS.map((slug) => (
              <Link
                key={slug}
                to="/$category"
                params={{ category: slug }}
                className="tech min-h-11 shrink-0 snap-start whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-metal transition-colors hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                {CATEGORIES[slug].nameFa}
              </Link>
            ))}
          </Shell>
        </header>

        <Band hairline={false} className="!py-10 md:!py-14">
          <Shell>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
              <aside className="hidden lg:block" aria-label="فیلتر محصولات">
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
                  <div className="mt-6" aria-busy="true" aria-label="در حال به‌روزرسانی محصولات">
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
                        onClick={() =>
                          setFilters({
                            ...filters,
                            cats: [],
                            colors: [],
                            sizes: [],
                            max: 0,
                            instock: false,
                            sale: false,
                          })
                        }
                        className={CtaClasses("signal")}
                      >
                        پاک کردن فیلترها
                      </button>
                    }
                  />
                ) : (
                  <>
                    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                      {shown.map((product, index) => (
                        <ProductCard key={product.id} p={product} priority={index < 2} />
                      ))}
                    </div>
                    {visible < filtered.length ? (
                      <div className="mt-10 flex justify-center">
                        <button
                          type="button"
                          onClick={() => setVisible((value) => value + PAGE_SIZE)}
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
