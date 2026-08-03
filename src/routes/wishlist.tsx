import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { ProductCard } from "@/components/lbb/ProductCard";
import { products } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "علاقه‌مندی‌ها | LBB" },
      { name: "description", content: "لیست محصولات مورد علاقه شما در فروشگاه استریت‌ویر LBB." },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "علاقه‌مندی‌ها | LBB" },
      { property: "og:description", content: "لیست محصولات مورد علاقه شما در فروشگاه استریت‌ویر LBB." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/wishlist" },
    ],
    links: [{ rel: "canonical", href: "/wishlist" }],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { slugs, count } = useWishlist();
  const items = products.filter((p) => slugs.includes(p.slug));

  return (
    <>
      <Navbar theme="light" />
      <main
        dir="rtl"
        className="min-h-screen bg-white px-5 pb-28 pt-28 md:px-10"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <div className="mx-auto max-w-[1280px]">
          <h1
            className="text-[24px] font-bold text-[#0A0A0A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            علاقه‌مندی‌ها
          </h1>
          <p className="mt-1 text-[13px] text-gray-500">
            {count.toLocaleString("fa-IR")} محصول ذخیره شده
          </p>

          {items.length === 0 ? (
            <div className="py-20 text-center">
              <Heart size={44} className="mx-auto text-black/20" aria-hidden="true" />
              <p className="mt-4 text-[15px] font-semibold">لیست علاقه‌مندی‌تون خالیه</p>
              <p className="mt-1 text-[13px] text-gray-500">
                با آیکن قلب روی هر محصول، اون رو اینجا ذخیره کن.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex h-12 items-center rounded-xl bg-[var(--lbb-red)] px-6 text-[13px] font-bold text-white"
              >
                شروع به خرید
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {items.map((p) => (
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
