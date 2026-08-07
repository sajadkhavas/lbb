import { useEffect, useId, useRef, useState } from "react";
import type { DecisionMedia } from "@/lib/product-decision";

type GalleryItem = DecisionMedia & { placeholder?: boolean };

const PLACEHOLDERS: GalleryItem[] = [
  {
    id: "pending-media-primary",
    src: "",
    alt: "رسانه محصول هنوز تأیید نشده است",
    width: 1024,
    height: 1280,
    placeholder: true,
  },
  {
    id: "pending-media-secondary",
    src: "",
    alt: "رسانه تکمیلی محصول هنوز تأیید نشده است",
    width: 1024,
    height: 1280,
    placeholder: true,
  },
];

export function Gallery({ media, name }: { media: DecisionMedia[]; name: string }) {
  const items: GalleryItem[] = media.length > 0 ? media : PLACEHOLDERS;
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    setActive(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [media]);

  const scrollToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    const clamped = Math.min(items.length - 1, Math.max(0, index));
    setActive(clamped);
    const track = trackRef.current;
    const child = track?.children.item(clamped) as HTMLElement | null;
    if (track && child) track.scrollTo({ left: child.offsetLeft, behavior });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth <= 0) return;
    const centers = Array.from(track.children).map((child) => {
      const element = child as HTMLElement;
      return Math.abs(element.offsetLeft - track.scrollLeft);
    });
    const next = centers.indexOf(Math.min(...centers));
    setActive((current) => (current === next ? current : next));
  };

  const focusThumbnail = (index: number) => {
    const clamped = Math.min(items.length - 1, Math.max(0, index));
    scrollToIndex(clamped);
    thumbRefs.current[clamped]?.focus();
  };

  const onThumbKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusThumbnail(index + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      focusThumbnail(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusThumbnail(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusThumbnail(items.length - 1);
    }
  };

  const onMainKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(active + 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(active - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      scrollToIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      scrollToIndex(items.length - 1);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex min-w-0 flex-col-reverse gap-3 md:sticky md:top-20 md:flex-row md:self-start"
    >
      <div
        role="tablist"
        aria-label={media.length > 0 ? "تصاویر محصول" : "تصاویر محصول — رسانه تأیید نشده"}
        aria-orientation="vertical"
        className="hidden md:flex md:w-20 md:flex-col md:gap-3"
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            id={`${id}-tab-${index}`}
            ref={(element) => {
              thumbRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`${id}-panel-${index}`}
            aria-label={
              item.placeholder
                ? `جایگاه رسانه ${index + 1} از ${items.length} — تأیید نشده`
                : `نمایش تصویر ${index + 1} از ${items.length} برای ${name}`
            }
            tabIndex={index === active ? 0 : -1}
            onClick={() => scrollToIndex(index)}
            onKeyDown={(event) => onThumbKeyDown(event, index)}
            className={`tap-target aspect-[4/5] overflow-hidden border bg-carbon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
              index === active ? "border-signal" : "border-hairline hover:border-metal"
            }`}
          >
            {item.placeholder ? (
              <span aria-hidden="true" className="grid h-full w-full place-items-center bg-carbon">
                <span className="h-5 w-5 border border-hairline" />
              </span>
            ) : (
              <img
                src={item.src}
                alt=""
                aria-hidden="true"
                width={160}
                height={200}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            )}
          </button>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div
          id={`${id}-gallery`}
          dir="ltr"
          ref={trackRef}
          onScroll={onScroll}
          onKeyDown={onMainKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`گالری ${name}`}
          className="group relative flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overflow-y-hidden border border-hairline bg-carbon [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-signal md:overflow-hidden [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              id={`${id}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${index}`}
              aria-hidden={index !== active}
              className="relative aspect-[4/5] w-full flex-none snap-center overflow-hidden"
            >
              {item.placeholder ? (
                <div
                  dir="rtl"
                  className="grid h-full place-items-center px-8 text-center"
                  aria-label={item.alt}
                >
                  <div className="max-w-[28rem]">
                    <span
                      aria-hidden="true"
                      className="mx-auto block h-12 w-12 border border-hairline"
                    />
                    <p className="mt-5 text-sm font-semibold text-bone">
                      رسانه محصول منتشر نشده است
                    </p>
                    <p className="mt-2 text-xs leading-6 text-metal">
                      تا زمانی که تصویر همان کالا با منبع قابل استناد تأیید نشود، تصویر نمونه یا
                      تصویر محصول دیگری جایگزین نمی‌شود.
                    </p>
                  </div>
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 md:group-hover:scale-[1.02]"
                />
              )}
            </div>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {media.length > 0
            ? `تصویر ${active + 1} از ${items.length}`
            : `جایگاه رسانه ${active + 1} از ${items.length}؛ رسانه تأیید نشده`}
        </p>
        <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-label="انتخاب تصویر">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`رفتن به ${item.placeholder ? "جایگاه رسانه" : "تصویر"} ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              className={`min-h-11 min-w-11 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                index === active ? "text-signal" : "text-mute"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mx-auto block h-1.5 rounded-full ${index === active ? "w-6 bg-signal" : "w-3 bg-hairline"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
