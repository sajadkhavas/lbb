import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { journalBySlug, JOURNAL_ARTICLES, type JournalArticle } from "@/lib/journal";
import { heroMain, lifestyle1, lifestyle2 } from "@/lib/product-images";

const covers = { hero: heroMain, l1: lifestyle1, l2: lifestyle2 };

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }): { article: JournalArticle; related: JournalArticle[] } => {
    const article = journalBySlug(params.slug);
    if (!article) throw notFound();
    const related = JOURNAL_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);
    return { article, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "پیدا نشد" }, { name: "robots", content: "noindex" }] };
    const { article: a } = loaderData;
    const title = `${a.title} | ژورنال LBB`;
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.excerpt,
      datePublished: a.isoDate,
      author: { "@type": "Organization", name: "LBB" },
      publisher: { "@type": "Organization", name: "LBB" },
      mainEntityOfPage: `/journal/${a.slug}`,
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
        { "@type": "ListItem", position: 2, name: "ژورنال", item: "/journal" },
        { "@type": "ListItem", position: 3, name: a.title, item: `/journal/${a.slug}` },
      ],
    };
    return {
      meta: [
        { title },
        { name: "description", content: a.excerpt },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: a.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/journal/${a.slug}` },
      ],
      links: [{ rel: "canonical", href: `/journal/${a.slug}` }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
        { type: "application/ld+json", children: JSON.stringify(articleLd) },
      ],
    };
  },
  notFoundComponent: () => (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="grid min-h-screen place-items-center bg-white pt-16 text-black" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold">این مقاله پیدا نشد</h1>
          <Link to="/journal" className="mt-4 inline-block text-[var(--lbb-red)]">بازگشت به ژورنال</Link>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  ),
  component: JournalDetailPage,
});

function JournalDetailPage() {
  const { article: a, related }: { article: JournalArticle; related: JournalArticle[] } =
    Route.useLoaderData();

  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-16 text-black" style={{ paddingBottom: 80, fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ژورنال", href: "/journal" }, { label: a.title }]} />
          </div>
        </div>

        <header className="mx-auto max-w-[820px] px-4 py-8 md:px-8">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{a.date}</span>
            <span>·</span>
            <span>{a.readingTime} مطالعه</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold md:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {a.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-gray-600">{a.excerpt}</p>
        </header>

        <div className="mx-auto max-w-[1000px] px-4 md:px-8">
          <div className="aspect-[16/8] overflow-hidden rounded-xl bg-[#f2f2f2]">
            <img
              src={covers[a.cover]}
              alt={`تصویر شاخص مقاله ${a.title}`}
              width={1200}
              height={600}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <article className="mx-auto max-w-[720px] px-4 py-10 md:px-8">
          {a.sections.map((s, i) => (
            <section key={i} className="mb-8">
              <h2 className="mb-3 text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.heading}
              </h2>
              {s.paragraphs.map((p, j) => (
                <p key={j} className="mb-4 text-sm leading-8 text-gray-700">{p}</p>
              ))}
            </section>
          ))}
        </article>

        {related.length > 0 && (
          <section className="border-t border-black/[0.06] py-10">
            <div className="mx-auto max-w-[1280px] px-4 md:px-8">
              <h3 className="mb-4 text-lg font-semibold">مقالات مرتبط</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} to="/journal/$slug" params={{ slug: r.slug }} className="rounded-xl border border-black/[0.06] p-5 hover:border-[var(--lbb-red)]">
                    <h4 className="text-sm font-bold">{r.title}</h4>
                    <p className="mt-2 text-xs text-gray-600">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
