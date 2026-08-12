import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { CategoryIcon } from "@/components/lbb/BrandIcon";
import { Frame, SectionHead, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { categoryImage } from "@/lib/category-images";
import { CATEGORIES } from "@/lib/categories";
import { HOME_CATEGORY_ORDER } from "@/lib/homepage";
import { fmtNum, productsByCategory } from "@/lib/products";

export function CategoryGateway() {
  return (
    <section
      id="home-categories"
      dir="rtl"
      aria-labelledby="home-categories-title"
      className="border-t border-hairline bg-obsidian py-14 md:py-20"
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

        <div className="mt-9 grid gap-3 md:grid-cols-6 md:grid-rows-2 lg:gap-4">
          {HOME_CATEGORY_ORDER.map((slug, index) => {
            const category = CATEGORIES[slug];
            const count = productsByCategory(slug).length;
            const placement =
              index === 0
                ? "md:col-span-3 md:row-span-2"
                : index === 1
                  ? "md:col-span-3"
                  : "md:col-span-2";
            const ratio = index === 0 ? "4/5" : index === 1 ? "16/9" : "4/3";

            return (
              <Link
                key={slug}
                to="/$category"
                params={{ category: slug }}
                aria-label={`مشاهده ${category.nameFaPlural} — ${fmtNum(count)} محصول`}
                className={`group relative min-w-0 overflow-hidden rounded-2xl border border-hairline bg-carbon shadow-raised transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-hairline-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${placement}`}
              >
                <Frame
                  src={categoryImage(slug)}
                  alt={`نمای دسته ${category.nameFaPlural} LBB`}
                  ratio={ratio}
                  width={index === 0 ? 1000 : 900}
                  height={index === 0 ? 1250 : 720}
                  sizes={
                    index === 0
                      ? "(max-width: 767px) 100vw, 50vw"
                      : "(max-width: 767px) 100vw, 33vw"
                  }
                  className="h-full min-h-[260px] w-full rounded-2xl sm:min-h-[280px]"
                  imgClassName="opacity-80 transition-[transform,opacity] duration-500 group-hover:scale-[1.035] group-hover:opacity-100"
                  zoom={false}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/15 to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 grid size-14 place-items-center rounded-2xl border border-white/20 bg-obsidian/80 text-bone shadow-raised backdrop-blur-md transition-[color,border-color,transform] duration-300 group-hover:-translate-y-1 group-hover:border-signal group-hover:text-signal md:right-5 md:top-5 md:size-16"
                  >
                    <CategoryIcon category={slug} className="size-9 md:size-10" />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <TechLabel tone="signal">0{index + 1}</TechLabel>
                          <TechLabel tone="bone">LBB / MAHESTAN</TechLabel>
                        </div>
                        <h3
                          className={`mt-2 font-black text-bone ${index === 0 ? "text-display-2" : "text-display-3"}`}
                        >
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
