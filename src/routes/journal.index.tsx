import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpLeft, Clock3 } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import { heroMain, lifestyle1, lifestyle2 } from "@/lib/product-images";
import {
  Band,
  CtaClasses,
  Frame,
  SectionHead,
  Shell,
  StatusTag,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { absUrl, breadcrumbLd, canonical, pageMeta } from "@/lib/site";
import { resolveStorefrontJournal, type StorefrontJournalDto } from "@/lib/storefront-control";

const TITLE = "ژورنال LBB | راهنمای استایل، پارچه و نگهداری";
const DESC =
  "ژورنال LBB: راهنماهای کاربردی درباره استایل، ترکیب رنگ، شناخت پارچه و نگهداری، همراه با مسیرهای مرتبط به کالکشن و دسته‌های فروشگاه.";

const COVERS = { hero: heroMain, l1: lifestyle1, l2: lifestyle2 };

export const Route = createFileRoute("/journal/")({
  loader: () => resolveStorefrontJournal(),
  head: ({ loaderData }) => {
    const indexArticles = loaderData ?? JOURNAL_ARTICLES;
    const itemListLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "ژورنال LBB",
      numberOfItems: indexArticles.length,
      itemListElement: indexArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        url: absUrl(`/journal/${article.slug}`),
      })),
    };

    return {
      meta: pageMeta({ title: TITLE, description: DESC, path: "/journal", image: heroMain }),
      links: canonical("/journal"),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: "ژورنال", path: "/journal" },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(itemListLd) },
      ],
    };
  },
  component: JournalIndexPage,
});

function JournalIndexPage() {
  const liveArticles = Route.useLoaderData();
  return liveArticles ? (
    <LiveJournalIndexPage articles={liveArticles} />
  ) : (
    <PrototypeJournalIndexPage />
  );
}

function LiveJournalIndexPage({ articles }: { articles: StorefrontJournalDto[] }) {
  return (
    <>
      <Navbar theme="light" />
      <main
        className="min-h-screen bg-obsidian pb-bottombar pt-16"
        data-f17-route="journal"
        data-storefront-source="live"
      >
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ژورنال" }]} />
        </Shell>
        <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
          <Shell>
            <TechLabel tone="signal">LBB / EDITORIAL NOTES</TechLabel>
            <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">
              ژورنال؛ راهنماها و یادداشت‌های منتشرشده LBB
            </h1>
            <p className="text-lede mt-5 max-w-[62ch]">
              فهرست این صفحه مستقیماً از محتوای منتشرشده در Backend می‌آید.
            </p>
          </Shell>
        </Band>
        <Band>
          <Shell>
            {articles.length === 0 ? (
              <div className="rounded-2xl border border-hairline bg-carbon p-8 text-center text-metal">
                هنوز مقاله‌ای منتشر نشده است.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {articles.map((article, index) => (
                  <article
                    key={article.publicId || article.slug}
                    className="overflow-hidden rounded-2xl border border-hairline bg-carbon"
                  >
                    {article.coverUrl ? (
                      <img
                        src={article.coverUrl}
                        alt=""
                        width={960}
                        height={640}
                        loading={index < 2 ? "eager" : "lazy"}
                        className="aspect-[3/2] w-full object-cover"
                      />
                    ) : null}
                    <div className="p-6">
                      <TechLabel tone="signal">{article.category ?? "JOURNAL"}</TechLabel>
                      <h2 className="mt-3 text-display-3 text-bone">{article.title}</h2>
                      {article.excerpt ? (
                        <p className="mt-3 text-sm leading-8 text-metal">{article.excerpt}</p>
                      ) : null}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        {article.publishedAt ? (
                          <time dateTime={article.publishedAt} className="text-xs text-mute">
                            {new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(
                              new Date(article.publishedAt),
                            )}
                          </time>
                        ) : (
                          <span />
                        )}
                        <Link
                          to="/journal/$slug"
                          params={{ slug: article.slug }}
                          className={CtaClasses("line", "sm")}
                        >
                          خواندن مقاله <ArrowUpLeft size={15} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}

function PrototypeJournalIndexPage() {
  const [featured, ...articles] = JOURNAL_ARTICLES;

  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16" data-f17-route="journal">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ژورنال" }]} />
        </Shell>

        <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
          <Shell>
            <TechLabel tone="signal">LBB / EDITORIAL NOTES</TechLabel>
            <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">
              ژورنال؛ بخوان، زمینه را بفهم، مسیر مرتبط را پیدا کن
            </h1>
            <p className="text-lede mt-5 max-w-[62ch]">
              مقاله‌های کوتاه درباره فیت، رنگ، پارچه و نگهداری. هر مقاله ابتدا یک محتوای ادیتوریال
              مستقل است و فقط در صورت ارتباط واقعی به کالکشن، دسته یا محصول عمومی وصل می‌شود.
            </p>
          </Shell>
        </Band>

        {featured ? (
          <Band>
            <Shell>
              <Link
                to="/journal/$slug"
                params={{ slug: featured.slug }}
                className="group grid overflow-hidden rounded-2xl border border-hairline bg-carbon transition-transform duration-300 ease-[var(--ease-lbb)] hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal lg:grid-cols-[1.15fr_0.85fr]"
              >
                <Frame
                  src={COVERS[featured.cover]}
                  alt={featured.coverAlt}
                  ratio="16/10"
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="lg:rounded-s-2xl"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusTag tone="signal" className="rounded-lg">
                      مقاله منتخب
                    </StatusTag>
                    <TechLabel>{featured.category}</TechLabel>
                  </div>
                  <h2 className="mt-5 text-display-2 text-bone">{featured.title}</h2>
                  <p className="mt-4 text-sm leading-8 text-metal">{featured.excerpt}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-mute">
                    <time dateTime={featured.isoDate}>{featured.date}</time>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 aria-hidden="true" size={14} />
                      {featured.readingTime} مطالعه
                    </span>
                  </div>
                  <span className="tech mt-7 inline-flex items-center gap-2 text-bone transition-colors group-hover:text-signal">
                    خواندن مقاله
                    <ArrowUpLeft aria-hidden="true" size={15} />
                  </span>
                </div>
              </Link>
            </Shell>
          </Band>
        ) : null}

        <Band>
          <Shell>
            <SectionHead
              index="ALL STORIES"
              label="GUIDES & NOTES"
              title="همه مقاله‌ها"
              lede="موضوع، تاریخ ثبت‌شده و زمان تقریبی مطالعه پیش از ورود به هر مقاله مشخص است."
            />

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {articles.map((article) => (
                <article key={article.slug}>
                  <Link
                    to="/journal/$slug"
                    params={{ slug: article.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-carbon transition-transform duration-300 ease-[var(--ease-lbb)] hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    <Frame
                      src={COVERS[article.cover]}
                      alt={article.coverAlt}
                      ratio="16/9"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="rounded-t-2xl"
                      imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <TechLabel tone="signal">{article.category}</TechLabel>
                        <div className="flex items-center gap-3 text-[11px] text-mute">
                          <time dateTime={article.isoDate}>{article.date}</time>
                          <span>{article.readingTime}</span>
                        </div>
                      </div>
                      <h2 className="mt-4 text-display-3 text-bone">{article.title}</h2>
                      <p className="mt-3 flex-1 text-sm leading-7 text-metal">{article.excerpt}</p>
                      <span className="tech mt-6 inline-flex items-center gap-2 text-bone transition-colors group-hover:text-signal">
                        ادامه مطلب
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
          <Shell className="grid gap-6 rounded-2xl border border-hairline bg-carbon p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <TechLabel tone="signal">CONTINUE DISCOVERY</TechLabel>
              <h2 className="mt-3 text-display-3 text-bone">مطلب را به مسیر کشف بعدی وصل کن</h2>
              <p className="mt-3 max-w-[58ch] text-sm leading-7 text-metal">
                برای دیدن روایت‌های تصویری به لوک‌بوک برو، کالکشن‌ها را مرور کن یا مستقیماً سراغ
                دسته‌های فروشگاه برو.
              </p>
            </div>
            <nav aria-label="مسیرهای بعدی ژورنال" className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/lookbook" className={CtaClasses("line")}>
                لوک‌بوک
              </Link>
              <Link to="/collections" className={CtaClasses("line")}>
                کالکشن‌ها
              </Link>
              <Link to="/shop" search={{}} className={CtaClasses("signal")}>
                فروشگاه
              </Link>
            </nav>
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
