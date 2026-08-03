const rawSiteUrl = (import.meta.env["VITE_SITE_URL"] as string | undefined)?.trim();
const isProduction = Boolean(import.meta.env.PROD);

export const SITE_NAME = "LBB";
export const SITE_LOCALE = "fa_IR";
export const SITE_LANGUAGE = "fa";
export const SITE_DESCRIPTION = "برند پوشاک استریت‌ویر ایرانی";
export const INSTAGRAM_URL = "https://www.instagram.com/lbbclo";

function normalizeOrigin(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("VITE_SITE_URL must be an absolute http(s) URL.");
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("VITE_SITE_URL must use http or https.");
  }
  if (isProduction && parsed.protocol !== "https:") {
    throw new Error("VITE_SITE_URL must use https in production.");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error("VITE_SITE_URL must be a clean origin without credentials, query, or hash.");
  }
  if (parsed.pathname !== "/") {
    throw new Error("VITE_SITE_URL must not include a path.");
  }

  return parsed.origin;
}

function resolveSiteUrl(): string {
  if (rawSiteUrl) return normalizeOrigin(rawSiteUrl);
  if (isProduction) {
    throw new Error("VITE_SITE_URL is required for production SEO and sitemap output.");
  }
  return "http://localhost:3000";
}

/** Validated, absolute origin without a trailing slash. */
export const SITE_URL = resolveSiteUrl();

export function absUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return normalizeOriginOrAbsolutePath(path);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${SITE_URL}/`).toString();
}

function normalizeOriginOrAbsolutePath(value: string): string {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`Unsupported absolute URL protocol: ${parsed.protocol}`);
  }
  return parsed.toString();
}

export function absAsset(assetUrl: string): string {
  return absUrl(assetUrl);
}

export const LOGO_URL = absUrl("/brand/lbb-logo.svg");
export const OG_IMAGE = absUrl("/icons/icon-512.png");
export const NOINDEX = { name: "robots", content: "noindex, nofollow" } as const;

type MetaEntry =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
}): MetaEntry[] {
  const { title, description, path, image, type = "website", noindex = false } = opts;
  const url = absUrl(path);
  const socialImage = image ? absAsset(image) : OG_IMAGE;

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:locale", content: SITE_LOCALE },
    { property: "og:image", content: socialImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: socialImage },
  ];
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

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absUrl("/"),
    logo: LOGO_URL,
    description: SITE_DESCRIPTION,
    sameAs: [INSTAGRAM_URL],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absUrl("/"),
    inLanguage: SITE_LANGUAGE,
  };
}

/** Safe JSON-LD serialization for inline script content. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
