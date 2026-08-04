import { useEffect, useMemo, useState, useTransition } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
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
import { CATEGORIES, CATEGORY_SLUGS, isValidCategory } from "@/lib/categories";
import { categoryImage } from "@/lib/category-images";
import { productsByCategory, type Product } from "@/lib/products";
import { absAsset, absUrl, breadcrumbLd, canonical, pageMeta } from "@/lib/site";
import {
  applyFilters,
  hasSearchModifiers,
  isCanonicalSearch,
  normalizeFilters,
  parseFilters,
  serializeFilters,
  stableSearchString,
  type Filters,
} from "@/lib/product-filter";

const PAGE_SIZE = 12;

export const Route = createFileRoute("/$category")({
  beforeLoad: ({ params }) => {
    if (!isValidCategory(params.category)) throw notFound();
  },
  validateSearch: (search: Record<string, unknown>): Filters => parseFilters(search),
  loader: ({ params }) => {
    const cat = CATEGORIES[params.category as keyof typeof CATEGORIES];
    return { cat, items: productsByCategory(cat.slug) };
  },
  head: ({ loaderData, match }) => {
    if (!loaderData)
      return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex" }] };
    const { cat, items } = loaderData;
    const filters = match.search as Filters;
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
      itemListElement: items.slice(0, 20).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absUrl(`/product/${product.slug}`),
        name: product.name,
      })),
    };
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: cat.faqs.map((faq: { q: string; a: string }) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    };

    return {
      meta: pageMeta({
        title: cat.metaTitle,
        description: cat.metaDesc,
        path: `/${cat.slug}`,
        image: absAsset(categoryImage(cat.slug)),
        noindex: hasSearchModifiers(filters),
      }),
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
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat, items } = Route.useLoaderData();
  const routeFilters = Route.useSearch();
  const navigate = useNavigate({ from: "/$category" });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();

  const colors = useMemo(
    () => Array.from(new Set<string>(items.flatMap((product: Product) => product.colors))),
    [items],
  );
  const sizes = useMemo(
    () => Array.from(new Set<string>(items.flatMap((product: Product) => product.sizes))),
    [items],
  );
  const priceCeil = useMemo(
    () => Math.max(1, ...items.map((product: Product) => product.price)),
    [items],
  );
  const scope = useMemo(
    () => ({ categories: false as const, colors, sizes, priceCeil }),
    [colors, sizes, priceCeil],
  );
  const filters = useMemo(() => normalizeFilters(routeFilters, scope), [routeFilters, scope]);
  const searchKey = stableSearchString(serializeFilters(filters));

  useEffect(() => setVisible(PAGE_SIZE), [searchKey, cat.slug]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const expected = serializeFilters(filters);
    if (!isCanonicalSearch(window.location.search, expected)) {
      navigate({ search: expected, replace: true });
    }
  }, [filters, navigate]);

  const setFilters = (nextFilters: Filters) => {
    const normalized = normalizeFilters(nextFilters, scope);
    startTransition(() => navigate({ search: serializeFilters(normalized), replace: false }));
  };

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
      <Navbar theme="dark" />
      <main
        dir="rtl"
        className="min-h-screen bg-obsidian pb-bottombar pt-[var(--lbb-nav-h)] md:pb-0"
      >
        <Shell className="border-b border-hairline py-4">
          <Breadcrumb
            items={[
              { label: "خانه", to: "/" },
              { label: "فروشگاه", to: "/shop" },
              { label: cat.nameFa },
            ]}
          />
        </Shell>

        <section className="border-b border-hairline">
          <Shell className="grid grid-cols-1 gap-7 py-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center md:py-12">
            <div className="overflow-hidden rounded-2xl border border-hairline bg-carbon">
              <img
                src={categoryImage(cat.slug)}
                alt={`مدل در حال پوشیدن ${cat.nameFaPlural} استریت‌ویر LBB`}
                width={720}
                height={540}
                loading="eager"
                fetchPriority="high"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
            <div>
              <TechLabel tone="signal">CATEGORY / {cat.slug.toUpperCase()}</TechLabel>
              <h1 className="text-display-2 mt-3 text-bone">{cat.h1}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-metal">{cat.heroTagline}</p>
              <p className="tech mt-4 text-signal">
                {items.length.toLocaleString("fa-IR")} محصول موجود
              </p>
              <ul className="mt-5 grid gap-2 text-sm text-metal sm:grid-cols-2">
                {cat.bullets.map((bullet: string) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Shell>
        </section>

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
                  lockedCategory
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
                    body="فیلترهای این دسته را تغییر بده یا پاک کن."
                    action={
                      <button
                        type="button"
                        onClick={() =>
                          setFilters({
                            ...filters,
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
                    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
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

        <Band label="CATEGORY GUIDE">
          <Shell className="max-w-[900px]">
            <h2 className="text-display-3 text-bone">
              {cat.nameFaPlural} استریت‌ویر LBB چه ویژگی‌هایی دارن؟
            </h2>
            <p className="mt-4 text-sm leading-8 text-metal">{cat.seoText}</p>
            <div className="mt-8 divide-y divide-hairline border-t border-hairline">
              {cat.faqs.map((faq: { q: string; a: string }) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal">
                    {faq.q}
                    <span
                      className="shrink-0 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-8 text-metal">{faq.a}</p>
                </details>
              ))}
            </div>
          </Shell>
        </Band>

        <Band label="MORE CATEGORIES">
          <Shell>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {CATEGORY_SLUGS.filter((slug) => slug !== cat.slug)
                .slice(0, 4)
                .map((slug) => (
                  <Link
                    key={slug}
                    to="/$category"
                    params={{ category: slug }}
                    className="grid min-h-24 place-items-center rounded-xl border border-hairline bg-carbon text-sm font-semibold text-bone transition hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    {CATEGORIES[slug].nameFa}
                  </Link>
                ))}
            </div>
          </Shell>
        </Band>
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}
