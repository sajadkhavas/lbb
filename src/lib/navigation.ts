import type { LinkProps } from "@tanstack/react-router";
import { CATEGORY_SLUGS, CATEGORIES } from "@/lib/categories";

export type NavigationItem = {
  label: string;
  latin: string;
  description?: string;
  to: LinkProps["to"];
  params?: LinkProps["params"];
};

export const SHOP_NAVIGATION: NavigationItem[] = [
  { label: "همه محصولات", latin: "SHOP ALL", description: "مشاهده کامل کاتالوگ", to: "/shop" },
  ...CATEGORY_SLUGS.map((slug) => ({
    label: CATEGORIES[slug].nameFa,
    latin: slug.toUpperCase(),
    description: CATEGORIES[slug].heroTagline,
    to: "/$category" as const,
    params: { category: slug },
  })),
];

export const EDITORIAL_NAVIGATION: NavigationItem[] = [
  {
    label: "کالکشن‌ها",
    latin: "COLLECTIONS",
    description: "دراپ‌ها و فصل‌های LBB",
    to: "/collections",
  },
  { label: "لوک‌بوک", latin: "LOOKBOOK", description: "استایل‌ها در بافت شهری", to: "/lookbook" },
  { label: "ژورنال", latin: "JOURNAL", description: "راهنما، فرهنگ و متریال", to: "/journal" },
];

export const SERVICE_NAVIGATION: NavigationItem[] = [
  { label: "راهنمای سایز", latin: "SIZE GUIDE", to: "/size-guide" },
  { label: "ارسال و مرجوعی", latin: "SHIPPING", to: "/shipping-returns" },
  { label: "پیگیری سفارش", latin: "TRACK ORDER", to: "/track-order" },
  { label: "سوالات متداول", latin: "FAQ", to: "/faq" },
  { label: "تماس", latin: "CONTACT", to: "/contact" },
];

export const BRAND_NAVIGATION: NavigationItem[] = [
  { label: "درباره LBB", latin: "ABOUT", to: "/about" },
  { label: "قوانین", latin: "TERMS", to: "/terms" },
  { label: "حریم خصوصی", latin: "PRIVACY", to: "/privacy" },
];

export const PERSONAL_NAVIGATION: NavigationItem[] = [
  { label: "حساب کاربری", latin: "ACCOUNT", to: "/account" },
  { label: "علاقه‌مندی‌ها", latin: "WISHLIST", to: "/wishlist" },
  { label: "سبد خرید", latin: "CART", to: "/cart" },
];

export function navigationHref(item: NavigationItem): string {
  if (item.to === "/$category") {
    const params = item.params as { category?: string } | undefined;
    return params?.category ? `/${params.category}` : "/shop";
  }
  return String(item.to);
}

export function isNavigationItemActive(pathname: string, item: NavigationItem): boolean {
  const href = navigationHref(item);
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
