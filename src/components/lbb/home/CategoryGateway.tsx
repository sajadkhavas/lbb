import { Link } from "@tanstack/react-router";
import type { PointerEvent } from "react";
import { ArrowUpLeft } from "lucide-react";
import { CategoryIcon } from "@/components/lbb/BrandIcon";
import { Frame, SectionHead, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { homeCategoryImage } from "@/lib/home-category-images";
import { CATEGORIES } from "@/lib/categories";
import { ACTIVE_HOME_CATEGORY_ORDER } from "@/lib/homepage";
import { fmtNum, productsByCategory } from "@/lib/products";
import type { StorefrontCategoryDto } from "@/lib/final-technical-api";
import { useStorefrontControl } from "@/lib/storefront-control";

export function CategoryGateway({
  liveCategories,
}: {
  liveCategories?: StorefrontCategoryDto[] | null;
}) {
  const { source, home, sectionCopy } = useStorefrontControl();
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

  if (source === "live") {
    const copy = sectionCopy.categories;
    const order = new Map(home.categoryOrder.map((slug, index) => [slug, index]));
    const categories = [...(liveCategories ?? [])]
      .filter((category) => category.showOnHome === true)
      .sort((left, right) => {
        const leftOrder = order.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = order.get(right.slug) ?? Number.MAX_SAFE_INTEGER;
        return leftOrder - rightOrder || left.name.localeCompare(right.name, "fa");
      });

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
            label={copy.label}
            title={<span id="home-categories-title">{copy.title}</span>}
            lede={copy.lede}
            action={
              <Link to="/shop" className="tech inline-flex min-h-11 items-center gap-2 text-signal">
                {copy.actionLabel}
                <ArrowUpLeft size={15} aria-hidden="true" />
              </Link>
            }
          />

          {categories.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-hairline bg-carbon p-6 text-sm leading-7 text-metal">
              هنوز دسته‌ای برای نمایش در صفحه اصلی از پنل مدیریت فعال نشده است.
            </div>
          ) : (
            <div className="mt-8 grid gap-3 md:grid-cols-6 lg:gap-4">
              {categories.map((category, index) => (
                <Link
                  key={category.publicId}
                  to="/$category"
                  params={{ category: category.slug }}
                  aria-label={`مشاهده ${category.name}${typeof category.productCount === "number" ? ` — ${fmtNum(category.productCount)} محصول` : ""}`}
                  onPointerMove={tilt}
                  onPointerLeave={resetTilt}
                  className="category-tilt group relative min-w-0 overflow-hidden rounded-[24px] border border-hairline bg-white shadow-raised hover:border-signal/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:col-span-3"
                >
                  {category.image ? (
                    <Frame
                      src={category.image}
                      alt={`نمای دسته ${category.name}`}
                      ratio="4/3"
                      width={900}
                      height={675}
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="h-full min-h-[270px] w-full rounded-[24px] bg-white"
                      imgClassName="object-contain p-5 opacity-100 drop-shadow-[0_18px_18px_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:scale-[1.045] sm:p-8"
                      zoom={false}
                    >
                      <LiveCategoryOverlay category={category} index={index} />
                    </Frame>
                  ) : (
                    <div
                      className="relative min-h-[270px] bg-[#f3f1ec]"
                      style={{ aspectRatio: "4/3" }}
                    >
                      <div className="absolute inset-0 grid place-items-center px-8 text-center text-sm text-obsidian/45">
                        تصویر دسته هنوز در پنل مدیریت منتشر نشده است.
                      </div>
                      <LiveCategoryOverlay category={category} index={index} />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Shell>
      </section>
    );
  }

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
          {ACTIVE_HOME_CATEGORY_ORDER.map((slug, index) => {
            const category = CATEGORIES[slug];
            const count = productsByCategory(slug).length;

            return (
              <Link
                key={slug}
                to="/$category"
                params={{ category: slug }}
                aria-label={`مشاهده ${category.nameFaPlural} — ${fmtNum(count)} محصول`}
                onPointerMove={tilt}
                onPointerLeave={resetTilt}
                className="category-tilt group relative min-w-0 overflow-hidden rounded-[24px] border border-hairline bg-white shadow-raised hover:border-signal/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:col-span-3"
              >
                <Frame
                  src={homeCategoryImage(slug)}
                  alt={`نمای دسته ${category.nameFaPlural} ال‌بی‌بی`}
                  ratio="4/3"
                  width={900}
                  height={1125}
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="h-full min-h-[270px] w-full rounded-[24px] bg-white"
                  imgClassName="object-contain p-5 opacity-100 drop-shadow-[0_18px_18px_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:scale-[1.045] sm:p-8"
                  zoom={false}
                >
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/5 to-transparent" />
                  <span aria-hidden="true" className="absolute right-4 top-4 grid size-14 place-items-center rounded-2xl border border-black/10 bg-white/90 text-obsidian shadow-raised backdrop-blur-md transition-[color,border-color,transform] duration-300 group-hover:-translate-y-1 group-hover:border-signal group-hover:text-signal md:right-5 md:top-5 md:size-16">
                    <CategoryIcon category={slug} className="size-9 md:size-10" />
                  </span>
                  <div className="category-tilt__content absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <TechLabel tone="signal">0{index + 1}</TechLabel>
                          <TechLabel tone="bone">ال‌بی‌بی / مهستان</TechLabel>
                        </div>
                        <h3 className="mt-2 text-display-3 font-black text-bone">{category.nameFaPlural}</h3>
                        <p className="mt-2 line-clamp-2 max-w-[42ch] text-xs leading-6 text-metal">{category.heroTagline}</p>
                      </div>
                      <span className="shrink-0 rounded-xl border border-hairline-strong bg-obsidian/90 px-3 py-2 text-left backdrop-blur">
                        <span className="num block text-sm font-black text-bone">{fmtNum(count)}</span>
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

function LiveCategoryOverlay({ category, index }: { category: StorefrontCategoryDto; index: number }) {
  return (
    <>
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/5 to-transparent" />
      {category.icon ? (
        <span aria-hidden="true" className="absolute right-4 top-4 grid size-14 place-items-center rounded-2xl border border-black/10 bg-white/90 text-obsidian shadow-raised backdrop-blur-md transition-[color,border-color,transform] duration-300 group-hover:-translate-y-1 group-hover:border-signal md:right-5 md:top-5 md:size-16">
          <img src={category.icon} alt="" width={40} height={40} className="size-9 object-contain md:size-10" loading="lazy" />
        </span>
      ) : null}
      <div className="category-tilt__content absolute inset-x-0 bottom-0 p-4 md:p-5">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <TechLabel tone="signal">{String(index + 1).padStart(2, "0")}</TechLabel>
              <TechLabel tone="bone">LIVE CATALOG</TechLabel>
            </div>
            <h3 className="mt-2 text-display-3 font-black text-bone">{category.name}</h3>
            {category.description ? <p className="mt-2 line-clamp-2 max-w-[42ch] text-xs leading-6 text-metal">{category.description}</p> : null}
          </div>
          {typeof category.productCount === "number" ? (
            <span className="shrink-0 rounded-xl border border-hairline-strong bg-obsidian/90 px-3 py-2 text-left backdrop-blur">
              <span className="num block text-sm font-black text-bone">{fmtNum(category.productCount)}</span>
              <span className="tech mt-1 block text-mute">محصول</span>
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
}
