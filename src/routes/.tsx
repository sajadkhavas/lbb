import { useMemo, useState, useTransition } from "react";
import { createFileRoute, notFound, Link, useNavigate } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductFilters } from "@/components/lbb/ProductFilters";
import { ProductGridControls } from "@/components/lbb/ProductGridControls";
import { Shell, Band, TechLabel, GridSkeleton, EmptyState, CtaClasses, Frame } from "@/components/lbb/ui/primitives";
import { CATEGORIES, CATEGORY_SLUGS, isValidCategory } from "@/lib/categories";
import { productsByCategory, type Product } from "@/lib/products";
import { productImage } from "@/lib/product-images";
import { categoryImage } from "@/lib/category-images";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";
import {
  activeCount,
  applyFilters,
  parseFilters,
  serializeFilters,
  type Filters,
} from "@/lib/product-filter";

const PAGE_SIZE = 12;

export const Route = createFileRoute("/$category")({
  beforeLoad: ({ params }) => {
    if (!isValidCategory(params.category)) throw notFound();
  },
  validateSearch: (s: Record<string, unknown>): Filters => parseFilters(s),
  loader: ({ params }) => {
    const cat = CATEGORIES[params.category as keyof typeof CATEGORIES];
    return { cat, items: productsByCategory(cat.slug) };
  },
  head: ({ loaderData, match: m }) => {
    if (!loaderData) {
      return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex, nofollow" }] };
    }
    const { cat, items } = loaderData;
    const filters = m.search as Filters;
    const filtered = activeCount(filters) > 0;
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
      meta: pageMeta({ title: cat.metaTitle, description: cat.metaDesc, path: `/${cat.slug}`, type: "website", noindex: filtered }),
      links: canonical(`/${cat.slug}`),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: "فروشگاه", path: "/shop" },
              { name: cat.nameFa, path: `/${cat.slug}` },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(collectionLd) },
        { type: "application/ld+json", children: JSON.stringify(itemListLd) },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat, items } = Route.useLoaderData();
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: "/$category" });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();

  const setFilters = (f: Filters) => {
    startTransition(() => {
      setVisible(PAGE_SIZE);
      navigate({ search: serializeFilters(f), replace: true });
    });
  };

  const colors = useMemo(() => Array.from(new Set<string>(items.flatMap((p: Product) => p.colors))), [items]);
  const sizes = useMemo(() => Array.from(new Set<string>(items.flatMap((p: Product) => p.sizes))), [items]);
  const priceCeil = useMemo(() => Math.max(1, ...items.map((p: Product) => p.price)), [items]);

  const filtered = useMemo(() => applyFilters(items, filters), [items, filters]);
  const shown = filtered.slice(0, visible);

  const filterUi = (
    <ProductFilters filters={filters} onChange={setFilters} colors={colors} sizes={sizes} priceCeil={priceCeil} />
  );

  return (
    <>
      <Navbar theme="dark" />
      <main dir="rtl" className="min-h-screen bg-obsidian pt-[var(--lbb-nav-h)] pb-bottombar md:pb-0">
        <Shell className="border-b border-hairline py-4">
          <Breadcrumb
            items={[{ label: "خانه", to: "/" }, { label: "فروشگاه", to: "/shop" }, { label: cat.nameFa }]}
          />
        </Shell>

        {/* Hero */}
        <section className="border-b border-hairline">
          <Shell className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[40%_60%] md:py-14">
            <Frame src={categoryImage(cat.slug)} alt={`دستهٔ ${cat.nameFa}`} ratio="4/3" width={800} height={600} />
            <div className="flex flex-col justify-center gap-3">
              <TechLabel tone="signal">{cat.nameFa.toUpperCase()}</TechLabel>
              <h1 className="text-display-2 text-bone">{cat.h1}</h1>
              <p className="text-lede">{cat.heroTagline}</p>
              <p className="tech text-signal">{items.length.toLocaleString("fa-IR")} محصول موجود</p>
            </div>
          </Shell>
        </section>

        {/* SEO text */}
        <section className="border-b border-hairline">
          <div className="lbb-read py-8">
            <h2 className="mb-3 text-sm font-semibold text-bone">{cat.nameFaPlural} استریت‌ویر LBB</h2>
            <p className="text-sm leading-8 text-metal">{cat.seoText}</p>
          </div>
        </section>

        {/* Grid */}
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
                  lockedCategory
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
                        onClick={() => setFilters({ ...filters, colors: [], sizes: [], max: 0, instock: false, sale: false })}
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
                        <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className={CtaClasses("line")}>
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

        {/* Related categories */}
        <section className="border-t border-hairline py-10">
          <Shell>
            <TechLabel>دسته‌بندی‌های مرتبط</TechLabel>
            <div className="mt-4 grid grid-cols-2 gap-px bg-hairline md:grid-cols-4">
              {CATEGORY_SLUGS.filter((s) => s !== cat.slug).slice(0, 4).map((s) => (
                <Link
                  key={s}
                  to="/$category"
                  params={{ category: s }}
                  className="group relative block overflow-hidden bg-obsidian"
                >
                  <Frame src={categoryImage(s)} alt={`دستهٔ ${CATEGORIES[s].nameFa}`} ratio="4/3" width={800} height={600} imgClassName="opacity-70 group-hover:opacity-100" />
                  <span className="absolute bottom-2.5 end-3 text-sm font-bold text-bone">{CATEGORIES[s].nameFa}</span>
                </Link>
              ))}
            </div>
          </Shell>
        </section>
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}
