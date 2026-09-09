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
import { DropStory, type LiveFeaturedStory } from "@/components/lbb/home/DropStory";
import { HeroNarrative } from "@/components/lbb/home/HeroNarrative";
import { LocalStoreVisit } from "@/components/lbb/home/LocalStoreVisit";
import { ProductMoments } from "@/components/lbb/home/ProductMoments";
import { TickerStrip } from "@/components/lbb/home/TickerStrip";
import { TrustStrip } from "@/components/lbb/home/TrustStrip";
import { BackendApiError, getCollection, getProduct, listProducts } from "@/lib/backend-api";
import { backendCard, type BackendCatalogCard } from "@/lib/backend-storefront";
import { listStorefrontCategories, type StorefrontCategoryDto } from "@/lib/final-technical-api";
import { productImage } from "@/lib/product-images";
import { absUrl, canonical, pageMeta } from "@/lib/site";
import {
  resolveStorefrontControl,
  resolveStorefrontLookbook,
  type StorefrontControl,
  type StorefrontLookDto,
} from "@/lib/storefront-control";

type LiveHeroProduct = {
  slug: string;
  name: string;
  priceToman: number | null;
  image: string | null;
};

type HomeLoaderData = {
  control: Awaited<ReturnType<typeof resolveStorefrontControl>>;
  heroProduct: LiveHeroProduct | null;
  categories: StorefrontCategoryDto[] | null;
  products: BackendCatalogCard[] | null;
  lookbook: StorefrontLookDto[] | null;
  featuredStory: LiveFeaturedStory | null;
};

async function resolveLiveHeroProduct(slug: string): Promise<LiveHeroProduct | null> {
  if (!slug.trim()) return null;
  try {
    const response = await getProduct(slug);
    return {
      slug: response.data.slug,
      name: response.data.name,
      priceToman: response.data.price.from?.amount ?? null,
      image: response.data.primaryImage,
    };
  } catch (error) {
    if (
      error instanceof BackendApiError &&
      error.status === 404 &&
      error.code === "resource_not_found"
    ) {
      return null;
    }

    throw error;
  }
}

async function resolveLiveFeaturedStory(control: StorefrontControl): Promise<LiveFeaturedStory | null> {
  if (!control.featuredStory.enabled || !control.featuredStory.collectionSlug.trim()) return null;

  try {
    const response = await getCollection(control.featuredStory.collectionSlug, {
      page: 1,
      per_page: 3,
      sort: "newest",
    });
    return {
      collection: response.data.collection,
      products: response.data.products.map(backendCard),
    };
  } catch (error) {
    if (
      error instanceof BackendApiError &&
      error.status === 404 &&
      error.code === "resource_not_found"
    ) {
      return null;
    }
    throw error;
  }
}

export const Route = createFileRoute("/")({
  loader: async (): Promise<HomeLoaderData> => {
    const control = await resolveStorefrontControl();
    if (control.source !== "live") {
      return {
        control,
        heroProduct: null,
        categories: null,
        products: null,
        lookbook: null,
        featuredStory: null,
      };
    }

    const [heroProduct, categories, productResponse, lookbook, featuredStory] = await Promise.all([
      resolveLiveHeroProduct(control.home.heroProductSlug),
      listStorefrontCategories(),
      listProducts({ sort: "newest", page: 1, per_page: 4 }),
      resolveStorefrontLookbook(),
      resolveLiveFeaturedStory(control),
    ]);

    return {
      control,
      heroProduct,
      categories,
      products: productResponse.data.map(backendCard),
      lookbook: lookbook ?? [],
      featuredStory,
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
        streetAddress: control.contact.addressLine || undefined,
        addressLocality: control.contact.city,
        addressRegion: control.contact.province,
        addressCountry: "IR",
      },
      telephone: control.contact.phone,
      email: control.contact.email || undefined,
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
  const { control, heroProduct, categories, products, lookbook, featuredStory } = Route.useLoaderData();
  const [barVisible, setBarVisible] = useState(false);
  const handleBarVisibility = useCallback((visible: boolean) => setBarVisible(visible), []);
  const offsetTop = barVisible ? ANNOUNCEMENT_HEIGHT : 0;

  const sections: Record<string, ReactNode> = {
    ticker: <TickerStrip />,
    trust: <TrustStrip />,
    categories: <CategoryGateway liveCategories={categories} />,
    products: <ProductMoments liveProducts={products} />,
    drop_story: <DropStory liveStory={featuredStory} />,
    decision_support: <DecisionSupport />,
    local_store: <LocalStoreVisit />,
    instagram: <InstagramStrip liveItems={lookbook} />,
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
        <HeroNarrative heroProduct={heroProduct} liveCategories={categories} />
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
