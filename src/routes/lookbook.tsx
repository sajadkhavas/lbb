import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { lifestyle1, lifestyle2, heroMain, productImage } from "@/lib/product-images";
import { Band, CtaClasses, SectionHead, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";
import { EMPTY_FILTERS } from "@/lib/product-filter";

const TITLE = "لوک‌بوک LBB | ایده‌های استایل با محصولات موجود";
const DESC =
  "لوک‌بوک LBB را ببینید؛ ترکیب‌های تصویری با هودی، تیشرت، شلوار، کتونی و جوراب‌های موجود در کاتالوگ.";

type Shot = {
  src: string;
  alt: string;
  label: string;
  className: string;
  ratio: string;
};

const SHOTS: Shot[] = [
  {
    src: heroMain,
    alt: "استایل تمام‌مشکی با هودی اورسایز و شلوار آزاد زیر نور قرمز",
    label: "LOOK 01 / NIGHT LAYER",
    className: "col-span-2 md:col-span-2 md:row-span-2",
    ratio: "4 / 5",
  },
  {
    src: lifestyle1,
    alt: "دو استایل خیابانی با هودی‌های اورسایز در فضای شبانه",
    label: "LOOK 02 / DOUBLE VOLUME",
    className: "",
    ratio: "3 / 4",
  },
  {
    src: productImage("oversized-black-hoodie"),
    alt: "هودی اورسایز مشکی LBB با چاپ گرافیکی پشت",
    label: "PIECE / BLACK HOODIE",
    className: "",
    ratio: "3 / 4",
  },
  {
    src: lifestyle2,
    alt: "چیدمان تخت هودی، شلوار و کتونی روی سطح بتنی",
    label: "LOOK 03 / FLAT LAY",
    className: "col-span-2 md:col-span-2",
    ratio: "16 / 10",
  },
  {
    src: productImage("cargo-street-pants"),
    alt: "شلوار کارگو استریت مشکی با جیب‌های جانبی",
    label: "PIECE / CARGO",
    className: "",
    ratio: "3 / 4",
  },
  {
    src: productImage("urban-runner-sneaker"),
    alt: "کتونی اربن رانر سفید با جزئیات مشکی",
    label: "PIECE / URBAN RUNNER",
    className: "",
    ratio: "3 / 4",
  },
  {
    src: productImage("denim-baggy-jean"),
    alt: "شلوار جین بگی دنیم با برش آزاد",
    label: "PIECE / BAGGY DENIM",
    className: "",
    ratio: "3 / 4",
  },
  {
    src: productImage("lbb-crew-socks"),
    alt: "جوراب ساقدار LBB با خطوط قرمز روی ساق",
    label: "PIECE / CREW SOCKS",
    className: "",
    ratio: "3 / 4",
  },
];

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeShot = activeIndex === null ? null : SHOTS[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current === null ? null : (current + 1) % SHOTS.length));
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + SHOTS.length) % SHOTS.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + SHOTS.length) % SHOTS.length,
    );
  };
  const showNext = () => {
    setActiveIndex((current) => (current === null ? null : (current + 1) % SHOTS.length));
  };

  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "لوک‌بوک" }]} />
        </Shell>

        <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
          <Shell>
            <TechLabel tone="signal">LBB / SEASONAL LOOKS</TechLabel>
            <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">
              لوک‌بوک؛ فرم، رنگ و لایه در یک قاب
            </h1>
            <p className="text-lede mt-5 max-w-[60ch]">
              این گالری با محصولات موجود در کاتالوگ ساخته شده است. برای دیدن تصویر بزرگ، هر قاب را
              باز کنید؛ برای جزئیات خرید به صفحه محصول بروید.
            </p>
          </Shell>
        </Band>

        <Band>
          <Shell>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:auto-rows-fr md:gap-3">
              {SHOTS.map((shot, index) => (
                <button
                  key={shot.label}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`group relative min-h-0 overflow-hidden rounded-2xl border border-hairline bg-carbon text-start transition-transform duration-300 ease-[var(--ease-lbb)] hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${shot.className}`}
                  style={{ aspectRatio: shot.ratio }}
                  aria-haspopup="dialog"
                  aria-label={`باز کردن تصویر: ${shot.alt}`}
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.className.includes("col-span-2") ? 1200 : 720}
                    height={shot.ratio.startsWith("16") ? 750 : 960}
                    loading={index < 2 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding={index === 0 ? "sync" : "async"}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-lbb)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
                  <TechLabel tone="bone" className="absolute inset-x-4 bottom-4">
                    {shot.label}
                  </TechLabel>
                </button>
              ))}
            </div>
          </Shell>
        </Band>

        <Band>
          <Shell className="grid gap-6 rounded-2xl border border-hairline bg-carbon p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <SectionHead
              index="BUILD THE LOOK"
              label="SHOP CURRENT PIECES"
              title="قطعه‌ها را جداگانه بررسی کنید"
              lede="لوک‌بوک برای الهام است؛ موجودی، رنگ و سایز هر محصول ممکن است متفاوت باشد و در صفحه محصول نمایش داده می‌شود."
            />
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/collections" className={CtaClasses("line")}>
                کالکشن‌ها
              </Link>
              <Link to="/shop" search={EMPTY_FILTERS} className={CtaClasses("signal")}>
                فروشگاه
              </Link>
            </div>
          </Shell>
        </Band>
      </main>

      {activeShot ? (
        <div
          className="fixed inset-0 z-[300] grid place-items-center bg-obsidian/95 p-3 backdrop-blur-sm md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lookbook-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <h2 id="lookbook-dialog-title" className="sr-only">
            {activeShot.alt}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="بستن تصویر"
            onClick={() => setActiveIndex(null)}
            className="tap-target absolute inset-inline-end-3 top-3 z-10 grid place-items-center rounded-full border border-bone/20 bg-obsidian/80 text-bone transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:inset-inline-end-6 md:top-6"
          >
            <X size={24} aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="تصویر قبلی"
            onClick={showPrevious}
            className="tap-target absolute inset-inline-start-3 top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full border border-bone/20 bg-obsidian/80 text-bone transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:inset-inline-start-6"
          >
            <ChevronRight size={26} aria-hidden="true" />
          </button>

          <figure className="flex max-h-[90vh] max-w-[min(92vw,1100px)] flex-col items-center gap-3">
            <img
              src={activeShot.src}
              alt={activeShot.alt}
              width={1400}
              height={1750}
              loading="eager"
              decoding="sync"
              className="max-h-[82vh] max-w-full rounded-xl object-contain"
            />
            <figcaption className="text-center">
              <TechLabel tone="signal">{activeShot.label}</TechLabel>
              <p className="mt-1 text-xs text-metal">{activeShot.alt}</p>
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="تصویر بعدی"
            onClick={showNext}
            className="tap-target absolute inset-inline-end-3 top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full border border-bone/20 bg-obsidian/80 text-bone transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:inset-inline-end-6"
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
