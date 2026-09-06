import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowUpLeft, BookOpenText, Clock3 } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { EditorialCommerceBridge } from "@/components/lbb/editorial/EditorialCommerceBridge";
import { journalBySlug, JOURNAL_ARTICLES, type JournalArticle } from "@/lib/journal";
import { getJournalCommerceView } from "@/lib/editorial-commerce";
import { heroMain, lifestyle1, lifestyle2 } from "@/lib/product-images";
import {
  Band,
  CtaClasses,
  EmptyState,
  Frame,
  SectionHead,
  Shell,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { absAsset, absUrl, breadcrumbLd, canonical, pageMeta } from "@/lib/site";
import { BackendApiError } from "@/lib/backend-api";
import { resolveStorefrontJournalPost, type StorefrontJournalDto } from "@/lib/storefront-control";

const COVERS = { hero: heroMain, l1: lifestyle1, l2: lifestyle2 };

export const Route = createFileRoute("/journal/$slug")({
  loader: async ({ params }) => {
    try {
      const liveArticle = await resolveStorefrontJournalPost(params.slug);
      if (liveArticle) return { source: "live" as const, article: liveArticle };
    } catch (error) {
      if (error instanceof BackendApiError && error.status === 404) {
        throw notFound({ routeId: "/journal/$slug" });
      }
      throw error;
    }

    const article = journalBySlug(params.slug);
    if (!article) throw notFound({ routeId: "/journal/$slug" });
    const related = JOURNAL_ARTICLES.filter((candidate) => candidate.slug !== article.slug)
      .sort(
        (left, right) =>
          Number(right.category === article.category) - Number(left.category === article.category),
      )
      .slice(0, 2);
    return { source: "prototype" as const, article, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "مقاله پیدا نشد" }, { name: "robots", content: "noindex, nofollow" }],
      };
    }

    if (loaderData.source === "live") {
      const article = loaderData.article;
      const title = `${article.title} | ژورنال LBB`;
      const path = `/journal/${article.slug}`;
      const articleLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt ?? article.title,
        image: article.coverUrl ?? undefined,
        datePublished: article.publishedAt ?? undefined,
        articleSection: article.category ?? undefined,
        inLanguage: "fa-IR",
        mainEntityOfPage: absUrl(path),
      };
      return {
        meta: pageMeta({
          title,
          description: article.excerpt ?? article.title,
          path,
          image: article.coverUrl ?? undefined,
          type: "article",
        }),
        links: canonical(path),
        scripts: [
          {
            type: "application/ld+json",
            children: JSON.stringify(
              breadcrumbLd([
                { name: "خانه", path: "/" },
                { name: "ژورنال", path: "/journal" },
                { name: article.title, path },
              ]),
            ),
          },
          { type: "application/ld+json", children: JSON.stringify(articleLd) },
        ],
      };
    }

    const { article } = loaderData;
    const title = `${article.title} | ژورنال LBB`;
    const path = `/journal/${article.slug}`;
    const cover = COVERS[article.cover];
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      image: absAsset(cover),
      datePublished: article.isoDate,
      articleSection: article.category,
      inLanguage: "fa-IR",
      mainEntityOfPage: absUrl(path),
    };

    return {
      meta: pageMeta({
        title,
        description: article.excerpt,
        path,
        image: cover,
        type: "article",
      }),
      links: canonical(path),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: "ژورنال", path: "/journal" },
              { name: article.title, path },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(articleLd) },
      ],
    };
  },
  notFoundComponent: JournalNotFound,
  component: JournalDetailPage,
});

function JournalNotFound() {
  return (
    <>
      <Navbar theme="light" />
      <main
        className="min-h-screen bg-obsidian pb-bottombar pt-16"
        data-f17-route="journal-not-found"
      >
        <Shell className="py-3">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "ژورنال", href: "/journal" },
              { label: "پیدا نشد" },
            ]}
          />
        </Shell>
        <Band hairline={false}>
          <Shell>
            <h1 className="sr-only">این مقاله پیدا نشد</h1>
            <EmptyState
              icon={<BookOpenText aria-hidden="true" size={34} />}
              title="این مقاله پیدا نشد"
              body="آدرس مقاله معتبر نیست یا این مطلب در فهرست عمومی ژورنال قرار ندارد."
              action={
                <Link to="/journal" className={CtaClasses("signal")}>
                  بازگشت به ژورنال
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

function JournalDetailPage() {
  const data = Route.useLoaderData();
  return data.source === "live" ? (
    <LiveJournalDetailPage article={data.article} />
  ) : (
    <PrototypeJournalDetailPage article={data.article} related={data.related} />
  );
}

function liveArticleParagraphs(content: string | undefined) {
  if (!content) return [];
  return content
    .replace(/<br\s*\/?>(?=.)/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .split(/\n+/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function LiveJournalDetailPage({ article }: { article: StorefrontJournalDto }) {
  const paragraphs = liveArticleParagraphs(article.content);
  return (
    <>
      <Navbar theme="light" />
      <main
        className="min-h-screen bg-obsidian pb-bottombar pt-16"
        data-f17-route="journal-detail"
        data-storefront-source="live"
      >
        <Shell className="py-3">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "ژورنال", href: "/journal" },
              { label: article.title },
            ]}
          />
        </Shell>
        <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
          <Shell className="max-w-[980px]">
            <TechLabel tone="signal">{article.category ?? "JOURNAL"}</TechLabel>
            <h1 className="mt-5 max-w-[18ch] text-display-1 text-bone">{article.title}</h1>
            {article.excerpt ? (
              <p className="text-lede mt-5 max-w-[62ch]">{article.excerpt}</p>
            ) : null}
            {article.publishedAt ? (
              <time dateTime={article.publishedAt} className="mt-6 block text-xs text-mute">
                {new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(
                  new Date(article.publishedAt),
                )}
              </time>
            ) : null}
          </Shell>
        </Band>
        {article.coverUrl ? (
          <Band>
            <Shell className="max-w-[1180px]">
              <img
                src={article.coverUrl}
                alt=""
                width={1600}
                height={900}
                className="aspect-[16/9] w-full rounded-2xl border border-hairline object-cover"
              />
            </Shell>
          </Band>
        ) : null}
        <Band>
          <Shell className="max-w-[760px]">
            <article className="space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${index}-${paragraph.slice(0, 24)}`}
                  className="text-[15px] leading-9 text-metal"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}

function PrototypeJournalDetailPage({
  article,
  related,
}: {
  article: JournalArticle;
  related: JournalArticle[];
}) {
  const commerce = getJournalCommerceView(article);

  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16" data-f17-route="journal-detail">
        <Shell className="py-3">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "ژورنال", href: "/journal" },
              { label: article.title },
            ]}
          />
        </Shell>

        <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
          <Shell className="max-w-[980px]">
            <TechLabel tone="signal">{article.category}</TechLabel>
            <h1 className="mt-5 max-w-[18ch] text-display-1 text-bone">{article.title}</h1>
            <p className="text-lede mt-5 max-w-[62ch]">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-mute">
              <time dateTime={article.isoDate}>{article.date}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 aria-hidden="true" size={14} />
                {article.readingTime} مطالعه
              </span>
            </div>
          </Shell>
        </Band>

        <Band>
          <Shell className="max-w-[1180px]">
            <Frame
              src={COVERS[article.cover]}
              alt={article.coverAlt}
              ratio="16/8"
              priority
              sizes="(max-width: 1180px) 100vw, 1180px"
              className="rounded-2xl border border-hairline"
              width={1600}
              height={800}
              zoom={false}
            />
          </Shell>
        </Band>

        <Band>
          <Shell className="grid max-w-[1100px] gap-10 lg:grid-cols-[240px_minmax(0,720px)] lg:items-start lg:justify-center">
            <aside
              className="rounded-2xl border border-hairline bg-carbon p-5 lg:sticky lg:top-24"
              aria-label="فهرست مقاله"
            >
              <TechLabel tone="signal">IN THIS ARTICLE</TechLabel>
              <ol className="mt-4 space-y-3">
                {article.sections.map((section, index) => (
                  <li key={section.heading}>
                    <a
                      href={`#section-${index + 1}`}
                      className="text-xs leading-6 text-metal transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    >
                      {index + 1}. {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <article className="min-w-0">
              {article.sections.map((section, index) => (
                <section
                  id={`section-${index + 1}`}
                  key={section.heading}
                  className="scroll-mt-28 border-b border-hairline pb-9 pt-1 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <TechLabel tone="signal">{String(index + 1).padStart(2, "0")}</TechLabel>
                    <h2 className="text-display-3 text-bone">{section.heading}</h2>
                  </div>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mb-5 text-[15px] leading-9 text-metal last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </article>
          </Shell>
        </Band>

        <Band label="مسیرهای مرتبط با مقاله">
          <Shell>
            <EditorialCommerceBridge
              title="اگر این موضوع به انتخاب بعدی شما کمک می‌کند"
              lede="ارتباط‌های فروش فقط در همان زمینه‌ای نشان داده می‌شوند که با موضوع مقاله هم‌راستا باشد؛ خود مقاله به آگهی محصول تبدیل نمی‌شود."
              publicProducts={commerce.publicProducts}
              referencedProductCount={commerce.productReferences.length}
              collections={commerce.collections}
              categories={commerce.categories}
            />
          </Shell>
        </Band>

        {related.length > 0 ? (
          <Band>
            <Shell>
              <SectionHead
                index="RELATED"
                label="CONTINUE READING"
                title="مقاله‌های مرتبط"
                lede="مطالب بعدی بر اساس موضوع نزدیک‌تر و سپس ترتیب انتشار انتخاب شده‌اند."
              />
              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    to="/journal/$slug"
                    params={{ slug: item.slug }}
                    className="group grid overflow-hidden rounded-2xl border border-hairline bg-carbon transition-transform duration-300 ease-[var(--ease-lbb)] hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal sm:grid-cols-[180px_1fr]"
                  >
                    <Frame
                      src={COVERS[item.cover]}
                      alt={item.coverAlt}
                      ratio="4/3"
                      sizes="(max-width: 640px) 100vw, 180px"
                      className="sm:h-full"
                      imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="flex flex-col justify-center p-5">
                      <TechLabel tone="signal">{item.category}</TechLabel>
                      <h3 className="mt-3 text-lg font-bold leading-8 text-bone">{item.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-metal">
                        {item.excerpt}
                      </p>
                      <span className="tech mt-4 inline-flex items-center gap-2 text-bone transition-colors group-hover:text-signal">
                        خواندن
                        <ArrowUpLeft aria-hidden="true" size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Shell>
          </Band>
        ) : null}
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
