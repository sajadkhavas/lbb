import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Shell } from "@/components/lbb/ui/primitives";

import { RACK_MODELS, type RackProduct } from "@/lib/rack-products";

function RackSceneFallback({ onSettled }: { onSettled: () => void }) {
  useEffect(() => {
    onSettled();
  }, [onSettled]);
  return <></>;
}

const RackScene = lazy(() =>
  import("./CollectionRackScene")
    .then(({ default: Scene }) => ({ default: Scene }))
    .catch(() => ({ default: RackSceneFallback })),
);

export function CollectionRack({ products }: { products: RackProduct[] }) {
  const host = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const hasProducts = products.length > 0;
  const models = useMemo(() => products.map(({ slug }) => RACK_MODELS[slug]), [products]);
  const productKey = products.map(({ slug }) => slug).join("|");
  const loading = started && settledKey !== productKey;
  const finishLoading = useCallback(() => setSettledKey(productKey), [productKey]);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(finishLoading, 20000);
    return () => window.clearTimeout(timer);
  }, [finishLoading, loading]);

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
              <RackScene
                key={productKey}
                models={models}
                active={active}
                visible={visible}
                onSettled={finishLoading}
              />
            </Suspense>
          )}
          <div
            aria-hidden={!loading}
            className={`pointer-events-none absolute inset-0 z-20 grid place-items-center bg-obsidian transition-opacity duration-300 motion-reduce:transition-none ${loading ? "opacity-100" : "opacity-0"}`}
          >
            {started && (
              <div className="grid justify-items-center gap-4">
                <img
                  src="/favicon.png"
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div
                  aria-hidden="true"
                  className="h-0.5 w-12 overflow-hidden rounded-full bg-carbon"
                >
                  <span className="block h-full w-full bg-signal motion-safe:animate-pulse" />
                </div>
                {loading && (
                  <span role="status" className="sr-only">
                    در حال بارگیری رگال
                  </span>
                )}
              </div>
            )}
          </div>
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
