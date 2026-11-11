import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { CtaClasses, Shell } from "@/components/lbb/ui/primitives";
import type { BackendCatalogCard } from "@/lib/backend-storefront";
import { fmtToman } from "@/lib/products";
import { getProductMannequinModel3d, type ProductMannequinModel3dDto } from "@/lib/product-3d-api";

type RackModel = ProductMannequinModel3dDto & { garment?: "tee" | "trousers" };

const RACK_MODELS: Readonly<Record<string, RackModel>> = {
  "dupu-boxy-distressed-tshirt-charcoal": {
    url: "/models/collection-rack/lbb-dupu-boxy-charcoal-web.glb",
    format: "glb",
    bytes: 1403456,
    garment: "tee",
  },
  "shloar-gyn-prynty-acne-studios": {
    url: "/models/collection-rack/lbb-nature-printed-denim-web.glb",
    format: "glb",
    bytes: 1798828,
    garment: "trousers",
  },
};

const RackScene = lazy(() =>
  import("./CollectionRackScene").catch(() => ({ default: () => <></> })),
);
const PAGE_SIZE = 5;
const MAX_PAGE_BYTES = 5 * 1024 * 1024;

export function CollectionRack({ products }: { products: BackendCatalogCard[] }) {
  const host = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState(0);
  const [modelPage, setModelPage] = useState<{
    key: string;
    models: RackModel[];
  } | null>(null);
  const [selection, setSelection] = useState(0);
  const prepared = products.filter(({ slug }) => Object.hasOwn(RACK_MODELS, slug));
  const remaining = products.filter(({ slug }) => !Object.hasOwn(RACK_MODELS, slug));
  const preparedPages = prepared.length > 0 ? 1 : 0;
  const pageCount = preparedPages + Math.ceil(remaining.length / PAGE_SIZE);
  const pageIndex = Math.min(page, Math.max(0, pageCount - 1));
  const offset = (pageIndex - preparedPages) * PAGE_SIZE;
  const garments =
    preparedPages && pageIndex === 0 ? prepared : remaining.slice(offset, offset + PAGE_SIZE);
  const active = Math.min(selection, garments.length - 1);
  const selected = garments[active];
  const productKey = garments.map(({ slug }) => slug).join("|");
  const hasProducts = Boolean(selected);

  useEffect(() => {
    const element = host.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
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

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (!started || !productKey || connection?.saveData) return;

    let cancelled = false;
    const slugs = productKey.split("|");
    void Promise.all(
      slugs.map((slug) =>
        Object.hasOwn(RACK_MODELS, slug) ? RACK_MODELS[slug] : getProductMannequinModel3d(slug),
      ),
    ).then((results) => {
      if (cancelled) return;
      const models = results.filter((model) => model !== null);
      if (
        models.length === slugs.length &&
        models.reduce((total, model) => total + model.bytes, 0) <= MAX_PAGE_BYTES
      ) {
        setModelPage({ key: productKey, models });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [started, productKey]);

  if (!selected) return null;

  const movePage = (step: number) => {
    setPage(pageIndex + step);
    setSelection(0);
  };

  return (
    <section
      dir="rtl"
      aria-labelledby="collection-rack-title"
      className="border-t border-hairline py-10"
    >
      <Shell>
        <h2 id="collection-rack-title" className="mb-5 text-2xl font-black text-bone md:text-4xl">
          رگال کالکشن
        </h2>
        <div className="overflow-hidden rounded-2xl border border-hairline bg-carbon">
          <div
            ref={host}
            className="relative isolate aspect-[5/4] min-h-56 max-h-[32rem] bg-[#dedbd3] sm:aspect-[2/1]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[4%] top-[12%] h-2 rounded-full bg-gradient-to-b from-[#737371] to-[#292929] shadow-lg"
            />
            <div
              dir="ltr"
              className="absolute inset-x-[7%] top-[12%] flex h-[77%] items-start justify-center"
            >
              {garments.map((product, index) => (
                <div
                  key={product.slug}
                  className="flex h-full min-w-0 flex-1 flex-col items-center pt-2"
                >
                  <span aria-hidden="true" className="h-[10%] w-px bg-[#353535]" />
                  {product.primaryImage && (
                    <img
                      src={product.primaryImage}
                      alt=""
                      width={160}
                      height={200}
                      loading="lazy"
                      decoding="async"
                      className={`h-[86%] w-full object-contain object-top mix-blend-multiply transition-transform duration-300 motion-reduce:transition-none ${index === active ? "" : "scale-x-75"}`}
                    />
                  )}
                </div>
              ))}
            </div>
            {modelPage?.key === productKey && (
              <Suspense fallback={null}>
                <RackScene
                  key={productKey}
                  models={modelPage.models}
                  active={active}
                  visible={visible}
                />
              </Suspense>
            )}
            <div dir="ltr" className="absolute inset-x-[7%] top-[12%] z-10 flex h-[77%]">
              {garments.map((product, index) => (
                <button
                  key={product.slug}
                  ref={(node) => {
                    buttons.current[index] = node;
                  }}
                  type="button"
                  aria-label={product.name}
                  aria-pressed={active === index}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse" && event.buttons === 0) setSelection(index);
                  }}
                  onFocus={() => setSelection(index)}
                  onClick={() => setSelection(index)}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                    event.preventDefault();
                    const next = Math.max(
                      0,
                      Math.min(garments.length - 1, index + (event.key === "ArrowRight" ? 1 : -1)),
                    );
                    buttons.current[next]?.focus();
                  }}
                  className="min-w-0 flex-1 touch-pan-y rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div aria-live="polite">
              <p className="font-bold text-bone">{selected.name}</p>
              {selected.priceFromToman != null && (
                <p className="mt-1 text-sm text-metal">{fmtToman(selected.priceFromToman)}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {pageCount > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="صفحهٔ قبلی رگال"
                    disabled={pageIndex === 0}
                    onClick={() => movePage(-1)}
                    className={CtaClasses("line", "sm")}
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="صفحهٔ بعدی رگال"
                    disabled={pageIndex + 1 >= pageCount}
                    onClick={() => movePage(1)}
                    className={CtaClasses("line", "sm")}
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                </>
              )}
              <Link
                to="/product/$slug"
                params={{ slug: selected.slug }}
                className={CtaClasses("signal", "sm")}
              >
                مشاهده محصول <ArrowUpLeft size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
