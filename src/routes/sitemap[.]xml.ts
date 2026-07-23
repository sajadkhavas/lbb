import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { products } from "@/lib/products";
import { CATEGORY_SLUGS } from "@/lib/categories";

const BASE_URL = "";

type Entry = { path: string; priority: string; changefreq?: string };

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/shop", priority: "0.9", changefreq: "weekly" },
          ...CATEGORY_SLUGS.map((s) => ({ path: `/${s}`, priority: "0.9", changefreq: "weekly" })),
          ...products.map((p) => ({ path: `/product/${p.slug}`, priority: "0.8", changefreq: "weekly" })),
          { path: "/about", priority: "0.5" },
          { path: "/contact", priority: "0.5" },
          { path: "/size-guide", priority: "0.5" },
          { path: "/faq", priority: "0.5" },
        ];
        const urls = entries
          .map((e) => `  <url>\n    <loc>${BASE_URL}${e.path}</loc>${e.changefreq ? `\n    <changefreq>${e.changefreq}</changefreq>` : ""}\n    <priority>${e.priority}</priority>\n  </url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
