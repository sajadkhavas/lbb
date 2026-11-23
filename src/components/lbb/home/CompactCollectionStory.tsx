import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Plus } from "lucide-react";
import type { CollectionDto } from "@/lib/backend-api";
import type { BackendCatalogCard } from "@/lib/backend-storefront";
import { Shell, TechLabel } from "@/components/lbb/ui/primitives";

// Coordinates belong to the supplied Diamond/Nature photograph, not arbitrary collections.
const points: Record<string, { x: number; y: number }> = {
  "black-distressed-cropped-hoodie": { x: 51, y: 43 },
  "shloar-gyn-prynty-acne-studios": { x: 52, y: 72 },
};
export function CompactCollectionStory({
  collection,
  products,
  heroImage,
  eyebrow,
  cta,
}: {
  collection: CollectionDto;
  products: BackendCatalogCard[];
  heroImage: string | null;
  eyebrow: string;
  cta: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const diamond =
    products.some((product) => product.slug === "black-distressed-cropped-hoodie") &&
    products.some((product) => product.slug === "shloar-gyn-prynty-acne-studios");
  return (
    <section
      dir="rtl"
      aria-labelledby="drop-story-title"
      className="border-t border-hairline bg-carbon py-7 md:py-9"
      data-final-storefront="featured-story"
      data-compact-collection
    >
      <Shell>
        <div className="grid overflow-hidden rounded-2xl border border-hairline bg-obsidian md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="relative min-h-[min(48vw,540px)] min-w-0 overflow-hidden bg-[#121212] [container-type:size] max-md:aspect-[3/4]">
            {heroImage && (
              <div className="absolute left-1/2 top-1/2 aspect-[3/4] w-[max(100cqw,75cqh)] -translate-x-1/2 -translate-y-1/2">
                <img
                  src={heroImage}
                  alt={collection.name}
                  width={900}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 block w-full object-cover"
                  style={{ height: "100%" }}
                />
                {diamond &&
                  products
                    .filter((product) => points[product.slug])
                    .map((product) => {
                      const point = points[product.slug];
                      return (
                        <Link
                          key={product.slug}
                          to="/product/$slug"
                          params={{ slug: product.slug }}
                          aria-label={`مشاهده ${product.name}`}
                          onMouseEnter={() => setActive(product.slug)}
                          onMouseLeave={() => setActive(null)}
                          onFocus={() => setActive(product.slug)}
                          onBlur={() => setActive(null)}
                          className="absolute z-10 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                          style={{ left: `${point.x}%`, top: `${point.y}%` }}
                        >
                          <span
                            aria-hidden="true"
                            className="absolute h-6 w-6 animate-ping rounded-full bg-white/45 motion-reduce:animate-none"
                          />
                          <span
                            className={`relative grid h-7 w-7 place-items-center rounded-full border border-white shadow-lg ${active === product.slug ? "bg-signal text-black" : "bg-black/65 text-white"}`}
                          >
                            <Plus size={14} />
                          </span>
                        </Link>
                      );
                    })}
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col justify-center p-4 md:p-6 lg:p-8">
            <TechLabel tone="signal">{eyebrow}</TechLabel>
            <h2
              id="drop-story-title"
              className="mt-2 text-xl font-black leading-relaxed text-bone lg:text-3xl"
            >
              {collection.name}
            </h2>
            <p className="mt-2 text-xs leading-6 text-metal">
              {diamond
                ? "هودی کراپ مشکی و جین بگ پرینتی؛ جزئیات هر تکه را از روی عکس ببین و استایل خودت را بساز."
                : "محصولات این کالکشن را ببین و هر تکه را با سایز دلخواهت انتخاب کن."}
            </p>
            <ul className="mt-4 space-y-2">
              {products.slice(0, 3).map((product) => (
                <li key={product.slug}>
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    onMouseEnter={() => setActive(product.slug)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(product.slug)}
                    onBlur={() => setActive(null)}
                    data-selected={active === product.slug}
                    className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-hairline bg-carbon p-2 transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal data-[selected=true]:border-signal data-[selected=true]:bg-signal/10"
                  >
                    {product.primaryImage ? (
                      <img
                        src={product.primaryImage}
                        alt=""
                        width={48}
                        height={60}
                        loading="lazy"
                        decoding="async"
                        className="w-12 rounded-md object-cover"
                        style={{ height: 60 }}
                      />
                    ) : (
                      <span />
                    )}
                    <span className="min-w-0">
                      <span className="block text-xs font-bold leading-6 text-bone">
                        {product.name}
                      </span>
                      <span className="text-[10px] text-metal">مشاهده جزئیات و انتخاب سایز</span>
                    </span>
                    <ArrowUpLeft size={16} className="text-signal" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/collections/$slug"
              params={{ slug: collection.slug }}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-signal px-4 text-xs font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {cta}
              <ArrowUpLeft size={16} />
            </Link>
          </div>
        </div>
      </Shell>
    </section>
  );
}
