import type { PropsWithChildren } from "react";
import { safePublicHref } from "@/lib/public-href";
import type { MerchantNavigationItem } from "@/lib/storefront-control";

export function isMerchantNavigationItemActive(pathname: string, item: MerchantNavigationItem) {
  const href = safePublicHref(item.href);
  if (!href || href.startsWith("https://")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MerchantNavigationLink({
  item,
  className,
  onNavigate,
  children,
}: PropsWithChildren<{
  item: MerchantNavigationItem;
  className?: string;
  onNavigate?: () => void;
}>) {
  const href = safePublicHref(item.href);
  if (!href) return null;
  const external = href.startsWith("https://");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onNavigate}
      className={className}
    >
      {children ?? item.label}
    </a>
  );
}
