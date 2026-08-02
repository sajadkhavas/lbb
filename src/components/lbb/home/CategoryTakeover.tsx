import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { productsByCategory, fmtNum } from "@/lib/products";
import { categoryImage } from "@/lib/category-images";
import { Band, SectionHead, Frame, TechLabel } from "@/components/lbb/ui/primitives";

export function CategoryTakeover() {
  const [active, setActive] = useState(0);

  const cats = CATEGORY_SLUGS.map((s) => ({
    ...CATEGORIES[s],
    count: productsByCategory(s).length,
  }));
  const current = cats[active];

  return (
    <Band label="دسته‌بندی‌ها" className="bg-obsidian px-5 md:px-10">
      <SectionHead
        index="02"
        label="CATEGORIES"
        title="دسته‌بندی‌ها"
        lede={`${current.heroTagline} — از هودی و شلوار تا کتونی و اکسسوری، هر چیزی که یک ست استریت‌ویر کامل لازم دارد.`}
        action={
          <Link to="/shop" className="tech text-bone transition-colors hover:text-signal">
            همه محصولات ←
          </Link>
        }
      />

      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {cats.map((c, i) => (
          <li key={c.slug}>
            <Link
              to="/$category"
              params={{ category: c.slug }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group relative block h-full overflow-hidden"
            >
              <Frame
                src={categoryImage(c.slug)}
                alt={`دسته‌بندی ${c.nameFa} LBB`}
                ratio="4/5"
                width={900}
                height={1200}
              >
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.25) 45%, rgba(5,5,5,0.05) 100%)",
                  }}
                />
                <TechLabel
                  tone="bone"
                  className="absolute inset-inline-end-4 top-4 bg-obsidian/70 px-2.5 py-1 backdrop-blur"
                >
                  {fmtNum(c.count)} محصول
                </TechLabel>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-display-3 text-bone">{c.nameFa}</p>
                    <p className="mt-0.5 truncate text-xs text-metal">{c.heroTagline}</p>
                  </div>
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center bg-bone text-obsidian transition-colors duration-300 group-hover:bg-signal group-hover:text-bone"
                  >
                    ←
                  </span>
                </div>
              </Frame>
            </Link>
          </li>
        ))}
      </ul>
    </Band>
  );
}
