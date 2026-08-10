import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { products } from "@/lib/products";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { COLLECTIONS } from "@/lib/collections";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import { evaluateProductEvidence } from "@/lib/product-evidence";
import { absUrl } from "@/lib/site";
import {
  isLiveBackend,
  listCategories,
  listCollections,
  listProducts,
  type CategoryDto,
  type CollectionDto,
  type ProductSummaryDto,
} from "@/lib/backend-api";
import { backendCanonicalPath, sitemapLastmod, xmlEscape } from "@/lib/seo-live";

type Entry = { path: string; priority: string; changefreq?: string; lastmod?: string | null };

const editorialEntries: Entry[] = [
  { path: "/collections", priority: "0.7", changefreq: "weekly" },
  { path: "/journal", priority: "0.6", changefreq: "weekly" },
  ...JOURNAL_ARTICLES.map((article) => ({ path: `/journal/${article.slug}`, priority: "0.6" })),
  { path: "/lookbook", priority: "0.5", changefreq: "monthly" },
  { path: "/about", priority: "0.5" },
  { path: "/contact", priority: "0.5" },
  { path: "/size-guide", priority: "0.5" },
  { path: "/faq", priority: "0.5" },
  { path: "/shipping-returns", priority: "0.4" },
  { path: "/terms", priority: "0.3" },
  { path: "/privacy", priority: "0.3" },
];

function prototypeCommerceEntries(): Entry[] {
  return [
    ...CATEGORY_SLUGS.map((slug) => ({ path: `/${slug}`, priority: "0.9", changefreq: "weekly" })),
    ...products
      .filter((product) => evaluateProductEvidence(product).publishable)
      .map((product) => ({
        path: `/product/${product.slug}`,
        priority: "0.8",
        changefreq: "weekly",
      })),
    ...COLLECTIONS.map((collection) => ({
      path: `/collections/${collection.slug}`,
      priority: "0.7",
    })),
  ];
}

async function fetchAllPublishedProducts() {
  const result: ProductSummaryDto[] = [];
  for (let page = 1; page <= 100; page += 1) {
    const response = await listProducts({ page, per_page: 48, sort: "newest" });
    result.push(...response.data);
    const pagination = response.meta.pagination;
    if (!pagination?.hasMore) return result;
  }
  throw new Error("Published product sitemap pagination exceeded safety limit.");
}

function categoryEntry(category: CategoryDto): Entry {
  return {
    path: backendCanonicalPath(category.seo, `/${category.slug}`),
    priority: "0.9",
    changefreq: "weekly",
    lastmod: sitemapLastmod(category.seo.updatedAt),
  };
}

function productEntry(product: ProductSummaryDto): Entry {
  return {
    path: backendCanonicalPath(product.seo, `/product/${product.slug}`),
    priority: "0.8",
    changefreq: "weekly",
    lastmod: sitemapLastmod(product.seo.updatedAt),
  };
}

function collectionEntry(collection: CollectionDto): Entry {
  return {
    path: backendCanonicalPath(collection.seo, `/collections/${collection.slug}`),
    priority: "0.7",
    lastmod: sitemapLastmod(collection.seo.updatedAt),
  };
}

async function liveCommerceEntries(): Promise<Entry[]> {
  const [categories, collections, publishedProducts] = await Promise.all([
    listCategories(),
    listCollections(),
    fetchAllPublishedProducts(),
  ]);
  return [
    ...categories.data.map(categoryEntry),
    ...publishedProducts.map(productEntry),
    ...collections.data.map(collectionEntry),
  ];
}

function uniqueEntries(entries: Entry[]) {
  const unique = new Map<string, Entry>();
  for (const entry of entries) if (!unique.has(entry.path)) unique.set(entry.path, entry);
  return [...unique.values()];
}

function renderSitemap(entries: Entry[]) {
  const urls = uniqueEntries(entries)
    .map((entry) => {
      const loc = xmlEscape(absUrl(entry.path));
      const lastmod = entry.lastmod ? `\n    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : "";
      const changefreq = entry.changefreq
        ? `\n    <changefreq>${entry.changefreq}</changefreq>`
        : "";
      return `  <url>\n    <loc>${loc}</loc>${lastmod}${changefreq}\n    <priority>${entry.priority}</priority>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const commerceEntries = isLiveBackend()
            ? await liveCommerceEntries()
            : prototypeCommerceEntries();
          const entries: Entry[] = [
            { path: "/", priority: "1.0", changefreq: "weekly" },
            { path: "/shop", priority: "0.9", changefreq: "weekly" },
            ...commerceEntries,
            ...editorialEntries,
          ];
          return new Response(renderSitemap(entries), {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
            },
          });
        } catch (error) {
          console.error("Live sitemap generation failed", error);
          if (!isLiveBackend()) throw error;
          return new Response("Sitemap temporarily unavailable.", {
            status: 503,
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-store",
              "Retry-After": "300",
            },
          });
        }
      },
    },
  },
});
