import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { AnnouncementBar, ANNOUNCEMENT_HEIGHT } from "@/components/lbb/AnnouncementBar";
import { Footer } from "@/components/lbb/Footer";
import { InstagramStrip } from "@/components/lbb/InstagramStrip";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Navbar } from "@/components/lbb/Navbar";
import { CategoryGateway } from "@/components/lbb/home/CategoryGateway";
import { DecisionSupport } from "@/components/lbb/home/DecisionSupport";
import { DropStory } from "@/components/lbb/home/DropStory";
import { HeroNarrative } from "@/components/lbb/home/HeroNarrative";
import { LocalStoreVisit } from "@/components/lbb/home/LocalStoreVisit";
import { Newsletter } from "@/components/lbb/home/Newsletter";
import { ProductMoments } from "@/components/lbb/home/ProductMoments";
import { TickerStrip } from "@/components/lbb/home/TickerStrip";
import { TrustStrip } from "@/components/lbb/home/TrustStrip";
import { BRAND, BRAND_COPY } from "@/lib/brand";
import { heroMain } from "@/lib/product-images";
import { absUrl, canonical, pageMeta } from "@/lib/site";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND.name,
  alternateName: BRAND.nameFa,
  url: absUrl("/"),
  inLanguage: "fa-IR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${absUrl("/search")}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: BRAND.name,
  alternateName: BRAND.nameFa,
  url: absUrl("/"),
  logo: absUrl("/icons/icon-512.png"),
  description: BRAND.shortIntroduction,
  address: {
    "@type": "PostalAddress",
    addressLocality: BRAND.city,
    addressRegion: BRAND.province,
    addressCountry: "IR",
  },
  sameAs: [BRAND.instagramUrl],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      ...pageMeta({
        title: BRAND_COPY.homepageTitle,
        description: BRAND_COPY.homepageDescription,
        path: "/",
        type: "website",
      }),
      {
        name: "keywords",
        content: BRAND_COPY.homepageKeywords.join("، "),
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [...canonical("/"), { rel: "preload", as: "image", href: heroMain }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(websiteJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(storeJsonLd) },
    ],
  }),
  component: Home,
});

function Home() {
  const [barVisible, setBarVisible] = useState(false);
  const handleBarVisibility = useCallback((visible: boolean) => setBarVisible(visible), []);
  const offsetTop = barVisible ? ANNOUNCEMENT_HEIGHT : 0;

  return (
    <>
      <a href="#main" className="sr-focusable">
        رفتن به محتوای اصلی
      </a>
      <AnnouncementBar onVisibilityChange={handleBarVisibility} />
      <Navbar theme="dark" offsetTop={offsetTop} />
      <main
        id="main"
        className="bg-obsidian pb-bottombar text-bone transition-[padding] duration-300 md:pb-0"
        style={{ paddingTop: offsetTop }}
      >
        <HeroNarrative />
        <TickerStrip />
        <TrustStrip />
        <CategoryGateway />
        <ProductMoments />
        <DropStory />
        <DecisionSupport />
        <LocalStoreVisit />
        <Newsletter />
        <InstagramStrip />
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}
