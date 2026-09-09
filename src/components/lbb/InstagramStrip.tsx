import type { StorefrontLookDto } from "@/lib/storefront-control";
import { useStorefrontControl } from "@/lib/storefront-control";
import { homeCategoryImage } from "@/lib/home-category-images";
import { communityStudio } from "@/lib/product-images";

const SHOTS = [
  homeCategoryImage("tshirts"),
  homeCategoryImage("pants"),
  communityStudio,
  homeCategoryImage("shoes"),
  homeCategoryImage("socks"),
];

function isExternalHref(value: string) {
  return /^https?:\/\//i.test(value);
}

export function InstagramStrip({ liveItems }: { liveItems?: StorefrontLookDto[] | null }) {
  const { source, brand } = useStorefrontControl();

  if (source === "live") {
    const items = liveItems ?? [];
    if (items.length === 0) return null;

    return (
      <section
        dir="rtl"
        className="border-t border-hairline bg-black px-6 py-12 md:px-10 md:py-16"
        aria-label="ویترین تصویری LBB"
      >
        <div className="mx-auto max-w-[1600px] text-center">
          <p className="tech text-white/50">{brand.instagramHandle}</p>
          <div
            dir="rtl"
            className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-5 md:overflow-visible md:pb-0"
          >
            {items.slice(0, 5).map((item, index) => {
              const href = item.linkUrl || brand.instagramUrl;
              const external = isExternalHref(href);
              return (
                <a
                  key={`${item.imageUrl}-${index}`}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group relative aspect-square w-[70vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/[0.08] transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:w-auto"
                  aria-label={item.title || "مشاهده محتوای تصویری LBB"}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title || "تصویر LBB"}
                    width={640}
                    height={640}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-transparent to-transparent p-4 text-start opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span>
                      <span className="block text-sm font-bold text-white">{item.title}</span>
                      {item.caption ? <span className="mt-1 line-clamp-2 block text-[11px] leading-5 text-white/70">{item.caption}</span> : null}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              دنبال ما در اینستاگرام
            </a>
            <a
              href="/lookbook"
              className="tap-target inline-flex items-center justify-center rounded-xl border border-white/15 px-8 py-3 text-xs font-bold text-white/80 transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              مشاهده لوک‌بوک
            </a>
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
        <div
          dir="rtl"
          className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-5 md:overflow-visible md:pb-0"
        >
          {SHOTS.map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/lbbclo"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square w-[70vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/[0.08] transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:w-auto"
              aria-label="مشاهده پست اینستاگرام LBB"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-4xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">✦</span>
            </a>
          ))}
        </div>
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
