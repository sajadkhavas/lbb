import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { COLLECTIONS } from "@/lib/collections";
import { productImage } from "@/lib/product-images";
import {
  Band,
  CtaClasses,
  Frame,
  SectionHead,
  Shell,
  StatusTag,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "کالکشن‌های LBB | انتخاب‌های ادیتوریال از محصولات موجود";
const DESC =
  "کالکشن‌های LBB را ببینید؛ گروه‌بندی‌های ادیتوریال از هودی، تیشرت، شلوار، کتونی و جوراب برای ساخت ست‌های هماهنگ.";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: pageMeta({
      title: TITLE,
      description: DESC,
      path: "/collections",
      image: productImage(COLLECTIONS[0].productSlugs[0]),
    }),
    links: canonical("/collections"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "کالکشن‌ها", path: "/collections" },
          ]),
        ),
      },
    ],
  }),
  component: CollectionsIndexPage,
});

function CollectionsIndexPage() {
  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "کالکشن‌ها" }]} />
        </Shell>

        <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
          <Shell>
            <TechLabel tone="signal">LBB / EDITORIAL COLLECTIONS</TechLabel>
            <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">کالکشن‌ها؛ مسیرهای آماده برای ساختن یک ست</h1>
            <p className="text-lede mt-5 max-w-[62ch]">
              هر کالکشن، محصولات واقعی فروشگاه را بر اساس رنگ، فرم و کاربرد کنار هم می‌گذارد. موجودی و سایز هر قطعه را در صفحه همان محصول بررسی کنید.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className={CtaClasses("signal")}>
                مشاهده همه محصولات
              </Link>
              <Link to="/lookbook" className={CtaClasses("line")}>
                دیدن لوک‌بوک
              </Link>
            </div>
          </Shell>
        </Band>

        <Band>
          <Shell>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {COLLECTIONS.map((collection, index) => (
                <article
                  key={collection.slug}
                  className={index === 0 ? "lg:col-span-2" : undefined}
                >
                  <Link
                    to="/collections/$slug"
                    params={{ slug: collection.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-carbon transition-transform duration-300 ease-[var(--ease-lbb)] hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    <Frame
                      src={productImage(collection.productSlugs[0])}
                      alt={`نمای محصول اصلی کالکشن ${collection.nameFa}`}
                      ratio={index === 0 ? "16/9" : "4/5"}
                      priority={index === 0}
                      sizes={index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
                      className="rounded-t-2xl"
                      imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-transparent to-transparent" />
                      <StatusTag tone="neutral" className="absolute inset-inline-end-4 top-4 rounded-lg backdrop-blur">
                        {collection.productSlugs.length.toLocaleString("fa-IR")} محصول
                      </StatusTag>
                    </Frame>

                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <TechLabel tone="signal">{collection.latinName}</TechLabel>
                      <h2 className="mt-3 text-display-3 text-bone">{collection.nameFa}</h2>
                      <p className="mt-3 text-sm leading-7 text-metal">{collection.tagline}</p>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`ویژگی‌های ${collection.nameFa}`}>
                        {collection.storyPoints.map((point) => (
                          <li key={point} className="rounded-full border border-hairline px-3 py-1.5 text-[11px] text-metal">
                            {point}
                          </li>
                        ))}
                      </ul>
                      <span className="tech mt-7 inline-flex items-center gap-2 text-bone transition-colors group-hover:text-signal">
                        مشاهده کالکشن
                        <ArrowUpLeft aria-hidden="true" size={15} />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </Shell>
        </Band>

        <Band>
          <Shell>
            <SectionHead
              index="HOW TO USE"
              label="COLLECTION NOTES"
              title="کالکشن، جایگزین صفحه محصول نیست"
              lede="کالکشن‌ها برای الهام و مقایسه ساخته شده‌اند. قیمت، موجودی، رنگ، سایز، جنس و روش نگهداری را همیشه از صفحه محصول بخوانید."
              action={
                <Link to="/journal" className="tech text-bone transition-colors hover:text-signal">
                  راهنماهای ژورنال ←
                </Link>
              }
            />
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
