import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { lifestyle1, lifestyle2, heroMain, productImage } from "@/lib/product-images";
import { Shell, Band, SectionHead, CtaClasses } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "لوک‌بوک LBB | استایل‌های استریت‌ویر فصل";
const DESC = "لوک‌بوک LBB: گالری استایل‌های استریت‌ویر و ست‌های کامل هودی، کارگو و کتونی برای الهام گرفتن.";

type Shot = { src: string; alt: string; span: string };

const shots: Shot[] = [
  { src: heroMain, alt: "ست تمام‌مشکی هودی و کارگو زیر نور قرمز", span: "row-span-2" },
  { src: lifestyle1, alt: "دو نفر با هودی اورسایز در خیابان شبانه", span: "" },
  { src: productImage("oversized-black-hoodie"), alt: "هودی اورسایز با پرینت پشت", span: "" },
  { src: lifestyle2, alt: "فلت‌لی ست کامل استریت‌ویر روی بتن", span: "col-span-2" },
  { src: productImage("cargo-street-pants"), alt: "شلوار کارگو مشکی", span: "" },
  { src: productImage("urban-runner-sneaker"), alt: "کتونی سفید اربن رانر", span: "" },
  { src: productImage("denim-baggy-jean"), alt: "جین بگی دنیم", span: "" },
  { src: productImage("graphic-tee-red"), alt: "تیشرت گرافیک قرمز", span: "" },
];

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/lookbook" }),
    links: canonical("/lookbook"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbLd([{ name: "خانه", path: "/" }, { name: "لوک‌بوک", path: "/lookbook" }])) },
    ],
  }),
  component: LookbookPage,
});

function LookbookPage() {
  const [active, setActive] = useState<Shot | null>(null);

  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "لوک‌بوک" }]} />
        </Shell>

        <Band hairline={false} className="pb-0 pt-6">
          <Shell>
            <SectionHead
              label="LOOKBOOK"
              title="لوک‌بوک"
              lede="ست‌های کامل فصل، همان‌طور که در خیابان دیده می‌شوند. روی هر تصویر بزنید تا بزرگ ببینید."
            />
          </Shell>
        </Band>

        <Band>
          <Shell>
            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4">
              {shots.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(s)}
                  className={`group relative overflow-hidden bg-carbon ${s.span}`}
                  style={{ aspectRatio: s.span === "row-span-2" ? "3 / 8" : "3 / 4" }}
                  aria-label={s.alt}
                >
                  <img
                    src={s.src}
                    alt={s.alt}
                    width={s.span === "row-span-2" ? 480 : s.span === "col-span-2" ? 960 : 480}
                    height={s.span === "row-span-2" ? 1280 : s.span === "col-span-2" ? 640 : 640}
                    loading={i < 2 ? "eager" : "lazy"}
                    fetchPriority={i < 2 ? "high" : undefined}
                    decoding="async"
                    className="frame-zoom h-full w-full object-cover group-hover:scale-105"
                  />
                </button>
              ))}
            </div>

            <div className="mt-12 border border-hairline bg-carbon px-6 py-10 text-center">
              <h2 className="text-display-3 text-bone">ست مورد علاقه‌تان را پیدا کنید</h2>
              <p className="mx-auto mt-2 max-w-[420px] text-sm text-metal">
                همه قطعات این لوک‌بوک در فروشگاه موجودند.
              </p>
              <Link to="/shop" className={CtaClasses("signal") + " mt-6"}>
                رفتن به فروشگاه
              </Link>
            </div>
          </Shell>
        </Band>
      </main>

      {active && (
        <div
          className="fixed inset-0 z-[300] grid place-items-center bg-obsidian/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="بستن"
            onClick={() => setActive(null)}
            className="tap-target absolute end-4 top-4 text-bone"
          >
            <X size={28} aria-hidden="true" />
          </button>
          <img
            src={active.src}
            alt={active.alt}
            width={1200}
            height={1500}
            loading="eager"
            decoding="async"
            className="max-h-[88vh] max-w-full object-contain"
          />
        </div>
      )}

      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
