import { Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpLeft } from "lucide-react";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";
import { BRAND_COPY } from "@/lib/brand";
import { CATEGORIES } from "@/lib/categories";
import { ACTIVE_HOME_CATEGORY_ORDER } from "@/lib/homepage";
import { productImage } from "@/lib/product-images";
import { fmtToman, productBySlug } from "@/lib/products";

export function HeroNarrative() {
  const heroProduct = productBySlug("lbb-signature-tee");

  return (
    <section
      dir="rtl"
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden bg-obsidian pt-[var(--lbb-nav-h)] text-bone"
    >
      <div aria-hidden="true" className="absolute inset-0 grid-marks opacity-55" />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-signal/10 blur-3xl"
      />

      <div className="relative grid min-h-[calc(100svh-var(--lbb-nav-h))] lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
        <div className="order-2 flex min-w-0 flex-col justify-between border-t border-hairline px-[var(--lbb-gutter)] py-10 lg:order-1 lg:border-l lg:border-t-0 lg:py-12 xl:py-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <TechLabel tone="signal">{BRAND_COPY.heroEyebrow}</TechLabel>
              <span aria-hidden="true" className="h-px w-10 bg-hairline" />
              <TechLabel>URBAN CLOTHING</TechLabel>
            </div>

            <h1 id="home-hero-title" className="mt-7 max-w-[12ch] text-hero leading-[0.9]">
              <span className="block text-bone">استایل روزمره،</span>
              <span className="block text-signal">از مهستان</span>
              <span className="block text-metal">کرج.</span>
            </h1>

            <p className="mt-7 max-w-[58ch] text-lede">{BRAND_COPY.heroBody}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop" className={CtaClasses("signal", "lg")}>
                {BRAND_COPY.primaryCta}
                <ArrowUpLeft size={17} aria-hidden="true" />
              </Link>
              <Link to="/contact" className={CtaClasses("line", "lg")}>
                {BRAND_COPY.secondaryCta}
              </Link>
            </div>

            <p className="mt-4 max-w-[55ch] text-xs leading-6 text-mute">
              قیمت، رنگ، سایزهای موجود و تن‌خور هر محصول را قبل از انتخاب بررسی کن.
            </p>
          </div>

          <div className="mt-10 border-t border-hairline pt-6">
            <p className="mb-4 text-xs font-bold text-metal">دسته موردنظرت را سریع پیدا کن:</p>
            <nav aria-label="دسترسی سریع به دسته‌های محصول" className="min-w-0">
              <ul className="flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ACTIVE_HOME_CATEGORY_ORDER.map((slug) => (
                  <li key={slug} className="shrink-0 snap-start">
                    <Link
                      to="/$category"
                      params={{ category: slug }}
                      className="inline-flex min-h-11 items-center border border-hairline px-4 text-xs font-semibold text-bone transition-colors hover:border-signal hover:text-signal"
                    >
                      {CATEGORIES[slug].nameFaPlural}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="relative order-1 min-h-[58svh] overflow-hidden bg-[#f3f1ec] lg:order-2 lg:min-h-full">
          <img
            src={productImage("lbb-signature-tee")}
            alt="تیشرت مشکی ال‌بی‌بی روی زمینه روشن"
            width={1200}
            height={1500}
            sizes="(max-width: 1023px) 100vw, 48vw"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain p-8 sm:p-12 lg:p-16"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent lg:bg-gradient-to-r lg:from-obsidian/65 lg:via-transparent"
          />
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-bone/30" />

          {heroProduct ? (
            <Link
              to="/product/$slug"
              params={{ slug: heroProduct.slug }}
              className="group absolute bottom-5 right-5 grid w-[min(360px,calc(100%-2.5rem))] grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-hairline-strong bg-obsidian/95 p-2 text-bone shadow-overlay backdrop-blur md:bottom-8 md:right-8"
            >
              <img
                src={productImage(heroProduct.slug)}
                alt=""
                width={64}
                height={80}
                loading="eager"
                decoding="async"
                className="h-20 w-16 rounded-xl object-cover"
              />
              <span className="min-w-0">
                <TechLabel tone="signal">HERO PIECE</TechLabel>
                <span className="mt-1 block truncate text-sm font-black">{heroProduct.name}</span>
                <span className="num mt-1 block text-xs text-metal">
                  {fmtToman(heroProduct.price)}
                </span>
              </span>
              <ArrowUpLeft
                size={18}
                aria-hidden="true"
                className="text-mute transition-colors group-hover:text-signal"
              />
            </Link>
          ) : null}

          <a
            href="#home-categories"
            className="absolute left-5 top-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-hairline-strong bg-obsidian/85 px-3 text-xs font-bold text-bone backdrop-blur transition-colors hover:border-signal hover:text-signal md:left-8 md:top-8"
          >
            دیدن دسته‌بندی‌ها
            <ArrowDownLeft size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
