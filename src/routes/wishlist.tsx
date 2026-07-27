import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { products } from "@/lib/products";

const KEY = "lbb-wishlist-v1";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "علاقه‌مندی‌ها | LBB" },
      { name: "description", content: "لیست محصولات مورد علاقه شما در فروشگاه استریت‌ویر LBB." },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "علاقه‌مندی‌ها | LBB" },
      { property: "og:description", content: "لیست محصولات مورد علاقه شما در فروشگاه استریت‌ویر LBB." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const remove = (slug: string) => {
    const next = slugs.filter((s) => s !== slug);
    setSlugs(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const items = products.filter((p) => slugs.includes(p.slug));

  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white px-5 pb-28 pt-28 md:px-10" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="mx-auto max-w-[1280px]">
          <h1 className="text-[24px] font-bold text-[#0A0A0A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            علاقه‌مندی‌ها
          </h1>

          {ready && items.length === 0 && (
            <div className="py-20 text-center">
              <Heart size={44} className="mx-auto text-black/20" aria-hidden="true" />
              <p className="mt-4 text-[15px] font-semibold">لیست علاقه‌مندی‌تون خالیه</p>
              <Link
                to="/shop"
                className="mt-6 inline-flex h-12 items-center rounded-xl bg-[var(--lbb-red)] px-6 text-[13px] font-bold text-white"
              >
                شروع به خرید
              </Link>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p.id} className="relative">
                <ProductCard p={p} />
                <button
                  onClick={() => remove(p.slug)}
                  aria-label={`حذف ${p.name} از علاقه‌مندی‌ها`}
                  className="absolute left-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-black shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
