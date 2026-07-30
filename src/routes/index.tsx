import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/lbb/Navbar";
import { AnnouncementBar, ANNOUNCEMENT_HEIGHT } from "@/components/lbb/AnnouncementBar";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { HeroSplit } from "@/components/lbb/home/HeroSplit";
import { NewDropCountdown } from "@/components/lbb/home/NewDropCountdown";
import { ShopTheLook } from "@/components/lbb/home/ShopTheLook";
import { EditorialSplit } from "@/components/lbb/home/EditorialSplit";
import { Testimonials } from "@/components/lbb/home/Testimonials";
import { Newsletter } from "@/components/lbb/home/Newsletter";
import { TickerStrip } from "@/components/lbb/home/TickerStrip";
import { CategoryTakeover } from "@/components/lbb/home/CategoryTakeover";
import { FeaturedPinned } from "@/components/lbb/home/FeaturedPinned";
import { BrandStatement } from "@/components/lbb/home/BrandStatement";
import { BestSellers } from "@/components/lbb/home/BestSellers";
import { TrustStrip } from "@/components/lbb/home/TrustStrip";
import { InstagramStrip } from "@/components/lbb/InstagramStrip";
import { Footer } from "@/components/lbb/Footer";
import { CustomCursor } from "@/components/lbb/CustomCursor";

const TITLE = "LBB | خرید پوشاک استریت‌ویر — هودی، شلوار، کتونی، تیشرت";
const DESC =
  "فروشگاه آنلاین LBB: برند استریت‌ویر ایران. خرید هودی، شلوار، تیشرت، کتونی و اکسسوری با کیفیت بالا. ارسال سریع به سراسر ایران. قیمت مناسب.";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LBB",
  url: "/",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "/search?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "LBB",
  alternateName: "ال‌بی‌بی",
  url: "/",
  logo: "/favicon.ico",
  description:
    "فروشگاه آنلاین پوشاک استریت‌ویر LBB. خرید هودی، شلوار، تیشرت، کتونی و اکسسوری.",
  priceRange: "$$",
  currenciesAccepted: "IRR",
  paymentAccepted: "درگاه بانکی",
  address: { "@type": "PostalAddress", addressCountry: "IR" },
  sameAs: ["https://www.instagram.com/lbbclo"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "پوشاک استریت‌ویر LBB",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "هودی استریت‌ویر" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "شلوار استریت‌ویر" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "کتونی" } },
    ],
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      {
        name: "keywords",
        content: "خرید هودی، خرید شلوار استریت‌ویر، LBB، فروشگاه لباس ایران، خرید کتونی",
      },
      { property: "og:title", content: "LBB | پوشاک استریت‌ویر ایران" },
      { property: "og:description", content: "هودی، شلوار، کتونی و اکسسوری — برند استریت‌ویر LBB" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fa_IR" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/" }],
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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-[var(--lbb-red)] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white"
      >
        رفتن به محتوای اصلی
      </a>
      <CustomCursor />
      <AnnouncementBar onDismiss={() => setBarVisible(false)} />
      <Navbar theme="dark" offsetTop={offsetTop} />
      <main
        id="main"
        className="bg-black text-white transition-[padding] duration-300"
        style={{ paddingBottom: "80px", paddingTop: offsetTop }}
      >
        <HeroSplit />
        <TickerStrip />
        <CategoryTakeover />
        <NewDropCountdown />
        <FeaturedPinned />
        <ShopTheLook />
        <BrandStatement />
        <EditorialSplit />
        <BestSellers />
        <Testimonials />
        <TrustStrip />
        <Newsletter />
        <InstagramStrip />
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </SmoothScroll>
  );
}
