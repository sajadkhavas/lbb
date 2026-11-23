import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  PackageSearch,
  RefreshCcw,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { ManagedPageHead } from "@/components/lbb/ManagedPageIntro";
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
import { CATEGORIES } from "@/lib/categories";
import { homeCategoryImage } from "@/lib/home-category-images";
import { ACTIVE_HOME_CATEGORY_ORDER } from "@/lib/homepage";
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
  listCategories,
  listProducts,
  type CategoryDto,
  type FacetsDto,
} from "@/lib/backend-api";
import {
  BACKEND_SUPPORTED_SORTS,
  backendCard,
  backendCatalogQuery,
  backendFacetVisuals,
  normalizeCatalogFilters,
  type BackendCatalogCard,
} from "@/lib/backend-storefront";
import { useStorefrontPresentation } from "@/lib/storefront-presentation";

const TITLE = "فروشگاه LBB | خرید پوشاک خیابانی و استریت‌ویر";
const DESC =
  "محصولات موجود LBB را با فیلترهای دسته، سایز، رنگ، قیمت و موجودی مرور کن و برای جزئیات هر مدل وارد صفحه همان محصول شو.";
const PAGE_SIZE = 12;
const BACKEND_PAGE_SIZE = 48;
const seasonalProducts = products.filter((product) => product.category !== "hoodies");

function createItemListLd() {
  const publishedProducts = seasonalProducts.filter(
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
  categories?: CategoryDto[];
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
      const [facetsResponse, categoryResponse] = await Promise.all([
        getCatalogFacets(),
        listCategories().catch(() => null),
      ]);
      const facets = facetsResponse.data;
      const visuals = backendFacetVisuals(facets);
      const scope: FilterScope = {
        categories: facets.categories.map((category) => category.slug),
        colors: visuals.colors,
        sizes: visuals.sizes,
        priceCeil: Math.max(1, visuals.priceCeil),
      };
      const filters = normalizeCatalogFilters(
        parseBackendFilters(deps.search as unknown as Record<string, unknown>),
        facets,
        scope,
      );
      try {
        const response = await listProducts({
          ...backendCatalogQuery(filters, facets),
          page: 1,
          per_page: BACKEND_PAGE_SIZE,
        });
        return {
          mode: "live",
          products: response.data.map(backendCard),
          facets,
          categories: categoryResponse?.data,
          total: response.meta.pagination?.total ?? response.data.length,
          totalPages: response.meta.pagination?.totalPages ?? 1,
          filters,
          error: null,
        };
      } catch (error) {
        return {
          mode: "live",
          products: [],
          facets,
          categories: categoryResponse?.data,
          total: 0,
          totalPages: 0,
          filters,
          error: backendErrorMessage(error),
        };
      }
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
      meta: isLiveBackend()
        ? hasSearchModifiers(filters)
          ? [{ name: "robots", content: "noindex, follow" }]
          : []
        : pageMeta({
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
  const scope: FilterScope = useMemo(() => {
    if (!facets) return {};
    const options = backendFacetVisuals(facets);
    return {
      categories: facets.categories.map((category) => category.slug),
      colors: options.colors,
      sizes: options.sizes,
      priceCeil: Math.max(1, options.priceCeil),
    };
  }, [facets]);
  const appliedFilters = useMemo(
    () => normalizeBackendFilters(loader.filters, scope),
    [loader.filters, scope],
  );
  const [optimisticFilters, setOptimisticFilters] = useState(appliedFilters);
  const filters = normalizeBackendFilters(optimisticFilters, scope);
  const serialized = useMemo(
    () => serializeBackendFilters(appliedFilters, scope),
    [appliedFilters, scope],
  );
  const searchKey = stableSearchString(serialized);
  const requestKey = useRef(searchKey);

  useEffect(() => {
    requestKey.current = searchKey;
    setOptimisticFilters(appliedFilters);
    setItems(loader.products);
    setPage(1);
    setLoadingMore(false);
    setLoadMoreError(null);
  }, [loader.products, searchKey, appliedFilters]);

  useEffect(() => {
    if (typeof window === "undefined" || !facets || requestKey.current !== searchKey) return;
    if (!isCanonicalSearch(window.location.search, serialized)) {
      navigate({ search: serialized, replace: true, resetScroll: false });
    }
  }, [facets, navigate, searchKey, serialized]);

  const setFilters = (next: Filters) => {
    const normalized = normalizeBackendFilters(next, scope);
    setOptimisticFilters(normalized);
    requestKey.current = stableSearchString(serializeBackendFilters(normalized, scope));
    startTransition(() =>
      navigate({
        search: serializeBackendFilters(normalized, scope),
        replace: false,
        resetScroll: false,
      }),
    );
  };

  const categoryOptions = facets?.categories.map((category) => ({
    slug: category.slug,
    label: category.name,
    image: category.image,
  }));
  const categoryLabels = Object.fromEntries(
    (categoryOptions ?? []).map((category) => [category.slug, category.label]),
  );
  const colorLabels = Object.fromEntries(
    (facets?.colors ?? []).map((color) => [color.slug, color.name]),
  );
  const colorSwatches = Object.fromEntries(
    (facets?.colors ?? []).map((color) => [color.slug, color.hex]),
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
      colorLabels={colorLabels}
      colorSwatches={colorSwatches}
    />
  );

  const getPreviewCount = useCallback(
    async (candidate: Filters) => {
      if (!facets) return 0;
      const response = await listProducts({
        ...backendCatalogQuery(candidate, facets),
        page: 1,
        per_page: 1,
      });
      return response.meta.pagination?.total ?? response.data.length;
    },
    [facets],
  );

  const loadMore = async () => {
    if (!facets || loadingMore || page >= loader.totalPages || requestKey.current !== searchKey)
      return;
    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const nextPage = page + 1;
      const response = await listProducts({
        ...backendCatalogQuery(filters, facets),
        page: nextPage,
        per_page: BACKEND_PAGE_SIZE,
      });
      if (requestKey.current !== searchKey) return;
      setItems((current) => {
        const seen = new Set(current.map((product) => product.id));
        return [
          ...current,
          ...response.data.map(backendCard).filter((product) => !seen.has(product.id)),
        ];
      });
      setPage(nextPage);
    } catch (error) {
      if (requestKey.current === searchKey) setLoadMoreError(backendErrorMessage(error));
    } finally {
      if (requestKey.current === searchKey) setLoadingMore(false);
    }
  };

  return (
    <ShopChrome
      categories={
        loader.categories?.map(({ slug, name, image }) => ({ slug, label: name, image })) ??
        categoryOptions ??
        []
      }
      status={
        loader.error
          ? "در حال حاضر دریافت اطلاعات فروشگاه امکان‌پذیر نیست. لطفاً کمی بعد دوباره تلاش کنید."
          : "قیمت، موجودی و گزینه‌های قابل انتخاب هر محصول به‌روز نمایش داده می‌شوند."
      }
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label="فیلتر محصولات">
          <div className="sticky top-[calc(var(--lbb-nav-h)+24px)] max-h-[calc(100dvh-var(--lbb-nav-h)-40px)] overflow-y-auto overscroll-contain pe-3">
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
              getPreviewCount={getPreviewCount}
              supportedSorts={BACKEND_SUPPORTED_SORTS}
              categoryLabels={categoryLabels}
              colorLabels={colorLabels}
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
  const filterScope = useMemo(() => createDiscoveryScope(seasonalProducts, true), []);
  const inventory = useMemo(() => catalogueInventorySummary(seasonalProducts), []);
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
      navigate({ search: expected, replace: true, resetScroll: false });
    }
  }, [filters, navigate]);

  const setFilters = (nextFilters: Filters) => {
    const normalized = normalizeFilters(nextFilters, filterScope);
    startTransition(() =>
      navigate({ search: serializeFilters(normalized), replace: false, resetScroll: false }),
    );
  };

  const filtered = useMemo(() => applyFilters(seasonalProducts, filters), [filters]);
  const shown = filtered.slice(0, visible);
  const getResultCount = (candidate: Filters) =>
    countDiscoveryResults(seasonalProducts, candidate, filterScope);
  const renderFilters = (candidate: Filters, onChange: (next: Filters) => void) => (
    <ProductFilters
      filters={candidate}
      onChange={onChange}
      colors={filterScope.colors}
      sizes={filterScope.sizes}
      priceCeil={filterScope.priceCeil}
      showCategory
      facetCounts={createFacetCounts(seasonalProducts, candidate, filterScope)}
    />
  );
  const desktopFilters = renderFilters(filters, setFilters);

  return (
    <ShopChrome
      categories={ACTIVE_HOME_CATEGORY_ORDER.map((slug) => ({
        slug,
        label: CATEGORIES[slug].nameFa,
      }))}
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
  categories: readonly { slug: string; label: string; image?: string | null }[];
  status: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const presentation = useStorefrontPresentation();
  const page = presentation.pages.shop;
  const [query, setQuery] = useState("");
  const categoryTrack = useRef<HTMLDivElement>(null);
  const [categoryScroll, setCategoryScroll] = useState({ previous: false, next: false });

  useEffect(() => {
    const track = categoryTrack.current;
    if (!track) return;
    const update = () => {
      const position = Math.abs(track.scrollLeft);
      setCategoryScroll({
        previous: position > 1,
        next: position + track.clientWidth < track.scrollWidth - 1,
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, [categories.length]);

  const scrollCategories = (direction: number) => {
    const track = categoryTrack.current;
    const card = track?.firstElementChild;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    if (q) void navigate({ to: "/search", search: { q } });
  };

  return (
    <>
      {presentation.source === "live" ? <ManagedPageHead presentation={page} path="/shop" /> : null}
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
            <div className="grid overflow-hidden rounded-3xl border border-hairline bg-carbon md:grid-cols-2">
              <div className="relative h-[340px] min-h-0 overflow-hidden bg-obsidian md:col-start-2 md:row-start-1 md:h-[480px]">
                <img
                  src="/brand/lbb-shop-storefront.webp"
                  alt="ویترین فروشگاه پوشاک LBB"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  style={{ height: "100%" }}
                />
              </div>
              <div className="flex flex-col justify-center bg-carbon p-6 md:col-start-1 md:row-start-1 md:p-8 lg:p-10">
                <TechLabel tone="signal">{page.eyebrow}</TechLabel>
                <h1 className="mt-4 max-w-xl text-[clamp(2.5rem,5vw,5rem)] font-black leading-[.92] tracking-[-.06em] text-bone">
                  {page.title}
                </h1>
                <p className="mt-5 max-w-lg text-sm leading-7 text-bone/78 md:text-base md:leading-8">
                  {page.lede}
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
                    placeholder="چی می‌خوای؟ تیشرت، بگی، کتونی…"
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
                <a
                  href="#shop-results"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 self-start text-xs font-bold text-bone underline-offset-4 hover:text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  رفتن به فهرست محصولات
                  <ArrowUpLeft size={16} aria-hidden="true" />
                </a>
                <p className="tech mt-4 text-bone/55">{status}</p>
              </div>
            </div>
          </Shell>

          <Shell className="py-8 md:py-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <TechLabel tone="signal">{page.sectionLabel}</TechLabel>
                <h2 className="mt-2 text-2xl font-black text-bone md:text-4xl">
                  {page.sectionTitle}
                </h2>
              </div>
              {(categoryScroll.previous || categoryScroll.next) && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label="دسته قبلی"
                    aria-controls="shop-category-track"
                    disabled={!categoryScroll.previous}
                    onClick={() => scrollCategories(1)}
                    className="grid size-11 place-items-center rounded-full border border-white/25 text-bone hover:border-signal focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-35"
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="دسته بعدی"
                    aria-controls="shop-category-track"
                    disabled={!categoryScroll.next}
                    onClick={() => scrollCategories(-1)}
                    className="grid size-11 place-items-center rounded-full border border-white/25 text-bone hover:border-signal focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-35"
                  >
                    <ArrowLeft size={18} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
            <div
              id="shop-category-track"
              ref={categoryTrack}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((category, index) => (
                <Link
                  key={category.slug}
                  to="/$category"
                  params={{ category: category.slug }}
                  className="group flex min-h-32 w-36 shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl border border-hairline bg-carbon p-4 text-center text-bone transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:min-h-36 md:w-[calc((100%_-_3.75rem)/6)]"
                >
                  {(category.image || Object.hasOwn(CATEGORIES, category.slug)) && (
                    <img
                      src={
                        category.image ||
                        (Object.hasOwn(CATEGORIES, category.slug)
                          ? homeCategoryImage(category.slug as keyof typeof CATEGORIES)
                          : undefined)
                      }
                      alt=""
                      width={640}
                      height={800}
                      loading={index < 2 ? "eager" : "lazy"}
                      className="size-12 object-contain md:size-14"
                    />
                  )}
                  <span className="text-sm font-bold">{category.label}</span>
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
        <Band id="shop-results" hairline={false} className="scroll-mt-24 !py-10 md:!py-14">
          <Shell>{children}</Shell>
        </Band>
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}
