import { useEffect, useMemo, useState, useTransition, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, PackageSearch, Search as SearchIcon, X } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { ProductFilters } from "@/components/lbb/ProductFilters";
import { ProductGridControls } from "@/components/lbb/ProductGridControls";
import { CtaClasses, EmptyState, GridSkeleton, Shell } from "@/components/lbb/ui/primitives";
import { products } from "@/lib/products";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
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
  normalizeFilters,
  parseFilterSearch,
  parseFilters,
  serializeFilters,
  stableSearchString,
  type Filters,
  type FilterSearch,
} from "@/lib/product-filter";

const ALL_COLORS = Array.from(new Set(products.flatMap((product) => product.colors)));
const ALL_SIZES = Array.from(new Set(products.flatMap((product) => product.sizes)));
const PRICE_CEIL = Math.max(1, ...products.map((product) => product.price));
const FILTER_SCOPE = { colors: ALL_COLORS, sizes: ALL_SIZES, priceCeil: PRICE_CEIL } as const;

type SearchParams = FilterSearch & { q?: string };

const queryFrom = (value: unknown) =>
  normalizeSearchTerm(typeof value === "string" ? value : "") || undefined;
const serializeSearch = (query: string | undefined, filters: Filters): SearchParams => ({
  ...(query ? { q: query } : {}),
  ...serializeFilters(filters),
});

const searchableText = (product: (typeof products)[number]) =>
  normalizeSearchTerm(
    [
      product.name,
      product.latinName,
      product.shortDescription,
      product.description,
      product.sku,
      CATEGORIES[product.category].nameFa,
      CATEGORIES[product.category].nameFaPlural,
    ].join(" "),
  ).toLocaleLowerCase("fa-IR");

const matchesQuery = (query: string) => {
  const normalized = normalizeSearchTerm(query).toLocaleLowerCase("fa-IR");
  if (!normalized) return [];
  const tokens = normalized.split(" ").filter(Boolean);
  return products.filter((product) => {
    const haystack = searchableText(product);
    return tokens.every((token) => haystack.includes(token));
  });
};

function highlight(text: string, query: string) {
  const token = normalizeSearchTerm(query).split(" ").filter(Boolean)[0];
  if (!token) return text;
  const index = text.toLocaleLowerCase("fa-IR").indexOf(token.toLocaleLowerCase("fa-IR"));
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-signal/15 text-signal">
        {text.slice(index, index + token.length)}
      </mark>
      {text.slice(index + token.length)}
    </>
  );
}

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    ...parseFilterSearch(search),
    q: queryFrom(search.q),
  }),
  head: ({ match }) => {
    const query = (match.search as SearchParams).q;
    const title = query ? `نتایج جستجو برای «${query}» | LBB` : "جستجو | LBB";
    const description = query
      ? `نتایج جستجو برای «${query}» در فروشگاه استریت‌ویر LBB.`
      : "جستجو در محصولات فروشگاه استریت‌ویر LBB — هودی، شلوار، تیشرت، کتونی و جوراب.";
    return {
      meta: pageMeta({ title, description, path: "/search", noindex: true }),
      links: canonical("/search"),
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const routeSearch = Route.useSearch();
  const query = routeSearch.q;
  const filters = useMemo(
    () =>
      normalizeFilters(
        parseFilters(routeSearch as unknown as Record<string, unknown>),
        FILTER_SCOPE,
      ),
    [routeSearch],
  );
  const navigate = useNavigate({ from: "/search" });
  const [draft, setDraft] = useState(query ?? "");
  const [recent, setRecent] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const expectedSearch = useMemo(() => serializeSearch(query, filters), [query, filters]);
  const searchKey = stableSearchString(expectedSearch);

  useEffect(() => setDraft(query ?? ""), [query]);
  useEffect(() => setRecent(getRecentSearches()), []);

  useEffect(() => {
    if (!query) return;
    addRecentSearch(query);
    setRecent(getRecentSearches());
  }, [query]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isCanonicalSearch(window.location.search, expectedSearch)) {
      navigate({ search: expectedSearch, replace: true });
    }
  }, [expectedSearch, navigate]);

  useEffect(() => {
    const nextQuery = normalizeSearchTerm(draft) || undefined;
    if (nextQuery === query) return;
    const timer = window.setTimeout(() => {
      startTransition(() =>
        navigate({ search: serializeSearch(nextQuery, filters), replace: true }),
      );
    }, 350);
    return () => window.clearTimeout(timer);
  }, [draft, filters, navigate, query]);

  const baseResults = useMemo(() => matchesQuery(query ?? ""), [query]);
  const results = useMemo(() => applyFilters(baseResults, filters), [baseResults, filters]);

  const commitQuery = (nextValue: string, replace = false) => {
    const nextQuery = normalizeSearchTerm(nextValue) || undefined;
    startTransition(() => navigate({ search: serializeSearch(nextQuery, filters), replace }));
  };

  const setFilters = (nextFilters: Filters) => {
    const normalized = normalizeFilters(nextFilters, FILTER_SCOPE);
    startTransition(() => navigate({ search: serializeSearch(query, normalized), replace: false }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    commitQuery(draft);
  };

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
      <main dir="rtl" className="min-h-screen bg-obsidian px-5 pb-28 pt-28 md:px-10">
        <Shell>
          <h1 className="text-display-2 text-bone">جستجو</h1>

          <form onSubmit={submit} className="relative mt-5" role="search">
            <label htmlFor="site-search" className="sr-only">
              جستجو در محصولات
            </label>
            <input
              id="site-search"
              type="search"
              aria-label="جست‌وجوی محصولات"
              value={draft}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setDraft(event.target.value)
              }
              placeholder="جستجو در محصولات LBB..."
              autoComplete="off"
              className="h-14 w-full rounded-xl border border-hairline bg-carbon ps-14 pe-28 text-sm text-bone outline-none tap-target placeholder:text-mute focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/40"
            />
            <SearchIcon
              size={18}
              className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-mute"
              aria-hidden="true"
            />
            {draft ? (
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  if (query) commitQuery("");
                }}
                aria-label="پاک کردن جستجو"
                className="tap-target absolute end-[76px] top-1/2 grid -translate-y-1/2 place-items-center text-mute hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
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

          {!query && recent.length > 0 ? (
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
                    setRecent([]);
                  }}
                  className="min-h-11 text-xs text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
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
                      onClick={() => commitQuery(item)}
                      className="min-h-9 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    >
                      {item}
                    </button>
                    <button
                      type="button"
                      aria-label={`حذف ${item}`}
                      onClick={() => {
                        removeRecentSearch(item);
                        setRecent(getRecentSearches());
                      }}
                      className="grid h-9 w-9 place-items-center text-mute hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {!query ? (
            <section className="mt-8" aria-labelledby="popular-categories-title">
              <h2 id="popular-categories-title" className="text-[13px] font-semibold text-metal">
                دسته‌بندی‌های پرطرفدار
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {CATEGORY_SLUGS.map((category) => (
                  <Link
                    key={category}
                    to="/$category"
                    params={{ category }}
                    className="tap-target rounded-full border border-hairline px-4 py-2 text-xs text-bone hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    {CATEGORIES[category].nameFa}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {query ? (
            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
              <aside className="hidden lg:block" aria-label="فیلتر نتایج جستجو">
                <div className="sticky top-[calc(var(--lbb-nav-h)+24px)]">{filterUi}</div>
              </aside>
              <section aria-labelledby="search-results-title">
                <h2 id="search-results-title" className="sr-only">
                  نتایج جستجو برای {query}
                </h2>
                <ProductGridControls
                  filters={filters}
                  onChange={setFilters}
                  resultCount={results.length}
                  filterSlot={filterUi}
                />
                <p
                  className="mt-4 text-[13px] text-metal"
                  role="status"
                  aria-live="polite"
                  key={searchKey}
                >
                  نتایج برای «{query}»: {results.length.toLocaleString("fa-IR")} محصول
                </p>

                {isPending ? (
                  <div className="mt-6" aria-busy="true" aria-label="در حال به‌روزرسانی نتایج">
                    <GridSkeleton count={6} />
                  </div>
                ) : results.length === 0 ? (
                  <EmptyState
                    className="mt-6"
                    icon={<PackageSearch size={40} aria-hidden="true" />}
                    title={`محصولی برای «${query}» پیدا نشد`}
                    body={
                      baseResults.length > 0
                        ? "نتیجه‌ای با فیلترهای انتخاب‌شده باقی نمانده است."
                        : "املای عبارت را بررسی کن یا یکی از دسته‌بندی‌ها را ببین."
                    }
                    action={
                      baseResults.length > 0 ? (
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
                      ) : (
                        <div className="flex flex-wrap justify-center gap-2">
                          {(["hoodies", "pants", "shoes"] as const).map((category) => (
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
                      )
                    }
                  />
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                    {results.map((product, index) => (
                      <div key={product.id}>
                        <ProductCard p={product} priority={index < 2} />
                        <p className="mt-2 line-clamp-1 px-1 text-[11px] text-metal">
                          {highlight(product.name, query)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </Shell>
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}
