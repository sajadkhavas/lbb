import { useEffect, useMemo, useState, useTransition } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpLeft, PackageSearch, RefreshCcw, Search } from "lucide-react";
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
import { evaluateProductEvidence } from "@/lib/product-evidence";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { categoryImage } from "@/lib/category-images";
import {
  catalogueInventorySummary,
  countDiscoveryResults,
  createDiscoveryScope,
  createFacetCounts,
} from "@/lib/catalog-discovery";
import { absUrl, breadcrumbLd, canonical, pageMeta } from "@/lib/site";
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
  type Filters,
  type FilterScope,
} from "@/lib/product-filter";
import {
  backendErrorMessage,
  getCatalogFacets,
  isLiveBackend,
  listProducts,
  type FacetsDto,
} from "@/lib/backend-api";
import {
  BACKEND_SUPPORTED_SORTS,
  backendCard,
  backendCatalogQuery,
  backendFacetVisuals,
  type BackendCatalogCard,
} from "@/lib/backend-storefront";

const TITLE = "فروشگاه | خرید هودی، شلوار، تیشرت و کتونی — LBB";
const DESC =
  "کاتالوگ استریت‌ویر LBB شامل هودی، شلوار، تیشرت، کتونی و جوراب با فیلترهای قابل اشتراک و اطلاعات شفاف موجودی.";
const PAGE_SIZE = 12;
const BACKEND_PAGE_SIZE = 48;

function createItemListLd() {
  const publishedProducts = products.filter(
    (product) => evaluateProductEvidence(product).publishable,
  );
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "محصولات فروشگاه LBB",
    numberOfItems: publishedProducts.length,
    itemListElement: publishedProducts.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absUrl(`/product/${product.slug}`),
      name: product.name,
    })),
  };
}

type LiveLoader = {
  mode: "live";
  products: BackendCatalogCard[];
  facets: FacetsDto | null;
  total: number;
  totalPages: number;
  filters: Filters;
  error: string | null;
};

type PrototypeLoader = { mode: "prototype" };
type ShopLoader = LiveLoader | PrototypeLoader;

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) =>
    isLiveBackend() ? parseBackendFilterSearch(search) : parseFilterSearch(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }): Promise<ShopLoader> => {
    if (!isLiveBackend()) return { mode: "prototype" };

    try {
      const facetsResponse = await getCatalogFacets();
      const facets = facetsResponse.data;
      const visuals = backendFacetVisuals(facets);
      const scope: FilterScope = {
        categories: facets.categories.map((category) => category.slug),
        colors: visuals.colors,
        sizes: visuals.sizes,
        priceCeil: Math.max(1, visuals.priceCeil),
      };
      const filters = normalizeBackendFilters(
        parseBackendFilters(deps.search as unknown as Record<string, unknown>),
        scope,
      );
      const response = await listProducts({
        ...backendCatalogQuery(filters, facets),
        page: 1,
        per_page: BACKEND_PAGE_SIZE,
      });
      return {
        mode: "live",
        products: response.data.map(backendCard),
        facets,
        total: response.meta.pagination?.total ?? response.data.length,
        totalPages: response.meta.pagination?.totalPages ?? 1,
        filters,
        error: null,
      };
    } catch (error) {
      return {
        mode: "live",
        products: [],
        facets: null,
        total: 0,
        totalPages: 0,
        filters: parseBackendFilters(deps.search as unknown as Record<string, unknown>),
        error: backendErrorMessage(error),
      };
    }
  },
  head: ({ match }) => {
    const filters = isLiveBackend()
      ? parseBackendFilters(match.search as unknown as Record<string, unknown>)
      : parseFilters(match.search as unknown as Record<string, unknown>);
    const scripts = [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "فروشگاه", path: "/shop" },
          ]),
        ),
      },
    ];
    if (!isLiveBackend()) {
      scripts.push({ type: "application/ld+json", children: JSON.stringify(createItemListLd()) });
    }
    return {
      meta: pageMeta({
        title: TITLE,
        description: DESC,
        path: "/shop",
        type: "website",
        robots: hasSearchModifiers(filters) ? "noindex, follow" : undefined,
      }),
      links: canonical("/shop"),
      scripts,
    };
  },
  component: ShopPage,
});

function ShopPage() {
  const loader = Route.useLoaderData();
  return loader.mode === "live" ? <LiveShop loader={loader} /> : <PrototypeShop />;
}

function LiveShop({ loader }: { loader: LiveLoader }) {
  const navigate = useNavigate({ from: "/shop" });
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(loader.products);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const facets = loader.facets;
  const visuals = facets ? backendFacetVisuals(facets) : { colors: [], sizes: [], priceCeil: 1 };
  const scope: FilterScope = facets
    ? {
        categories: facets.categories.map((category) => category.slug),
        colors: visuals.colors,
        sizes: visuals.sizes,
        priceCeil: Math.max(1, visuals.priceCeil),
      }
    : {};
  const filters = normalizeBackendFilters(loader.filters, scope);
  const serialized = serializeBackendFilters(filters, scope);
  const searchKey = stableSearchString(serialized);

  useEffect(() => {
    setItems(loader.products);
    setPage(1);
    setLoadMoreError(null);
  }, [loader.products, searchKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !facets) return;
    if (!isCanonicalSearch(window.location.search, serialized)) {
      navigate({ search: serialized, replace: true });
    }
  }, [facets, navigate, searchKey, serialized]);

  const setFilters = (next: Filters) => {
    const normalized = normalizeBackendFilters(next, scope);
    startTransition(() =>
      navigate({ search: serializeBackendFilters(normalized, scope), replace: false }),
    );
  };

  const categoryOptions = facets?.categories.map((category) => ({
    slug: category.slug,
    label: category.name,
  }));
  const categoryLabels = Object.fromEntries(
    (categoryOptions ?? []).map((category) => [category.slug, category.label]),
  );
  const renderFilters = (candidate: Filters, onChange: (next: Filters) => void) => (
    <ProductFilters
      filters={candidate}
      onChange={onChange}
      colors={visuals.colors}
      sizes={visuals.sizes}
      priceCeil={Math.max(1, visuals.priceCeil)}
      showCategory
      showSale={false}
      categoryOptions={categoryOptions}
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
    <ShopChrome
      categories={categoryOptions ?? []}
      status={
        loader.error
          ? "ارتباط کاتالوگ با Backend برقرار نیست. داده نمونه جایگزین نشده است."
          : "قیمت، موجودی و گزینه‌های محصول مستقیماً از Backend خوانده می‌شوند."
      }
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label="فیلتر محصولات">
          <div className="sticky top-[calc(var(--lbb-nav-h)+24px)]">
            {facets ? renderFilters(filters, setFilters) : null}
          </div>
        </aside>

        <section aria-labelledby="shop-grid-title">
          <h2 id="shop-grid-title" className="sr-only">
            نتایج کاتالوگ LBB
          </h2>
          {facets ? (
            <ProductGridControls
              filters={filters}
              onChange={setFilters}
              resultCount={loader.total}
              filterSlot={renderFilters}
              getResultCount={() => loader.total}
              supportedSorts={BACKEND_SUPPORTED_SORTS}
              categoryLabels={categoryLabels}
            />
          ) : null}

          {loader.error ? (
            <EmptyState
              className="mt-6"
              icon={<RefreshCcw size={40} aria-hidden="true" />}
              title="کاتالوگ قابل تأیید نیست"
              body={loader.error}
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
          ) : isPending ? (
            <div className="mt-6" aria-busy="true" aria-label="در حال به‌روزرسانی محصولات">
              <GridSkeleton count={8} />
            </div>
          ) : loader.total === 0 ? (
            <EmptyState
              className="mt-6"
              icon={<PackageSearch size={40} aria-hidden="true" />}
              title="محصولی با این ترکیب فیلتر پیدا نشد"
              body="یکی از فیلترها را حذف کن یا کاتالوگ را به حالت پایه برگردان."
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
                    })
                  }
                  className={CtaClasses("signal")}
                >
                  بازگشت به همه قطعه‌ها
                </button>
              }
            />
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
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
    </ShopChrome>
  );
}

function PrototypeShop() {
  const routeFilters = Route.useSearch();
  const filterScope = useMemo(() => createDiscoveryScope(products, true), []);
  const inventory = useMemo(() => catalogueInventorySummary(products), []);
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
  const getResultCount = (candidate: Filters) =>
    countDiscoveryResults(products, candidate, filterScope);
  const renderFilters = (candidate: Filters, onChange: (next: Filters) => void) => (
    <ProductFilters
      filters={candidate}
      onChange={onChange}
      colors={filterScope.colors}
      sizes={filterScope.sizes}
      priceCeil={filterScope.priceCeil}
      showCategory
      facetCounts={createFacetCounts(products, candidate, filterScope)}
    />
  );
  const desktopFilters = renderFilters(filters, setFilters);

  return (
    <ShopChrome
      categories={CATEGORY_SLUGS.map((slug) => ({ slug, label: CATEGORIES[slug].nameFa }))}
      status={`${inventory.label} پرداخت و ارسال واقعی در این نسخه فعال نیست.`}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label="فیلتر محصولات">
          <div className="sticky top-[calc(var(--lbb-nav-h)+24px)]">{desktopFilters}</div>
        </aside>

        <section aria-labelledby="shop-grid-title">
          <h2 id="shop-grid-title" className="sr-only">
            نتایج کاتالوگ LBB
          </h2>
          <ProductGridControls
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
            filterSlot={renderFilters}
            getResultCount={getResultCount}
          />

          {isPending ? (
            <div className="mt-6" aria-busy="true" aria-label="در حال به‌روزرسانی محصولات">
              <GridSkeleton count={8} />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              className="mt-6"
              icon={<PackageSearch size={40} aria-hidden="true" />}
              title="محصولی با این ترکیب فیلتر پیدا نشد"
              body="یکی از فیلترها را حذف کن یا کاتالوگ را به حالت پایه برگردان."
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
                  بازگشت به همه قطعه‌ها
                </button>
              }
            />
          ) : (
            <>
              <div
                className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4"
                aria-busy={isPending}
              >
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
    </ShopChrome>
  );
}

function ShopChrome({
  categories,
  status,
  children,
}: {
  categories: readonly { slug: string; label: string }[];
  status: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    if (q) void navigate({ to: "/search", search: { q } });
  };

  return (
    <>
      <Navbar theme="dark" />
      <main
        dir="rtl"
        className="min-h-screen bg-obsidian pb-bottombar pt-[var(--lbb-nav-h)] md:pb-0"
      >
        <Shell className="py-4">
          <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "فروشگاه" }]} />
        </Shell>
        <header className="border-y border-hairline">
          <Shell className="py-3 md:py-5">
            <div className="relative isolate min-h-[520px] overflow-hidden rounded-[24px] bg-carbon md:min-h-[590px] md:rounded-[32px]">
              <img
                src={categoryImage("hoodies")}
                alt="استایل شهری LBB برای شروع مرور فروشگاه"
                width={1600}
                height={2000}
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-center md:object-[center_42%]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,.12)_0%,rgba(9,9,11,.38)_42%,rgba(9,9,11,.94)_100%)] md:bg-[linear-gradient(90deg,rgba(9,9,11,.94)_0%,rgba(9,9,11,.68)_42%,rgba(9,9,11,.08)_78%)]" />
              <div className="relative flex min-h-[520px] flex-col justify-end p-5 md:min-h-[590px] md:max-w-[680px] md:justify-center md:p-12 lg:p-16">
                <TechLabel tone="signal">SHOP / LBB MAHESTAN</TechLabel>
                <h1 className="mt-4 max-w-xl text-[clamp(2.75rem,7vw,6.5rem)] font-black leading-[.92] tracking-[-.06em] text-bone">
                  استایل تو،
                  <span className="block text-signal">قانون تو.</span>
                </h1>
                <p className="mt-5 max-w-lg text-sm leading-7 text-bone/78 md:text-base md:leading-8">
                  قطعه‌های LBB را بر اساس دسته، رنگ، سایز و موجودی کشف کن؛ یا مستقیم چیزی را که
                  می‌خواهی جست‌وجو کن.
                </p>

                <form
                  onSubmit={submitSearch}
                  role="search"
                  className="mt-7 flex min-h-14 w-full max-w-xl items-center gap-2 rounded-full border border-white/20 bg-obsidian/75 p-1.5 ps-5 shadow-overlay backdrop-blur-xl focus-within:border-signal"
                >
                  <Search size={19} className="shrink-0 text-signal" aria-hidden="true" />
                  <label htmlFor="shop-search" className="sr-only">
                    جست‌وجو در فروشگاه
                  </label>
                  <input
                    id="shop-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="چی می‌خوای؟ هودی، بگی، کتونی…"
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent text-sm text-bone outline-none placeholder:text-metal"
                  />
                  <button
                    type="submit"
                    disabled={!query.trim()}
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-signal text-bone transition-transform hover:scale-105 disabled:opacity-45"
                    aria-label="نمایش نتایج جست‌وجو"
                  >
                    <ArrowUpLeft size={18} aria-hidden="true" />
                  </button>
                </form>
                <p className="tech mt-4 text-bone/55">{status}</p>
              </div>
            </div>
          </Shell>

          <Shell className="py-8 md:py-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <TechLabel tone="signal">SHOP BY CATEGORY</TechLabel>
                <h2 className="mt-2 text-2xl font-black text-bone md:text-4xl">از دسته شروع کن</h2>
              </div>
              <span className="tech hidden text-mute md:block">SWIPE / EXPLORE</span>
            </div>
            <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              {categories.map((category, index) => (
                <Link
                  key={category.slug}
                  to="/$category"
                  params={{ category: category.slug }}
                  className="group relative aspect-[4/5] w-[72vw] max-w-[290px] shrink-0 snap-start overflow-hidden rounded-[20px] border border-white/10 bg-white shadow-raised transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-signal/60 hover:shadow-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:w-auto md:max-w-none"
                >
                  <img
                    src={categoryImage(category.slug as keyof typeof CATEGORIES)}
                    alt=""
                    width={640}
                    height={800}
                    loading={index < 2 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                    <span>
                      <span className="block text-xl font-black text-bone">{category.label}</span>
                      <span className="tech mt-1 block text-bone/60">0{index + 1}</span>
                    </span>
                    <span className="grid size-10 place-items-center rounded-full border border-white/25 bg-obsidian/45 text-bone backdrop-blur transition-colors group-hover:border-signal group-hover:bg-signal">
                      <ArrowUpLeft size={16} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Shell>

          <Shell className="flex snap-x gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link
              to="/shop"
              className="tech min-h-11 shrink-0 snap-start whitespace-nowrap border-b-2 border-signal px-4 py-3 text-signal"
            >
              همه قطعه‌ها
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                to="/$category"
                params={{ category: category.slug }}
                className="tech min-h-11 shrink-0 snap-start whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-metal transition-colors hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                {category.label}
              </Link>
            ))}
          </Shell>
        </header>
        <Band hairline={false} className="!py-10 md:!py-14">
          <Shell>{children}</Shell>
        </Band>
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}
