import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { lifestyle1, lifestyle2, heroMain, productImage } from "@/lib/product-images";

const TITLE = "لوک‌بوک LBB | استایل‌های استریت‌ویر فصل";
const DESC =
  "لوک‌بوک LBB: گالری استایل‌های استریت‌ویر، ست‌های کامل هودی، کارگو و کتونی. الهام بگیر و ست خودت رو بساز.";

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
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/lookbook" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/lookbook" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "خانه", item: "/" },
            { "@type": "ListItem", position: 2, name: "لوک‌بوک", item: "/lookbook" },
          ],
        }),
      },
    ],
  }),
  component: LookbookPage,
});

function LookbookPage() {
  const [active, setActive] = useState<Shot | null>(null);

  return (
    <>
      <Navbar theme="light" />
      <main
        dir="rtl"
        className="min-h-screen bg-white pt-16 text-black"
        style={{ paddingBottom: "80px", fontFamily: "'Vazirmatn', sans-serif" }}
      >
        <div className="border-b border-black/[0.06]">
          <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-8">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "لوک‌بوک" }]} />
          </div>
        </div>

        <header className="mx-auto max-w-[1280px] px-4 py-10 md:px-8">
          <h1
            className="text-3xl font-bold md:text-[42px]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            لوک‌بوک
          </h1>
          <p className="mt-3 max-w-[560px] text-sm leading-7 text-gray-600">
            ست‌های کامل فصل، همون‌طور که توی خیابون دیده می‌شن. روی هر تصویر بزن تا بزرگ ببینیش.
          </p>
        </header>

        <section className="mx-auto max-w-[1280px] px-4 pb-14 md:px-8">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {shots.map((s, i) => (
              <button
                key={i}
                onClick={() => setActive(s)}
                className={`group relative overflow-hidden rounded-xl bg-[#f2f2f2] ${s.span}`}
                style={{ aspectRatio: s.span === "row-span-2" ? "3 / 8" : "3 / 4" }}
                aria-label={s.alt}
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
              </button>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-[#0A0A0A] px-6 py-10 text-center text-white">
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ست مورد علاقه‌ت رو پیدا کن
            </h2>
            <p className="mx-auto mt-2 max-w-[420px] text-[13px] text-white/60">
              همه قطعات این لوک‌بوک توی فروشگاه موجودن.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex h-12 items-center rounded-lg bg-[var(--lbb-red)] px-7 text-xs font-bold"
            >
              رفتن به فروشگاه
            </Link>
          </div>
        </section>
      </main>

      {active && (
        <div
          className="fixed inset-0 z-[300] grid place-items-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <button
            aria-label="بستن"
            onClick={() => setActive(null)}
            className="absolute left-5 top-5 text-white"
          >
            <X size={28} />
          </button>
          <img
            src={active.src}
            alt={active.alt}
            className="max-h-[88vh] max-w-full rounded-lg object-contain"
          />
        </div>
      )}

      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
