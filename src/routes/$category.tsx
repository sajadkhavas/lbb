import { useEffect, useMemo, useState, useTransition } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { PackageSearch, RefreshCcw } from "lucide-react";
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
import {
  catalogueInventorySummary,
  countDiscoveryResults,
  createDiscoveryScope,
  createFacetCounts,
} from "@/lib/catalog-discovery";
import { productsByCategory } from "@/lib/products";
import { evaluateProductEvidence } from "@/lib/product-evidence";
import { backendCanonicalPath } from "@/lib/seo-live";
import { absAsset, absUrl, breadcrumbLd, canonical, pageMeta } from "@/lib/site";
import {
  applyFilters,
  hasSearchModifiers,
  isCanonicalSearch,
  normalizeBackendFilters,
  normalizeFilters,
  parseBackendFilterSearch,
  parseBackendFilters,
  parseFilterSearch,
  parseFilters,
  serializeBackendFilters,
  serializeFilters,
  stableSearchString,
  type FilterScope,
  type Filters,
} from "@/lib/product-filter";
import {
  BackendApiError,
  backendErrorMessage,
  getCatalogFacets,
  getCategory,
  isLiveBackend,
  listProducts,
  type CategoryDto,
  type FacetsDto,
} from "@/lib/backend-api";
import {
  BACKEND_SUPPORTED_SORTS,
  backendCard,
  backendCatalogQuery,
  backendFacetVisuals,
  type BackendCatalogCard,
} from "@/lib/backend-storefront";

const PAGE_SIZE = 12;
const BACKEND_PAGE_SIZE = 48;

type LiveLoader = {
  mode: "live";
  category: CategoryDto | null;
  items: BackendCatalogCard[];
  facets: FacetsDto | null;
  filters: Filters;
  total: number;
  totalPages: number;
  error: string | null;
};

type PrototypeLoader = {
  mode: "prototype";
  cat: (typeof CATEGORIES)[keyof typeof CATEGORIES];
  items: ReturnType<typeof productsByCategory>;
};

type CategoryLoader = LiveLoader | PrototypeLoader;

export const Route = createFileRoute("/$category")({
  beforeLoad: ({ params }) => {
    if (!isLiveBackend() && !isValidCategory(params.category)) throw notFound();
  },
  validateSearch: (search: Record<string, unknown>) =>
    isLiveBackend() ? parseBackendFilterSearch(search) : parseFilterSearch(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ params, deps }): Promise<CategoryLoader> => {
    if (!isLiveBackend()) {
      const cat = CATEGORIES[params.category as keyof typeof CATEGORIES];
      return { mode: "prototype", cat, items: productsByCategory(cat.slug) };
    }

    try {
      const [categoryResponse, facetsResponse] = await Promise.all([
        getCategory(params.category),
        getCatalogFacets(),
      ]);
      const category = categoryResponse.data;
      const facets = facetsResponse.data;
      const visuals = backendFacetVisuals(facets);
      const scope: FilterScope = {
        categories: false,
        colors: visuals.colors,
        sizes: visuals.sizes,
        priceCeil: Math.max(1, visuals.priceCeil),
      };
      const filters = normalizeBackendFilters(
        parseBackendFilters(deps.search as unknown as Record<string, unknown>),
        scope,
      );
      const productsResponse = await listProducts({
        ...backendCatalogQuery(filters, facets),
        category: category.slug,
        page: 1,
        per_page: BACKEND_PAGE_SIZE,
      });
      return {
        mode: "live",
        category,
        items: productsResponse.data.map(backendCard),
        facets,
        filters,
        total: productsResponse.meta.pagination?.total ?? productsResponse.data.length,
        totalPages: productsResponse.meta.pagination?.totalPages ?? 1,
        error: null,
      };
    } catch (error) {
      if (error instanceof BackendApiError && error.status === 404) throw notFound();
      return {
        mode: "live",
        category: null,
        items: [],
        facets: null,
        filters: parseBackendFilters(deps.search as unknown as Record<string, unknown>),
        total: 0,
        totalPages: 0,
        error: backendErrorMessage(error),
      };
    }
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) {
      return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex" }] };
    }

    if (loaderData.mode === "live") {
      const category = loaderData.category;
      if (!category) {
        return {
          meta: pageMeta({
            title: "دسته‌بندی موقتاً در دسترس نیست | LBB",
            description: "اطلاعات دسته از Backend قابل دریافت نیست.",
            path: "/shop",
            robots: "noindex, nofollow",
          }),
        };
      }
      const filters = parseBackendFilters(match.search as unknown as Record<string, unknown>);
      const path = backendCanonicalPath(category.seo, `/${category.slug}`);
      const title = category.seo.metaTitle?.trim() || `${category.name} | LBB`;
      const description =
        category.seo.metaDescription?.trim() ||
        category.description ||
        `محصولات ${category.name} در LBB`;
      const scripts = [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: "فروشگاه", path: "/shop" },
              { name: category.name, path },
            ]),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description,
            url: absUrl(path),
          }),
        },
        ...(loaderData.items.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  name: category.name,
                  numberOfItems: loaderData.items.length,
                  itemListElement: loaderData.items.map((product, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: absUrl(`/product/${product.slug}`),
                    name: product.name,
                  })),
                }),
              },
            ]
          : []),
      ];
      return {
        meta: pageMeta({
          title: title.slice(0, 70),
          description: description.slice(0, 170),
          path,
          image: category.image || undefined,
          robots: hasSearchModifiers(filters) ? "noindex, follow" : undefined,
        }),
        links: canonical(path),
        scripts,
      };
    }

    const { cat, items } = loaderData;
    const publishedItems = items.filter((product) => evaluateProductEvidence(product).publishable);
    const filters = parseFilters(match.search as unknown as Record<string, unknown>);
    return {
      meta: pageMeta({
        title: cat.metaTitle,
        description: cat.metaDesc,
        path: `/${cat.slug}`,
        image: absAsset(categoryImage(cat.slug)),
        robots: hasSearchModifiers(filters) ? "noindex, follow" : undefined,
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
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: cat.h1,
            numberOfItems: publishedItems.length,
            itemListElement: publishedItems.slice(0, 20).map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absUrl(`/product/${product.slug}`),
              name: product.name,
            })),
          }),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const loader = Route.useLoaderData();
  return loader.mode === "live" ? (
    <LiveCategory loader={loader} />
  ) : (
    <PrototypeCategory loader={loader} />
  );
}

function LiveCategory({ loader }: { loader: LiveLoader }) {
  const navigate = useNavigate({ from: "/$category" });
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(loader.items);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const category = loader.category;
  const facets = loader.facets;
  const visuals = facets ? backendFacetVisuals(facets) : { colors: [], sizes: [], priceCeil: 1 };
  const scope: FilterScope = {
    categories: false,
    colors: visuals.colors,
    sizes: visuals.sizes,
    priceCeil: Math.max(1, visuals.priceCeil),
  };
  const filters = normalizeBackendFilters(loader.filters, scope);
  const serialized = serializeBackendFilters(filters, scope);
  const searchKey = stableSearchString(serialized);

  useEffect(() => {
    setItems(loader.items);
    setPage(1);
    setLoadMoreError(null);
  }, [loader.items, searchKey, category?.slug]);

  useEffect(() => {
    if (typeof window === "undefined" || !facets) return;
    if (!isCanonicalSearch(window.location.search, serialized)) {
      navigate({ search: serialized, replace: true });
    }
  }, [facets, navigate, searchKey, serialized]);

  if (!category) {
    return (
      <CategoryChrome
        categoryName="دسته‌بندی"
        categorySlug="unavailable"
        description="داده تأییدشده در دسترس نیست."
      >
        <EmptyState
          icon={<RefreshCcw size={40} aria-hidden="true" />}
          title="دسته‌بندی قابل تأیید نیست"
          body={loader.error ?? "Backend پاسخ معتبر برنگرداند."}
          action={
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={CtaClasses("signal")}
            >
              تلاش دوباره
            </button>
          }
        />
      </CategoryChrome>
    );
  }

  const setFilters = (next: Filters) => {
    const normalized = normalizeBackendFilters(next, scope);
    startTransition(() =>
      navigate({ search: serializeBackendFilters(normalized, scope), replace: false }),
    );
  };
  const renderFilters = (candidate: Filters, onChange: (next: Filters) => void) => (
    <ProductFilters
      filters={candidate}
      onChange={onChange}
      colors={visuals.colors}
      sizes={visuals.sizes}
      priceCeil={Math.max(1, visuals.priceCeil)}
      showSale={false}
    />
  );

  const loadMore = async () => {
    if (!facets || loadingMore || page >= loader.totalPages) return;
    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const nextPage = page + 1;
      const response = await listProducts({
        ...backendCatalogQuery(filters, facets),
        category: category.slug,
        page: nextPage,
        per_page: BACKEND_PAGE_SIZE,
      });
      setItems((current) => [...current, ...response.data.map(backendCard)]);
      setPage(nextPage);
    } catch (error) {
      setLoadMoreError(backendErrorMessage(error));
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <CategoryChrome
      categoryName={category.name}
      categorySlug={category.slug}
      description={
        category.description || "محصولات منتشرشده این دسته مستقیماً از Backend خوانده می‌شوند."
      }
      image={category.image}
      siblingCategories={facets?.categories
        .filter((item) => item.slug !== category.slug)
        .slice(0, 4)}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label="فیلتر محصولات">
          <div className="sticky top-[calc(var(--lbb-nav-h)+24px)]">
            {facets ? renderFilters(filters, setFilters) : null}
          </div>
        </aside>
        <section aria-labelledby="category-grid-title">
          <h2 id="category-grid-title" className="sr-only">
            محصولات دسته {category.name}
          </h2>
          {facets ? (
            <ProductGridControls
              filters={filters}
              onChange={setFilters}
              resultCount={loader.total}
              filterSlot={renderFilters}
              getResultCount={() => loader.total}
              lockedCategory
              supportedSorts={BACKEND_SUPPORTED_SORTS}
            />
          ) : null}
          {loader.error ? (
            <EmptyState
              className="mt-6"
              icon={<RefreshCcw size={40} aria-hidden="true" />}
              title="کاتالوگ این دسته در دسترس نیست"
              body={loader.error}
            />
          ) : isPending ? (
            <div className="mt-6" aria-busy="true">
              <GridSkeleton count={8} />
            </div>
          ) : loader.total === 0 ? (
            <EmptyState
              className="mt-6"
              icon={<PackageSearch size={40} aria-hidden="true" />}
              title={`محصولی از ${category.name} با این فیلترها پیدا نشد`}
              body="فیلترها را تغییر دهید یا همه محصولات این دسته را ببینید."
              action={
                <button
                  type="button"
                  onClick={() =>
                    setFilters({ ...filters, colors: [], sizes: [], max: 0, instock: false })
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
                {items.map((product, index) => (
                  <ProductCard key={product.id} p={product} priority={index < 2} />
                ))}
              </div>
              {page < loader.totalPages ? (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className={CtaClasses("line")}
                  >
                    {loadingMore ? "در حال دریافت…" : "نمایش قطعه‌های بیشتر"}
                  </button>
                  {loadMoreError ? (
                    <p role="alert" className="text-xs text-signal">
                      {loadMoreError}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="tech mt-10 text-center text-mute">همه نتایج نمایش داده شدند</p>
              )}
            </>
          )}
        </section>
      </div>
    </CategoryChrome>
  );
}

function CategoryChrome({
  categoryName,
  categorySlug,
  description,
  image,
  siblingCategories = [],
  children,
}: {
  categoryName: string;
  categorySlug: string;
  description: string;
  image?: string | null;
  siblingCategories?: readonly CategoryDto[];
  children: React.ReactNode;
}) {
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
              { label: categoryName },
            ]}
          />
        </Shell>
        <section className="border-b border-hairline">
          <Shell
            className={`grid grid-cols-1 gap-7 py-8 ${image ? "md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]" : ""} md:items-center md:py-12`}
          >
            {image ? (
              <div className="overflow-hidden rounded-2xl border border-hairline bg-carbon">
                <img
                  src={image}
                  alt={categoryName}
                  width={720}
                  height={540}
                  loading="eager"
                  fetchPriority="high"
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>
            ) : null}
            <div>
              <TechLabel tone="signal">CATEGORY / {categorySlug.toUpperCase()}</TechLabel>
              <h1 className="text-display-2 mt-3 text-bone">{categoryName}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-metal">{description}</p>
              <p className="tech mt-4 text-signal">قیمت و موجودی از Backend</p>
            </div>
          </Shell>
        </section>
        <Band hairline={false} className="!py-10 md:!py-14">
          <Shell>{children}</Shell>
        </Band>
        {siblingCategories.length > 0 ? (
          <Band label="MORE CATEGORIES">
            <Shell>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {siblingCategories.map((category) => (
                  <Link
                    key={category.publicId}
                    to="/$category"
                    params={{ category: category.slug }}
                    className="grid min-h-24 place-items-center rounded-xl border border-hairline bg-carbon text-sm font-semibold text-bone transition hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </Shell>
          </Band>
        ) : null}
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}

function PrototypeCategory({ loader }: { loader: PrototypeLoader }) {
  const { cat, items } = loader;
  const routeFilters = Route.useSearch();
  const navigate = useNavigate({ from: "/$category" });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();
  const scope = useMemo(() => createDiscoveryScope(items, false), [items]);
  const inventory = useMemo(() => catalogueInventorySummary(items), [items]);
  const filters = useMemo(
    () => normalizeFilters(parseFilters(routeFilters as Record<string, unknown>), scope),
    [routeFilters, scope],
  );
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
  const getResultCount = (candidate: Filters) => countDiscoveryResults(items, candidate, scope);
  const renderFilters = (candidate: Filters, onChange: (next: Filters) => void) => (
    <ProductFilters
      filters={candidate}
      onChange={onChange}
      colors={scope.colors}
      sizes={scope.sizes}
      priceCeil={scope.priceCeil}
      facetCounts={createFacetCounts(items, candidate, scope)}
    />
  );
  const desktopFilters = renderFilters(filters, setFilters);

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
                alt={`نمای دسته ${cat.nameFaPlural} ال‌بی‌بی`}
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
              <p className="tech mt-4 text-signal">{inventory.label}</p>
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
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[250px_1fr]">
              <aside className="hidden lg:block" aria-label="فیلتر محصولات">
                <div className="sticky top-[calc(var(--lbb-nav-h)+24px)]">{desktopFilters}</div>
              </aside>
              <section aria-labelledby="category-grid-title">
                <h2 id="category-grid-title" className="sr-only">
                  محصولات دسته {cat.nameFa}
                </h2>
                <ProductGridControls
                  filters={filters}
                  onChange={setFilters}
                  resultCount={filtered.length}
                  filterSlot={renderFilters}
                  getResultCount={getResultCount}
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
                    title={`قطعه‌ای از ${cat.nameFaPlural} با این فیلترها پیدا نشد`}
                    body="فیلترهای این دسته را تغییر بده یا به نمای کامل دسته برگرد."
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
                        نمایش همه {cat.nameFaPlural}
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
                          نمایش قطعه‌های بیشتر
                        </button>
                      </div>
                    ) : (
                      <p className="tech mt-10 text-center text-mute">همه نتایج نمایش داده شدند</p>
                    )}
                  </>
                )}
              </section>
            </div>
          </Shell>
        </Band>

        <Band label="CATEGORY GUIDE">
          <Shell className="max-w-[900px]">
            <h2 className="text-display-3 text-bone">
              {`برای انتخاب ${cat.nameFa} در LBB به چه چیزهایی توجه کنیم؟`}
            </h2>
            <p className="mt-4 text-sm leading-8 text-metal">{cat.seoText}</p>
            <Link
              to="/size-guide"
              className="tech mt-5 inline-flex min-h-11 items-center text-signal underline-offset-4 hover:underline"
            >
              راهنمای انتخاب اندازه
            </Link>
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
