/** Absolute-URL helpers shared by metadata, structured data and text endpoints. */
function normalizeSiteUrl(value: string | undefined): string {
  const raw = value?.trim();
  if (!raw) {
    if (import.meta.env.PROD) {
      throw new Error("VITE_SITE_URL is required for production builds.");
    }
    return "";
  }

  const url = new URL(raw);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("VITE_SITE_URL must use http or https.");
  }
  if (import.meta.env.PROD && url.protocol !== "https:") {
    throw new Error("VITE_SITE_URL must use https in production.");
  }
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error(
      "VITE_SITE_URL must be a clean origin without path, credentials, query or hash.",
    );
  }
  return url.origin;
}

export const SITE_URL = normalizeSiteUrl(import.meta.env["VITE_SITE_URL"] as string | undefined);
export const SITE_NAME = "LBB";
export const SITE_LOCALE = "fa_IR";

/** `/shop` → `https://site/shop` in production and `/shop` during unconfigured development. */
export function absUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return SITE_URL ? `${SITE_URL}${normalizedPath === "/" ? "/" : normalizedPath}` : normalizedPath;
}

export function absAsset(assetUrl: string): string {
  if (/^https?:\/\//.test(assetUrl)) return assetUrl;
  return absUrl(assetUrl);
}

export const OG_IMAGE = absUrl("/icons/icon-512.png");
export const ROBOTS = {
  INDEX_FOLLOW: "index, follow",
  NOINDEX_FOLLOW: "noindex, follow",
  NOINDEX_NOFOLLOW: "noindex, nofollow",
} as const;
export type RobotsDirective = (typeof ROBOTS)[keyof typeof ROBOTS];
export const NOINDEX = { name: "robots", content: ROBOTS.NOINDEX_NOFOLLOW } as const;

type MetaEntry =
  { title: string } | { name: string; content: string } | { property: string; content: string };

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  robots?: RobotsDirective;
  noindex?: boolean;
}): MetaEntry[] {
  const { title, description, path, image, type = "website", robots, noindex } = opts;
  const url = absUrl(path);
  const img = image ? absAsset(image) : OG_IMAGE;
  const meta: MetaEntry[] = [
    { title },
    { name: "description", content: description },
    {
      name: "robots",
      content: robots ?? (noindex ? ROBOTS.NOINDEX_NOFOLLOW : ROBOTS.INDEX_FOLLOW),
    },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:locale", content: SITE_LOCALE },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  meta.push({ property: "og:image", content: img });
  meta.push({ name: "twitter:image", content: img });
  return meta;
}

export function canonical(path: string) {
  return [{ rel: "canonical", href: absUrl(path) }];
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  };
}
