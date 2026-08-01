/**
 * Absolute-URL helpers for SEO metadata.
 *
 * Set `VITE_SITE_URL` (e.g. https://lbb.example.com) so canonical, Open Graph,
 * Schema.org and sitemap URLs are absolute in production. When it is not set we
 * fall back to root-relative paths, which stay valid but are less portable.
 */
const RAW = (import.meta.env["VITE_SITE_URL"] as string | undefined) ?? "";

/** Configured origin without a trailing slash, or "" when unconfigured. */
export const SITE_URL = RAW.replace(/\/+$/, "");

export const SITE_NAME = "LBB";
export const SITE_LOCALE = "fa_IR";

/** `/shop` → `https://site/shop` when configured, otherwise `/shop`. */
export function absUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return SITE_URL ? `${SITE_URL}${p === "/" ? "/" : p}` : p;
}

/** Absolute URL for a bundled asset import (hashed Vite URL). */
export function absAsset(assetUrl: string): string {
  if (/^https?:\/\//.test(assetUrl)) return assetUrl;
  return absUrl(assetUrl);
}

/** Default social share image. */
export const OG_IMAGE = absUrl("/icons/icon-512.png");

/** Shared meta for pages that must stay out of the index. */
export const NOINDEX = { name: "robots", content: "noindex, nofollow" } as const;

type MetaEntry = { title: string } | { name: string; content: string } | { property: string; content: string };

/**
 * Builds the standard meta block for a content page.
 * `image` should be an absolute https URL (or a bundled asset URL).
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
}): MetaEntry[] {
  const { title, description, path, image, type = "website", noindex } = opts;
  const url = absUrl(path);
  const img = image ? absAsset(image) : OG_IMAGE;
  const meta: MetaEntry[] = [
    { title },
    { name: "description", content: description },
    { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:locale", content: SITE_LOCALE },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (!noindex) {
    meta.push({ property: "og:image", content: img });
    meta.push({ name: "twitter:image", content: img });
  }
  return meta;
}

export function canonical(path: string) {
  return [{ rel: "canonical", href: absUrl(path) }];
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}
