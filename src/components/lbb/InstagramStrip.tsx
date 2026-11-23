import { LookbookCarousel } from "./LookbookCarousel";
import type { StorefrontLookDto } from "@/lib/storefront-control";
import { useStorefrontControl } from "@/lib/storefront-control";
import { homeCategoryImage } from "@/lib/home-category-images";
import { communityStudio } from "@/lib/product-images";
import { MerchantNavigationLink } from "@/components/lbb/navigation/MerchantNavigationLink";
import { useStorefrontPresentation } from "@/lib/storefront-presentation";

const SHOTS = [
  homeCategoryImage("tshirts"),
  homeCategoryImage("pants"),
  communityStudio,
  homeCategoryImage("shoes"),
  homeCategoryImage("socks"),
];

export function InstagramStrip({ liveItems }: { liveItems?: StorefrontLookDto[] | null }) {
  const { source, brand, sectionCopy } = useStorefrontControl();
  const presentation = useStorefrontPresentation();

  if (source === "live") {
    const items = liveItems ?? [];
    if (items.length === 0) return null;
    const copy = sectionCopy.instagram;

    return (
      <section
        dir="rtl"
        className="border-t border-hairline bg-black px-6 py-5 md:px-10 md:py-8"
        aria-label="ویترین تصویری LBB"
      >
        <div className="mx-auto max-w-[1600px] text-center">
          <p className="tech text-white/50">{brand.instagramHandle}</p>
          <LookbookCarousel items={items} instagramUrl={brand.instagramUrl} compact />
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              {copy.followCta}
            </a>
            <MerchantNavigationLink
              item={{
                label: copy.lookbookCta,
                latin: "LOOKBOOK",
                href: presentation.sectionLinks.instagramLookbook,
              }}
              className="tap-target inline-flex items-center justify-center rounded-xl border border-white/15 px-8 py-3 text-xs font-bold text-white/80 transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              {copy.lookbookCta}
            </MerchantNavigationLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      dir="rtl"
      className="border-t border-hairline bg-black px-6 py-12 md:px-10 md:py-16"
      aria-label="اینستاگرام LBB"
    >
      <div className="mx-auto max-w-[1600px] text-center">
        <p className="tech text-white/50">@lbbclo</p>
        <LookbookCarousel
          compact
          instagramUrl="https://www.instagram.com/lbbclo"
          items={SHOTS.map((imageUrl, sortOrder) => ({
            imageUrl,
            sortOrder,
            title: "",
            caption: null,
            linkUrl: null,
          }))}
        />
        <div className="mt-7">
          <a
            href="https://www.instagram.com/lbbclo"
            target="_blank"
            rel="noreferrer"
            className="tap-target inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            دنبال ما در اینستاگرام
          </a>
        </div>
      </div>
    </section>
  );
}
