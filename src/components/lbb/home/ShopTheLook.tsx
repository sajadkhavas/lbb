import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Plus, X } from "lucide-react";
import { lifestyle1, productImage } from "@/lib/product-images";
import { fmtToman, productBySlug } from "@/lib/products";
import { Frame, SectionHead, Shell, TechLabel } from "@/components/lbb/ui/primitives";

type Hotspot = { slug: string; x: number; y: number };

const HOTSPOTS: Hotspot[] = [
  { slug: "lbb-classic-hoodie", x: 32, y: 30 },
  { slug: "cargo-street-pants", x: 55, y: 68 },
  { slug: "urban-runner-sneaker", x: 68, y: 88 },
];

export function ShopTheLook() {
  const [active, setActive] = useState(HOTSPOTS[0].slug);
  const products = HOTSPOTS.map((hotspot) => productBySlug(hotspot.slug)).filter(
    (product): product is NonNullable<typeof product> => Boolean(product),
  );

  return (
    <section
      dir="rtl"
      aria-labelledby="shop-look-title"
      className="border-t border-hairline bg-obsidian py-14 md:py-20"
    >
      <Shell>
        <SectionHead
          index="04"
          label="SHOP THE LOOK"
          title={<span id="shop-look-title">ست را ببین، قطعه را جدا انتخاب کن</span>}
          lede="Hotspotها فقط راه میانبرند؛ نام، قیمت و مقصد هر قطعه همیشه کنار تصویر قابل مشاهده است."
          action={
            <Link
              to="/shop"
              className="tech inline-flex min-h-11 items-center gap-2 text-signal"
            >
              مشاهده فروشگاه
              <ArrowUpLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-9 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <div className="relative min-w-0">
            <Frame
              src={lifestyle1}
              alt="ست استریت‌ویر LBB شامل هودی کلاسیک، شلوار کارگو و کتونی اربن رانر"
              ratio="4/5"
              zoom={false}
              width={1200}
              height={1500}
              sizes="(max-width: 1023px) 100vw, 58vw"
              className="border border-hairline"
            >
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/35 to-transparent" />
              {HOTSPOTS.map((hotspot, index) => {
                const product = productBySlug(hotspot.slug);
                if (!product) return null;
                const selected = active === hotspot.slug;
                return (
                  <button
                    key={hotspot.slug}
                    type="button"
                    aria-label={`انتخاب ${product.name}`}
                    aria-pressed={selected}
                    onClick={() => setActive(hotspot.slug)}
                    className={`absolute z-10 grid h-11 w-11 place-items-center rounded-full border-4 shadow-overlay transition-[transform,background-color,color,border-color] hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                      selected
                        ? "border-signal/30 bg-signal text-obsidian"
                        : "border-bone/30 bg-bone text-obsidian"
                    }`}
                    style={{
                      insetInlineStart: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {selected ? <X size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
                    <span className="sr-only">نقطه {index + 1}</span>
                  </button>
                );
              })}
            </Frame>
          </div>

          <aside className="flex flex-col border border-hairline bg-carbon p-4 md:p-6">
            <TechLabel tone="signal">VISIBLE PRODUCT INDEX</TechLabel>
            <p className="mt-3 text-sm leading-7 text-metal">
              هر قطعه مستقل فروخته می‌شود. برای سایز، رنگ و موجودی وارد صفحه همان محصول شو.
            </p>

            <ol className="mt-6 space-y-2">
              {products.map((product, index) => {
                const selected = active === product.slug;
                return (
                  <li key={product.slug}>
                    <Link
                      to="/product/$slug"
                      params={{ slug: product.slug }}
                      onMouseEnter={() => setActive(product.slug)}
                      onFocus={() => setActive(product.slug)}
                      aria-current={selected ? "true" : undefined}
                      className={`group grid min-h-[92px] grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 border p-2 transition-colors ${
                        selected ? "border-signal bg-obsidian" : "border-hairline bg-carbon hover:border-hairline-strong"
                      }`}
                    >
                      <img
                        src={productImage(product.slug)}
                        alt=""
                        width={64}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="h-20 w-16 object-cover"
                      />
                      <span className="min-w-0">
                        <TechLabel tone={selected ? "signal" : "metal"}>0{index + 1} / {product.sku}</TechLabel>
                        <span className="mt-1 block truncate text-sm font-black text-bone">
                          {product.name}
                        </span>
                        <span className="num mt-1 block text-xs text-metal">
                          {fmtToman(product.price)}
                        </span>
                      </span>
                      <ArrowUpLeft
                        size={16}
                        aria-hidden="true"
                        className={selected ? "text-signal" : "text-mute group-hover:text-signal"}
                      />
                    </Link>
                  </li>
                );
              })}
            </ol>

            <p className="mt-auto border-t border-hairline pt-5 text-xs leading-6 text-mute">
              تصویر برای نمایش ترکیب است؛ تناسب رنگ و فیت نهایی به Variant انتخاب‌شده در صفحه محصول وابسته است.
            </p>
          </aside>
        </div>
      </Shell>
    </section>
  );
}
