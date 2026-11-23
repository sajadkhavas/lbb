import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpLeft, RefreshCcw } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { ManagedPageHead } from "@/components/lbb/ManagedPageIntro";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { COLLECTIONS } from "@/lib/collections";
import { getCollectionEditorialView } from "@/lib/editorial-commerce";
import {
  Band,
  CtaClasses,
  EmptyState,
  Frame,
  SectionHead,
  Shell,
  StatusTag,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";
import {
  backendErrorMessage,
  isLiveBackend,
  listCollections,
  type CollectionDto,
} from "@/lib/backend-api";
import { useStorefrontPresentation } from "@/lib/storefront-presentation";

const TITLE = "کالکشن‌های LBB | روایت‌های ادیتوریال و مسیرهای کشف";
const DESC = "کالکشن‌های منتشرشده LBB و مسیرهای کشف محصول.";
const COLLECTION_VIEWS = COLLECTIONS.map(getCollectionEditorialView);
type ManagedCollection = CollectionDto & { coverImage?: string | null };

type LoaderData =
  { mode: "live"; collections: CollectionDto[]; error: string | null } | { mode: "prototype" };

export const Route = createFileRoute("/collections/")({
  loader: async (): Promise<LoaderData> => {
    if (!isLiveBackend()) return { mode: "prototype" };
    try {
      const response = await listCollections();
      return { mode: "live", collections: response.data, error: null };
    } catch (error) {
      return { mode: "live", collections: [], error: backendErrorMessage(error) };
    }
  },
  head: () => ({
    meta: isLiveBackend()
      ? []
      : pageMeta({ title: TITLE, description: DESC, path: "/collections" }),
    links: canonical("/collections"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "کالکشن‌ها", path: "/collections" },
          ]),
        ),
      },
    ],
  }),
  component: CollectionsIndexPage,
});

function CollectionsIndexPage() {
  const loader = Route.useLoaderData();
  return loader.mode === "live" ? (
    <LiveCollections collections={loader.collections} error={loader.error} />
  ) : (
    <PrototypeCollections />
  );
}

function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16" data-f17-route="collections">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "کالکشن‌ها" }]} />
        </Shell>
        {children}
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}

function LiveCollections({
  collections,
  error,
}: {
  collections: CollectionDto[];
  error: string | null;
}) {
  const page = useStorefrontPresentation().pages.collections;
  return (
    <Chrome>
      <ManagedPageHead presentation={page} path="/collections" />
      <Shell className="pb-16">
        <header
          dir="rtl"
          className="border-b border-hairline pb-5 pt-3 md:flex md:items-end md:justify-between md:gap-6 md:pb-7"
        >
          <div>
            <h1 className="text-3xl font-black leading-tight text-bone sm:text-5xl">
              {page.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-metal">{page.lede}</p>
          </div>
          <Link
            to="/shop"
            search={{}}
            className="mt-3 inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-signal"
          >
            همه محصولات <ArrowUpLeft size={16} aria-hidden="true" />
          </Link>
        </header>
        <div dir="rtl" className="mt-5 md:mt-8" data-collections-redesign>
          {error ? (
            <EmptyState
              icon={<RefreshCcw size={40} aria-hidden="true" />}
              title="کالکشن‌ها قابل دریافت نیستند"
              body={error}
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
          ) : collections.length === 0 ? (
            <EmptyState
              title="کالکشن منتشرشده‌ای وجود ندارد"
              body="کالکشن‌های تازه LBB به‌زودی در این بخش قرار می‌گیرند."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {collections.map((collection, index) => {
                const managed = collection as ManagedCollection;
                const cover = managed.coverImage || collection.seo.primaryImage;
                const lead = index === 0;
                const summary = (
                  collection.seo.metaDescription ||
                  collection.description ||
                  ""
                ).trim();
                return (
                  <Link
                    key={collection.publicId}
                    to="/collections/$slug"
                    params={{ slug: collection.slug }}
                    className={`group grid overflow-hidden rounded-2xl border border-hairline bg-carbon hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${lead ? "md:col-span-2 md:grid-cols-[clamp(300px,34vw,430px)_minmax(0,1fr)]" : ""}`}
                  >
                    {cover ? (
                      <div
                        className="relative aspect-[4/5] w-full self-center overflow-hidden bg-carbon"
                      >
                        <img
                          src={cover}
                          alt={`ویترین کالکشن ${collection.name}`}
                          width={900}
                          height={1200}
                          loading={lead ? "eager" : "lazy"}
                          fetchPriority={lead ? "high" : "auto"}
                          decoding="async"
                          className="absolute inset-0 w-full object-cover object-center"
                          style={{ height: "100%" }}
                        />
                      </div>
                    ) : null}
                    <div
                      className={`flex min-w-0 flex-col justify-center p-5 sm:p-8 ${lead ? "lg:p-12" : ""} ${!cover && lead ? "md:col-span-2" : ""}`}
                    >
                      {typeof collection.productCount === "number" && (
                        <span className="mb-3 text-xs text-metal">
                          {collection.productCount.toLocaleString("fa-IR")} محصول
                        </span>
                      )}
                      <h2
                        className={`text-xl font-black leading-snug text-bone ${lead ? "md:text-4xl" : "md:text-2xl"}`}
                      >
                        {collection.name}
                      </h2>
                      {summary && (
                        <p className="mt-3 line-clamp-3 max-w-prose text-sm leading-7 text-metal">
                          {summary.length > 220
                            ? summary.slice(0, 220).replace(/\s+\S*$/, "") + "…"
                            : summary}
                        </p>
                      )}
                      <span className="mt-5 inline-flex min-h-11 items-center gap-2 self-start rounded-lg bg-signal px-4 text-sm font-bold text-black">
                        دیدن کالکشن <ArrowUpLeft size={16} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Shell>
    </Chrome>
  );
}

function PrototypeCollections() {
  return (
    <>
      <Navbar theme="light" />
      <main className="min-h-screen bg-obsidian pb-bottombar pt-16" data-f17-route="collections">
        <Shell className="py-3">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "کالکشن‌ها" }]} />
        </Shell>

        <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
          <Shell>
            <TechLabel tone="signal">LBB / EDITORIAL COLLECTIONS</TechLabel>
            <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">
              کالکشن‌ها؛ داستان‌هایی برای پیدا کردن مسیر بعدی
            </h1>
            <p className="text-lede mt-5 max-w-[62ch]">
              هر کالکشن یک گروه‌بندی ادیتوریال است، نه تکرار دسته‌بندی فروشگاه. از روایت شروع کنید و
              فقط وقتی داده محصول برای انتشار آماده باشد، به صفحه همان محصول بروید.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/lookbook" className={CtaClasses("signal")}>
                دیدن لوک‌بوک
              </Link>
              <Link to="/shop" search={{}} className={CtaClasses("line")}>
                مرور فروشگاه
              </Link>
            </div>
          </Shell>
        </Band>

        <Band>
          <Shell>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {COLLECTION_VIEWS.map((view, index) => (
                <article
                  key={view.collection.slug}
                  className={index === 0 ? "lg:col-span-2" : undefined}
                >
                  <Link
                    to="/collections/$slug"
                    params={{ slug: view.collection.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-carbon transition-transform duration-300 ease-[var(--ease-lbb)] hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                    data-f17-collection-link={view.collection.slug}
                  >
                    <Frame
                      src={view.media}
                      alt={`فضای تصویری ${view.collection.nameFa}`}
                      ratio={index === 0 ? "16/9" : "4/5"}
                      priority={index === 0}
                      sizes={
                        index === 0
                          ? "(max-width: 1024px) 100vw, 66vw"
                          : "(max-width: 1024px) 100vw, 33vw"
                      }
                      className="rounded-t-2xl"
                      imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-transparent to-transparent" />
                      <div className="absolute inset-inline-end-4 top-4 flex flex-wrap justify-end gap-2">
                        <StatusTag
                          tone={view.kind === "drop" ? "signal" : "neutral"}
                          className="rounded-lg backdrop-blur"
                        >
                          {view.kind === "drop" ? "DROP STORY" : "EDITORIAL COLLECTION"}
                        </StatusTag>
                        <StatusTag tone="neutral" className="rounded-lg backdrop-blur">
                          {view.publicProducts.length > 0
                            ? `${view.publicProducts.length.toLocaleString("fa-IR")} محصول قابل مشاهده`
                            : "بدون لینک مستقیم محصول"}
                        </StatusTag>
                      </div>
                    </Frame>

                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <TechLabel tone="signal">{view.collection.latinName}</TechLabel>
                      <h2 className="mt-3 text-display-3 text-bone">{view.collection.nameFa}</h2>
                      <p className="mt-3 text-sm leading-7 text-metal">{view.collection.tagline}</p>
                      <ul
                        className="mt-5 flex flex-wrap gap-2"
                        aria-label={`ویژگی‌های ${view.collection.nameFa}`}
                      >
                        {view.collection.storyPoints.map((point) => (
                          <li
                            key={point}
                            className="rounded-full border border-hairline px-3 py-1.5 text-[11px] text-metal"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                      <span className="tech mt-7 inline-flex items-center gap-2 text-bone transition-colors group-hover:text-signal">
                        ورود به روایت
                        <ArrowUpLeft aria-hidden="true" size={15} />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </Shell>
        </Band>

        <Band>
          <Shell>
            <SectionHead
              index="INTENT"
              label="COLLECTION ≠ CATEGORY"
              title="روایت را با دسته‌بندی محصول قاطی نمی‌کنیم"
              lede="کالکشن برای کشف و داستان‌گویی است؛ دسته‌ها برای مرور نوع محصول. اگر قصد مقایسه مستقیم دارید، از فروشگاه یا دسته مربوط ادامه دهید."
              action={
                <Link
                  to="/journal"
                  className="tech min-h-11 text-bone transition-colors hover:text-signal"
                >
                  راهنماهای ژورنال ←
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
