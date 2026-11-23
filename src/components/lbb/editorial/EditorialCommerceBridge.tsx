import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Layers3 } from "lucide-react";
import type { Collection } from "@/lib/collections";
import type { EditorialProductReference } from "@/lib/editorial-commerce";
import type { CategorySlug } from "@/lib/products";
import {
  CtaClasses,
  Frame,
  SectionHead,
  StatePanel,
  TechLabel,
} from "@/components/lbb/ui/primitives";

type CategoryLink = { slug: CategorySlug; label: string };

type Props = {
  title: string;
  lede: string;
  publicProducts?: EditorialProductReference[];
  referencedProductCount?: number;
  collections?: Collection[];
  categories?: CategoryLink[];
  className?: string;
};

export function EditorialCommerceBridge({
  title,
  lede,
  publicProducts = [],
  referencedProductCount = 0,
  collections = [],
  categories = [],
  className,
}: Props) {
  const hasDirectProducts = publicProducts.length > 0;

  return (
    <div data-f17-editorial="commerce-bridge" className={className}>
      <SectionHead index="NEXT" label="STORY → COMMERCE" title={title} lede={lede} />

      {hasDirectProducts ? (
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {publicProducts.map((reference) => (
            <Link
              key={reference.slug}
              to="/product/$slug"
              params={{ slug: reference.slug }}
              className="group grid min-h-[112px] grid-cols-[84px_minmax(0,1fr)_auto] items-center gap-3 border border-hairline bg-carbon p-3 transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              data-f17-public-product-link={reference.slug}
            >
              <Frame
                src={reference.image}
                alt=""
                ratio="4/5"
                width={168}
                height={210}
                sizes="84px"
                className="h-[92px] w-[74px]"
                zoom={false}
              />
              <span className="min-w-0">
                <TechLabel tone="signal">PUBLIC PRODUCT</TechLabel>
                <span className="mt-2 block text-sm font-black leading-6 text-bone">
                  {reference.product.name}
                </span>
                <span className="mt-1 block text-xs leading-6 text-metal">مشاهده جزئیات محصول</span>
              </span>
              <ArrowUpLeft
                aria-hidden="true"
                size={16}
                className="text-mute transition-colors group-hover:text-signal"
              />
            </Link>
          ))}
        </div>
      ) : referencedProductCount > 0 ? (
        <StatePanel
          className="mt-7"
          title="لینک مستقیم محصول در این روایت فعلاً نمایش داده نمی‌شود"
          action={<Layers3 aria-hidden="true" size={20} className="text-mute" />}
        >
          برای ادامه مسیر می‌توانید کالکشن، دسته مرتبط یا فروشگاه را مرور کنید.
        </StatePanel>
      ) : null}

      <nav aria-label="مسیرهای بعدی این روایت" className="mt-7 flex flex-wrap gap-3">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            to="/collections/$slug"
            params={{ slug: collection.slug }}
            className={CtaClasses("line")}
          >
            {collection.nameFa}
          </Link>
        ))}
        {categories.map((category) => (
          <Link
            key={category.slug}
            to="/$category"
            params={{ category: category.slug }}
            className={CtaClasses("line")}
          >
            {category.label}
          </Link>
        ))}
        <Link to="/shop" search={{}} className={CtaClasses("signal")}>
          مرور فروشگاه
          <ArrowUpLeft aria-hidden="true" size={16} />
        </Link>
      </nav>
    </div>
  );
}
