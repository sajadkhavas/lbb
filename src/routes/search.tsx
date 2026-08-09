import { useEffect, useMemo, useState, useTransition, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, PackageSearch, Search as SearchIcon, X } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { ProductFilters } from "@/components/lbb/ProductFilters";
import { ProductGridControls } from "@/components/lbb/ProductGridControls";
import {
  CtaClasses,
  EmptyState,
  GridSkeleton,
  Shell,
  StatePanel,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { products } from "@/lib/product-catalog";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import {
  createDiscoveryScope,
  createFacetCounts,
  countDiscoveryResults,
} from "@/lib/catalog-discovery";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  normalizeSearchTerm,
  removeRecentSearch,
} from "@/lib/recent-searches";
import { canonical, pageMeta } from "@/lib/site";
import {
  applyFilters,
  isCanonicalSearch,
  normalizeBackendFilters,
  normalizeFilters,
  parseBackendFilters,
  parseFilters,
  serializeBackendFilters,
  serializeFilters,
  stableSearchString,
  type FilterScope,
  type FilterSearch,
  type Filters,
} from "@/lib/product-filter";
import {
  backendErrorMessage,
  getCatalogFacets,
  isLiveBackend,
  searchProducts,
  type FacetsDto,
} from "@/lib/backend-api";
import {
  BACKEND_SUPPORTED_SORTS,
  backendCard,
  backendCatalogQuery,
  backendFacetVisuals,
  type BackendCatalogCard,
} from "@/lib/backend-storefront";

type SearchParams = FilterSearch & { q?: string };
const BACKEND_PAGE_SIZE = 48;
const queryFrom = (value: unknown) =>
  normalizeSearchTerm(typeof value === "string" ? value : "") || undefined;

function parseSearch(search: Record<string, unknown>): SearchParams {
  const q = queryFrom(search.q);
  const filters = isLiveBackend() ? parseBackendFilters(search) : parseFilters(search);
  return {
    ...(q ? { q } : {}),
    ...(isLiveBackend() ? serializeBackendFilters(filters) : serializeFilters(filters)),
  };
}

function serializeSearch(
  query: string | undefined,
  filters: Filters,
  scope?: FilterScope,
): SearchParams {
  return {
    ...(query ? { q: query } : {}),
    ...(isLiveBackend() ? serializeBackendFilters(filters, scope) : serializeFilters(filters)),
  };
}

function localMatches(query: string) {
  const normalized = normalizeSearchTerm(query).toLocaleLowerCase("fa-IR");
  if (!normalized) return [];
  const tokens = normalized.split(" ").filter(Boolean);
  return products.filter((product) => {
    const category = CATEGORIES[product.category];
    const haystack = normalizeSearchTerm(
      [
        product.name,
        product.latinName,
        product.shortDescription,
        product.description,
        product.sku,
        category.nameFa,
        category.nameFaPlural,
      ].join(" "),
    ).toLocaleLowerCase("fa-IR");
    return tokens.every((token) => haystack.includes(token));
  });
}

type LiveLoader = {
  mode: "live";
  facets: FacetsDto | null;
  items: BackendCatalogCard[];
  filters: Filters;
  total: number;
  totalPages: number;
  error: string | null;
};
type SearchLoader = LiveLoader | { mode: "prototype" };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => parseSearch(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }): Promise<SearchLoader> => {
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
      const q = queryFrom((deps.search as SearchParams).q);
      if (!q)
        return { mode: "live", facets, items: [], filters, total: 0, totalPages: 0, error: null };
      const response = await searchProducts({
        q,
        ...backendCatalogQuery(filters, facets),
        page: 1,
        per_page: BACKEND_PAGE_SIZE,
      });
      return {
        mode: "live",
        facets,
        items: response.data.map(backendCard),
        filters,
        total: response.meta.pagination?.total ?? response.data.length,
        totalPages: response.meta.pagination?.totalPages ?? 1,
        error: null,
      };
    } catch (error) {
      return {
        mode: "live",
        facets: null,
        items: [],
        filters: parseBackendFilters(deps.search as unknown as Record<string, unknown>),
        total: 0,
        totalPages: 0,
        error: backendErrorMessage(error),
      };
    }
  },
  head: ({ match }) => {
    const query = (match.search as SearchParams).q;
    return {
      meta: pageMeta({
        title: query ? `نتایج جستجو برای «${query}» | LBB` : "جستجو | LBB",
        description: query ? `نتایج جستجو برای «${query}» در LBB.` : "جستجو در کاتالوگ LBB.",
        path: "/search",
        robots: "noindex, follow",
      }),
      links: canonical("/search"),
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const loader = Route.useLoaderData();
  return loader.mode === "live" ? <LiveSearch loader={loader} /> : <PrototypeSearch />;
}

function SearchChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar theme="dark" />
      <main
        dir="rtl"
        className="min-h-screen bg-obsidian px-5 pb-bottombar pt-[calc(var(--lbb-nav-h)+32px)] md:px-10 md:pb-16"
      >
        <Shell>{children}</Shell>
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}

function SearchHeader({
  query,
  draft,
  setDraft,
  submit,
  clear,
}: {
  query?: string;
  draft: string;
  setDraft: (value: string) => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
  clear: () => void;
}) {
  return (
    <>
      <TechLabel tone="signal">DISCOVERY / SEARCH</TechLabel>
      <h1 className="text-display-2 mt-3 text-bone">جستجو در کاتالوگ</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-metal">
        در حالت live نتیجه، قیمت، موجودی و فیلترها از Backend می‌آیند.
      </p>
      <form onSubmit={submit} className="relative mt-6" role="search">
        <label htmlFor="site-search" className="sr-only">
          جستجو در محصولات
        </label>
        <input
          id="site-search"
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="نام یا عبارت محصول"
          autoComplete="off"
          className="h-14 w-full rounded-xl border border-hairline bg-carbon ps-14 pe-28 text-sm text-bone outline-none placeholder:text-mute focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/40"
        />
        <SearchIcon
          size={18}
          className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-mute"
          aria-hidden="true"
        />
        {draft ? (
          <button
            type="button"
            onClick={clear}
            aria-label="پاک کردن جستجو"
            className="tap-target absolute end-[76px] top-1/2 grid -translate-y-1/2 place-items-center text-mute hover:text-bone"
          >
            <X size={18} aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="submit"
          className={`${CtaClasses("signal")} absolute end-1.5 top-1.5 h-11 px-4`}
        >
          جستجو
        </button>
      </form>
      {query ? <p className="mt-4 text-xs text-metal">عبارت فعال: «{query}»</p> : null}
    </>
  );
}

function RecentSearches({
  recent,
  onPick,
  onChange,
}: {
  recent: string[];
  onPick: (value: string) => void;
  onChange: (items: string[]) => void;
}) {
  if (recent.length === 0) return null;
  return (
    <section className="mt-6" aria-labelledby="recent-searches-title">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="recent-searches-title"
          className="flex items-center gap-1.5 text-[13px] font-semibold text-metal"
        >
          <Clock size={14} aria-hidden="true" /> جستجوهای اخیر
        </h2>
        <button
          type="button"
          onClick={() => {
            clearRecentSearches();
            onChange([]);
          }}
          className="min-h-11 text-xs text-signal hover:underline"
        >
          پاک کردن همه
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {recent.map((item) => (
          <span
            key={item}
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-hairline bg-carbon px-3 text-xs text-bone"
          >
            <button
              type="button"
              onClick={() => onPick(item)}
              className="min-h-9 hover:text-signal"
            >
              {item}
            </button>
            <button
              type="button"
              aria-label={`حذف ${item}`}
              onClick={() => {
                removeRecentSearch(item);
                onChange(getRecentSearches());
              }}
              className="grid h-9 w-9 place-items-center text-mute hover:text-bone"
            >
              <X size={12} aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}

function LiveSearch({ loader }: { loader: LiveLoader }) {
  const routeSearch = Route.useSearch();
  const query = routeSearch.q;
  const navigate = useNavigate({ from: "/search" });
  const [draft, setDraft] = useState(query ?? "");
  const [recent, setRecent] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(loader.items);
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
  const expectedSearch = serializeSearch(query, filters, scope);
  const searchKey = stableSearchString(expectedSearch);

  useEffect(() => setDraft(query ?? ""), [query]);
  useEffect(() => setRecent(getRecentSearches()), []);
  useEffect(() => {
    if (query) {
      addRecentSearch(query);
      setRecent(getRecentSearches());
    }
  }, [query]);
  useEffect(() => {
    setItems(loader.items);
    setPage(1);
    setLoadMoreError(null);
  }, [loader.items, searchKey]);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      facets &&
      !isCanonicalSearch(window.location.search, expectedSearch)
    )
      navigate({ search: expectedSearch, replace: true });
  }, [expectedSearch, facets, navigate]);

  const commitQuery = (value: string, replace = false) => {
    const next = normalizeSearchTerm(value) || undefined;
    startTransition(() => navigate({ search: serializeSearch(next, filters, scope), replace }));
  };
  const setFilters = (next: Filters) => {
    const normalized = normalizeBackendFilters(next, scope);
    startTransition(() =>
      navigate({ search: serializeSearch(query, normalized, scope), replace: false }),
    );
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    commitQuery(draft);
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
    if (!query || !facets || loadingMore || page >= loader.totalPages) return;
    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const nextPage = page + 1;
      const response = await searchProducts({
        q: query,
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
    <SearchChrome>
      <SearchHeader
        query={query}
        draft={draft}
        setDraft={setDraft}
        submit={submit}
        clear={() => {
          setDraft("");
          if (query) commitQuery("");
        }}
      />
      {!query ? <RecentSearches recent={recent} onPick={commitQuery} onChange={setRecent} /> : null}
      {!query && facets ? (
        <section className="mt-8">
          <h2 className="text-[13px] font-semibold text-metal">دسته‌بندی‌های منتشرشده</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {facets.categories.map((category) => (
              <Link
                key={category.publicId}
                to="/$category"
                params={{ category: category.slug }}
                className="tap-target rounded-full border border-hairline px-4 py-2 text-xs text-bone hover:border-signal hover:text-signal"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {loader.error ? (
        <div className="mt-8">
          <StatePanel title="جستجوی Backend در دسترس نیست" tone="warning">
            {loader.error}
          </StatePanel>
        </div>
      ) : null}
      {query && !loader.error ? (
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--lbb-nav-h)+24px)]">
              {facets ? renderFilters(filters, setFilters) : null}
            </div>
          </aside>
          <section aria-labelledby="search-results-title">
            <h2 id="search-results-title" className="sr-only">
              نتایج جستجو برای {query}
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
            <p className="mt-4 text-[13px] text-metal" role="status" aria-live="polite">
              «{query}» · {loader.total.toLocaleString("fa-IR")} نتیجه
            </p>
            {isPending ? (
              <div className="mt-6" aria-busy="true">
                <GridSkeleton count={6} />
              </div>
            ) : loader.total === 0 ? (
              <EmptyState
                className="mt-6"
                icon={<PackageSearch size={40} aria-hidden="true" />}
                title={`نتیجه‌ای برای «${query}» پیدا نشد`}
                body="عبارت یا فیلترها را تغییر دهید."
              />
            ) : (
              <>
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                  {items.map((product) => (
                    <ProductCard key={product.id} p={product} />
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
                      {loadingMore ? "در حال دریافت…" : "نتایج بیشتر"}
                    </button>
                    {loadMoreError ? (
                      <p role="alert" className="text-xs text-signal">
                        {loadMoreError}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>
      ) : null}
    </SearchChrome>
  );
}

function PrototypeSearch() {
  const routeSearch = Route.useSearch();
  const query = routeSearch.q;
  const scope = useMemo(() => createDiscoveryScope(products, true), []);
  const filters = useMemo(
    () => normalizeFilters(parseFilters(routeSearch as Record<string, unknown>), scope),
    [routeSearch, scope],
  );
  const navigate = useNavigate({ from: "/search" });
  const [draft, setDraft] = useState(query ?? "");
  const [recent, setRecent] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const baseResults = useMemo(() => localMatches(query ?? ""), [query]);
  const results = useMemo(() => applyFilters(baseResults, filters), [baseResults, filters]);
  const expectedSearch = serializeSearch(query, filters);
  useEffect(() => setDraft(query ?? ""), [query]);
  useEffect(() => setRecent(getRecentSearches()), []);
  useEffect(() => {
    if (query) {
      addRecentSearch(query);
      setRecent(getRecentSearches());
    }
  }, [query]);
  useEffect(() => {
    if (typeof window !== "undefined" && !isCanonicalSearch(window.location.search, expectedSearch))
      navigate({ search: expectedSearch, replace: true });
  }, [expectedSearch, navigate]);
  const commitQuery = (value: string) => {
    const next = normalizeSearchTerm(value) || undefined;
    startTransition(() => navigate({ search: serializeSearch(next, filters), replace: false }));
  };
  const setFilters = (next: Filters) => {
    const normalized = normalizeFilters(next, scope);
    startTransition(() => navigate({ search: serializeSearch(query, normalized), replace: false }));
  };
  const renderFilters = (candidate: Filters, onChange: (next: Filters) => void) => (
    <ProductFilters
      filters={candidate}
      onChange={onChange}
      colors={scope.colors}
      sizes={scope.sizes}
      priceCeil={scope.priceCeil}
      showCategory
      facetCounts={createFacetCounts(baseResults, candidate, scope)}
    />
  );
  const getResultCount = (candidate: Filters) =>
    countDiscoveryResults(baseResults, candidate, scope);
  return (
    <SearchChrome>
      <SearchHeader
        query={query}
        draft={draft}
        setDraft={setDraft}
        submit={(event) => {
          event.preventDefault();
          commitQuery(draft);
        }}
        clear={() => {
          setDraft("");
          if (query) commitQuery("");
        }}
      />
      {!query ? <RecentSearches recent={recent} onPick={commitQuery} onChange={setRecent} /> : null}
      {!query ? (
        <section className="mt-8">
          <h2 className="text-[13px] font-semibold text-metal">دسته‌بندی‌های کاتالوگ</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORY_SLUGS.map((category) => (
              <Link
                key={category}
                to="/$category"
                params={{ category }}
                className="tap-target rounded-full border border-hairline px-4 py-2 text-xs text-bone hover:border-signal hover:text-signal"
              >
                {CATEGORIES[category].nameFa}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {query ? (
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">{renderFilters(filters, setFilters)}</aside>
          <section>
            <ProductGridControls
              filters={filters}
              onChange={setFilters}
              resultCount={results.length}
              filterSlot={renderFilters}
              getResultCount={getResultCount}
            />
            {isPending ? (
              <div className="mt-6">
                <GridSkeleton count={6} />
              </div>
            ) : results.length === 0 ? (
              <EmptyState
                className="mt-6"
                icon={<PackageSearch size={40} />}
                title={`نتیجه‌ای برای «${query}» پیدا نشد`}
                body="عبارت یا فیلترها را تغییر بده."
              />
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                {results.map((product) => (
                  <ProductCard key={product.id} p={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      ) : null}
    </SearchChrome>
  );
}
