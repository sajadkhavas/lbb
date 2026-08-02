import { useRef, useState } from "react";
import { productGallery } from "@/lib/product-images";

/**
 * Accessible product gallery: thumbnail buttons with aria-selected semantics,
 * keyboard arrow navigation, mobile swipe (native scroll-snap) and a fixed
 * aspect ratio to guarantee zero layout shift.
 */
export function Gallery({ slug, name }: { slug: string; name: string }) {
  const images = productGallery(slug);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const scrollToIndex = (i: number) => {
    const clamped = (i + images.length) % images.length;
    setActive(clamped);
    const track = trackRef.current;
    const child = track?.children[clamped] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, clientWidth } = track;
    const idx = Math.round(Math.abs(scrollLeft) / clientWidth);
    if (idx !== active) setActive(idx);
  };

  const onThumbKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(i + 1);
      thumbRefs.current[(i + 1) % images.length]?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(i - 1);
      thumbRefs.current[(i - 1 + images.length) % images.length]?.focus();
    }
  };

  const onMainKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(active + 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(active - 1);
    }
  };

  return (
    <div dir="rtl" className="flex flex-col-reverse gap-3 md:flex-row md:sticky md:top-20 md:self-start">
      {/* Vertical thumbnails — desktop only */}
      <div role="tablist" aria-label="تصاویر محصول" className="hidden md:flex md:w-20 md:flex-col md:gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            ref={(el) => { thumbRefs.current[i] = el; }}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls="pdp-gallery-main"
            tabIndex={i === active ? 0 : -1}
            onClick={() => scrollToIndex(i)}
            onKeyDown={(e) => onThumbKeyDown(e, i)}
            className={`tap-target aspect-square overflow-hidden border bg-carbon transition-colors ${
              i === active ? "border-signal" : "border-hairline hover:border-metal"
            }`}
          >
            <img
              src={src}
              alt=""
              aria-hidden="true"
              width={160}
              height={160}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image / mobile swipe carousel */}
      <div className="flex-1">
        <div
          id="pdp-gallery-main"
          ref={trackRef}
          onScroll={onScroll}
          onKeyDown={onMainKeyDown}
          tabIndex={0}
          role="group"
          aria-label={`گالری تصاویر ${name}`}
          className="group relative flex aspect-square snap-x snap-mandatory gap-0 overflow-x-auto overflow-y-hidden border border-hairline bg-carbon [scrollbar-width:none] focus:outline-none focus-visible:ring-1 focus-visible:ring-signal md:overflow-hidden [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <div key={i} className="relative aspect-square w-full flex-none snap-center overflow-hidden">
              <img
                src={src}
                alt={i === 0 ? name : `${name} — تصویر ${i + 1}`}
                width={1024}
                height={1024}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                className="frame-zoom h-full w-full object-cover md:group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        {/* Dots — mobile only */}
        <div className="mt-3 flex justify-center gap-1.5 md:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`رفتن به تصویر ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-5 bg-signal" : "w-1.5 bg-hairline"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
