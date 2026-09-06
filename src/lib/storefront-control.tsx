import { createContext, useContext, type ReactNode } from "react";

import {
  BackendApiError,
  getBackendBaseUrl,
  isLiveBackend,
  LBB_CONTRACT_VERSION,
} from "@/lib/backend-api";
import { BRAND, BRAND_COPY } from "@/lib/brand";
import {
  BRAND_NAVIGATION,
  EDITORIAL_NAVIGATION,
  SERVICE_NAVIGATION,
  SHOP_NAVIGATION,
  navigationHref,
} from "@/lib/navigation";
import { STORE_SETTINGS } from "@/lib/store-settings";

export type MerchantNavigationItem = {
  label: string;
  latin: string;
  description?: string;
  href: string;
};

export type AnnouncementItem = {
  text: string;
  href: string;
};

export type BrandIdentity = {
  name: string;
  nameFa: string;
  category: string;
  city: string;
  province: string;
  physicalLocation: string;
  physicalLocationShort: string;
  instagramHandle: string;
  instagramUrl: string;
  slogan: string;
  storyTitle: string;
  descriptor: string;
  shortIntroduction: string;
};

export type BrandCopy = {
  homepageTitle: string;
  homepageDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  storeLocationLabel: string;
};

export type PublicContact = {
  phone: string;
  whatsapp: string;
  instagramHandle: string;
  instagramUrl: string;
  locationLabel: string;
  city: string;
  province: string;
};

export type BrandIntroControl = {
  enabled: boolean;
  version: string;
  eyebrow: string;
  title: string;
  body: string;
  storyCta: string;
  storeCta: string;
};

export type HomePresentation = {
  heroProductSlug: string;
  categoryOrder: string[];
  sections: string[];
};

export type SeoDefaults = {
  siteName: string;
  locale: string;
  organizationDescription: string;
  instagramUrl: string;
};

export type StorefrontControl = {
  source: "prototype" | "backend";
  contractVersion: string;
  brand: BrandIdentity;
  copy: BrandCopy;
  contact: PublicContact;
  announcements: AnnouncementItem[];
  navigation: {
    shop: MerchantNavigationItem[];
    editorial: MerchantNavigationItem[];
    service: MerchantNavigationItem[];
    brand: MerchantNavigationItem[];
  };
  intro: BrandIntroControl;
  home: HomePresentation;
  seo: SeoDefaults;
};

export type StorefrontPageDto = {
  slug: string;
  type: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
};

export type StorefrontFaqDto = {
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export type StorefrontLookDto = {
  title: string;
  caption: string | null;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
};

export type StorefrontJournalDto = {
  publicId: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  coverUrl: string | null;
  author: string | null;
  publishedAt: string | null;
  content?: string;
};

type BootstrapDto = {
  contractVersion: string;
  settings: Record<string, Record<string, unknown>>;
};

type Envelope<T> = {
  success: true;
  data: T;
  meta: { contractVersion: string; apiVersion: string; requestId?: string };
};

type FailureEnvelope = {
  success: false;
  code?: string;
  message?: string;
  errors?: Record<string, unknown>;
  meta?: { contractVersion?: string };
};

const localNavigation = (items: typeof SHOP_NAVIGATION): MerchantNavigationItem[] =>
  items.map((item) => ({
    label: item.label,
    latin: item.latin,
    description: item.description,
    href: navigationHref(item),
  }));

const LOCAL_CONTROL: StorefrontControl = {
  source: "prototype",
  contractVersion: LBB_CONTRACT_VERSION,
  brand: { ...BRAND },
  copy: { ...BRAND_COPY },
  contact: {
    phone: STORE_SETTINGS.contacts.find((channel) => channel.kind === "phone")?.value ?? "026-3256-0477",
    whatsapp: STORE_SETTINGS.contacts.find((channel) => channel.kind === "whatsapp")?.value ?? "0902-858-4879",
    instagramHandle: BRAND.instagramHandle,
    instagramUrl: BRAND.instagramUrl,
    locationLabel: BRAND.physicalLocationShort,
    city: BRAND.city,
    province: BRAND.province,
  },
  announcements: [
    { text: "LBB؛ الهام‌گرفته از ذهنی خلاق", href: "/shop" },
    { text: "فروشگاه حضوری LBB — کرج، پاساژ مهستان", href: "/contact" },
    { text: "راهنمای سایز اختصاصی برای انتخاب دقیق‌تر", href: "/size-guide" },
  ],
  navigation: {
    shop: localNavigation(SHOP_NAVIGATION),
    editorial: localNavigation(EDITORIAL_NAVIGATION as typeof SHOP_NAVIGATION),
    service: localNavigation(SERVICE_NAVIGATION as typeof SHOP_NAVIGATION),
    brand: localNavigation(BRAND_NAVIGATION as typeof SHOP_NAVIGATION),
  },
  intro: {
    enabled: true,
    version: "v1",
    eyebrow: "LBB / STREETWEAR",
    title: BRAND.storyTitle,
    body: `LBB؛ ${BRAND.slogan}`,
    storyCta: "داستان LBB",
    storeCta: "ورود به فروشگاه",
  },
  home: {
    heroProductSlug: "lbb-signature-tee",
    categoryOrder: ["tshirts", "hoodies", "pants", "shoes", "socks"],
    sections: [
      "ticker",
      "trust",
      "categories",
      "products",
      "drop_story",
      "decision_support",
      "local_store",
      "instagram",
    ],
  },
  seo: {
    siteName: BRAND.name,
    locale: "fa_IR",
    organizationDescription: "برند پوشاک خیابانی و استریت‌ویر LBB",
    instagramUrl: BRAND.instagramUrl,
  },
};

function objectSetting<T>(
  settings: BootstrapDto["settings"],
  group: string,
  key: string,
): T {
  const value = settings[group]?.[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new BackendApiError(`تنظیم ${key} در Backend معتبر نیست.`, {
      code: "storefront_config_invalid",
    });
  }
  return value as T;
}

function arraySetting<T>(
  settings: BootstrapDto["settings"],
  group: string,
  key: string,
): T[] {
  const value = settings[group]?.[key];
  if (!Array.isArray(value)) {
    throw new BackendApiError(`تنظیم ${key} در Backend معتبر نیست.`, {
      code: "storefront_config_invalid",
    });
  }
  return value as T[];
}

export async function fetchStorefront<T>(path: `/api/v1/storefront/${string}`): Promise<T> {
  if (!isLiveBackend()) {
    throw new BackendApiError("Storefront API فقط در حالت live خوانده می‌شود.", {
      code: "storefront_api_not_live",
    });
  }

  let response: Response;
  try {
    response = await fetch(`${getBackendBaseUrl()}${path}`, {
      headers: { Accept: "application/json" },
      credentials: "include",
    });
  } catch {
    throw new BackendApiError("ارتباط با Backend محتوای فروشگاه برقرار نشد.", {
      code: "backend_network_error",
    });
  }

  const payload = (await response.json().catch(() => null)) as Envelope<T> | FailureEnvelope | null;
  if (!payload) {
    throw new BackendApiError("پاسخ Backend محتوای فروشگاه قابل خواندن نیست.", {
      status: response.status,
      code: "backend_invalid_json",
    });
  }

  if (payload.meta?.contractVersion !== LBB_CONTRACT_VERSION) {
    throw new BackendApiError("نسخه قرارداد محتوای Backend با Frontend هم‌خوان نیست.", {
      status: response.status,
      code: "contract_version_mismatch",
    });
  }

  if (!response.ok || payload.success !== true) {
    const failure = payload as FailureEnvelope;
    throw new BackendApiError(failure.message || "درخواست محتوای Backend ناموفق بود.", {
      status: response.status,
      code: failure.code || "storefront_request_failed",
      errors: failure.errors,
    });
  }

  return payload.data;
}

export async function resolveStorefrontControl(): Promise<StorefrontControl> {
  if (!isLiveBackend()) return LOCAL_CONTROL;

  const bootstrap = await fetchStorefront<BootstrapDto>("/api/v1/storefront/bootstrap");
  if (bootstrap.contractVersion !== LBB_CONTRACT_VERSION) {
    throw new BackendApiError("نسخه bootstrap فروشگاه با Frontend هم‌خوان نیست.", {
      code: "contract_version_mismatch",
    });
  }

  return {
    source: "backend",
    contractVersion: bootstrap.contractVersion,
    brand: objectSetting<BrandIdentity>(bootstrap.settings, "brand", "brand.identity"),
    copy: objectSetting<BrandCopy>(bootstrap.settings, "brand", "brand.copy"),
    contact: objectSetting<PublicContact>(bootstrap.settings, "contact", "contact.public"),
    announcements: arraySetting<AnnouncementItem>(
      bootstrap.settings,
      "announcement",
      "announcement.messages",
    ),
    navigation: {
      shop: arraySetting<MerchantNavigationItem>(bootstrap.settings, "navigation", "navigation.shop"),
      editorial: arraySetting<MerchantNavigationItem>(
        bootstrap.settings,
        "navigation",
        "navigation.editorial",
      ),
      service: arraySetting<MerchantNavigationItem>(
        bootstrap.settings,
        "navigation",
        "navigation.service",
      ),
      brand: arraySetting<MerchantNavigationItem>(
        bootstrap.settings,
        "navigation",
        "navigation.brand",
      ),
    },
    intro: objectSetting<BrandIntroControl>(bootstrap.settings, "home", "home.brand_intro"),
    home: objectSetting<HomePresentation>(bootstrap.settings, "home", "home.presentation"),
    seo: objectSetting<SeoDefaults>(bootstrap.settings, "seo", "seo.defaults"),
  };
}

export async function resolveStorefrontPage(slug: string) {
  if (!isLiveBackend()) return null;
  return fetchStorefront<StorefrontPageDto>(
    `/api/v1/storefront/pages/${encodeURIComponent(slug)}`,
  );
}

export async function resolveStorefrontFaqs() {
  if (!isLiveBackend()) return null;
  return fetchStorefront<StorefrontFaqDto[]>("/api/v1/storefront/faqs");
}

export async function resolveStorefrontLookbook() {
  if (!isLiveBackend()) return null;
  return fetchStorefront<StorefrontLookDto[]>("/api/v1/storefront/lookbook");
}

export async function resolveStorefrontJournal() {
  if (!isLiveBackend()) return null;
  return fetchStorefront<StorefrontJournalDto[]>("/api/v1/storefront/journal");
}

export async function resolveStorefrontJournalPost(slug: string) {
  if (!isLiveBackend()) return null;
  return fetchStorefront<StorefrontJournalDto>(
    `/api/v1/storefront/journal/${encodeURIComponent(slug)}`,
  );
}

const StorefrontControlContext = createContext<StorefrontControl>(LOCAL_CONTROL);

export function StorefrontControlProvider({
  value,
  children,
}: {
  value: StorefrontControl;
  children: ReactNode;
}) {
  return (
    <StorefrontControlContext.Provider value={value}>{children}</StorefrontControlContext.Provider>
  );
}

export function useStorefrontControl() {
  return useContext(StorefrontControlContext);
}

export function prototypeStorefrontControl() {
  return LOCAL_CONTROL;
}
