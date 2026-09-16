import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Loader2 } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { products } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";
import { Shell, EmptyState, CtaClasses, StatePanel } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical } from "@/lib/site";
import { BackendApiError, getProduct, isLiveBackend } from "@/lib/backend-api";
import { backendCard, type BackendCatalogCard } from "@/lib/backend-storefront";

const TITLE = "علاقه‌مندی‌ها | LBB";
const DESC = "محصولات ذخیره‌شده شما در فروشگاه LBB.";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/wishlist", noindex: true }),
    links: canonical("/wishlist"),
  }),
  component: Wishlist,
});

function Wishlist() {
  const { slugs, count, remove, hydrated } = useWishlist();
  const live = isLiveBackend();
  const [liveItems, setLiveItems] = useState<BackendCatalogCard[]>([]);
  const [loading, setLoading] = useState(live);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !live) return;

    if (slugs.length === 0) {
      setLiveItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      const resolved: BackendCatalogCard[] = [];
      const stale: string[] = [];
      let failed = false;

      for (const slug of slugs) {
        try {
          const response = await getProduct(slug);
          resolved.push(backendCard(response.data));
        } catch (cause) {
          if (
            cause instanceof BackendApiError &&
            cause.status === 404 &&
            cause.code === "resource_not_found"
          ) {
            stale.push(slug);
          } else {
            failed = true;
          }
        }
      }

      if (cancelled) return;
      setLiveItems(resolved);
      if (failed) setError("بخشی از علاقه‌مندی‌ها فعلاً قابل دریافت نیست؛ دوباره تلاش کنید.");
      stale.forEach(remove);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, live, remove, slugs]);

  const localItems = products.filter((product) => slugs.includes(product.slug));
  const items = live ? liveItems : localItems;

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian px-5 pb-28 pt-28 md:px-10">
        <Shell>
          <h1 className="text-display-2 text-bone">علاقه‌مندی‌ها</h1>
          <p className="mt-1 text-[13px] text-metal" role="status" aria-live="polite">
            {count.toLocaleString("fa-IR")} محصول ذخیره‌شده
          </p>

          {!hydrated || loading ? (
            <p className="mt-10 flex items-center gap-2 text-sm text-metal" role="status">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              در حال آماده‌کردن علاقه‌مندی‌ها…
            </p>
          ) : error && items.length === 0 ? (
            <div className="mt-10">
              <StatePanel title="نمایش علاقه‌مندی‌ها کامل نشد" tone="warning">
                {error}
              </StatePanel>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<Heart size={44} aria-hidden="true" />}
              title="لیست علاقه‌مندی‌های شما خالی است"
              body="با آیکن قلب روی هر محصول، آن را برای بعد ذخیره کنید."
              action={
                <Link to="/shop" className={CtaClasses("signal")}>
                  رفتن به فروشگاه
                </Link>
              }
            />
          ) : (
            <>
              {error ? (
                <div className="mt-6">
                  <StatePanel title="برخی موارد نمایش داده نشدند" tone="warning">
                    {error}
                  </StatePanel>
                </div>
              ) : null}
              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                {items.map((product) => (
                  <ProductCard key={product.id} p={product} />
                ))}
              </div>
            </>
          )}
        </Shell>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
