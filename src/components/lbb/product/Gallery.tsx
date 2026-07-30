import { useRef, useState } from "react";
import { productGallery } from "@/lib/product-images";

export function Gallery({ slug, name }: { slug: string; name: string }) {
  const images = productGallery(slug);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (i: number) => {
    setActive(i);
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[i] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, clientWidth } = track;
    const idx = Math.round(Math.abs(scrollLeft) / clientWidth);
    if (idx !== active) setActive(idx);
  };

  return (
    <div dir="rtl" className="flex flex-col-reverse gap-3 md:flex-row">
      {/* Vertical thumbnails - desktop only */}
      <div className="hidden md:flex md:w-20 md:flex-col md:gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`aspect-square overflow-hidden rounded-md border bg-[#f2f2f2] transition-colors ${
              i === active ? "border-[var(--lbb-red)]" : "border-black/10 hover:border-black/30"
            }`}
            aria-label={`تصویر ${i + 1}`}
            aria-current={i === active}
          >
            <img
              src={src}
              alt=""
              aria-hidden
              width={160}
              height={160}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image / mobile carousel */}
      <div className="flex-1">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="group relative flex aspect-square snap-x snap-mandatory gap-0 overflow-x-auto overflow-y-hidden rounded-xl border border-black/[0.06] bg-[#f2f2f2] [scrollbar-width:none] md:overflow-hidden [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <div key={i} className="relative aspect-square w-full flex-none snap-center overflow-hidden">
              <img
                src={src}
                alt={i === 0 ? name : `${name} - تصویر ${i + 1}`}
                width={1024}
                height={1024}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        {/* Dots - mobile only */}
        <div className="mt-3 flex justify-center gap-1.5 md:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`رفتن به تصویر ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-5 bg-[var(--lbb-red)]" : "w-1.5 bg-black/15"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
