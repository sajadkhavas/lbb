import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon, X, Clock } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { products } from "@/lib/products";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { addRecentSearch, clearRecentSearches, getRecentSearches, removeRecentSearch } from "@/lib/recent-searches";
import { Shell, EmptyState } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical } from "@/lib/site";

type Search = { q?: string };

const match = (q: string) => {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return products.filter((p) =>
    [p.name, p.shortDescription, p.description, p.sku, CATEGORIES[p.category].nameFa]
      .join(" ")
      .toLowerCase()
      .includes(t),
  );
};

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-signal/15 text-signal">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
  }),
  head: ({ match: m }) => {
    const q = (m.search as Search).q;
    const title = q ? `نتایج جستجو برای «${q}» | LBB` : "جستجو | LBB";
    const desc = q
      ? `نتایج جستجو برای «${q}» در فروشگاه استریت‌ویر LBB.`
      : "جستجو در محصولات فروشگاه استریت‌ویر LBB — هودی، شلوار، تیشرت، کتونی و جوراب.";
    return {
      meta: pageMeta({ title, description: desc, path: "/search", noindex: true }),
      links: canonical("/search"),
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q ?? "");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => setValue(q ?? ""), [q]);
  useEffect(() => setRecent(getRecentSearches()), []);

  useEffect(() => {
    const id = setTimeout(() => {
      if ((value || undefined) !== q) {
        navigate({ to: "/search", search: value ? { q: value } : {}, replace: true });
      }
    }, 300);
    return () => clearTimeout(id);
  }, [value, q, navigate]);

  useEffect(() => {
    if (q && q.trim()) {
      addRecentSearch(q);
      setRecent(getRecentSearches());
    }
  }, [q]);

  const results = useMemo(() => match(q ?? ""), [q]);

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian px-5 pb-28 pt-28 md:px-10">
        <Shell>
          <h1 className="text-display-2 text-bone">جستجو</h1>

          <div className="relative mt-5">
            <label htmlFor="site-search" className="sr-only">جستجو در محصولات</label>
            <input
              id="site-search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="جستجو در محصولات LBB..."
              className="h-14 w-full rounded-xl border border-hairline bg-carbon ps-24 pe-5 text-sm text-bone outline-none tap-target placeholder:text-mute focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/40"
            />
            <SearchIcon size={18} className="absolute start-5 top-1/2 -translate-y-1/2 text-mute" aria-hidden="true" />
            {value && (
              <button
                onClick={() => setValue("")}
                aria-label="پاک کردن جستجو"
                className="absolute start-12 top-1/2 -translate-y-1/2 tap-target text-mute"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {!q && recent.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-metal">
                  <Clock size={14} /> جستجوهای اخیر
                </p>
                <button
                  onClick={() => {
                    clearRecentSearches();
                    setRecent([]);
                  }}
                  className="text-xs text-signal hover:underline"
                >
                  پاک کردن همه
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {recent.map((r) => (
                  <span
                    key={r}
                    className="flex items-center gap-1.5 rounded-full border border-hairline bg-carbon px-3 py-1.5 text-xs text-bone"
                  >
                    <button onClick={() => setValue(r)} className="hover:text-signal">
                      {r}
                    </button>
                    <button
                      aria-label={`حذف ${r}`}
                      onClick={() => {
                        removeRecentSearch(r);
                        setRecent(getRecentSearches());
                      }}
                      className="text-mute hover:text-bone"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {!q && (
            <div className="mt-8">
              <p className="text-[13px] font-semibold text-metal">دسته‌بندی‌های پرطرفدار</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {CATEGORY_SLUGS.map((c) => (
                  <Link
                    key={c}
                    to="/$category"
                    params={{ category: c }}
                    className="tap-target rounded-full border border-hairline px-4 py-2 text-xs text-bone hover:border-signal hover:text-signal"
                  >
                    {CATEGORIES[c].nameFa}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {q && (
            <p className="mt-5 text-[13px] text-metal" role="status" aria-live="polite">
              نتایج برای «{q}»: {results.length.toLocaleString("fa-IR")} محصول
            </p>
          )}

          {q && results.length === 0 ? (
            <EmptyState
              className="mt-4"
              icon={<SearchIcon size={40} aria-hidden="true" />}
              title={`محصولی برای «${q}» پیدا نشد`}
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  {(["hoodies", "pants", "shoes"] as const).map((c) => (
                    <Link
                      key={c}
                      to="/$category"
                      params={{ category: c }}
                      className="tap-target rounded-full border border-hairline px-4 py-2 text-xs text-bone hover:border-signal hover:text-signal"
                    >
                      {CATEGORIES[c].nameFa}
                    </Link>
                  ))}
                </div>
              }
            />
          ) : q && results.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {results.map((p) => (
                <div key={p.id}>
                  <ProductCard p={p} />
                  <p className="mt-2 line-clamp-1 px-1 text-[11px] text-metal">
                    {highlight(p.name, q)}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </Shell>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
