import { BackendApiError } from "@/lib/backend-api";
import { resolveStorefrontPage, type StorefrontPageDto } from "@/lib/storefront-control";

/**
 * Published content pages are optional during the controlled activation window.
 * A missing page (404) means "not published from Admin yet" and must not crash SSR.
 * Contract, network and other backend failures remain hard failures.
 */
export async function resolveOptionalStorefrontPage(
  slug: string,
): Promise<StorefrontPageDto | null> {
  try {
    return await resolveStorefrontPage(slug);
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 404) return null;
    throw error;
  }
}

export function contentParagraphs(content: string | null): string[] {
  if (!content) return [];

  return content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .split(/\n+/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}
