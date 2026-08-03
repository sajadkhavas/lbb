import { useMemo, useState } from "react";
import { createFileRoute, notFound, Link, useNavigate } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductFilters } from "@/components/lbb/ProductFilters";
import { ProductGridControls } from "@/components/lbb/ProductGridControls";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CATEGORY_SLUGS, isValidCategory } from "@/lib/categories";
import { categoryImage } from "@/lib/category-images";
import { productsByCategory, type Product } from "@/lib/products";
import { pageMeta, canonical, breadcrumbLd, absUrl, absAsset } from "@/lib/site";
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
    if (!loaderData) return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex" }] };
    const { cat, items } = loaderData;
    const filters = m.search as Filters;
    const filtered = activeCount(filters) > 0;

    const crumbLd = breadcrumbLd([
      { name: "خانه", path: "/" },
      { name: "فروشگاه", path: "/shop" },
      { name: cat.nameFa, path: `/${cat.slug}` },
    ]);
    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: cat.h1,
      description: cat.metaDesc,
      url: absUrl(`/${cat.slug}`),
    };
    const itemListLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: cat.h1,
      numberOfItems: items.length,
      itemListElement: items.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absUrl(`/product/${p.slug}`),
        name: p.name,
      })),
    };
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: cat.faqs.map((f: { q: string; a: string }) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    return {
      meta: pageMeta({
        title: cat.metaTitle,
        description: cat.metaDesc,
        path: `/${cat.slug}`,
        image: absAsset(categoryImage(cat.slug)),
        noindex: filtered,
      }),
      links: canonical(`/${cat.slug}`),
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(crumbLd) },
        { type: "application/ld+json", children: JSON.stringify(collectionLd) },
        { type: "application/ld+json", children: JSON.stringify(itemListLd) },
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
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

  const setFilters = (f: Filters) => {
    setVisible(PAGE_SIZE);
    navigate({ search: serializeFilters(f), replace: true });
  };

  const colors = useMemo(() => Array.from(new Set<string>(items.flatMap((p: Product) => p.colors))), [items]);
  const sizes = useMemo(() => Array.from(new Set<string>(items.flatMap((p: Product) => p.sizes))), [items]);
  const priceCeil = useMemo(() => Math.max(1, ...items.map((p: Product) => p.price)), [items]);

  const filtered = useMemo(() => applyFilters(items, filters), [items, filters]);
  const shown = filtered.slice(0, visible);

  const filterUi = (
    <ProductFilters
      filters={filters}
      onChange={setFilters}
      colors={colors}
      sizes={sizes}
      priceCeil={priceCeil}
    />
  );

  return (
    <>
      <Navbar theme="light" />
      <main
        dir="rtl"
        className="min-h-screen bg-white pt-16 text-black"
        style={{ paddingBottom: "80px", fontFamily: "var(--font-body)" }}
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
            <div className="overflow-hidden rounded-2xl bg-gray-50">
              <img
                src={categoryImage(cat.slug)}
                alt={`مدل در حال پوشیدن ${cat.nameFaPlural} استریت‌ویر LBB`}
                width={640}
                height={480}
                loading="eager"
                fetchPriority="high"
                className="aspect-[4/3] h-full w-full object-cover md:aspect-auto"
              />
            </div>
            <div className="flex flex-col justify-center gap-3">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {cat.h1}
              </h1>
              <p className="text-base text-gray-600">{cat.heroTagline}</p>
              <p className="text-sm font-semibold text-[var(--lbb-red)]">
                {items.length.toLocaleString("fa-IR")} محصول موجود
              </p>
              <ul className="mt-2 flex flex-col gap-2 text-sm text-gray-700">
                {cat.bullets.map((b: string) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--lbb-red)]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-8 md:px-8">
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
                lockedCategory
              />

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-24 text-center">
                  <PackageSearch size={48} className="text-black/15" />
                  <p className="text-base font-semibold text-black">محصولی با این فیلترها پیدا نشد</p>
                  <p className="text-sm text-gray-500">فیلترها را تغییر بده یا همه را پاک کن.</p>
                  <Button
                    onClick={() => setFilters({ ...filters, colors: [], sizes: [], max: 0, instock: false, sale: false })}
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
        </section>

        {/* SEO / AEO content */}
        <section className="border-t border-black/[0.06] bg-gray-50/60 py-10">
          <div className="mx-auto max-w-[900px] px-4 md:px-8">
            <h2 className="mb-3 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {cat.nameFaPlural} استریت‌ویر LBB چه ویژگی‌هایی دارن؟
            </h2>
            <p className="text-sm leading-8 text-gray-700">{cat.seoText}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10">
          <div className="mx-auto max-w-[900px] px-4 md:px-8">
            <h2 className="mb-4 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              سوالات متداول درباره {cat.nameFaPlural}
            </h2>
            <div className="divide-y divide-black/[0.06] border-t border-black/[0.06]">
              {cat.faqs.map((f: { q: string; a: string }) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold">
                    {f.q}
                    <span className="shrink-0 transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="mt-3 text-sm leading-8 text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related categories */}
        <section className="border-t border-black/[0.06] py-10">
          <div className="mx-auto max-w-[1280px] px-4 md:px-8">
            <h3 className="mb-4 text-sm font-semibold">دسته‌بندی‌های مرتبط</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {CATEGORY_SLUGS.filter((s) => s !== cat.slug).slice(0, 4).map((s) => (
                <Link
                  key={s}
                  to="/$category"
                  params={{ category: s }}
                  className="grid h-24 place-items-center rounded-xl bg-gray-50 text-sm font-semibold hover:bg-gray-100"
                >
                  {CATEGORIES[s].nameFa}
                </Link>
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
