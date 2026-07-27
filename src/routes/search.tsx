import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon, X } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { products } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";

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

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
  }),
  head: ({ match: m }) => {
    const q = (m.search as Search).q;
    const title = q ? `نتایج جستجو برای «${q}» | LBB` : "جستجو | LBB";
    const desc = q
      ? `نتایج جستجو برای «${q}» در فروشگاه استریت‌ویر LBB.`
      : "جستجو در محصولات فروشگاه استریت‌ویر LBB — هودی، شلوار، تیشرت، کتونی و اکسسوری.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q ?? "");

  useEffect(() => setValue(q ?? ""), [q]);

  useEffect(() => {
    const id = setTimeout(() => {
      if ((value || undefined) !== q) {
        navigate({ to: "/search", search: value ? { q: value } : {}, replace: true });
      }
    }, 300);
    return () => clearTimeout(id);
  }, [value, q, navigate]);

  const results = useMemo(() => match(q ?? ""), [q]);

  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white px-5 pb-28 pt-28 md:px-10" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="mx-auto max-w-[1280px]">
          <h1 className="text-[24px] font-bold text-[#0A0A0A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            جستجو
          </h1>

          <div className="relative mt-5">
            <label htmlFor="site-search" className="sr-only">جستجو در محصولات</label>
            <input
              id="site-search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="جستجو در محصولات LBB..."
              className="h-14 w-full rounded-xl border border-[#e0e0e0] pr-5 pl-24 text-sm outline-none focus:border-[var(--lbb-red)]"
            />
            <SearchIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/40" aria-hidden="true" />
            {value && (
              <button
                onClick={() => setValue("")}
                aria-label="پاک کردن جستجو"
                className="absolute left-12 top-1/2 -translate-y-1/2 text-black/40"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {q && (
            <p className="mt-5 text-[13px] text-[#666]">
              نتایج برای «{q}»: {results.length.toLocaleString("fa-IR")} محصول
            </p>
          )}

          {q && results.length === 0 ? (
            <div className="py-16 text-center">
              <SearchIcon size={40} className="mx-auto text-black/20" aria-hidden="true" />
              <p className="mt-4 text-[15px] font-semibold">محصولی برای «{q}» پیدا نشد</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {(["hoodies", "pants", "shoes"] as const).map((c) => (
                  <Link
                    key={c}
                    to="/$category"
                    params={{ category: c }}
                    className="rounded-full border border-black/15 px-4 py-2 text-[12px] hover:border-[var(--lbb-red)] hover:text-[var(--lbb-red)]"
                  >
                    {CATEGORIES[c].nameFa}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
