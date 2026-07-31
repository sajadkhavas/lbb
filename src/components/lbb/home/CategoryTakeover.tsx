import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { productsByCategory } from "@/lib/products";
import { categoryImage } from "@/lib/category-images";

const fa = (n: number) => n.toLocaleString("fa-IR");

export function CategoryTakeover() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const cats = CATEGORY_SLUGS.map((s) => ({
    ...CATEGORIES[s],
    count: productsByCategory(s).length,
  }));
  const current = cats[active];

  return (
    <section
      ref={rootRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-[#0A0A0A] py-14 md:py-24"
      aria-labelledby="cats-title"
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-10">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <span
              className="text-[10px] uppercase text-[var(--lbb-red)] md:text-[11px]"
              style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.3em" }}
            >
              CATEGORIES
            </span>
            <h2
              id="cats-title"
              className="mt-2 text-[30px] font-bold leading-none text-white md:text-[54px]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
            >
              دسته‌بندی‌ها
            </h2>
            <p className="mt-3 max-w-md text-[13px] leading-6 text-white/50 md:text-[15px]">
              {current.heroTagline} — از هودی و شلوار تا کتونی و اکسسوری، هر چیزی که یک ست
              استریت‌ویر کامل لازم دارد.
            </p>
          </div>
          <Link
            to="/shop"
            className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-[11px] font-bold text-white transition hover:border-[var(--lbb-red)] hover:text-[var(--lbb-red)] md:px-5 md:text-[12px]"
          >
            همه محصولات ←
          </Link>
        </header>

        {/* editorial image grid */}
        <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-3 md:gap-4">
          {cats.map((c, i) => (
            <li
              key={c.slug}
              className="cat-item"
            >
              <Link
                to="/$category"
                params={{ category: c.slug }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative block h-full overflow-hidden rounded-2xl bg-[#141414]"
              >
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden"
                >
                  <img
                    src={categoryImage(c.slug)}
                    alt={`دسته‌بندی ${c.nameFa} LBB`}
                    width={900}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.05) 100%)",
                    }}
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-black/50 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur">
                    {fa(c.count)} محصول
                  </span>
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className="truncate text-[20px] font-bold text-white md:text-[30px]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {c.nameFa}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-white/55 md:text-[12px]">
                        {c.heroTagline}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-black transition-all duration-300 group-hover:bg-[var(--lbb-red)] group-hover:text-white"
                    >
                      ←
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
