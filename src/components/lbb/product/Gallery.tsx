import { lazy, Suspense, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Box, UserRound } from "lucide-react";
import { StyleMannequin } from "@/components/lbb/product/StyleMannequin";
import { getProductMannequinModel3d, type ProductMannequinModel3dDto } from "@/lib/product-3d-api";
import { detectProduct3dViewerCapability } from "@/lib/product-3d-capability";
import type { DecisionMedia } from "@/lib/product-decision";

const ProductModel3dViewer = lazy(() =>
  import("@/components/lbb/product/ProductModel3dViewer").then((module) => ({
    default: module.ProductModel3dViewer,
  })),
);

type GalleryItem = DecisionMedia & {
  placeholder?: boolean;
  model3d?: ProductMannequinModel3dDto;
};

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

export function Gallery({
  media,
  name,
  productSlug,
  enable3d = false,
}: {
  media: DecisionMedia[];
  name: string;
  productSlug?: string;
  enable3d?: boolean;
}) {
  const [model3d, setModel3d] = useState<ProductMannequinModel3dDto | null>(null);
  const [model3dBroken, setModel3dBroken] = useState(false);
  const hasMannequin = media.some((item) => Boolean(item.mannequin));
  const baseItems: GalleryItem[] = media.length > 0 ? media : PLACEHOLDERS;
  const items = useMemo<GalleryItem[]>(() => {
    if (!model3d || model3dBroken || !productSlug) return baseItems;

    const mannequinIndex = baseItems.findIndex((item) => Boolean(item.mannequin));
    if (mannequinIndex < 0) return baseItems;

    const modelItem: GalleryItem = {
      id: `${productSlug}:mannequin-3d`,
      src: "",
      alt: `نمای سه‌بعدی ${name}`,
      width: 1200,
      height: 1500,
      model3d,
    };

    return [
      ...baseItems.slice(0, mannequinIndex + 1),
      modelItem,
      ...baseItems.slice(mannequinIndex + 1),
    ];
  }, [baseItems, model3d, model3dBroken, name, productSlug]);

  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    setModel3d(null);
    setModel3dBroken(false);

    if (!enable3d || !productSlug || !hasMannequin || !detectProduct3dViewerCapability()) {
      return;
    }

    let cancelled = false;
    void getProductMannequinModel3d(productSlug).then((model) => {
      if (!cancelled) setModel3d(model);
    });

    return () => {
      cancelled = true;
    };
  }, [enable3d, hasMannequin, productSlug]);

  useEffect(() => {
    setActive(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [media]);

  const scrollToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    const clamped = Math.min(items.length - 1, Math.max(0, index));
    setActive(clamped);
    const track = trackRef.current;
    const child = track?.children.item(clamped) as HTMLElement | null;
    if (track && child) {
      child.scrollIntoView({ behavior, block: "nearest", inline: "center" });
    }
  };

  const handleModel3dError = useCallback(() => {
    const fallbackIndex = baseItems.findIndex((item) => Boolean(item.mannequin));
    setModel3dBroken(true);
    setActive(fallbackIndex >= 0 ? fallbackIndex : 0);
  }, [baseItems]);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth <= 0) return;
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    const centers = Array.from(track.children).map((child) => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      return Math.abs(rect.left + rect.width / 2 - trackCenter);
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

  const itemLabel = (item: GalleryItem, index: number) => {
    if (item.model3d) return `نمایش مدل سه‌بعدی ${name}`;
    if (item.mannequin) return `نمایش ${name} روی مانکن`;
    if (item.placeholder) return `جایگاه رسانه ${index + 1} از ${items.length} — تأیید نشده`;
    return `نمایش تصویر ${index + 1} از ${items.length} برای ${name}`;
  };

  const mobileItemLabel = (item: GalleryItem, index: number) => {
    if (item.model3d) return `رفتن به نمای سه‌بعدی ${name}`;
    if (item.mannequin) return `رفتن به نمای مانکن ${name}`;
    return `رفتن به ${item.placeholder ? "جایگاه رسانه" : "تصویر"} ${index + 1}`;
  };

  return (
    <div
      dir="rtl"
      className="flex min-w-0 flex-col-reverse gap-3 md:sticky md:top-20 md:flex-row md:self-start lg:top-24 lg:gap-4"
    >
      <div
        role="tablist"
        aria-label={media.length > 0 ? "تصاویر و نماهای محصول" : "تصاویر محصول — رسانه تأیید نشده"}
        aria-orientation="vertical"
        className="hidden md:flex md:w-20 md:flex-col md:gap-3 lg:w-24"
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
            aria-label={itemLabel(item, index)}
            tabIndex={index === active ? 0 : -1}
            onClick={() => scrollToIndex(index)}
            onKeyDown={(event) => onThumbKeyDown(event, index)}
            className={`tap-target aspect-[4/5] overflow-hidden rounded-lg border bg-carbon transition-[border-color,opacity,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal lg:rounded-xl ${
              index === active
                ? "border-signal opacity-100"
                : "border-hairline opacity-75 hover:border-metal hover:opacity-100"
            }`}
          >
            {item.model3d ? (
              <span className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[#f3f1ec] px-1 text-[10px] font-black text-obsidian">
                <Box size={24} aria-hidden="true" />
                <span>نمای 3D</span>
              </span>
            ) : item.mannequin ? (
              <span className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[#f3f1ec] px-1 text-[10px] font-black text-obsidian">
                <UserRound size={24} aria-hidden="true" />
                <span>مانکن</span>
              </span>
            ) : item.placeholder ? (
              <span aria-hidden="true" className="grid h-full w-full place-items-center bg-carbon">
                <span className="h-5 w-5 rounded border border-hairline" />
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
          dir="rtl"
          ref={trackRef}
          onScroll={onScroll}
          onKeyDown={onMainKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`گالری تصاویر و نماهای ${name}`}
          className="group relative flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-xl border border-hairline bg-carbon shadow-[0_18px_55px_rgba(0,0,0,0.2)] [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-signal md:overflow-hidden md:rounded-2xl lg:shadow-[0_24px_75px_rgba(0,0,0,0.3)] [&::-webkit-scrollbar]:hidden"
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
              {item.model3d ? (
                index === active ? (
                  <Suspense
                    fallback={
                      <div className="grid h-full place-items-center bg-[#f3f1ec] text-xs font-bold text-obsidian">
                        در حال بارگذاری Viewer سه‌بعدی…
                      </div>
                    }
                  >
                    <ProductModel3dViewer
                      modelUrl={item.model3d.url}
                      productName={name}
                      onError={handleModel3dError}
                    />
                  </Suspense>
                ) : (
                  <div className="grid h-full place-items-center bg-[#f3f1ec] text-center text-obsidian">
                    <div>
                      <Box className="mx-auto" size={38} aria-hidden="true" />
                      <p className="mt-3 text-xs font-black">نمای سه‌بعدی آماده است</p>
                    </div>
                  </div>
                )
              ) : item.mannequin ? (
                <StyleMannequin
                  profile={item.mannequin}
                  productName={name}
                  priority={index === 0}
                />
              ) : item.placeholder ? (
                <div
                  dir="rtl"
                  className="grid h-full place-items-center px-8 text-center"
                  aria-label={item.alt}
                >
                  <div className="max-w-[28rem]">
                    <span
                      aria-hidden="true"
                      className="mx-auto block h-12 w-12 rounded-lg border border-hairline"
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
                  className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 md:group-hover:scale-[1.015]"
                />
              )}
            </div>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {items[active]?.model3d
            ? `نمای سه‌بعدی ${name}`
            : items[active]?.mannequin
              ? `نمای مانکن ${name}`
              : media.length > 0
                ? `تصویر ${active + 1} از ${items.length}`
                : `جایگاه رسانه ${active + 1} از ${items.length}؛ رسانه تأیید نشده`}
        </p>
        <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-label="انتخاب تصویر">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={mobileItemLabel(item, index)}
              aria-current={index === active ? "true" : undefined}
              className={`min-h-11 min-w-11 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                index === active ? "text-signal" : "text-mute"
              }`}
            >
              {item.model3d ? (
                <span
                  aria-hidden="true"
                  className={`mx-auto inline-flex min-h-7 items-center gap-1 rounded-full border px-2 text-[10px] font-black ${
                    index === active ? "border-signal text-signal" : "border-hairline text-mute"
                  }`}
                >
                  <Box size={13} />
                  3D
                </span>
              ) : item.mannequin ? (
                <span
                  aria-hidden="true"
                  className={`mx-auto inline-flex min-h-7 items-center gap-1 rounded-full border px-2 text-[10px] font-black ${
                    index === active ? "border-signal text-signal" : "border-hairline text-mute"
                  }`}
                >
                  <UserRound size={13} />
                  مانکن
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className={`mx-auto block h-1.5 rounded-full ${index === active ? "w-6 bg-signal" : "w-3 bg-hairline"}`}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
