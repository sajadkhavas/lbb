import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Gallery } from "@/components/lbb/product/Gallery";
import { StickyBuyBar } from "@/components/lbb/product/StickyBuyBar";
import { FitGuide } from "@/components/lbb/product/FitGuide";
import { RecentlyViewed } from "@/components/lbb/product/RecentlyViewed";
import { SizeGuideDialog } from "@/components/lbb/product/SizeGuideDialog";
import { colorName } from "@/lib/color-names";
import type { Product } from "@/lib/products";
import {
  bestSellers,
  discountPercent,
  fmtToman,
  isSizeAvailable,
  productBySlug,
  productsByCategory,
} from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { productGallery } from "@/lib/product-images";
import { recordRecentlyViewed } from "@/lib/recently-viewed";
import { absAsset, absUrl, breadcrumbLd as buildBreadcrumbLd } from "@/lib/site";
import {
  Band,
  CtaClasses,
  SectionHead,
  Shell,
  StatusTag,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MAX_QTY = 10;

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = productBySlug(params.slug);
    if (!product) throw notFound();
    let related = productsByCategory(product.category).filter((item) => item.slug !== product.slug);
    if (related.length === 0) related = bestSellers(4).filter((item) => item.slug !== product.slug);
    return { product, related: related.slice(0, 4) };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex" }] };
    const product = loaderData.product;
    const category = CATEGORIES[product.category];
    const title = `${product.name} | خرید از LBB — ${category.nameFa}`.slice(0, 59);
    const description = `${product.shortDescription} قیمت: ${fmtToman(product.price)}.`.slice(
      0,
      159,
    );
    const path = `/product/${product.slug}`;
    const gallery = productGallery(product.slug).map(absAsset);

    const productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      sku: product.sku,
      brand: { "@type": "Brand", name: "LBB" },
      description: product.description,
      image: gallery,
      color: product.colors.map(colorName).join("، "),
      size: product.sizes.join("، "),
      offers: {
        "@type": "Offer",
        url: absUrl(path),
        priceCurrency: "IRR",
        price: product.price * 10,
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: "LBB" },
      },
    };
    const crumbs = buildBreadcrumbLd([
      { name: "خانه", path: "/" },
      { name: "فروشگاه", path: "/shop" },
      { name: category.nameFa, path: `/${category.slug}` },
      { name: product.name, path },
    ]);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: absUrl(path) },
        { property: "og:image", content: gallery[0] },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: gallery[0] },
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
  const cat = CATEGORIES[p.category];
  const [color, setColor] = useState(p.colors[0] ?? "");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const { add, openDrawer } = useCart();
  const { has, toggle } = useWishlist();
  const addBtnRef = useRef<HTMLDivElement>(null);
  const sizeGroupRef = useRef<HTMLDivElement>(null);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const discount = discountPercent(p);
  const liked = has(p.slug);

  useEffect(() => {
    recordRecentlyViewed(p.slug);
  }, [p.slug]);

  useEffect(() => {
    setColor(p.colors[0] ?? "");
    setSize("");
    setQty(1);
    setSizeError(false);
    setAdded(false);
  }, [p.slug, p.colors]);

  useEffect(() => {
    const element = addBtnRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { rootMargin: "0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [p.slug]);

  useEffect(
    () => () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    },
    [],
  );

  const focusSizePicker = () => {
    sizeGroupRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    requestAnimationFrame(() =>
      sizeGroupRef.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus(),
    );
  };

  const onAdd = () => {
    if (!p.inStock) return;
    if (!size || !isSizeAvailable(p, size)) {
      setSizeError(true);
      toast.error("لطفاً یک سایز موجود را انتخاب کنید");
      focusSizePicker();
      return;
    }
    add({ slug: p.slug, name: p.name, price: p.price, color, size, qty });
    toast.success("به سبد خرید اضافه شد", { description: `${p.name} — سایز ${size}` });
    openDrawer();
    setAdded(true);
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-bottombar pt-16 md:pb-0">
        <Shell className="py-4">
          <Breadcrumb
            items={[
              { label: "خانه", to: "/" },
              { label: "فروشگاه", to: "/shop" },
              { label: cat.nameFa, to: "/$category", params: { category: cat.slug } },
              { label: p.name },
            ]}
          />
        </Shell>

        <Shell
          as="section"
          className="grid grid-cols-1 gap-8 pb-12 md:grid-cols-[minmax(0,62%)_minmax(0,38%)] md:gap-10"
        >
          <Gallery slug={p.slug} name={p.name} />

          <div className="flex min-w-0 flex-col gap-5 md:sticky md:top-20 md:self-start">
            <div>
              <TechLabel tone="signal">
                {cat.nameFa} / {p.latinName}
              </TechLabel>
              <h1 className="mt-2 text-display-2 text-bone">{p.name}</h1>
              <p className="mt-2 text-sm leading-7 text-metal">{p.shortDescription}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {p.isNew ? <StatusTag tone="signal">جدید</StatusTag> : null}
              {!p.inStock ? <StatusTag tone="out">ناموجود</StatusTag> : null}
              {discount > 0 ? <StatusTag tone="bone">{discount}٪ تخفیف</StatusTag> : null}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="num text-2xl font-bold text-bone">{fmtToman(p.price)}</span>
                {p.originalPrice ? (
                  <span className="num text-sm text-mute line-through">
                    {fmtToman(p.originalPrice)}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => {
                  toggle(p.slug);
                  toast(liked ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد", {
                    description: p.name,
                  });
                }}
                aria-label={
                  liked ? `حذف ${p.name} از علاقه‌مندی‌ها` : `افزودن ${p.name} به علاقه‌مندی‌ها`
                }
                aria-pressed={liked}
                className="tap-target grid shrink-0 place-items-center border border-hairline text-bone transition hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                <Heart
                  size={18}
                  aria-hidden="true"
                  className={liked ? "fill-signal text-signal" : ""}
                />
              </button>
            </div>

            <span aria-hidden="true" className="h-px w-full bg-hairline" />

            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-bone">
                رنگ: <span className="font-normal text-metal">{colorName(color)}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {p.colors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-label={`انتخاب رنگ ${colorName(item)}`}
                    aria-pressed={color === item}
                    onClick={() => setColor(item)}
                    className="tap-target grid place-items-center rounded-full border-2 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    style={{
                      background: item,
                      borderColor: color === item ? "var(--lbb-signal)" : "var(--lbb-hairline)",
                    }}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <div className="mb-2 flex items-center justify-between gap-3">
                <legend className="text-xs font-semibold text-bone">سایز</legend>
                <SizeGuideDialog
                  trigger={
                    <button
                      type="button"
                      className="min-h-11 tech text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    >
                      راهنمای سایز
                    </button>
                  }
                />
              </div>
              <div
                ref={sizeGroupRef}
                className="flex flex-wrap gap-2"
                aria-describedby={sizeError ? "pdp-size-error" : undefined}
              >
                {p.sizes.map((item) => {
                  const available = isSizeAvailable(p, item);
                  return (
                    <button
                      key={item}
                      type="button"
                      disabled={!available}
                      aria-pressed={size === item}
                      aria-label={available ? `انتخاب سایز ${item}` : `سایز ${item} ناموجود`}
                      onClick={() => {
                        setSize(item);
                        setSizeError(false);
                      }}
                      className={`tap-target min-w-[44px] border px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                        !available
                          ? "cursor-not-allowed border-hairline text-mute line-through opacity-40"
                          : size === item
                            ? "border-signal bg-signal text-bone"
                            : "border-hairline text-bone hover:border-metal"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              {sizeError ? (
                <p
                  id="pdp-size-error"
                  role="alert"
                  className="mt-2 text-xs font-semibold text-signal"
                >
                  لطفاً پیش از افزودن به سبد، یک سایز موجود را انتخاب کنید.
                </p>
              ) : null}
              {!p.inStock ? (
                <p className="mt-2 text-xs leading-6 text-metal">
                  این محصول فعلاً ناموجود است؛ برای مشاهدهٔ گزینه‌های مشابه به بخش پیشنهادها بروید.
                </p>
              ) : null}
            </fieldset>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-bone">تعداد:</span>
              <div className="flex items-center border border-hairline">
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  disabled={qty <= 1}
                  aria-label="کاهش تعداد"
                  className="tap-target text-lg text-bone disabled:opacity-35"
                >
                  −
                </button>
                <output className="num w-10 text-center text-sm text-bone" aria-live="polite">
                  {qty}
                </output>
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.min(MAX_QTY, value + 1))}
                  disabled={qty >= MAX_QTY}
                  aria-label="افزایش تعداد"
                  className="tap-target text-lg text-bone disabled:opacity-35"
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
                className={`${CtaClasses("signal")} h-14 w-full`}
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

        <Band label="PRODUCT INFO">
          <Shell className="max-w-[760px]">
            <Accordion type="single" collapsible defaultValue="details" className="text-bone">
              <AccordionItem value="details" className="border-hairline">
                <AccordionTrigger className="text-sm font-bold text-bone hover:no-underline">
                  جزئیات
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-8 text-metal">
                  {p.description}
                </AccordionContent>
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
                          <th scope="row" className="py-2 text-start font-normal text-mute">
                            جنس
                          </th>
                          <td className="py-2">{p.material}</td>
                        </tr>
                        <tr className="border-b border-hairline">
                          <th scope="row" className="py-2 text-start font-normal text-mute">
                            سایزبندی
                          </th>
                          <td className="num py-2">{p.sizes.join(" · ")}</td>
                        </tr>
                        <tr>
                          <th scope="row" className="py-2 text-start font-normal text-mute">
                            کد محصول
                          </th>
                          <td className="num py-2">{p.sku}</td>
                        </tr>
                      </tbody>
                    </table>
                    <ul className="flex flex-col gap-1.5">
                      {p.care.map((care) => (
                        <li key={care} className="flex gap-2">
                          <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-signal" />
                          {care}
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

        {related.length > 0 ? (
          <Band label="YOU MAY ALSO LIKE">
            <Shell>
              <SectionHead label="شاید بپسندید" title="پیشنهاد برای شما" className="mb-8" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {related.map((product: Product) => (
                  <ProductCard key={product.id} p={product} />
                ))}
              </div>
            </Shell>
          </Band>
        ) : null}

        <RecentlyViewed excludeSlug={p.slug} />
      </main>
      <StickyBuyBar
        visible={stickyVisible}
        name={p.name}
        price={p.price}
        inStock={p.inStock}
        selectedSize={size}
        onAdd={onAdd}
      />
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
