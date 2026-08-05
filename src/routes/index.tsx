import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AnnouncementBar, ANNOUNCEMENT_HEIGHT } from "@/components/lbb/AnnouncementBar";
import { CustomCursor } from "@/components/lbb/CustomCursor";
import { Footer } from "@/components/lbb/Footer";
import { InstagramStrip } from "@/components/lbb/InstagramStrip";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Navbar } from "@/components/lbb/Navbar";
import { BrandStatement } from "@/components/lbb/home/BrandStatement";
import { CategoryGateway } from "@/components/lbb/home/CategoryGateway";
import { DecisionSupport } from "@/components/lbb/home/DecisionSupport";
import { DropStory } from "@/components/lbb/home/DropStory";
import { EditorialGateway } from "@/components/lbb/home/EditorialGateway";
import { HeroNarrative } from "@/components/lbb/home/HeroNarrative";
import { Newsletter } from "@/components/lbb/home/Newsletter";
import { ProductMoments } from "@/components/lbb/home/ProductMoments";
import { ShopTheLook } from "@/components/lbb/home/ShopTheLook";
import { TickerStrip } from "@/components/lbb/home/TickerStrip";
import { TrustStrip } from "@/components/lbb/home/TrustStrip";
import { heroMain } from "@/lib/product-images";
import { absUrl, canonical, pageMeta } from "@/lib/site";

const TITLE = "LBB | استریت‌ویر تهران — دراپ ۰۰۱";
const DESC =
  "دراپ ۰۰۱ استریت‌ویر LBB؛ هودی اورسایز، شلوار بگی و کارگو، تیشرت سنگین، کتونی و جوراب با مسیر شفاف فیت، متریال و موجودی.";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LBB",
  url: absUrl("/"),
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
  name: "LBB",
  alternateName: "ال‌بی‌بی",
  url: absUrl("/"),
  logo: absUrl("/icons/icon-512.png"),
  description: "کاتالوگ آنلاین پوشاک استریت‌ویر LBB؛ هودی، شلوار، تیشرت، کتونی و جوراب.",
  priceRange: "$$",
  currenciesAccepted: "IRR",
  address: { "@type": "PostalAddress", addressCountry: "IR" },
  sameAs: ["https://www.instagram.com/lbbclo"],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      ...pageMeta({ title: TITLE, description: DESC, path: "/", type: "website" }),
      {
        name: "keywords",
        content: "استریت‌ویر تهران، خرید هودی اورسایز، شلوار بگی، شلوار کارگو، LBB",
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
  const [barVisible, setBarVisible] = useState(true);
  const offsetTop = barVisible ? ANNOUNCEMENT_HEIGHT : 0;

  return (
    <SmoothScroll>
      <a href="#main" className="sr-focusable">
        رفتن به محتوای اصلی
      </a>
      <CustomCursor />
      <AnnouncementBar onDismiss={() => setBarVisible(false)} />
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
        <ShopTheLook />
        <DecisionSupport />
        <EditorialGateway />
        <BrandStatement />
        <Newsletter />
        <InstagramStrip />
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </SmoothScroll>
  );
}
