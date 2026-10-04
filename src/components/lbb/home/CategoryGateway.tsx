import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, LayoutGrid } from "lucide-react";
import { CategoryIcon } from "@/components/lbb/BrandIcon";
import { MerchantNavigationLink } from "@/components/lbb/navigation/MerchantNavigationLink";
import { SectionHead, Shell } from "@/components/lbb/ui/primitives";
import { CATEGORIES } from "@/lib/categories";
import { ACTIVE_HOME_CATEGORY_ORDER } from "@/lib/homepage";
import { fmtNum, productsByCategory } from "@/lib/products";
import type { CategorySlug } from "@/lib/products";
import type { StorefrontCategoryDto } from "@/lib/final-technical-api";
import { useStorefrontControl } from "@/lib/storefront-control";
import { useStorefrontPresentation } from "@/lib/storefront-presentation";

export function CategoryGateway({
  liveCategories,
}: {
  liveCategories?: StorefrontCategoryDto[] | null;
}) {
  const { source, home, sectionCopy } = useStorefrontControl();
  const presentation = useStorefrontPresentation();
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
              <MerchantNavigationLink
                item={{
                  label: copy.actionLabel,
                  latin: "SHOP",
                  href: presentation.sectionLinks.categories,
                }}
                className="tech inline-flex min-h-11 items-center gap-2 text-signal"
              >
                {copy.actionLabel}
                <ArrowUpLeft size={15} aria-hidden="true" />
              </MerchantNavigationLink>
            }
          />

          {categories.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-hairline bg-carbon p-6 text-sm leading-7 text-metal">
              دسته‌بندی‌های فروشگاه به‌زودی در این بخش نمایش داده می‌شوند.
            </div>
          ) : (
            <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:thin]">
              {categories.map((category) => (
                <Link
                  key={category.publicId}
                  to="/$category"
                  params={{ category: category.slug }}
                  aria-label={`مشاهده ${category.name}${typeof category.productCount === "number" ? ` — ${fmtNum(category.productCount)} محصول` : ""}`}
                  className="group flex min-h-28 w-40 shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl border border-hairline bg-carbon p-4 text-center text-bone transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal sm:w-48"
                >
                  {category.icon ? (
                    <img
                      src={category.icon}
                      alt=""
                      className="size-9 object-contain"
                      loading="lazy"
                    />
                  ) : category.slug in CATEGORIES ? (
                    <CategoryIcon
                      category={category.slug as CategorySlug}
                      className="size-9 text-signal"
                    />
                  ) : (
                    <LayoutGrid className="size-9 text-signal" aria-hidden="true" />
                  )}
                  <span className="text-sm font-bold">{category.name}</span>
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

        <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {ACTIVE_HOME_CATEGORY_ORDER.map((slug) => {
            const category = CATEGORIES[slug];
            const count = productsByCategory(slug).length;

            return (
              <Link
                key={slug}
                to="/$category"
                params={{ category: slug }}
                aria-label={`مشاهده ${category.nameFaPlural} — ${fmtNum(count)} محصول`}
                className="group flex min-h-28 w-40 shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl border border-hairline bg-carbon p-4 text-center text-bone transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal sm:w-48"
              >
                <CategoryIcon category={slug} className="size-9 text-signal" />
                <span className="text-sm font-bold">{category.nameFaPlural}</span>
              </Link>
            );
          })}
        </div>
      </Shell>
    </section>
  );
}
