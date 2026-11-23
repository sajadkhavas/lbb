import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowUpLeft, Layers3, RefreshCcw } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { ProductCard } from "@/components/lbb/ProductCard";
import { EditorialCommerceBridge } from "@/components/lbb/editorial/EditorialCommerceBridge";
import { collectionBySlug, type Collection } from "@/lib/collections";
import { CATEGORIES } from "@/lib/categories";
import { getCollectionEditorialView } from "@/lib/editorial-commerce";
import {
  BackendApiError,
  backendErrorMessage,
  getCollection,
  isLiveBackend,
  type CollectionDto,
  type ProductSummaryDto,
} from "@/lib/backend-api";
import { backendCard } from "@/lib/backend-storefront";
import {
  Band,
  CtaClasses,
  EmptyState,
  Frame,
  Shell,
  StatusTag,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd, absUrl } from "@/lib/site";
import { backendCanonicalPath } from "@/lib/seo-live";

function collectionSummary(collection: CollectionDto): string {
  const text = (collection.seo.metaDescription || collection.description || "").trim();
  return text.length > 190 ? text.slice(0, 190).replace(/\s+\S*$/, "") + "…" : text;
}

type LiveLoader = {
  mode: "live";
  collection: CollectionDto | null;
  products: ProductSummaryDto[];
  error: string | null;
};

type PrototypeLoader = {
  mode: "prototype";
  collection: Collection;
};

type LoaderData = LiveLoader | PrototypeLoader;

export const Route = createFileRoute("/collections/$slug")({
  loader: async ({ params }): Promise<LoaderData> => {
    if (!isLiveBackend()) {
      const collection = collectionBySlug(params.slug);
      if (!collection) throw notFound({ routeId: "/collections/$slug" });
      return { mode: "prototype", collection };
    }

    try {
      const response = await getCollection(params.slug, { page: 1, per_page: 48 });
      return {
        mode: "live",
        collection: response.data.collection,
        products: response.data.products,
        error: null,
      };
    } catch (error) {
      if (error instanceof BackendApiError && error.status === 404) {
        throw notFound({ routeId: "/collections/$slug" });
      }
      return {
        mode: "live",
        collection: null,
        products: [],
        error: backendErrorMessage(error),
      };
    }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "کالکشن پیدا نشد" }, { name: "robots", content: "noindex, nofollow" }],
      };
    }

    if (loaderData.mode === "live") {
      const collection = loaderData.collection;
      const routePath = `/collections/${params.slug}`;
      if (!collection) {
        return {
          meta: [
            { title: "کالکشن در دسترس نیست | LBB" },
            { name: "robots", content: "noindex, nofollow" },
          ],
          links: canonical(routePath),
        };
      }

      const path = backendCanonicalPath(collection.seo, routePath);
      const title = collection.seo.metaTitle || `${collection.name} | LBB`;
      const description =
        collection.seo.metaDescription ||
        collectionSummary(collection) ||
        `محصولات کالکشن ${collection.name} در فروشگاه LBB.`;
      const collectionLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: collection.name,
        description,
        url: absUrl(path),
        inLanguage: "fa-IR",
      };
      const itemListLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: collection.name,
        numberOfItems: loaderData.products.length,
        itemListElement: loaderData.products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absUrl(`/product/${product.slug}`),
          name: product.name,
        })),
      };

      return {
        meta: pageMeta({
          title,
          description,
          path,
          image: collection.seo.primaryImage || undefined,
        }),
        links: canonical(path),
        scripts: [
          {
            type: "application/ld+json",
            children: JSON.stringify(
              breadcrumbLd([
                { name: "خانه", path: "/" },
                { name: "کالکشن‌ها", path: "/collections" },
                { name: collection.name, path },
              ]),
            ),
          },
          { type: "application/ld+json", children: JSON.stringify(collectionLd) },
          ...(loaderData.products.length > 0
            ? [{ type: "application/ld+json", children: JSON.stringify(itemListLd) }]
            : []),
        ],
      };
    }

    const { collection } = loaderData;
    const view = getCollectionEditorialView(collection);
    const path = `/collections/${collection.slug}`;
    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: collection.nameFa,
      description: collection.description,
      url: absUrl(path),
      inLanguage: "fa-IR",
    };
    const itemListLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: collection.nameFa,
      numberOfItems: view.publicProducts.length,
      itemListElement: view.publicProducts.map((reference, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absUrl(`/product/${reference.slug}`),
        name: reference.product.name,
      })),
    };

    return {
      meta: pageMeta({
        title: collection.metaTitle,
        description: collection.metaDesc,
        path,
        image: view.media,
      }),
      links: canonical(path),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: "کالکشن‌ها", path: "/collections" },
              { name: collection.nameFa, path },
            ]),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(collectionLd) },
        ...(view.publicProducts.length > 0
          ? [{ type: "application/ld+json", children: JSON.stringify(itemListLd) }]
          : []),
      ],
    };
  },
  notFoundComponent: CollectionNotFound,
  component: CollectionDetailPage,
});

function CollectionNotFound() {
  return (
    <>
      <Navbar theme="light" />
      <main
        className="min-h-screen bg-obsidian pb-bottombar pt-16"
        data-f17-route="collection-not-found"
      >
        <Shell className="py-3">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "کالکشن‌ها", href: "/collections" },
              { label: "پیدا نشد" },
            ]}
          />
        </Shell>
        <Band hairline={false}>
          <Shell>
            <h1 className="sr-only">این کالکشن پیدا نشد</h1>
            <EmptyState
              icon={<Layers3 aria-hidden="true" size={34} />}
              title="این کالکشن پیدا نشد"
              body="آدرس کالکشن معتبر نیست یا این روایت در فهرست عمومی کالکشن‌های LBB قرار ندارد."
              action={
                <Link to="/collections" className={CtaClasses("signal")}>
                  بازگشت به کالکشن‌ها
                </Link>
              }
            />
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}

function CollectionDetailPage() {
  const loader = Route.useLoaderData();
  return loader.mode === "live" ? (
    <LiveCollectionDetail loader={loader} />
  ) : (
    <PrototypeCollectionDetail collection={loader.collection} />
  );
}

function LiveCollectionDetail({ loader }: { loader: LiveLoader }) {
  const collection = loader.collection;

  if (!collection) {
    return (
      <PageChrome breadcrumbLabel="کالکشن">
        <Band hairline={false}>
          <Shell>
            <EmptyState
              icon={<RefreshCcw aria-hidden="true" size={36} />}
              title="اطلاعات کالکشن قابل دریافت نیست"
              body={loader.error || "اطلاعات این کالکشن فعلاً در دسترس نیست."}
              action={
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className={CtaClasses("signal")}
                >
                  تلاش دوباره
                </button>
              }
            />
          </Shell>
        </Band>
      </PageChrome>
    );
  }

  const image =
    (collection as CollectionDto & { coverImage?: string }).coverImage ||
    collection.seo.primaryImage;
  const summary = collectionSummary(collection);
  const categories = Array.from(
    new Map(
      loader.products.map((product) => [
        product.category.slug,
        { slug: product.category.slug, label: product.category.name },
      ]),
    ).values(),
  );

  return (
    <PageChrome breadcrumbLabel={collection.name}>
      <Shell className="pb-6 pt-2 md:pb-10">
        <header
          dir="rtl"
          data-collection-detail-redesign
          className={`grid overflow-hidden rounded-2xl border border-hairline bg-carbon ${image ? "md:grid-cols-[minmax(0,1fr)_clamp(300px,34vw,430px)]" : ""}`}
        >
          <div className="flex min-w-0 flex-col justify-center p-5 md:p-9 lg:p-12">
            <h1 className="text-2xl font-black leading-snug text-bone sm:text-3xl lg:text-5xl">
              {collection.name}
            </h1>
            {summary && <p className="mt-3 max-w-prose text-sm leading-7 text-metal">{summary}</p>}
            {loader.products.length > 0 && (
              <a href="#collection-products" className={`mt-4 self-start ${CtaClasses("signal")}`}>
                دیدن {loader.products.length.toLocaleString("fa-IR")} محصول
              </a>
            )}
          </div>
          {image && (
            <div className="relative aspect-[4/5] w-full self-center overflow-hidden bg-carbon">
              <img
                src={image}
                alt={`پوشش و استایل کالکشن ${collection.name}`}
                width={900}
                height={1200}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 w-full object-cover object-center"
                style={{ height: "100%" }}
              />
            </div>
          )}
        </header>
      </Shell>

      <section
        id="collection-products"
        dir="rtl"
        aria-labelledby="collection-products-title"
        className="scroll-mt-24 border-t border-hairline py-6 md:py-10"
      >
        <Shell>
          <h2
            id="collection-products-title"
            className="mb-4 text-xl font-black text-bone md:mb-6 md:text-3xl"
          >
            محصولات این کالکشن
          </h2>
          {loader.products.length === 0 ? (
            <EmptyState
              icon={<Layers3 aria-hidden="true" size={32} />}
              title="محصول منتشرشده‌ای برای این کالکشن وجود ندارد"
              body="هنوز محصول منتشرشده‌ای در این کالکشن وجود ندارد."
              action={
                <Link to="/shop" search={{}} className={CtaClasses("line")}>
                  مرور فروشگاه
                </Link>
              }
            />
          ) : (
            <>
              <div
                className={`grid grid-cols-2 gap-2 sm:gap-4 ${loader.products.length <= 2 ? "mx-auto max-w-3xl" : "md:grid-cols-3 lg:grid-cols-4"}`}
              >
                {loader.products.map((product, index) => (
                  <ProductCard
                    key={product.publicId}
                    p={backendCard(product)}
                    priority={index < 2}
                  />
                ))}
              </div>
              {categories.length > 0 ? (
                <div className="mt-10 flex flex-wrap gap-2" aria-label="دسته‌های مرتبط">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      to="/$category"
                      params={{ category: category.slug }}
                      className={CtaClasses("line")}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </Shell>
      </section>
      {collection.description && collection.description.trim() !== summary && (
        <section
          dir="rtl"
          aria-labelledby="collection-about"
          className="border-t border-hairline py-8 md:py-12"
        >
          <Shell>
            <div className="max-w-3xl rounded-2xl border border-hairline bg-carbon p-5 md:p-8">
              <h2 id="collection-about" className="text-xl font-black text-bone">
                دربارهٔ این کالکشن
              </h2>
              {collection.description
                .trim()
                .split(/\n+/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index} className="mt-3 text-sm leading-8 text-metal">
                    {paragraph}
                  </p>
                ))}
            </div>
          </Shell>
        </section>
      )}
    </PageChrome>
  );
}

function PageChrome({
  breadcrumbLabel,
  children,
}: {
  breadcrumbLabel: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar theme="light" />
      <main
        className="min-h-screen bg-obsidian pb-bottombar pt-16"
        data-f17-route="collection-detail"
      >
        <Shell className="py-3">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "کالکشن‌ها", href: "/collections" },
              { label: breadcrumbLabel },
            ]}
          />
        </Shell>
        {children}
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}

function PrototypeCollectionDetail({ collection }: { collection: Collection }) {
  const view = getCollectionEditorialView(collection);
  const category = view.primaryCategory ? CATEGORIES[view.primaryCategory] : undefined;
  const categoryLinks = category ? [{ slug: category.slug, label: category.nameFaPlural }] : [];

  return (
    <>
      <Navbar theme="light" />
      <main
        className="min-h-screen bg-obsidian pb-bottombar pt-16"
        data-f17-route="collection-detail"
        data-f17-collection-kind={view.kind}
      >
        <Shell className="py-3">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "کالکشن‌ها", href: "/collections" },
              { label: collection.nameFa },
            ]}
          />
        </Shell>

        <Band hairline={false} className="pb-10 pt-8 md:pb-14 md:pt-12">
          <Shell className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3">
                <TechLabel tone="signal">{collection.latinName}</TechLabel>
                <StatusTag
                  tone={view.kind === "drop" ? "signal" : "neutral"}
                  className="rounded-lg"
                >
                  {view.kind === "drop" ? "DROP / EDITORIAL" : "COLLECTION / EDITORIAL"}
                </StatusTag>
              </div>
              <h1 className="mt-5 text-display-1 text-bone">{collection.nameFa}</h1>
              <p className="text-lede mt-5 max-w-[52ch]">{collection.tagline}</p>
              <p className="mt-6 max-w-[64ch] text-sm leading-8 text-metal">
                {collection.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {collection.storyPoints.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-hairline px-3 py-1.5 text-[11px] text-metal"
                  >
                    {point}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#collection-commerce" className={CtaClasses("signal")}>
                  ادامه از این داستان
                </a>
                <Link to="/collections" className={CtaClasses("line")}>
                  همه کالکشن‌ها
                </Link>
              </div>
            </div>

            <Frame
              src={view.media}
              alt={`روایت تصویری ${collection.nameFa}`}
              ratio="4/5"
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="rounded-2xl border border-hairline"
              width={1200}
              height={1500}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-transparent to-transparent" />
              <StatusTag
                tone="neutral"
                className="absolute inset-inline-end-4 top-4 rounded-lg backdrop-blur"
              >
                {view.publicProducts.length > 0
                  ? `${view.publicProducts.length.toLocaleString("fa-IR")} لینک محصول عمومی`
                  : "روایت بدون لینک خرید مستقیم"}
              </StatusTag>
              <div className="absolute inset-x-5 bottom-5">
                <TechLabel tone="bone">VISUAL STORY</TechLabel>
                <p className="mt-2 max-w-[36ch] text-sm font-bold leading-7 text-bone">
                  {collection.tagline}
                </p>
              </div>
            </Frame>
          </Shell>
        </Band>

        <Band id="collection-commerce" label={`مسیر بعدی ${collection.nameFa}`}>
          <Shell>
            {view.publicProducts.length === 0 ? (
              <div data-f17-empty-products="true">
                <EmptyState
                  icon={<Layers3 aria-hidden="true" size={32} />}
                  title="برای این روایت فعلاً لینک مستقیم محصول نمایش داده نمی‌شود"
                  body="داستان کالکشن قابل مرور است و می‌توانید از دسته مرتبط، لوک‌بوک یا فروشگاه مسیرتان را ادامه دهید."
                />
              </div>
            ) : null}

            <EditorialCommerceBridge
              className={view.publicProducts.length === 0 ? "mt-8" : undefined}
              title="از روایت به مسیر خرید مرتبط"
              lede="لینک مستقیم محصول فقط برای آیتم‌هایی نمایش داده می‌شود که وضعیت انتشار عمومی آن‌ها تأیید شده باشد."
              publicProducts={view.publicProducts}
              referencedProductCount={view.productReferences.length}
              categories={categoryLinks}
            />
          </Shell>
        </Band>

        <Band>
          <Shell className="grid gap-6 rounded-2xl border border-hairline bg-carbon p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <TechLabel tone="signal">EDITORIAL NOTE</TechLabel>
              <h2 className="mt-3 text-display-3 text-bone">یادداشت استایلینگ</h2>
              <p className="mt-3 max-w-[68ch] text-sm leading-8 text-metal">
                {collection.editorialNote}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/lookbook" className={CtaClasses("line")}>
                دیدن لوک‌بوک
                <ArrowUpLeft aria-hidden="true" size={16} />
              </Link>
              <Link to="/journal" className={CtaClasses("line")}>
                خواندن ژورنال
              </Link>
            </div>
          </Shell>
        </Band>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
