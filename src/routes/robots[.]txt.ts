import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { absUrl } from "@/lib/site";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          ["User-agent: *", "Allow: /", `Sitemap: ${absUrl("/sitemap.xml")}`, ""].join("\n"),
          {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
            },
          },
        ),
    },
  },
});
