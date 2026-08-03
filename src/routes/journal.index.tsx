import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import { heroMain, lifestyle1, lifestyle2 } from "@/lib/product-images";

const TITLE = "ژورنال LBB | مجله استریت‌ویر و استایل خیابانی";
const DESC =
  "ژورنال LBB: مقالاتی درباره استایل، فرهنگ خیابانی، پارچه‌شناسی و نگهداری از پوشاک استریت‌ویر.";

const covers = { hero: heroMain, l1: lifestyle1, l2: lifestyle2 };

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
    { "@type": "ListItem", position: 2, name: "ژورنال", item: "/journal" },
  ],
};

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/journal" },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbLd) }],
  }),
  component: JournalIndexPage,
});

function JournalIndexPage() {
  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-16 text-black" style={{ paddingBottom: 80, fontFamily: "var(--font-body)" }}>
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ژورنال" }]} />
          </div>
        </div>

        <header className="mx-auto max-w-[1280px] px-4 py-10 md:px-8">
          <h1 className="text-3xl font-bold md:text-[42px]" style={{ fontFamily: "var(--font-display)" }}>
            ژورنال
          </h1>
          <p className="mt-3 max-w-[560px] text-sm leading-7 text-gray-600">
            استایل، فرهنگ خیابونی و راهنماهای عملی، مستقیم از تیم LBB.
          </p>
        </header>

        <section className="mx-auto max-w-[1280px] px-4 pb-16 md:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {JOURNAL_ARTICLES.map((a) => (
              <Link
                key={a.slug}
                to="/journal/$slug"
                params={{ slug: a.slug }}
                className="group overflow-hidden rounded-xl border border-black/[0.06] bg-white"
              >
                <div className="aspect-[16/9] overflow-hidden bg-[#f2f2f2]">
                  <img
                    src={covers[a.cover]}
                    alt={`تصویر شاخص مقاله ${a.title}`}
                    width={960}
                    height={540}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    <span>{a.date}</span>
                    <span>·</span>
                    <span>{a.readingTime} مطالعه</span>
                  </div>
                  <h2 className="mt-2 text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                    {a.title}
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-gray-600">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
