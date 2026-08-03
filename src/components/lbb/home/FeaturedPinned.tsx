import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/lib/products";
import { BigProductCard } from "./BigProductCard";
import { Shell, TechLabel } from "@/components/lbb/ui/primitives";

const featured = products
  .filter((p) => p.isNew)
  .concat(products.filter((p) => !p.isNew))
  .slice(0, 6);

/**
 * آخرین ورودی‌ها — a native RTL scroll-snap rail.
 * Deliberately no scroll pinning: pinning fought the page scroll on both
 * touch and trackpads, so the rail scrolls on its own axis instead.
 */
export function FeaturedPinned() {
  const railRef = useRef<HTMLDivElement>(null);

  const nudge = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const step = Math.max(240, rail.clientWidth * 0.6);
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section dir="rtl" className="bg-obsidian py-14 md:py-20" aria-labelledby="new-arrivals-title">
      <Shell>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <TechLabel tone="signal">03 / NEW ARRIVALS</TechLabel>
            <h2 id="new-arrivals-title" className="mt-4 text-display-1 text-bone">
              آخرین ورودی‌ها
            </h2>
            <p className="text-lede mt-3 max-w-prose">
              تازه‌ترین قطعه‌های دراپ ۰۰۱ — از هودی و شلوار تا کتونی و جوراب.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="tech rounded-xl border border-hairline px-4 py-3 text-bone transition-colors hover:border-signal hover:text-signal"
            >
              مشاهده همه
            </Link>
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => nudge(1)}
                aria-label="قبلی"
                className="tap-target grid place-items-center rounded-xl border border-hairline text-bone transition-colors hover:border-signal hover:text-signal"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => nudge(-1)}
                aria-label="بعدی"
                className="tap-target grid place-items-center rounded-xl border border-hairline text-bone transition-colors hover:border-signal hover:text-signal"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </Shell>

      <div
        ref={railRef}
        dir="rtl"
        tabIndex={0}
        aria-label="فهرست آخرین ورودی‌ها"
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-[var(--lbb-gutter)] pb-4 md:gap-6"
        style={{ scrollbarWidth: "none" }}
      >
        {featured.map((p) => (
          <div
            key={p.id}
            className="w-[74vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[22vw]"
          >
            <BigProductCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
