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
          label="انتخاب‌های LBB"
          title={<span id="home-products-title">تازه‌ها و انتخاب‌های این هفته</span>}
          lede="چند انتخاب آماده برای شروع؛ قیمت، رنگ و سایز موجود همین‌جا مشخص است."
          action={
            <Link to="/shop" className="tech inline-flex min-h-11 items-center gap-2 text-signal">
              کاتالوگ کامل
              <ArrowUpLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {curated.map((product, index) => (
            <div key={product.slug} className="min-w-0">
              <ProductCard p={product} priority={index === 0} />
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {DECISION_POINTS.map(({ icon: Icon, title, body }, index) => (
            <article
              key={title}
              className="rounded-2xl border border-hairline bg-carbon p-5 transition-colors hover:border-hairline-strong md:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-hairline bg-carbon-2 text-signal">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <TechLabel tone="signal">0{index + 1} / راهنمای خرید</TechLabel>
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
