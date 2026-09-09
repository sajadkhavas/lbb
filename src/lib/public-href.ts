export function safePublicHref(value: string | null | undefined): string | null {
  const href = value?.trim();
  if (!href) return null;

  if (href.startsWith("/") && !href.startsWith("//")) return href;

  try {
    const url = new URL(href);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function safeHttpsHref(value: string | null | undefined): string | null {
  const href = value?.trim();
  if (!href) return null;

  try {
    const url = new URL(href);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
