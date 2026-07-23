import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductCard } from "@/components/lbb/ProductCard";
import { productBySlug, productsByCategory, fmtToman } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { useCart } from "@/lib/cart";
import { ShoppingBag, Check } from "lucide-react";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = productBySlug(params.slug);
    if (!product) throw notFound();
    const related = productsByCategory(product.category).filter((p) => p.slug !== product.slug).slice(0, 4);
    return { product, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    const cat = CATEGORIES[p.category];
    const title = `${p.name} | خرید از LBB — ${cat.nameFa}`;
    const desc = `${p.name} را از LBB بخرید. ${p.shortDescription}. قیمت: ${fmtToman(p.price)}. ارسال سریع.`;
    const productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description,
      sku: p.sku,
      brand: { "@type": "Brand", name: "LBB" },
      category: cat.nameFa,
      material: p.material,
      offers: {
        "@type": "Offer",
        url: `/product/${p.slug}`,
        priceCurrency: "IRR",
        price: p.price * 10,
        availability: p.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "LBB" },
      },
      ...(p.avgRating && p.reviewCount
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: p.avgRating,
              reviewCount: p.reviewCount,
              bestRating: 5,
            },
          }
        : {}),
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
        { "@type": "ListItem", position: 2, name: "فروشگاه", item: "/shop" },
        { "@type": "ListItem", position: 3, name: cat.nameFa, item: `/${cat.slug}` },
        { "@type": "ListItem", position: 4, name: p.name, item: `/product/${p.slug}` },
      ],
    };
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: p.inStock ? "index, follow" : "noindex, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: p.shortDescription },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${p.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${p.slug}` }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p, related } = Route.useLoaderData();
    const cat = CATEGORIES[p.category as keyof typeof CATEGORIES];
  const [color, setColor] = useState(p.colors[0]);
  const [size, setSize] = useState(p.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"desc" | "spec" | "reviews">("desc");
  const { add } = useCart();
  const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

  const onAdd = () => {
    add({ slug: p.slug, name: p.name, price: p.price, color, size, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <Navbar theme="light" />
      <main
        dir="rtl"
        className="min-h-screen bg-white pt-16 text-black"
        style={{ paddingBottom: "80px", fontFamily: "'Vazirmatn', sans-serif" }}
      >
        <div className="mx-auto max-w-[1280px] px-4 py-4 md:px-8">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "فروشگاه", href: "/shop" },
              { label: cat.nameFa, href: `/${cat.slug}` },
              { label: p.name },
            ]}
          />
        </div>

        <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 pb-12 md:grid-cols-[55%_45%] md:px-8">
          {/* Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-black/[0.06] bg-white">
              <div className="absolute inset-0 grid place-items-center">
                <span
                  className="font-black text-black/[0.06]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 160 }}
                >
                  LBB
                </span>
              </div>
              <div
                aria-hidden
                className="absolute inset-8 rounded-lg"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${color}30 0%, transparent 70%)`,
                }}
              />
            </div>
            <div className="mt-3 flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  className={`aspect-square w-20 rounded-md border ${
                    i === 0 ? "border-[var(--lbb-red)]" : "border-black/10"
                  } bg-white`}
                  aria-label={`تصویر ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <span
              className="text-[11px] uppercase tracking-wider text-[var(--lbb-red)]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {cat.nameFa}
            </span>
            <h1 className="text-2xl font-bold md:text-[26px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {p.name}
            </h1>
            {p.avgRating && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-[var(--lbb-red)]">
                  {"★".repeat(Math.round(p.avgRating))}
                  <span className="text-gray-300">{"★".repeat(5 - Math.round(p.avgRating))}</span>
                </span>
                <span>
                  {p.avgRating} از ۵ — {p.reviewCount} نظر
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {fmtToman(p.price)}
              </span>
              {p.originalPrice && (
                <>
                  <span className="text-base text-gray-400 line-through">{fmtToman(p.originalPrice)}</span>
                  <span className="rounded bg-[var(--lbb-red)] px-2 py-0.5 text-[11px] font-bold text-white">
                    {discount}٪ تخفیف
                  </span>
                </>
              )}
            </div>

            <hr className="border-black/[0.06]" />

            {/* Colors */}
            <div>
              <p className="mb-2 text-sm font-semibold">
                رنگ: <span className="font-normal text-gray-600">{color}</span>
              </p>
              <div className="flex gap-2">
                {p.colors.map((c: string) => (
                  <button
                    key={c}
                    aria-label={c}
                    onClick={() => setColor(c)}
                    className="grid h-8 w-8 place-items-center rounded-full"
                    style={{
                      background: c,
                      border: color === c ? "2px solid var(--lbb-red)" : "1px solid rgba(0,0,0,0.15)",
                      outline: color === c ? "2px solid white" : "none",
                      outlineOffset: color === c ? "-4px" : 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">سایز</span>
                <a href="/size-guide" className="text-xs text-[var(--lbb-red)]">
                  راهنمای سایز →
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`grid h-10 min-w-[40px] place-items-center rounded-md border px-3 text-xs ${
                      size === s
                        ? "border-[var(--lbb-red)] bg-[#fff5f5] text-[var(--lbb-red)]"
                        : "border-black/15 text-gray-700 hover:border-black/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">تعداد:</span>
              <div className="flex items-center rounded-md border border-black/15">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 text-lg">−</button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="h-10 w-10 text-lg">+</button>
              </div>
            </div>

            <button
              onClick={onAdd}
              disabled={!p.inStock}
              className="mt-2 flex h-14 items-center justify-center gap-2 rounded-lg bg-[var(--lbb-red)] text-white transition-all hover:brightness-110 disabled:opacity-50"
            >
              {added ? (
                <>
                  <Check size={18} /> <span className="text-sm font-bold">به سبد اضافه شد</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span className="text-sm font-bold">
                    {p.inStock ? "افزودن به سبد خرید" : "ناموجود"}
                  </span>
                </>
              )}
            </button>

            <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600">
              <span>🚚 ارسال به سراسر ایران</span>
              <span>↩ مرجوعی ۷ روزه</span>
              <span>🔒 درگاه امن</span>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="border-t border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 md:px-8">
            <div className="flex gap-6 border-b border-black/[0.06]">
              {(
                [
                  ["desc", "توضیحات"],
                  ["spec", "مشخصات"],
                  ["reviews", `نظرات (${p.reviewCount ?? 0})`],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`border-b-2 py-3 text-sm ${
                    tab === id ? "border-[var(--lbb-red)] font-semibold text-black" : "border-transparent text-gray-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="py-6 text-sm leading-8 text-gray-700">
              {tab === "desc" && <p>{p.description}</p>}
              {tab === "spec" && (
                <table className="w-full max-w-[520px] text-sm">
                  <tbody>
                    <tr className="border-b border-black/[0.06]"><td className="py-2 text-gray-500">جنس</td><td className="py-2">{p.material}</td></tr>
                    <tr className="border-b border-black/[0.06]"><td className="py-2 text-gray-500">سایزبندی</td><td className="py-2">{p.sizes.join(", ")}</td></tr>
                    <tr className="border-b border-black/[0.06]"><td className="py-2 text-gray-500">کد محصول</td><td className="py-2">{p.sku}</td></tr>
                    <tr><td className="py-2 text-gray-500">کشور</td><td className="py-2">ایران</td></tr>
                  </tbody>
                </table>
              )}
              {tab === "reviews" && (
                <p className="text-gray-500">
                  {p.reviewCount ? `میانگین امتیاز ${p.avgRating} از ${p.reviewCount} نظر` : "هنوز نظری ثبت نشده."}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-black/[0.06] py-10">
            <div className="mx-auto max-w-[1280px] px-4 md:px-8">
              <h3 className="mb-4 text-lg font-semibold">محصولات مشابه</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {related.map((r: import("@/lib/products").Product) => <ProductCard key={r.id} p={r} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
