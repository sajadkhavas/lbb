import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState, type ReactNode } from "react";
import { AnnouncementBar, ANNOUNCEMENT_HEIGHT } from "@/components/lbb/AnnouncementBar";
import { Footer } from "@/components/lbb/Footer";
import { BrandIntro } from "@/components/lbb/BrandIntro";
import { InstagramStrip } from "@/components/lbb/InstagramStrip";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Navbar } from "@/components/lbb/Navbar";
import { CategoryGateway } from "@/components/lbb/home/CategoryGateway";
import { DecisionSupport } from "@/components/lbb/home/DecisionSupport";
import { DropStory } from "@/components/lbb/home/DropStory";
import { HeroNarrative } from "@/components/lbb/home/HeroNarrative";
import { LocalStoreVisit } from "@/components/lbb/home/LocalStoreVisit";
import { ProductMoments } from "@/components/lbb/home/ProductMoments";
import { TickerStrip } from "@/components/lbb/home/TickerStrip";
import { TrustStrip } from "@/components/lbb/home/TrustStrip";
import { getProduct } from "@/lib/backend-api";
import { productImage } from "@/lib/product-images";
import { absUrl, canonical, pageMeta } from "@/lib/site";
import { resolveStorefrontControl } from "@/lib/storefront-control";

export const Route = createFileRoute("/")({
  loader: async () => {
    const control = await resolveStorefrontControl();
    if (control.source !== "live") return { control, heroProduct: null };

    const response = await getProduct(control.home.heroProductSlug);
    return {
      control,
      heroProduct: {
        slug: response.data.slug,
        name: response.data.name,
        priceToman: response.data.price.from?.amount ?? null,
        image: response.data.primaryImage,
      },
    };
  },
  head: ({ loaderData }) => {
    const control = loaderData?.control;
    if (!control) return {};
    const heroImage =
      control.source === "live"
        ? (loaderData.heroProduct?.image ?? null)
        : productImage(control.home.heroProductSlug);

    const websiteJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: control.brand.nameFa,
      alternateName: control.brand.name,
      url: absUrl("/"),
      inLanguage: "fa-IR",
    };
    const storeJsonLd = {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      name: control.brand.nameFa,
      alternateName: control.brand.name,
      url: absUrl("/"),
      logo: absUrl("/icons/icon-512.png"),
      description: control.brand.shortIntroduction,
      address: {
        "@type": "PostalAddress",
        addressLocality: control.contact.city,
        addressRegion: control.contact.province,
        addressCountry: "IR",
      },
      sameAs: [control.contact.instagramUrl],
    };

    return {
      meta: [
        ...pageMeta({
          title: control.copy.homepageTitle,
          description: control.copy.homepageDescription,
          path: "/",
          type: "website",
          image: heroImage ?? undefined,
        }),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        ...canonical("/"),
        ...(heroImage ? [{ rel: "preload", as: "image", href: heroImage }] : []),
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(websiteJsonLd) },
        { type: "application/ld+json", children: JSON.stringify(storeJsonLd) },
      ],
    };
  },
  component: Home,
});

function Home() {
  const { control, heroProduct } = Route.useLoaderData();
  const [barVisible, setBarVisible] = useState(false);
  const handleBarVisibility = useCallback((visible: boolean) => setBarVisible(visible), []);
  const offsetTop = barVisible ? ANNOUNCEMENT_HEIGHT : 0;

  const sections: Record<string, ReactNode> = {
    ticker: <TickerStrip />,
    trust: <TrustStrip />,
    categories: <CategoryGateway />,
    products: <ProductMoments />,
    drop_story: <DropStory />,
    decision_support: <DecisionSupport />,
    local_store: <LocalStoreVisit />,
    instagram: <InstagramStrip />,
  };

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
        data-storefront-source={control.source}
      >
        <HeroNarrative heroProduct={heroProduct} />
        {control.home.sections.map((key) => (
          <div key={key}>{sections[key] ?? null}</div>
        ))}
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
      <BrandIntro />
    </>
  );
}
