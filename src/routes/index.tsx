import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { HeroSection } from "@/components/lbb/HeroSection";
import { Marquee } from "@/components/lbb/Marquee";
import { CategoryGrid } from "@/components/lbb/CategoryGrid";
import { ProductsSection } from "@/components/lbb/ProductsSection";
import { Manifesto } from "@/components/lbb/Manifesto";
import { InstagramStrip } from "@/components/lbb/InstagramStrip";
import { Footer } from "@/components/lbb/Footer";
import { CustomCursor } from "@/components/lbb/CustomCursor";

const TITLE = "LBB | پوشاک استریت‌ویر ایران — هودی، شلوار، کتونی";
const DESC =
  "فروشگاه آنلاین LBB: بهترین برند استریت‌ویر ایران. خرید هودی، شلوار، تیشرت، کتونی و اکسسوری با کیفیت بالا. ارسال سریع به سراسر ایران.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "LBB",
  url: "/",
  description: DESC,
  address: { "@type": "PostalAddress", addressCountry: "IR" },
  sameAs: ["https://www.instagram.com/lbbclo"],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "LBB | پوشاک استریت‌ویر" },
      { property: "og:description", content: "هودی، شلوار، کتونی و اکسسوری استریت‌ویر — LBB" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fa_IR" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-[var(--lbb-red)] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white"
      >
        رفتن به محتوا
      </a>
      <CustomCursor />
      <Navbar theme="dark" />
      <main id="main" className="bg-black text-white" style={{ paddingBottom: "80px" }}>
        <HeroSection />
        <Marquee />
        <CategoryGrid />
        <ProductsSection />
        <Manifesto />
        <InstagramStrip />
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}
