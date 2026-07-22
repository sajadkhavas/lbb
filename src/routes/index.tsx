import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { HeroSection } from "@/components/lbb/HeroSection";
import { Marquee } from "@/components/lbb/Marquee";
import { CategoryGrid } from "@/components/lbb/CategoryGrid";
import { ProductsSection } from "@/components/lbb/ProductsSection";
import { Manifesto } from "@/components/lbb/Manifesto";
import { InstagramStrip } from "@/components/lbb/InstagramStrip";
import { Footer } from "@/components/lbb/Footer";
import { CustomCursor } from "@/components/lbb/CustomCursor";

const TITLE = "LBB — Premium Iranian Streetwear Boutique";
const DESC =
  "LBB — Premium Iranian streetwear from Tehran. Hoodies, pants, t-shirts, sneakers, and accessories built for the street.";

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
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(jsonLd) },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-[var(--lbb-red)] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:text-white"
      >
        Skip to content
      </a>
      <CustomCursor />
      <Navbar />
      <main id="main" className="bg-black text-white">
        <HeroSection />
        <Marquee />
        <CategoryGrid />
        <ProductsSection />
        <Manifesto />
        <InstagramStrip />
      </main>
      <Footer />
    </>
  );
}
