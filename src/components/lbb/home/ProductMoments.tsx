import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Layers3, Ruler, Tags } from "lucide-react";
import { ProductCard } from "@/components/lbb/ProductCard";
import { SectionHead, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { products } from "@/lib/products";

const DECISION_POINTS = [
  {
    icon: Ruler,
    title: "فیت قبل از خرید",
    body: "اورسایز، باکسی، ریلکس یا اندازه واقعی روی هر محصول مشخص است.",
  },
  {
    icon: Layers3,
    title: "متریال قابل مقایسه",
    body: "گرماژ، ترکیب پارچه و نگهداری در صفحه هر قطعه ثبت شده است.",
  },
  {
    icon: Tags,
    title: "موجودی شفاف",
    body: "سایز ناموجود، تخفیف و وضعیت کلی محصول قبل از افزودن دیده می‌شود.",
  },
];

export function ProductMoments() {
  const curated = [...products].sort((a, b) => a.rank - b.rank).slice(0, 4);

  return (
    <section
      dir="rtl"
      aria-labelledby="home-products-title"
      className="border-t border-hairline bg-obsidian py-14 md:py-20"
    >
      <Shell>
        <SectionHead
          index="02"
          label="PRODUCT MOMENTS"
          title={<span id="home-products-title">چهار نقطه شروع برای دراپ ۰۰۱</span>}
          lede="منتخب‌ها بر اساس جایگاه Merchandising در کاتالوگ نمایش داده می‌شوند؛ نه فروش ساختگی یا شمارنده اجتماعی."
          action={
            <Link to="/shop" className="tech inline-flex min-h-11 items-center gap-2 text-signal">
              کاتالوگ کامل
              <ArrowUpLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
          {curated.map((product, index) => (
            <div
              key={product.slug}
              className={index === 0 ? "col-span-2 lg:col-span-2 lg:row-span-2" : "min-w-0"}
            >
              <ProductCard p={product} priority={index === 0} />
            </div>
          ))}
        </div>

        <div className="mt-12 grid border-y border-hairline md:grid-cols-3 md:divide-x md:divide-x-reverse md:divide-hairline">
          {DECISION_POINTS.map(({ icon: Icon, title, body }, index) => (
            <article
              key={title}
              className="border-b border-hairline p-5 last:border-b-0 md:border-b-0 md:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center border border-hairline text-signal">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <TechLabel tone="signal">0{index + 1} / PRODUCT TRUTH</TechLabel>
                  <h3 className="mt-2 text-sm font-black text-bone">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-metal">{body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Shell>
    </section>
  );
}
