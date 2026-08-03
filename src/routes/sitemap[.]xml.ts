import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { COLLECTIONS } from "@/lib/collections";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import { products } from "@/lib/products";
import { absUrl, escapeXml } from "@/lib/site";

type Entry = { path: string; priority: string; changefreq?: "weekly" | "monthly" };

function sitemapEntries(): Entry[] {
  return [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/shop", priority: "0.9", changefreq: "weekly" },
    ...CATEGORY_SLUGS.map((slug) => ({
      path: `/${slug}`,
      priority: "0.9",
      changefreq: "weekly" as const,
    })),
    ...products.map((product) => ({
      path: `/product/${product.slug}`,
      priority: "0.8",
      changefreq: "weekly" as const,
    })),
    { path: "/lookbook", priority: "0.5", changefreq: "monthly" },
    { path: "/about", priority: "0.5" },
    { path: "/contact", priority: "0.5" },
    { path: "/size-guide", priority: "0.5" },
    { path: "/faq", priority: "0.5" },
    { path: "/collections", priority: "0.7", changefreq: "weekly" },
    ...COLLECTIONS.map((collection) => ({
      path: `/collections/${collection.slug}`,
      priority: "0.7",
    })),
    { path: "/journal", priority: "0.6", changefreq: "weekly" },
    ...JOURNAL_ARTICLES.map((article) => ({ path: `/journal/${article.slug}`, priority: "0.6" })),
    { path: "/track-order", priority: "0.4" },
    { path: "/shipping-returns", priority: "0.4" },
    { path: "/terms", priority: "0.3" },
    { path: "/privacy", priority: "0.3" },
  ];
}

function renderSitemap(entries: Entry[]): string {
  const uniqueEntries = [...new Map(entries.map((entry) => [entry.path, entry])).values()];
  const urls = uniqueEntries
    .map((entry) => {
      const location = absUrl(entry.path);
      if (!location.startsWith("https://") && !location.startsWith("http://")) {
        throw new Error(`Sitemap URL is not absolute: ${location}`);
      }
      return [
        "  <url>",
        `    <loc>${escapeXml(location)}</loc>`,
        entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(renderSitemap(sitemapEntries()), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
            "X-Content-Type-Options": "nosniff",
          },
        }),
    },
  },
});
