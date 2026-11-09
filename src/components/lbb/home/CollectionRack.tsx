import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";
import type { BackendCatalogCard } from "@/lib/backend-storefront";
import { fmtToman } from "@/lib/products";

export function CollectionRack({
  products,
  title = "رگال کالکشن",
}: {
  products: BackendCatalogCard[];
  title?: string;
}) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = products.find((product) => product.slug === selectedSlug) ?? products[0];

  if (!selected) return null;

  return (
    <div className="mt-8" data-testid="collection-rack">
      <TechLabel>{title}</TechLabel>
      <p className="mt-2 text-xs leading-6 text-metal">
        برای دیدن هر لباس، روی آن مکث کنید یا لمسش کنید.
      </p>
      <div className="relative isolate mt-3 overflow-hidden rounded-xl bg-[#eeebe5] px-3 pt-10 sm:px-6">
        <div
          aria-hidden="true"
          className="absolute inset-x-3 top-10 h-2 rounded-full bg-gradient-to-b from-[#77746f] via-[#403d39] to-[#25231f] shadow-md sm:inset-x-6"
        />
        <ul className="relative mx-auto flex max-w-3xl items-start justify-center pb-5">
          {products.map((product) => {
            const active = selected.slug === product.slug;
            const select = () => setSelectedSlug(product.slug);
            const trousers = /pants|jeans|trousers|shorts|shalvar|شلوار/i.test(
              `${product.categorySlug} ${product.categoryLabel} ${product.name}`,
            );

            return (
              <li key={product.slug} className="w-full max-w-56 min-w-0">
                <button
                  type="button"
                  aria-label={product.name}
                  aria-pressed={active}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") select();
                  }}
                  onFocus={select}
                  onClick={select}
                  className="relative block w-full rounded-lg px-1 pt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <span
                    className={`relative mx-auto block origin-top transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${active ? "scale-x-100 opacity-100" : "scale-x-[0.58] -rotate-3 opacity-75"}`}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 100 34"
                      className="mx-auto h-9 w-4/5 overflow-visible text-[#35312b]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M50 20v-7a5 5 0 1 0-5-5" />
                      {trousers ? (
                        <path d="M17 21h66M25 21v11m50-11v11" strokeWidth="4" />
                      ) : (
                        <path d="m50 19 34 13H16z" />
                      )}
                    </svg>
                    {product.primaryImage ? (
                      <img
                        src={product.primaryImage}
                        alt=""
                        width={144}
                        height={192}
                        loading="lazy"
                        decoding="async"
                        className={`mx-auto -mt-1 block w-full object-contain object-top mix-blend-multiply ${trousers ? "aspect-[2/3]" : "aspect-[4/5]"}`}
                      />
                    ) : (
                      <span className="text-xs text-metal">LBB</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="-mx-3 flex flex-wrap items-center justify-between gap-3 bg-carbon px-4 py-3 sm:-mx-6 sm:px-6">
          <div>
            <p className="text-sm font-bold text-bone">{selected.name}</p>
            {selected.priceFromToman != null && (
              <p className="mt-1 text-xs text-metal">{fmtToman(selected.priceFromToman)}</p>
            )}
          </div>
          <Link to="/product/$slug" params={{ slug: selected.slug }} className={CtaClasses("line")}>
            مشاهده محصول <ArrowUpLeft size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
