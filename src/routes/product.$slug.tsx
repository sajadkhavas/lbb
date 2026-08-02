import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Check } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { colorName } from "@/lib/color-names";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Gallery } from "@/components/lbb/product/Gallery";
import { StickyBuyBar } from "@/components/lbb/product/StickyBuyBar";
import { FitGuide } from "@/components/lbb/product/FitGuide";
import { RecentlyViewed } from "@/components/lbb/product/RecentlyViewed";
import { SizeGuideDialog } from "@/components/lbb/product/SizeGuideDialog";
import {
  productBySlug,
  productsByCategory,
  bestSellers,
  fmtToman,
  isSizeAvailable,
  discountPercent,
} from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { useCart } from "@/lib/cart";
import { productImage } from "@/lib/product-images";
import { recordRecentlyViewed } from "@/lib/recently-viewed";
import { absAsset, absUrl, breadcrumbLd as buildBreadcrumbLd } from "@/lib/site";
import {
  Shell,
  Band,
  SectionHead,
  StatusTag,
  TechLabel,
  CtaClasses,
} from "@/components/lbb/ui/primitives";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = productBySlug(params.slug);
    if (!product) throw notFound();
    let related = productsByCategory(product.category).filter((p) => p.slug !== product.slug);
    if (related.length === 0) related = bestSellers(4).filter((p) => p.slug !== product.slug);
    return { product, related: related.slice(0, 4) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    const cat = CATEGORIES[p.category];
    const title = `${p.name} | خرید از LBB — ${cat.nameFa}`.slice(0, 59);
    const desc = `${p.shortDescription} قیمت: ${fmtToman(p.price)}.`.slice(0, 159);
    const path = `/product/${p.slug}`;

    // No real review data exists, so no Review/AggregateRating schema is emitted.
    const productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      sku: p.sku,
      brand: { "@type": "Brand", name: "LBB" },
      description: p.description,
      image: [absAsset(productImage(p.slug))],
      offers: {
        "@type": "Offer",
        url: absUrl(path),
        priceCurrency: "IRR",
        price: p.price * 10,
        availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "LBB" },
      },
    };
    const crumbs = buildBreadcrumbLd([
      { name: "خانه", path: "/" },
      { name: "فروشگاه", path: "/shop" },
      { name: cat.nameFa, path: `/${cat.slug}` },
      { name: p.name, path },
    ]);

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: p.inStock ? "index, follow" : "noindex, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: absUrl(path) },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: absUrl(path) }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productLd) },
        { type: "application/ld+json", children: JSON.stringify(crumbs) },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p, related } = Route.useLoaderData();
  const cat = CATEGORIES[p.category as keyof typeof CATEGORIES];
  const [color, setColor] = useState(p.colors[0]);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const { add, openDrawer } = useCart();
  const addBtnRef = useRef<HTMLDivElement>(null);
  const discount = discountPercent(p);

  useEffect(() => {
    recordRecentlyViewed(p.slug);
  }, [p.slug]);

  useEffect(() => {
    setColor(p.colors[0]);
    setSize("");
    setQty(1);
    setSizeError(false);
  }, [p.slug]);

  useEffect(() => {
    const el = addBtnRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting), {
      rootMargin: "0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onAdd = () => {
    if (!size) {
      setSizeError(true);
      toast.error("لطفاً یک سایز انتخاب کنید");
      return;
    }
    add({ slug: p.slug, name: p.name, price: p.price, color, size, qty });
    toast.success("به سبد خرید اضافه شد", { description: p.name });
    openDrawer();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16 md:pb-0">
        <Shell className="py-4">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "فروشگاه", href: "/shop" },
              { label: cat.nameFa, to: "/$category", params: { category: cat.slug } },
              { label: p.name },
            ]}
          />
        </Shell>

        <Shell as="section" className="grid grid-cols-1 gap-8 pb-12 md:grid-cols-[62%_38%] md:gap-10">
          {/* Images */}
          <Gallery slug={p.slug} name={p.name} />

          {/* Info — sticky on desktop */}
          <div className="flex flex-col gap-5 md:sticky md:top-20 md:self-start">
            <div>
              <TechLabel tone="signal">
                {cat.nameFa} / {p.latinName}
              </TechLabel>
              <h1 className="mt-2 text-display-2 text-bone">{p.name}</h1>
              <p className="mt-2 text-sm leading-7 text-metal">{p.shortDescription}</p>
            </div>

            <div className="flex items-center gap-2">
              {p.isNew && <StatusTag tone="signal">جدید</StatusTag>}
              {!p.inStock && <StatusTag tone="out">ناموجود</StatusTag>}
              {discount > 0 && <StatusTag tone="bone">{discount}٪ تخفیف</StatusTag>}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="num text-2xl font-bold text-bone">{fmtToman(p.price)}</span>
              {p.originalPrice && (
                <span className="num text-sm text-mute line-through">{fmtToman(p.originalPrice)}</span>
              )}
            </div>

            <span aria-hidden="true" className="h-px w-full bg-hairline" />

            {/* Colors — name is always shown as text, never colour-only */}
            <div>
              <p className="mb-2 text-xs font-semibold text-bone">
                رنگ: <span className="font-normal text-metal">{colorName(color)}</span>
              </p>
              <div className="flex gap-2">
                {p.colors.map((c: string) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={colorName(c)}
                    aria-pressed={color === c}
                    onClick={() => setColor(c)}
                    className="tap-target grid place-items-center rounded-full border-2 p-0"
                    style={{
                      background: c,
                      borderColor: color === c ? "var(--lbb-signal)" : "var(--lbb-hairline)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-bone">سایز</span>
                <SizeGuideDialog
                  trigger={
                    <button type="button" className="tech text-signal">
                      راهنمای سایز
                    </button>
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="انتخاب سایز">
                {p.sizes.map((s: string) => {
                  const available = isSizeAvailable(p, s);
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={!available}
                      aria-pressed={size === s}
                      onClick={() => {
                        setSize(s);
                        setSizeError(false);
                      }}
                      className={`tap-target min-w-[44px] border px-3 text-xs font-semibold transition ${
                        !available
                          ? "border-hairline text-mute line-through opacity-40"
                          : size === s
                            ? "border-signal bg-signal text-bone"
                            : "border-hairline text-bone hover:border-metal"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {sizeError && (
                <p role="alert" className="mt-2 text-xs font-semibold text-signal">
                  لطفاً پیش از افزودن به سبد، یک سایز انتخاب کنید.
                </p>
              )}
            </div>

            {/* Qty */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-bone">تعداد:</span>
              <div className="flex items-center border border-hairline">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="کاهش تعداد"
                  className="tap-target text-lg text-bone"
                >
                  −
                </button>
                <span className="num w-10 text-center text-sm text-bone">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="افزایش تعداد"
                  className="tap-target text-lg text-bone"
                >
                  +
                </button>
              </div>
            </div>

            <div ref={addBtnRef}>
              <button
                type="button"
                onClick={onAdd}
                disabled={!p.inStock}
                className={CtaClasses("signal") + " h-14 w-full"}
              >
                {added ? (
                  <>
                    <Check size={18} aria-hidden="true" />
                    <span>به سبد اضافه شد</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} aria-hidden="true" />
                    <span>{p.inStock ? "افزودن به سبد خرید" : "ناموجود"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Shell>

        {/* Info accordion — no reviews */}
        <Band label="PRODUCT INFO">
          <Shell className="max-w-[760px]">
            <Accordion type="single" collapsible defaultValue="details" className="text-bone">
              <AccordionItem value="details" className="border-hairline">
                <AccordionTrigger className="text-sm font-bold text-bone hover:no-underline">
                  جزئیات
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-8 text-metal">{p.description}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="care" className="border-hairline">
                <AccordionTrigger className="text-sm font-bold text-bone hover:no-underline">
                  جنس و مراقبت
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4 text-sm leading-8 text-metal">
                    <table className="w-full max-w-[420px] text-sm">
                      <tbody>
                        <tr className="border-b border-hairline">
                          <th scope="row" className="py-2 text-start font-normal text-mute">جنس</th>
                          <td className="py-2">{p.material}</td>
                        </tr>
                        <tr className="border-b border-hairline">
                          <th scope="row" className="py-2 text-start font-normal text-mute">سایزبندی</th>
                          <td className="num py-2">{p.sizes.join(" · ")}</td>
                        </tr>
                        <tr>
                          <th scope="row" className="py-2 text-start font-normal text-mute">کد محصول</th>
                          <td className="num py-2">{p.sku}</td>
                        </tr>
                      </tbody>
                    </table>
                    <ul className="flex flex-col gap-1.5">
                      {p.care.map((c) => (
                        <li key={c} className="flex gap-2">
                          <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-signal" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="fit" className="border-hairline">
                <AccordionTrigger className="text-sm font-bold text-bone hover:no-underline">
                  راهنمای فیت
                </AccordionTrigger>
                <AccordionContent>
                  <FitGuide product={p} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping" className="border-hairline">
                <AccordionTrigger className="text-sm font-bold text-bone hover:no-underline">
                  ارسال و بازگشت
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-2 text-sm leading-8 text-metal">
                    <li>ارسال به سراسر ایران، معمولاً ۲ تا ۵ روز کاری.</li>
                    <li>امکان مرجوعی و تعویض تا ۷ روز پس از دریافت، در صورت سالم بودن کالا.</li>
                    <li>جزئیات کامل در صفحهٔ ارسال و مرجوعی.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Shell>
        </Band>

        {/* Related */}
        {related.length > 0 && (
          <Band label="YOU MAY ALSO LIKE">
            <Shell>
              <SectionHead label="شاید بپسندید" title="پیشنهاد برای شما" className="mb-8" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {related.map((r) => (
                  <ProductCard key={r.id} p={r} />
                ))}
              </div>
            </Shell>
          </Band>
        )}

        <RecentlyViewed excludeSlug={p.slug} />
      </main>
      <StickyBuyBar visible={stickyVisible} name={p.name} price={p.price} inStock={p.inStock} onAdd={onAdd} />
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
