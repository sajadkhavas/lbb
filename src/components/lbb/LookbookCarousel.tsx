import { useId, useRef } from "react";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { safePublicHref } from "@/lib/public-href";
import type { StorefrontLookDto } from "@/lib/storefront-control";

export function LookbookCarousel({
  items,
  instagramUrl,
  compact = false,
}: {
  items: StorefrontLookDto[];
  instagramUrl: string;
  compact?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const id = useId();
  const move = (step: number) => {
    const el = track.current;
    if (!el) return;
    const edge = el.getBoundingClientRect().right;
    const cards = Array.from(el.children);
    const offsets = cards.map((card) => card.getBoundingClientRect().right - edge);
    const target =
      step < 0
        ? offsets.find((offset) => offset < -6)
        : offsets.reverse().find((offset) => offset > 6);
    el.scrollBy({
      left: target ?? (step < 0 ? -el.clientWidth : el.clientWidth),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };
  return (
    <div dir="rtl" data-lookbook-carousel>
      {items.length > 1 && (
        <div className="mb-2 flex justify-end gap-1">
          <button
            type="button"
            aria-controls={id}
            aria-label="تصویر قبلی"
            onClick={() => move(1)}
            className="grid size-11 place-items-center rounded-full border border-hairline hover:border-signal"
          >
            <ChevronRight size={17} />
          </button>
          <button
            type="button"
            aria-controls={id}
            aria-label="تصویر بعدی"
            onClick={() => move(-1)}
            className="grid size-11 place-items-center rounded-full border border-hairline hover:border-signal"
          >
            <ChevronLeft size={17} />
          </button>
        </div>
      )}
      <div
        ref={track}
        id={id}
        className={`flex snap-x snap-mandatory items-start gap-3 overflow-x-auto p-1 [scrollbar-width:thin] ${compact ? "lg:justify-between lg:gap-5" : ""}`}
      >
        {items.map((item, index) => {
          const href = safePublicHref(item.linkUrl) ?? safePublicHref(instagramUrl);
          const external = href?.startsWith("https:");
          const insta = href && /^https:\/\/(?:www\.)?instagram\.com\//i.test(href);
          const frame = (
            <>
              <img
                src={item.imageUrl}
                alt={item.title || "تصویر لوک‌بوک LBB"}
                loading={!compact && index === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`block h-auto w-auto max-w-[calc(84vw-2px)] object-contain ${compact ? "max-h-[200px] sm:max-h-[240px] lg:max-h-[300px]" : "max-h-[300px] sm:max-h-[380px] lg:max-h-[460px]"}`}
              />
              {insta && (
                <span className="absolute end-2 top-2 grid size-9 place-items-center rounded-full bg-black/80 text-white transition-opacity [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Instagram size={17} aria-hidden="true" />
                </span>
              )}
            </>
          );
          const frameClass = "group relative block w-fit max-w-full overflow-hidden rounded-xl";
          return (
            <article
              key={`${item.imageUrl}-${index}`}
              className="w-max max-w-[84vw] shrink-0 self-start snap-start overflow-hidden rounded-xl border border-hairline bg-carbon"
            >
              {href ? (
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={`${item.title || "دیدن تصویر"}${insta ? " در اینستاگرام" : ""}`}
                  className={frameClass}
                >
                  {frame}
                </a>
              ) : (
                <div className={frameClass}>{frame}</div>
              )}
              {!compact && (item.title || item.caption) && (
                <div className="w-0 min-w-full p-3">
                  {item.title && (
                    <h2 className="line-clamp-2 text-sm font-bold leading-6 text-bone">
                      {item.title}
                    </h2>
                  )}
                  {item.caption && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-metal">{item.caption}</p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
