import type { PropsWithChildren } from "react";
import type { MerchantNavigationItem } from "@/lib/storefront-control";

export function isMerchantNavigationItemActive(pathname: string, item: MerchantNavigationItem) {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
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
  return (
    <a href={item.href} onClick={onNavigate} className={className}>
      {children ?? item.label}
    </a>
  );
}
