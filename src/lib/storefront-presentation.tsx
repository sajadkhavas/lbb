import { createContext, useContext, type ReactNode } from "react";

import type { ProductSummaryDto } from "@/lib/backend-api";
import { isLiveBackend } from "@/lib/backend-api";
import { safePublicHref } from "@/lib/public-href";
import { fetchStorefront } from "@/lib/storefront-control";

export type PagePresentation = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lede: string;
  sectionLabel: string;
  sectionTitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string | null;
  secondaryCtaLabel: string;
  secondaryCtaHref: string | null;
  socialImageUrl: string | null;
};

export type FaqCategoryPresentation = {
  label: string;
  title: string;
};

export type UtilityLink = {
  label: string;
  href: string;
};

export type StorefrontPresentation = {
  source: "prototype" | "live";
  hero: {
    enabled: boolean;
    imageUrl: string | null;
    imageAlt: string;
    imageFit: "contain" | "cover";
    imagePosition: string;
    primaryCtaHref: string;
    secondaryCtaHref: string;
  };
  sectionLinks: {
    categories: string;
    products: string;
    instagramLookbook: string;
  };
  localStoreLinks: {
    contact: string;
    instagram: string | null;
    shop: string;
  };
  shell: {
    shopMenuLabel: string;
    footerGroups: {
      shop: string;
      editorial: string;
      service: string;
      personal: string;
      brand: string;
    };
    utilityLinks: UtilityLink[];
  };
  pages: Record<"shop" | "collections" | "lookbook" | "journal" | "faq", PagePresentation>;
  faqCategories: Record<string, FaqCategoryPresentation>;
};

type BootstrapDto = {
  contractVersion: string;
  settings: Record<string, Record<string, unknown>>;
};

const PAGE_DEFAULTS: StorefrontPresentation["pages"] = {
  shop: {
    metaTitle: "فروشگاه LBB | خرید پوشاک خیابانی و استریت‌ویر",
    metaDescription:
      "محصولات موجود LBB را با فیلترهای دسته، سایز، رنگ، قیمت و موجودی مرور کن و برای جزئیات هر مدل وارد صفحه همان محصول شو.",
    eyebrow: "فروشگاه / ال‌بی‌بی / مهستان",
    title: "استایل تو، قانون تو.",
    lede: "قطعه‌های ال‌بی‌بی را بر اساس دسته، رنگ، سایز و موجودی کشف کن؛ یا مستقیم چیزی را که می‌خواهی جست‌وجو کن.",
    sectionLabel: "SHOP BY CATEGORY",
    sectionTitle: "از دسته شروع کن",
    primaryCtaLabel: "",
    primaryCtaHref: null,
    secondaryCtaLabel: "",
    secondaryCtaHref: null,
    socialImageUrl: null,
  },
  collections: {
    metaTitle: "کالکشن‌های LBB | روایت‌های ادیتوریال و مسیرهای کشف",
    metaDescription: "کالکشن‌های منتشرشده LBB و مسیرهای کشف محصول.",
    eyebrow: "LBB / PUBLISHED COLLECTIONS",
    title: "کالکشن‌های منتشرشده",
    lede: "این فهرست از Backend می‌آید. فقط کالکشن و عضویت محصولی که برای انتشار معتبر است نمایش داده می‌شود.",
    sectionLabel: "",
    sectionTitle: "",
    primaryCtaLabel: "مرور فروشگاه",
    primaryCtaHref: "/shop",
    secondaryCtaLabel: "لوک‌بوک ادیتوریال",
    secondaryCtaHref: "/lookbook",
    socialImageUrl: null,
  },
  lookbook: {
    metaTitle: "لوک‌بوک LBB | داستان‌های تصویری و مسیرهای مرتبط",
    metaDescription:
      "لوک‌بوک LBB را ببینید؛ داستان‌های تصویری با مسیرهای مرتبط به کالکشن، دسته و در صورت انتشار عمومی، صفحه محصول.",
    eyebrow: "LBB / VISUAL STORIES",
    title: "لوک‌بوک؛ داستان‌های تصویری LBB",
    lede: "تصاویر و مسیرهای این صفحه مستقیماً از محتوای منتشرشده فروشگاه می‌آیند.",
    sectionLabel: "",
    sectionTitle: "",
    primaryCtaLabel: "",
    primaryCtaHref: null,
    secondaryCtaLabel: "",
    secondaryCtaHref: null,
    socialImageUrl: null,
  },
  journal: {
    metaTitle: "ژورنال LBB | راهنمای استایل، پارچه و نگهداری",
    metaDescription:
      "ژورنال LBB: راهنماهای کاربردی درباره استایل، ترکیب رنگ، شناخت پارچه و نگهداری، همراه با مسیرهای مرتبط به کالکشن و دسته‌های فروشگاه.",
    eyebrow: "LBB / EDITORIAL NOTES",
    title: "ژورنال؛ راهنماها و یادداشت‌های منتشرشده LBB",
    lede: "فهرست این صفحه مستقیماً از محتوای منتشرشده در Backend می‌آید.",
    sectionLabel: "",
    sectionTitle: "",
    primaryCtaLabel: "",
    primaryCtaHref: null,
    secondaryCtaLabel: "",
    secondaryCtaHref: null,
    socialImageUrl: null,
  },
  faq: {
    metaTitle: "سوالات متداول LBB | سایز، ارسال و انتخاب محصول",
    metaDescription:
      "پاسخ سوالات متداول LBB درباره اطلاعات محصول، انتخاب سایز و روش‌های ارسال تأییدشده؛ در حالت live پاسخ‌ها از پنل مدیریت می‌آیند.",
    eyebrow: "FAQ / LBB",
    title: "پاسخ‌های روشن پیش از انتخاب و ثبت سفارش",
    lede: "در حالت live، فقط سؤال‌های فعال ثبت‌شده در پنل مدیریت نمایش داده می‌شوند.",
    sectionLabel: "",
    sectionTitle: "",
    primaryCtaLabel: "",
    primaryCtaHref: null,
    secondaryCtaLabel: "",
    secondaryCtaHref: null,
    socialImageUrl: null,
  },
};

const LOCAL_PRESENTATION: StorefrontPresentation = {
  source: "prototype",
  hero: {
    enabled: true,
    imageUrl: null,
    imageAlt: "",
    imageFit: "contain",
    imagePosition: "center center",
    primaryCtaHref: "/shop",
    secondaryCtaHref: "/contact",
  },
  sectionLinks: {
    categories: "/shop",
    products: "/shop",
    instagramLookbook: "/lookbook",
  },
  localStoreLinks: {
    contact: "/contact",
    instagram: null,
    shop: "/shop",
  },
  shell: {
    shopMenuLabel: "فروشگاه",
    footerGroups: {
      shop: "خرید",
      editorial: "کالکشن و محتوا",
      service: "پشتیبانی",
      personal: "شخصی",
      brand: "برند",
    },
    utilityLinks: [
      { label: "قوانین", href: "/terms" },
      { label: "حریم خصوصی", href: "/privacy" },
      { label: "تماس", href: "/contact" },
    ],
  },
  pages: PAGE_DEFAULTS,
  faqCategories: {
    products: { label: "PRODUCT DATA", title: "محصول و موجودی" },
    sizing: { label: "FIT & SIZE", title: "فیت و انتخاب سایز" },
    ordering: { label: "ORDER FLOW", title: "قیمت و ثبت سفارش" },
    shipping: { label: "SHIPPING", title: "ارسال و تحویل" },
    returns: { label: "RETURNS", title: "تعویض و مرجوعی" },
    editorial: { label: "EDITORIAL", title: "محتوا و راهنما" },
    general: { label: "GENERAL", title: "سوالات عمومی" },
  },
};

function objectAt(settings: BootstrapDto["settings"], group: string, key: string) {
  const value = settings[group]?.[key];
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function nullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function publicHref(value: unknown, fallback: string) {
  const href = typeof value === "string" ? safePublicHref(value) : null;
  return href ?? fallback;
}

function optionalPublicHref(value: unknown) {
  return typeof value === "string" ? safePublicHref(value) : null;
}

function pagePresentation(raw: unknown, fallback: PagePresentation): PagePresentation {
  const value =
    raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  return {
    metaTitle: stringValue(value.metaTitle, fallback.metaTitle),
    metaDescription: stringValue(value.metaDescription, fallback.metaDescription),
    eyebrow: stringValue(value.eyebrow, fallback.eyebrow),
    title: stringValue(value.title, fallback.title),
    lede: stringValue(value.lede, fallback.lede),
    sectionLabel: stringValue(value.sectionLabel, fallback.sectionLabel),
    sectionTitle: stringValue(value.sectionTitle, fallback.sectionTitle),
    primaryCtaLabel: stringValue(value.primaryCtaLabel, fallback.primaryCtaLabel),
    primaryCtaHref: optionalPublicHref(value.primaryCtaHref) ?? fallback.primaryCtaHref,
    secondaryCtaLabel: stringValue(value.secondaryCtaLabel, fallback.secondaryCtaLabel),
    secondaryCtaHref: optionalPublicHref(value.secondaryCtaHref) ?? fallback.secondaryCtaHref,
    socialImageUrl: nullableString(value.socialImageUrl),
  };
}

export async function resolveStorefrontPresentation(): Promise<StorefrontPresentation> {
  if (!isLiveBackend()) return LOCAL_PRESENTATION;

  const bootstrap = await fetchStorefront<BootstrapDto>("/api/v1/storefront/bootstrap");
  const home = objectAt(bootstrap.settings, "home", "home.presentation");
  const sectionCopy = objectAt(bootstrap.settings, "home", "home.section_copy");
  const categoriesCopy = sectionCopy.categories as Record<string, unknown> | undefined;
  const productsCopy = sectionCopy.products as Record<string, unknown> | undefined;
  const instagramCopy = sectionCopy.instagram as Record<string, unknown> | undefined;
  const localStore = objectAt(bootstrap.settings, "home", "home.local_store");
  const shell = objectAt(bootstrap.settings, "shell", "shell.copy");
  const rawFooterGroups =
    shell.footerGroups && typeof shell.footerGroups === "object"
      ? (shell.footerGroups as Record<string, unknown>)
      : {};
  const rawUtilityLinks = Array.isArray(shell.utilityLinks) ? shell.utilityLinks : [];
  const rawPages = objectAt(bootstrap.settings, "page", "page.presentation");
  const rawFaqCategories = objectAt(bootstrap.settings, "faq", "faq.presentation");

  const utilityLinks = rawUtilityLinks.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const row = item as Record<string, unknown>;
    const href = optionalPublicHref(row.href);
    const label = nullableString(row.label);
    return href && label ? [{ href, label }] : [];
  });

  const faqCategories: Record<string, FaqCategoryPresentation> = {};
  for (const [key, raw] of Object.entries(rawFaqCategories)) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const row = raw as Record<string, unknown>;
    faqCategories[key] = {
      label: stringValue(row.label, key.toUpperCase()),
      title: stringValue(row.title, "سوالات عمومی"),
    };
  }

  return {
    source: "live",
    hero: {
      enabled: home.heroEnabled !== false,
      imageUrl: nullableString(home.heroImageUrl),
      imageAlt: stringValue(home.heroImageAlt, ""),
      imageFit: home.heroImageFit === "cover" ? "cover" : "contain",
      imagePosition: stringValue(home.heroImagePosition, "center center"),
      primaryCtaHref: publicHref(home.primaryCtaHref, "/shop"),
      secondaryCtaHref: publicHref(home.secondaryCtaHref, "/contact"),
    },
    sectionLinks: {
      categories: publicHref(categoriesCopy?.actionHref, "/shop"),
      products: publicHref(productsCopy?.actionHref, "/shop"),
      instagramLookbook: publicHref(instagramCopy?.lookbookHref, "/lookbook"),
    },
    localStoreLinks: {
      contact: publicHref(localStore.contactHref, "/contact"),
      instagram: optionalPublicHref(localStore.instagramHref),
      shop: publicHref(localStore.shopHref, "/shop"),
    },
    shell: {
      shopMenuLabel: stringValue(shell.shopMenuLabel, "فروشگاه"),
      footerGroups: {
        shop: stringValue(rawFooterGroups.shop, "خرید"),
        editorial: stringValue(rawFooterGroups.editorial, "کالکشن و محتوا"),
        service: stringValue(rawFooterGroups.service, "پشتیبانی"),
        personal: stringValue(rawFooterGroups.personal, "شخصی"),
        brand: stringValue(rawFooterGroups.brand, "برند"),
      },
      utilityLinks: utilityLinks.length > 0 ? utilityLinks : LOCAL_PRESENTATION.shell.utilityLinks,
    },
    pages: {
      shop: pagePresentation(rawPages.shop, PAGE_DEFAULTS.shop),
      collections: pagePresentation(rawPages.collections, PAGE_DEFAULTS.collections),
      lookbook: pagePresentation(rawPages.lookbook, PAGE_DEFAULTS.lookbook),
      journal: pagePresentation(rawPages.journal, PAGE_DEFAULTS.journal),
      faq: pagePresentation(rawPages.faq, PAGE_DEFAULTS.faq),
    },
    faqCategories:
      Object.keys(faqCategories).length > 0 ? faqCategories : LOCAL_PRESENTATION.faqCategories,
  };
}

export async function resolveStorefrontHomeProducts(): Promise<ProductSummaryDto[]> {
  if (!isLiveBackend()) return [];
  return fetchStorefront<ProductSummaryDto[]>("/api/v1/storefront/home-products");
}

const StorefrontPresentationContext = createContext<StorefrontPresentation>(LOCAL_PRESENTATION);

export function StorefrontPresentationProvider({
  value,
  children,
}: {
  value: StorefrontPresentation;
  children: ReactNode;
}) {
  return (
    <StorefrontPresentationContext.Provider value={value}>
      {children}
    </StorefrontPresentationContext.Provider>
  );
}

export function useStorefrontPresentation() {
  return useContext(StorefrontPresentationContext);
}

export function prototypeStorefrontPresentation() {
  return LOCAL_PRESENTATION;
}
