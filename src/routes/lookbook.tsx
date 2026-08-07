import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CATEGORIES } from "@/lib/categories";
import { LOOKBOOK_SCENES, getLookbookSceneView } from "@/lib/editorial-commerce";
import { heroMain } from "@/lib/product-images";
import {
  Band,
  CtaClasses,
  SectionHead,
  Shell,
  StatePanel,
  StatusTag,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "لوک‌بوک LBB | داستان‌های تصویری و مسیرهای مرتبط";
const DESC =
  "لوک‌بوک LBB را ببینید؛ داستان‌های تصویری با مسیرهای مرتبط به کالکشن، دسته و در صورت انتشار عمومی، صفحه محصول.";
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/lookbook", image: heroMain }),
    links: canonical("/lookbook"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "لوک‌بوک", path: "/lookbook" },
          ]),
        ),
      },
    ],
  }),
  component: LookbookPage,
});

function LookbookPage() {
  const sceneViews = useMemo(() => LOOKBOOK_SCENES.map(getLookbookSceneView), []);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const activeScene = activeIndex === null ? null : sceneViews[activeIndex];
  const directProductLinkCount = sceneViews.reduce(
    (total, scene) => total + scene.publicProducts.length,
    0,
  );
  const isLightboxOpen = activeIndex !== null;

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveIndex(null);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % sceneViews.length,
        );
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + sceneViews.length) % sceneViews.length,
        );
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => !element.hasAttribute("disabled") && element.getClientRects().length > 0);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      requestAnimationFrame(() => openerRef.current?.focus());
    };
  }, [isLightboxOpen, sceneViews.length]);

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + sceneViews.length) % sceneViews.length,
    );
  };
  const showNext = () => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % sceneViews.length,
    );
  };

  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16" data-f17-route="lookbook">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "لوک‌بوک" }]} />
        </Shell>

        <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
          <Shell>
            <TechLabel tone="signal">LBB / VISUAL STORIES</TechLabel>
            <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">
              لوک‌بوک؛ تصویر را ببین، مسیر مرتبط را پیدا کن
            </h1>
            <p className="text-lede mt-5 max-w-[60ch]">
              هر قاب یک داستان تصویری است. ارتباط با کالکشن یا دسته همیشه روشن می‌ماند و لینک مستقیم
              محصول فقط وقتی نمایش داده می‌شود که همان محصول برای انتشار عمومی آماده باشد.
            </p>

            {directProductLinkCount === 0 ? (
              <StatePanel className="mt-7 max-w-[720px]" title="این لوک‌بوک فعلاً لینک مستقیم محصول ندارد">
                مسیرهای کالکشن و دسته برای ادامه کشف فعال‌اند؛ هیچ نقطه خریدی روی محصول منتشرنشده ساخته نمی‌شود.
              </StatePanel>
            ) : null}
          </Shell>
        </Band>

        <Band>
          <Shell>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:auto-rows-fr md:gap-3">
              {sceneViews.map((scene, index) => {
                const category = scene.categorySlug ? CATEGORIES[scene.categorySlug] : undefined;
                return (
                  <article
                    key={scene.id}
                    className={`min-w-0 overflow-hidden rounded-2xl border border-hairline bg-carbon ${scene.className}`}
                    data-f17-lookbook-scene={scene.id}
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        openerRef.current = event.currentTarget;
                        setActiveIndex(index);
                      }}
                      className="group relative block w-full overflow-hidden text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal"
                      style={{ aspectRatio: scene.ratio }}
                      aria-haspopup="dialog"
                      aria-label={`باز کردن تصویر: ${scene.alt}`}
                      data-testid={`lookbook-scene-${index}`}
                    >
                      <img
                        src={scene.src}
                        alt={scene.alt}
                        width={scene.className.includes("col-span-2") ? 1200 : 720}
                        height={scene.ratio.startsWith("16") ? 750 : 960}
                        loading={index < 2 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        decoding={index === 0 ? "sync" : "async"}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-lbb)] group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-transparent" />
                      <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-3">
                        <TechLabel tone="bone">{scene.label}</TechLabel>
                        <StatusTag tone={scene.publicProducts.length > 0 ? "signal" : "neutral"} className="rounded-lg backdrop-blur">
                          {scene.publicProducts.length > 0
                            ? "PRODUCT LINK"
                            : scene.collection
                              ? "COLLECTION PATH"
                              : "EDITORIAL"}
                        </StatusTag>
                      </div>
                    </button>

                    <div className="flex flex-wrap gap-2 p-3 md:p-4">
                      {scene.publicProducts.map((reference) => (
                        <Link
                          key={reference.slug}
                          to="/product/$slug"
                          params={{ slug: reference.slug }}
                          className={CtaClasses("signal", "sm")}
                          data-f17-lookbook-product-link={reference.slug}
                        >
                          مشاهده محصول
                        </Link>
                      ))}
                      {scene.collection ? (
                        <Link
                          to="/collections/$slug"
                          params={{ slug: scene.collection.slug }}
                          className={CtaClasses("line", "sm")}
                        >
                          {scene.collection.nameFa}
                        </Link>
                      ) : null}
                      {category ? (
                        <Link
                          to="/$category"
                          params={{ category: category.slug }}
                          className={CtaClasses("line", "sm")}
                        >
                          {category.nameFaPlural}
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </Shell>
        </Band>

        <Band>
          <Shell className="grid gap-6 rounded-2xl border border-hairline bg-carbon p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <SectionHead
              index="KEEP EXPLORING"
              label="EDITORIAL → COMMERCE"
              title="از تصویر به مسیر بعدی برو"
              lede="اگر یک قاب لینک مستقیم محصول نداشته باشد، کالکشن، دسته یا فروشگاه همچنان مسیر روشن بعدی هستند."
            />
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/collections" className={CtaClasses("line")}>
                کالکشن‌ها
              </Link>
              <Link to="/shop" search={{}} className={CtaClasses("signal")}>
                فروشگاه
              </Link>
            </div>
          </Shell>
        </Band>
      </main>

      {activeScene ? (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[300] grid place-items-center overflow-y-auto bg-obsidian/95 p-3 backdrop-blur-sm md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lookbook-dialog-title"
          aria-describedby="lookbook-dialog-description"
          data-f17-lookbook-dialog="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <h2 id="lookbook-dialog-title" className="sr-only">
            {activeScene.alt}
          </h2>
          <p id="lookbook-dialog-description" className="sr-only">
            برای جابه‌جایی بین تصاویر از کلیدهای جهت‌دار استفاده کنید و برای بستن Escape را بزنید.
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="بستن تصویر"
            onClick={() => setActiveIndex(null)}
            className="tap-target absolute inset-inline-end-3 top-3 z-20 grid place-items-center rounded-full border border-bone/20 bg-obsidian/90 text-bone transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:inset-inline-end-6 md:top-6"
          >
            <X size={24} aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="تصویر قبلی"
            onClick={showPrevious}
            className="tap-target fixed inset-inline-start-3 top-1/2 z-20 grid -translate-y-1/2 place-items-center rounded-full border border-bone/20 bg-obsidian/90 text-bone transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:inset-inline-start-6"
          >
            <ChevronRight size={26} aria-hidden="true" />
          </button>

          <figure className="my-auto flex max-w-[min(92vw,1100px)] flex-col items-center gap-4 py-14">
            <img
              src={activeScene.src}
              alt={activeScene.alt}
              width={1400}
              height={1750}
              loading="eager"
              decoding="sync"
              className="max-h-[72vh] max-w-full rounded-xl object-contain"
            />
            <figcaption className="w-full max-w-[760px] rounded-xl border border-hairline bg-carbon p-4 text-center md:p-5">
              <TechLabel tone="signal">{activeScene.label}</TechLabel>
              <p className="mt-2 text-xs leading-6 text-metal">{activeScene.alt}</p>
              <nav aria-label="مسیرهای مرتبط این تصویر" className="mt-4 flex flex-wrap justify-center gap-2">
                {activeScene.publicProducts.map((reference) => (
                  <Link
                    key={reference.slug}
                    to="/product/$slug"
                    params={{ slug: reference.slug }}
                    className={CtaClasses("signal", "sm")}
                    onClick={() => setActiveIndex(null)}
                  >
                    مشاهده محصول
                  </Link>
                ))}
                {activeScene.collection ? (
                  <Link
                    to="/collections/$slug"
                    params={{ slug: activeScene.collection.slug }}
                    className={CtaClasses("line", "sm")}
                    onClick={() => setActiveIndex(null)}
                  >
                    مشاهده کالکشن
                  </Link>
                ) : null}
                {activeScene.categorySlug ? (
                  <Link
                    to="/$category"
                    params={{ category: activeScene.categorySlug }}
                    className={CtaClasses("line", "sm")}
                    onClick={() => setActiveIndex(null)}
                  >
                    {CATEGORIES[activeScene.categorySlug].nameFaPlural}
                  </Link>
                ) : null}
              </nav>
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="تصویر بعدی"
            onClick={showNext}
            className="tap-target fixed inset-inline-end-3 top-1/2 z-20 grid -translate-y-1/2 place-items-center rounded-full border border-bone/20 bg-obsidian/90 text-bone transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:inset-inline-end-6"
          >
            <ChevronLeft size={26} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
