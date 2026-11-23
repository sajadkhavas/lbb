import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, type ProductCardModel } from "@/components/lbb/ProductCard";
import { useIdleAutoplay } from "@/hooks/use-idle-autoplay";

export function HomeProductCarousel({ items }: { items: ProductCardModel[] }) {
  const [viewport, api] = useEmblaCarousel({
    direction: "rtl",
    align: "start",
    loop: false,
    slidesToScroll: 1,
    watchDrag: (_api, event) =>
      !(event.target instanceof Element && event.target.closest(".product-card__media")),
  });
  const { ref } = useIdleAutoplay(
    () => {
      if (!api) return;
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    },
    7000,
    items.length > 1,
  );
  return (
    <div
      ref={ref}
      className="mt-6"
      role="region"
      aria-roledescription="کاروسل"
      aria-label="محصولات فروشگاه"
      data-home-product-carousel
    >
      <div className="mb-3 flex justify-end gap-2">
        <button
          type="button"
          aria-label="محصولات قبلی"
          onClick={() =>
            api?.canScrollPrev() ? api.scrollPrev() : api?.scrollTo(api.scrollSnapList().length - 1)
          }
          className="grid h-11 w-11 place-items-center rounded-full border border-hairline text-bone hover:border-signal focus-visible:ring-2 focus-visible:ring-signal"
        >
          <ChevronRight size={18} />
        </button>
        <button
          type="button"
          aria-label="محصولات بعدی"
          onClick={() => (api?.canScrollNext() ? api.scrollNext() : api?.scrollTo(0))}
          className="grid h-11 w-11 place-items-center rounded-full border border-hairline text-bone hover:border-signal focus-visible:ring-2 focus-visible:ring-signal"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
      <div ref={viewport} className="overflow-hidden">
        <div className="-mr-3 flex touch-pan-y">
          {items.map((product, index) => (
            <div
              key={product.slug}
              className="min-w-0 shrink-0 grow-0 basis-1/2 pl-0 pr-3 lg:basis-1/4"
              role="group"
              aria-roledescription="اسلاید"
              aria-label={`${index + 1} از ${items.length}`}
            >
              <ProductCard p={product} autoplay />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
