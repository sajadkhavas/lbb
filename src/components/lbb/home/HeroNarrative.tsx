import { Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpLeft } from "lucide-react";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { HOME_CATEGORY_ORDER } from "@/lib/homepage";
import { heroMain, productImage } from "@/lib/product-images";
import { PRODUCT_COUNT, fmtNum, fmtToman, productBySlug } from "@/lib/products";

export function HeroNarrative() {
  const heroProduct = productBySlug("lbb-classic-hoodie");

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
              <TechLabel tone="signal">LBB / TEHRAN / DROP 001</TechLabel>
              <span aria-hidden="true" className="h-px w-10 bg-hairline" />
              <TechLabel>STREETWEAR CATALOG</TechLabel>
            </div>

            <h1 id="home-hero-title" className="mt-7 max-w-[10ch] text-hero leading-[0.88]">
              <span className="block text-bone">تهران را</span>
              <span className="block text-signal">با فرم</span>
              <span className="block text-metal">خودت بپوش.</span>
            </h1>

            <p className="mt-7 max-w-[58ch] text-lede">
              هشت قطعه از اولین دراپ LBB؛ هودی اورسایز، شلوار بگی و کارگو، تیشرت سنگین، کتونی و جوراب. مسیر خرید از دسته تا فیت و موجودی شفاف است.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop" className={CtaClasses("signal", "lg")}>
                خرید DROP 001
                <ArrowUpLeft size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/$category"
                params={{ category: "hoodies" }}
                className={CtaClasses("line", "lg")}
              >
                دیدن هودی‌ها
              </Link>
            </div>

            <p className="mt-4 max-w-[55ch] text-xs leading-6 text-mute">
              قیمت، سایزهای ناموجود و وضعیت موجودی هر قطعه مستقیماً در صفحه محصول نمایش داده می‌شود. پرداخت و ارسال واقعی در این نسخه فعال نیست.
            </p>
          </div>

          <div className="mt-10 grid gap-6 border-t border-hairline pt-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end">
            <dl className="grid grid-cols-3 gap-5">
              <div>
                <dt className="tech text-mute">PIECES</dt>
                <dd className="num mt-1 text-xl font-black text-bone">{fmtNum(PRODUCT_COUNT)}</dd>
              </div>
              <div>
                <dt className="tech text-mute">CATEGORIES</dt>
                <dd className="num mt-1 text-xl font-black text-bone">
                  {fmtNum(CATEGORY_SLUGS.length)}
                </dd>
              </div>
              <div>
                <dt className="tech text-mute">DROP</dt>
                <dd className="num mt-1 text-xl font-black text-bone">001</dd>
              </div>
            </dl>

            <nav aria-label="دسترسی سریع به دسته‌های محصول" className="min-w-0">
              <ul className="flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {HOME_CATEGORY_ORDER.map((slug) => (
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

        <div className="relative order-1 min-h-[58svh] overflow-hidden bg-carbon lg:order-2 lg:min-h-full">
          <img
            src={heroMain}
            alt="استایل شبانه LBB از دراپ ۰۰۱ در فضای شهری"
            width={1200}
            height={1500}
            sizes="(max-width: 1023px) 100vw, 48vw"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
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
              className="group absolute bottom-5 right-5 grid w-[min(360px,calc(100%-2.5rem))] grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 border border-hairline-strong bg-obsidian/95 p-2 text-bone shadow-overlay backdrop-blur md:bottom-8 md:right-8"
            >
              <img
                src={productImage(heroProduct.slug)}
                alt=""
                width={64}
                height={80}
                loading="eager"
                decoding="async"
                className="h-20 w-16 object-cover"
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
            className="absolute left-5 top-5 inline-flex min-h-11 items-center gap-2 border border-hairline-strong bg-obsidian/85 px-3 text-xs font-bold text-bone backdrop-blur transition-colors hover:border-signal hover:text-signal md:left-8 md:top-8"
          >
            مسیر خرید
            <ArrowDownLeft size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
