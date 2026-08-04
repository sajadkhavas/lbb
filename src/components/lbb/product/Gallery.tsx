import { useEffect, useId, useRef, useState } from "react";
import { productGallery } from "@/lib/product-images";

export function Gallery({ slug, name }: { slug: string; name: string }) {
  const images = productGallery(slug);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    setActive(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [slug]);

  const scrollToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    const clamped = Math.min(images.length - 1, Math.max(0, index));
    setActive(clamped);
    const track = trackRef.current;
    const child = track?.children.item(clamped) as HTMLElement | null;
    if (track && child) track.scrollTo({ left: child.offsetLeft, behavior });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth <= 0) return;
    const index = Math.min(
      images.length - 1,
      Math.max(0, Math.round(track.scrollLeft / track.clientWidth)),
    );
    setActive((current) => (current === index ? current : index));
  };

  const focusThumbnail = (index: number) => {
    const clamped = Math.min(images.length - 1, Math.max(0, index));
    scrollToIndex(clamped);
    thumbRefs.current[clamped]?.focus();
  };

  const onThumbKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusThumbnail(Math.min(images.length - 1, index + 1));
    } else if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      focusThumbnail(Math.max(0, index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      focusThumbnail(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusThumbnail(images.length - 1);
    }
  };

  const onMainKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(active - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(active + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      scrollToIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      scrollToIndex(images.length - 1);
    }
  };

  return (
    <div dir="rtl" className="flex flex-col-reverse gap-3 md:sticky md:top-20 md:flex-row md:self-start">
      <div role="tablist" aria-label="تصاویر محصول" aria-orientation="vertical" className="hidden md:flex md:w-20 md:flex-col md:gap-3">
        {images.map((source, index) => (
          <button
            key={`${source}-${index}`}
            id={`${id}-tab-${index}`}
            ref={(element: HTMLButtonElement | null) => {
              thumbRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => scrollToIndex(index)}
            onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => onThumbKeyDown(event, index)}
            className={`tap-target aspect-square overflow-hidden border bg-carbon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
              index === active ? "border-signal" : "border-hairline hover:border-metal"
            }`}
          >
            <img src={source} alt="" aria-hidden="true" width={160} height={160} loading="lazy" decoding="async" className="h-full w-full object-cover" />
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
          aria-label={`گالری تصاویر ${name}`}
          className="group relative flex aspect-square snap-x snap-mandatory overflow-x-auto overflow-y-hidden border border-hairline bg-carbon [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-signal md:overflow-hidden [&::-webkit-scrollbar]:hidden"
        >
          {images.map((source, index) => (
            <div
              key={`${source}-${index}`}
              id={`${id}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${index}`}
              aria-hidden={index !== active}
              className="relative aspect-square w-full flex-none snap-center overflow-hidden"
            >
              <img
                src={source}
                alt={index === 0 ? name : `${name} — تصویر ${index + 1}`}
                width={1024}
                height={1024}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                className="frame-zoom h-full w-full object-cover md:group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">تصویر {active + 1} از {images.length}</p>
        <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-label="انتخاب تصویر">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`رفتن به تصویر ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              className={`min-h-6 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                index === active ? "w-6 bg-signal" : "w-3 bg-hairline"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
