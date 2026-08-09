import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpLeft, RefreshCcw } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
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

const TITLE = "کالکشن‌های LBB | روایت‌های ادیتوریال و مسیرهای کشف";
const DESC = "کالکشن‌های منتشرشده LBB و مسیرهای کشف محصول.";
const COLLECTION_VIEWS = COLLECTIONS.map(getCollectionEditorialView);

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
    meta: pageMeta({ title: TITLE, description: DESC, path: "/collections" }),
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
  return (
    <Chrome>
      <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
        <Shell>
          <TechLabel tone="signal">LBB / PUBLISHED COLLECTIONS</TechLabel>
          <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">کالکشن‌های منتشرشده</h1>
          <p className="text-lede mt-5 max-w-[62ch]">
            این فهرست از Backend می‌آید. فقط کالکشن و عضویت محصولی که برای انتشار معتبر است نمایش
            داده می‌شود.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" search={{}} className={CtaClasses("signal")}>
              مرور فروشگاه
            </Link>
            <Link to="/lookbook" className={CtaClasses("line")}>
              لوک‌بوک ادیتوریال
            </Link>
          </div>
        </Shell>
      </Band>
      <Band>
        <Shell>
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
              body="تا زمان انتشار در Backend، کالکشن نمونه جایگزین نمی‌شود."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <Link
                  key={collection.publicId}
                  to="/collections/$slug"
                  params={{ slug: collection.slug }}
                  className="group flex min-h-64 flex-col justify-between rounded-2xl border border-hairline bg-carbon p-6 transition hover:-translate-y-1 hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <div>
                    <TechLabel tone="signal">
                      {collection.isFeatured ? "FEATURED COLLECTION" : "COLLECTION"}
                    </TechLabel>
                    <h2 className="mt-4 text-display-3 text-bone">{collection.name}</h2>
                    <p className="mt-3 text-sm leading-7 text-metal">
                      {collection.description || "توضیح عمومی برای این کالکشن منتشر نشده است."}
                    </p>
                    {typeof collection.productCount === "number" ? (
                      <StatusTag tone="neutral" className="mt-5">
                        {collection.productCount.toLocaleString("fa-IR")} محصول منتشرشده
                      </StatusTag>
                    ) : null}
                  </div>
                  <span className="tech mt-8 inline-flex items-center gap-2 text-bone group-hover:text-signal">
                    مشاهده کالکشن <ArrowUpLeft size={15} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Shell>
      </Band>
    </Chrome>
  );
}

function PrototypeCollections() {
  return (
    <Chrome>
      <Band hairline={false} className="pb-8 pt-8 md:pb-12 md:pt-12">
        <Shell>
          <TechLabel tone="signal">LBB / EDITORIAL COLLECTIONS</TechLabel>
          <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">
            کالکشن‌ها؛ داستان‌هایی برای پیدا کردن مسیر بعدی
          </h1>
          <p className="text-lede mt-5 max-w-[62ch]">
            هر کالکشن یک گروه‌بندی ادیتوریال است، نه تکرار دسته‌بندی فروشگاه.
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
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-carbon transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <Frame
                    src={view.media}
                    alt={`فضای تصویری ${view.collection.nameFa}`}
                    ratio={index === 0 ? "16/9" : "4/5"}
                    priority={index === 0}
                    className="rounded-t-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-transparent to-transparent" />
                  </Frame>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <TechLabel tone="signal">{view.collection.latinName}</TechLabel>
                    <h2 className="mt-3 text-display-3 text-bone">{view.collection.nameFa}</h2>
                    <p className="mt-3 text-sm leading-7 text-metal">{view.collection.tagline}</p>
                    <span className="tech mt-7 inline-flex items-center gap-2 text-bone group-hover:text-signal">
                      ورود به روایت <ArrowUpLeft size={15} aria-hidden="true" />
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
            lede="کالکشن برای کشف و داستان‌گویی است؛ دسته‌ها برای مرور نوع محصول."
          />
        </Shell>
      </Band>
    </Chrome>
  );
}
