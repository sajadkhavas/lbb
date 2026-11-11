import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Shell } from "@/components/lbb/ui/primitives";

import { RACK_MODELS, type RackProduct } from "@/lib/rack-products";

const RackScene = lazy(() =>
  import("./CollectionRackScene").catch(() => ({ default: () => <></> })),
);

export function CollectionRack({ products }: { products: RackProduct[] }) {
  const host = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const hasProducts = products.length > 0;
  const models = useMemo(() => products.map(({ slug }) => RACK_MODELS[slug]), [products]);
  const productKey = products.map(({ slug }) => slug).join("|");

  useEffect(() => {
    const element = host.current;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (!element || connection?.saveData || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasProducts]);

  if (!hasProducts) return null;

  return (
    <section aria-label="رگال ال‌بی‌بی">
      <Shell>
        <div
          id="lbb-home-rack"
          ref={host}
          dir="ltr"
          className="relative isolate aspect-[5/4] w-full overflow-hidden bg-obsidian sm:aspect-[2/1] sm:max-h-[32rem]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[4%] top-[12%] h-1.5 rounded-full bg-gradient-to-b from-[#777] to-[#323232]"
          />
          <div aria-hidden="true" className="absolute inset-x-[7%] top-[12%] flex h-[77%]">
            {products.map(({ slug, image }, index) => (
              <div key={slug} className="flex h-full min-w-0 flex-1 flex-col items-center pt-2">
                <span className="h-[10%] w-px bg-[#737373]" />
                {image && (
                  <img
                    src={image}
                    alt=""
                    width={160}
                    height={200}
                    loading="lazy"
                    decoding="async"
                    className={`h-[80%] w-[72%] object-contain object-top transition-transform duration-300 motion-reduce:transition-none ${index === active ? "" : "scale-x-75"}`}
                  />
                )}
              </div>
            ))}
          </div>
          {started && (
            <Suspense fallback={null}>
              <RackScene key={productKey} models={models} active={active} visible={visible} />
            </Suspense>
          )}
          <div className="absolute inset-x-[7%] top-[12%] z-10 flex h-[77%]">
            {products.map(({ slug, name }, index) => (
              <Link
                key={slug}
                to="/product/$slug"
                params={{ slug }}
                aria-label={name}
                draggable={false}
                onFocus={() => setActive(index)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse" && event.buttons === 0) setActive(index);
                }}
                onPointerDown={(event) => {
                  pointer.current = { x: event.clientX, y: event.clientY };
                  setActive(index);
                }}
                onClick={(event) => {
                  const start = pointer.current;
                  pointer.current = null;
                  if (
                    event.detail > 0 &&
                    start &&
                    Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8
                  ) {
                    event.preventDefault();
                  }
                }}
                className="min-w-0 flex-1 touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal"
              />
            ))}
          </div>
        </div>
      </Shell>
    </section>
  );
}
