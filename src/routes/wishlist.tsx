import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { products } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";
import { Shell, EmptyState, CtaClasses } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical } from "@/lib/site";

const TITLE = "علاقه‌مندی‌ها | LBB";
const DESC = "لیست محصولات مورد علاقه شما در فروشگاه استریت‌ویر LBB.";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/wishlist", noindex: true }),
    links: canonical("/wishlist"),
  }),
  component: Wishlist,
});

function Wishlist() {
  const { slugs, count } = useWishlist();
  const items = products.filter((p) => slugs.includes(p.slug));

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian px-5 pb-28 pt-28 md:px-10">
        <Shell>
          <h1 className="text-display-2 text-bone">علاقه‌مندی‌ها</h1>
          <p className="mt-1 text-[13px] text-metal" role="status" aria-live="polite">
            {count.toLocaleString("fa-IR")} محصول ذخیره شده
          </p>

          {items.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<Heart size={44} aria-hidden="true" />}
              title="لیست علاقه‌مندی‌تون خالیه"
              body="با آیکن قلب روی هر محصول، اون رو اینجا ذخیره کن."
              action={
                <Link to="/shop" className={CtaClasses("signal")}>
                  شروع به خرید
                </Link>
              }
            />
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </Shell>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
