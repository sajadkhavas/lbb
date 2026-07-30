import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { COLLECTIONS } from "@/lib/collections";
import { productImage } from "@/lib/product-images";

const TITLE = "کالکشن‌های فصلی LBB | دراپ‌ها و کپسول‌های محدود";
const DESC =
  "همه کالکشن‌های فصلی و دراپ‌های محدود LBB رو ببین. هر دراپ یه داستان و رنگ‌بندی خاص خودش رو داره.";

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
    { "@type": "ListItem", position: 2, name: "کالکشن‌ها", item: "/collections" },
  ],
};

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumbLd) }],
  }),
  component: CollectionsIndexPage,
});

function CollectionsIndexPage() {
  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-16 text-black" style={{ paddingBottom: 80, fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "کالکشن‌ها" }]} />
          </div>
        </div>

        <header className="mx-auto max-w-[1280px] px-4 py-10 md:px-8">
          <h1 className="text-3xl font-bold md:text-[42px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            کالکشن‌های فصلی
          </h1>
          <p className="mt-3 max-w-[560px] text-sm leading-7 text-gray-600">
            هر دراپ LBB یه روایت جداست؛ محدود، متمرکز و با هویت بصری خاص خودش.
          </p>
        </header>

        <section className="mx-auto max-w-[1280px] px-4 pb-16 md:px-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.slug}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="group overflow-hidden rounded-xl border border-black/[0.06] bg-white"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#f2f2f2]">
                  <img
                    src={productImage(c.productSlugs[0])}
                    alt={c.nameFa}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {c.nameFa}
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-gray-600">{c.tagline}</p>
                  <span className="mt-3 inline-block text-xs font-semibold text-[var(--lbb-red)]">مشاهده کالکشن ←</span>
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
