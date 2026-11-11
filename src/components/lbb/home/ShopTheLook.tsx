import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Plus } from "lucide-react";
import { Frame, Shell } from "@/components/lbb/ui/primitives";

export const shopTheLookSpots = [
  { slug: "dupu-boxy-distressed-tshirt-charcoal", x: 53, y: 32 },
  { slug: "shloar-gyn-prynty-acne-studios", x: 51, y: 68 },
];

export type LookProduct = {
  slug: string;
  name: string;
  image: string | null;
  priceToman: number | null;
};

export function ShopTheLook({ products }: { products: LookProduct[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const activeSlug = products.some(({ slug }) => slug === selectedSlug)
    ? selectedSlug
    : products[0]?.slug;

  if (!products.length) return null;

  return (
    <section dir="rtl" aria-labelledby="shop-look-title" className="border-t border-hairline py-14">
      <Shell>
        <h2 id="shop-look-title" className="text-2xl font-black md:text-4xl">
          خرید از روی استایل
        </h2>
        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Frame
            src="/brand/lbb-shop-the-look.webp"
            alt="استایل LBB با تیشرت باکسی ذغالی و شلوار جین پرینتی"
            ratio="1122/1402"
            width={1122}
            height={1402}
            sizes="(min-width: 1024px) 55vw, 100vw"
            zoom={false}
          >
            {shopTheLookSpots.map(({ slug, x, y }) => {
              const product = products.find((item) => item.slug === slug);
              if (!product) return null;
              const selected = activeSlug === slug;

              return (
                <button
                  key={slug}
                  type="button"
                  aria-label={product.name}
                  aria-pressed={selected}
                  onMouseEnter={() => setSelectedSlug(slug)}
                  onFocus={() => setSelectedSlug(slug)}
                  onClick={() => setSelectedSlug(slug)}
                  className={`absolute z-10 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-bone shadow-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                    selected ? "bg-signal text-obsidian" : "bg-obsidian text-bone"
                  }`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <Plus size={19} aria-hidden="true" />
                </button>
              );
            })}
          </Frame>

          <ul className="space-y-3">
            {products.map(({ slug, name, image, priceToman }) => (
              <li key={slug}>
                <Link
                  to="/product/$slug"
                  params={{ slug }}
                  onMouseEnter={() => setSelectedSlug(slug)}
                  onFocus={() => setSelectedSlug(slug)}
                  data-selected={activeSlug === slug}
                  className="grid min-h-24 grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 border border-hairline bg-carbon p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal data-[selected=true]:border-signal"
                >
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      width={64}
                      height={80}
                      loading="lazy"
                      className="h-20 w-16 object-cover"
                    />
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  <span className="min-w-0">
                    <span className="block font-bold">{name}</span>
                    {priceToman !== null && (
                      <span className="mt-1 block text-sm text-metal">
                        {priceToman.toLocaleString("fa-IR")} تومان
                      </span>
                    )}
                  </span>
                  <ArrowUpLeft size={18} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    </section>
  );
}
