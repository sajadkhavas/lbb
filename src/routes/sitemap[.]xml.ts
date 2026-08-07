import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { products } from "@/lib/products";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { COLLECTIONS } from "@/lib/collections";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import { evaluateProductEvidence } from "@/lib/product-evidence";
import { absUrl } from "@/lib/site";

type Entry = { path: string; priority: string; changefreq?: string };

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/shop", priority: "0.9", changefreq: "weekly" },
          ...CATEGORY_SLUGS.map((slug) => ({
            path: `/${slug}`,
            priority: "0.9",
            changefreq: "weekly",
          })),
          ...products
            .filter((product) => evaluateProductEvidence(product).publishable)
            .map((product) => ({
              path: `/product/${product.slug}`,
              priority: "0.8",
              changefreq: "weekly",
            })),
          { path: "/collections", priority: "0.7", changefreq: "weekly" },
          ...COLLECTIONS.map((collection) => ({
            path: `/collections/${collection.slug}`,
            priority: "0.7",
          })),
          { path: "/journal", priority: "0.6", changefreq: "weekly" },
          ...JOURNAL_ARTICLES.map((article) => ({
            path: `/journal/${article.slug}`,
            priority: "0.6",
          })),
          { path: "/lookbook", priority: "0.5", changefreq: "monthly" },
          { path: "/about", priority: "0.5" },
          { path: "/contact", priority: "0.5" },
          { path: "/size-guide", priority: "0.5" },
          { path: "/faq", priority: "0.5" },
          { path: "/shipping-returns", priority: "0.4" },
          { path: "/terms", priority: "0.3" },
          { path: "/privacy", priority: "0.3" },
        ];

        const urls = entries
          .map(
            (entry) =>
              `  <url>\n    <loc>${absUrl(entry.path)}</loc>${
                entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : ""
              }\n    <priority>${entry.priority}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
