import { Link } from "@tanstack/react-router";
import type { PointerEvent } from "react";
import { ArrowUpLeft } from "lucide-react";
import { CategoryIcon } from "@/components/lbb/BrandIcon";
import { Frame, SectionHead, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { homeCategoryImage } from "@/lib/home-category-images";
import { CATEGORIES } from "@/lib/categories";
import { HOME_CATEGORY_ORDER } from "@/lib/homepage";
import { fmtNum, productsByCategory } from "@/lib/products";

export function CategoryGateway() {
  const activeCategories = HOME_CATEGORY_ORDER.filter((slug) => slug !== "hoodies");
  const tilt = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch") return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
  };

  const resetTilt = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <section
      id="home-categories"
      dir="rtl"
      aria-labelledby="home-categories-title"
      className="border-t border-hairline bg-obsidian py-12 md:py-16"
    >
      <Shell>
        <SectionHead
          index="01"
          label="دسته‌بندی محصولات"
          title={<span id="home-categories-title">دنبال چی می‌گردی؟</span>}
          lede="مستقیم وارد دسته دلخواهت شو و مدل‌ها، رنگ‌ها و سایزهای موجود را با هم مقایسه کن."
          action={
            <Link to="/shop" className="tech inline-flex min-h-11 items-center gap-2 text-signal">
              همه محصولات
              <ArrowUpLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-8 grid gap-3 md:grid-cols-6 lg:gap-4">
          {activeCategories.map((slug, index) => {
            const category = CATEGORIES[slug];
            const count = productsByCategory(slug).length;
            const placement = "md:col-span-3";
            const ratio = "4/3";

            return (
              <Link
                key={slug}
                to="/$category"
                params={{ category: slug }}
                aria-label={`مشاهده ${category.nameFaPlural} — ${fmtNum(count)} محصول`}
                onPointerMove={tilt}
                onPointerLeave={resetTilt}
                className={`category-tilt group relative min-w-0 overflow-hidden rounded-[24px] border border-hairline bg-white shadow-raised hover:border-signal/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${placement}`}
              >
                <Frame
                  src={homeCategoryImage(slug)}
                  alt={`نمای دسته ${category.nameFaPlural} LBB`}
                  ratio={ratio}
                  width={900}
                  height={1125}
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="h-full min-h-[270px] w-full rounded-[24px] bg-white"
                  imgClassName="object-contain p-5 opacity-100 drop-shadow-[0_18px_18px_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:scale-[1.045] sm:p-8"
                  zoom={false}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/5 to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 grid size-14 place-items-center rounded-2xl border border-black/10 bg-white/90 text-obsidian shadow-raised backdrop-blur-md transition-[color,border-color,transform] duration-300 group-hover:-translate-y-1 group-hover:border-signal group-hover:text-signal md:right-5 md:top-5 md:size-16"
                  >
                    <CategoryIcon category={slug} className="size-9 md:size-10" />
                  </span>
                  <div className="category-tilt__content absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <TechLabel tone="signal">0{index + 1}</TechLabel>
                          <TechLabel tone="bone">ال‌بی‌بی / مهستان</TechLabel>
                        </div>
                        <h3 className="mt-2 text-display-3 font-black text-bone">
                          {category.nameFaPlural}
                        </h3>
                        <p className="mt-2 line-clamp-2 max-w-[42ch] text-xs leading-6 text-metal">
                          {category.heroTagline}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-xl border border-hairline-strong bg-obsidian/90 px-3 py-2 text-left backdrop-blur">
                        <span className="num block text-sm font-black text-bone">
                          {fmtNum(count)}
                        </span>
                        <span className="tech mt-1 block text-mute">محصول</span>
                      </span>
                    </div>
                  </div>
                </Frame>
              </Link>
            );
          })}
        </div>
      </Shell>
    </section>
  );
}
