import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { COLLECTIONS } from "@/lib/collections";
import { productImage } from "@/lib/product-images";
import { Shell, Band, SectionHead, Frame, TechLabel } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "کالکشن‌های فصلی LBB | دراپ‌ها و کپسول‌های محدود";
const DESC = "همه کالکشن‌های فصلی و دراپ‌های محدود LBB را ببینید؛ هر دراپ یک روایت و رنگ‌بندی خاص خودش را دارد.";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/collections" }),
    links: canonical("/collections"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbLd([{ name: "خانه", path: "/" }, { name: "کالکشن‌ها", path: "/collections" }])),
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

        <Band hairline={false} className="pb-0 pt-6">
          <Shell>
            <SectionHead
              index="COLLECTIONS"
              label="DROPS"
              title="کالکشن‌های فصلی"
              lede="هر دراپ LBB یک روایت جداست؛ محدود، متمرکز و با هویت بصری خاص خودش."
            />
          </Shell>
        </Band>

        <Band>
          <Shell>
            <div className="grid grid-cols-1 gap-px bg-hairline md:grid-cols-3">
              {COLLECTIONS.map((c) => (
                <Link
                  key={c.slug}
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  className="group flex flex-col bg-obsidian"
                >
                  <Frame src={productImage(c.productSlugs[0])} alt={`تصویر کالکشن ${c.nameFa}`} ratio="4/5" />
                  <div className="flex flex-col gap-2 p-5">
                    <TechLabel tone="metal">{c.slug}</TechLabel>
                    <h2 className="text-display-3 text-bone">{c.nameFa}</h2>
                    <p className="text-xs leading-6 text-metal">{c.tagline}</p>
                    <span className="tech mt-2 text-signal">مشاهده کالکشن</span>
                  </div>
                </Link>
              ))}
            </div>
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
