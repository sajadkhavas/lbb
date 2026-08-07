import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { CtaClasses, Shell, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";
import { getCollectionEditorialViewBySlug } from "@/lib/editorial-commerce";

export function DropStory() {
  const view = getCollectionEditorialViewBySlug("drop-01-shabgard");
  if (!view) return null;

  const { collection } = view;

  return (
    <section
      dir="rtl"
      aria-labelledby="drop-story-title"
      className="relative overflow-hidden border-t border-hairline bg-carbon"
      data-f17-editorial="home-drop-story"
    >
      <div aria-hidden="true" className="absolute inset-0 grid-marks opacity-35" />
      <Shell className="relative grid gap-0 py-14 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)]">
        <div className="relative min-h-[520px] overflow-hidden border border-hairline bg-obsidian lg:min-h-[760px]">
          <img
            src={view.media}
            alt={`روایت تصویری ${collection.nameFa}`}
            width={1200}
            height={1500}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 1023px) 100vw, 52vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/10"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
            <TechLabel tone="signal">{collection.latinName}</TechLabel>
            <p className="mt-3 max-w-[38ch] text-sm leading-7 text-bone">{collection.tagline}</p>
          </div>
        </div>

        <div className="flex flex-col border border-t-0 border-hairline bg-obsidian p-5 md:p-8 lg:border-r-0 lg:border-t lg:p-10">
          <div>
            <TechLabel tone="signal">03 / DROP NARRATIVE</TechLabel>
            <h2 id="drop-story-title" className="mt-4 text-display-2 text-bone">
              {collection.nameFa}
            </h2>
            <p className="mt-5 text-sm leading-8 text-metal">{collection.description}</p>
          </div>

          <ol className="mt-8 border-y border-hairline">
            {collection.storyPoints.map((point, index) => (
              <li
                key={point}
                className="grid min-h-14 grid-cols-[40px_minmax(0,1fr)] items-center gap-3 border-b border-hairline-soft last:border-b-0"
              >
                <span className="num text-xs text-signal">0{index + 1}</span>
                <span className="text-sm font-bold text-bone">{point}</span>
              </li>
            ))}
          </ol>

          {view.publicProducts.length > 0 ? (
            <div className="mt-8">
              <TechLabel>PUBLIC PIECES IN THIS STORY</TechLabel>
              <ul className="mt-3 space-y-2">
                {view.publicProducts.slice(0, 3).map((reference) => (
                  <li key={reference.slug}>
                    <Link
                      to="/product/$slug"
                      params={{ slug: reference.slug }}
                      className="group grid min-h-[78px] grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 border border-hairline bg-carbon p-2 transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                      data-f17-public-product-link={reference.slug}
                    >
                      <img
                        src={reference.image}
                        alt=""
                        width={56}
                        height={70}
                        loading="lazy"
                        decoding="async"
                        className="h-[70px] w-14 object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black text-bone">
                          {reference.product.name}
                        </span>
                        <span className="mt-1 block text-xs leading-6 text-metal">
                          مشاهده جزئیات عمومی محصول
                        </span>
                      </span>
                      <ArrowUpLeft
                        size={16}
                        aria-hidden="true"
                        className="text-mute transition-colors group-hover:text-signal"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <StatePanel className="mt-8" title="این دراپ فعلاً لینک مستقیم محصول ندارد">
              روایت و مسیرهای کشف فعال‌اند؛ لینک محصول زمانی نمایش داده می‌شود که وضعیت انتشار آن
              برای نمایش عمومی آماده باشد.
            </StatePanel>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/collections/$slug"
              params={{ slug: collection.slug }}
              className={CtaClasses("signal")}
            >
              مشاهده روایت {collection.nameFa}
            </Link>
            <Link to="/lookbook" className={CtaClasses("line")}>
              دیدن لوک‌بوک
            </Link>
          </div>

          <p className="mt-auto border-t border-hairline pt-7 text-xs leading-6 text-mute">
            وضعیت زمانی یا موجودی دراپ در این روایت حدس زده نمی‌شود؛ اطلاعات زمانی فقط با داده
            منتشرشده نمایش داده خواهد شد.
          </p>
        </div>
      </Shell>
    </section>
  );
}
