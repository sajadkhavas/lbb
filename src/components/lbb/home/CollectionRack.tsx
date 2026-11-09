import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";
import type { BackendCatalogCard } from "@/lib/backend-storefront";

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
      <div className="relative mt-3 rounded-xl border border-hairline bg-carbon px-2 pb-3 pt-7 sm:px-4">
        <div
          aria-hidden="true"
          className="absolute inset-x-3 top-5 h-1 rounded-full bg-gradient-to-b from-white/60 to-white/15"
        />
        <ul className="relative flex justify-center gap-1 sm:gap-2">
          {products.map((product) => {
            const active = selected.slug === product.slug;
            const select = () => setSelectedSlug(product.slug);

            return (
              <li key={product.slug} className="w-full max-w-36 min-w-0">
                <button
                  type="button"
                  aria-label={product.name}
                  aria-pressed={active}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") select();
                  }}
                  onFocus={select}
                  onClick={select}
                  className="relative flex w-full flex-col items-center rounded-lg pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <span
                    aria-hidden="true"
                    className="-mt-2 h-5 w-3 rounded-t-full border-2 border-b-0 border-white/50"
                  />
                  <span
                    aria-hidden="true"
                    className="h-5 w-4/5 [clip-path:polygon(50%_0,100%_100%,0_100%)] bg-white/30"
                  />
                  <span
                    className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-md bg-obsidian transition-transform duration-500 ease-out motion-reduce:transition-none"
                    style={{
                      transform: active
                        ? "perspective(500px) rotateY(0deg)"
                        : "perspective(500px) rotateY(-55deg)",
                    }}
                  >
                    {product.primaryImage ? (
                      <img
                        src={product.primaryImage}
                        alt=""
                        width={144}
                        height={192}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain"
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
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-2 pt-3">
          <p className="text-sm font-bold text-bone">{selected.name}</p>
          <Link to="/product/$slug" params={{ slug: selected.slug }} className={CtaClasses("line")}>
            مشاهده محصول <ArrowUpLeft size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
