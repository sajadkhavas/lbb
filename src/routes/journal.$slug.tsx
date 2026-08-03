import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowUpLeft, BookOpenText, Clock3 } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { journalBySlug, JOURNAL_ARTICLES, type JournalArticle } from "@/lib/journal";
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

const COVERS = { hero: heroMain, l1: lifestyle1, l2: lifestyle2 };

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }): { article: JournalArticle; related: JournalArticle[] } => {
    const article = journalBySlug(params.slug);
    if (!article) throw notFound();

    const related = JOURNAL_ARTICLES.filter((candidate) => candidate.slug !== article.slug)
      .sort((left, right) => Number(right.category === article.category) - Number(left.category === article.category))
      .slice(0, 2);

    return { article, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "مقاله پیدا نشد" }, { name: "robots", content: "noindex, nofollow" }] };
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
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ژورنال", href: "/journal" }, { label: "پیدا نشد" }]} />
        </Shell>
        <Band hairline={false}>
          <Shell>
            <EmptyState
              icon={<BookOpenText aria-hidden="true" size={34} />}
              title="این مقاله پیدا نشد"
              body="آدرس مقاله معتبر نیست یا این مطلب دیگر در فهرست ژورنال قرار ندارد."
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
  const { article, related }: { article: JournalArticle; related: JournalArticle[] } = Route.useLoaderData();

  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16">
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
            <aside className="rounded-2xl border border-hairline bg-carbon p-5 lg:sticky lg:top-24" aria-label="فهرست مقاله">
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
                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-metal">{item.excerpt}</p>
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
