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
  email: string | null;
  instagramHandle: string;
  instagramUrl: string;
  locationLabel: string;
  addressLine: string | null;
  mapUrl: string | null;
  openingHours: string[];
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

export type HomeSectionCopy = {
  hero: {
    helperText: string;
    categoryPrompt: string;
    categoryAnchorLabel: string;
  };
  categories: {
    label: string;
    title: string;
    lede: string;
    actionLabel: string;
  };
  products: {
    label: string;
    title: string;
    lede: string;
    actionLabel: string;
  };
  instagram: {
    followCta: string;
    lookbookCta: string;
  };
};

export type HomeTrustItem = {
  icon: "details" | "size" | "location" | "shipping" | "support" | string;
  title: string;
  description: string;
  href?: string | null;
  enabled: boolean;
};

export type DecisionSupportControl = {
  enabled: boolean;
  label: string;
  title: string;
  lede: string;
  checkLabel: string;
  checks: string[];
  links: Array<{
    label: string;
    latin: string;
    description: string;
    href: string;
  }>;
};

export type LocalStoreControl = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  body: string;
  imageUrl: string | null;
  addressTitle: string;
  instagramTitle: string;
  contactCta: string;
  instagramCta: string;
  shopCta: string;
};

export type FeaturedStoryControl = {
  enabled: boolean;
  collectionSlug: string;
  eyebrow: string;
  storyPoints: string[];
  collectionCta: string;
  lookbookCta: string;
  inventoryNote: string;
};

export type ReturnsPolicyControl = {
  enabled: boolean;
  verification: "missing" | "pending" | "verified";
  exchangeEnabled: boolean;
  returnWindowDays: number | null;
  refundTimeLabel: string | null;
  customerPaysReturnShipping: boolean | null;
  quickIssueNoticeHours: number | null;
};

export type EnamadControl = {
  enabled: boolean;
  verification: "missing" | "pending" | "verified";
  identifier: string | null;
  verificationUrl: string | null;
  badgeImageUrl: string | null;
  altText: string;
  displayLocation: "footer" | "trust-page";
};

export type StorefrontRuntime = {
  checkoutEnabled: boolean;
  payment: {
    enabled: boolean;
    provider: string;
  };
};

export type SeoDefaults = {
  siteName: string;
  locale: string;
  organizationDescription: string;
  instagramUrl: string;
};

export type StorefrontControl = {
  source: "prototype" | "live";
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
  ticker: string[];
  trust: HomeTrustItem[];
  sectionCopy: HomeSectionCopy;
  decisionSupport: DecisionSupportControl;
  localStore: LocalStoreControl;
  featuredStory: FeaturedStoryControl;
  policies: {
    returns: ReturnsPolicyControl;
    enamad: EnamadControl;
  };
  runtime: StorefrontRuntime;
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
  runtime?: StorefrontRuntime;
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
    phone:
      STORE_SETTINGS.contacts.find((channel) => channel.kind === "phone")?.value ?? "026-3256-0477",
    whatsapp:
      STORE_SETTINGS.contacts.find((channel) => channel.kind === "whatsapp")?.value ??
      "0902-858-4879",
    email: STORE_SETTINGS.contacts.find((channel) => channel.kind === "email")?.value ?? null,
    instagramHandle: BRAND.instagramHandle,
    instagramUrl: BRAND.instagramUrl,
    locationLabel: BRAND.physicalLocationShort,
    addressLine: STORE_SETTINGS.location.addressLine,
    mapUrl: null,
    openingHours: STORE_SETTINGS.location.openingHours,
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
  ticker: ["ال‌بی‌بی", "پوشاک خیابانی", "تیشرت", "شلوار", "کتونی", "جوراب", "کرج", "پاساژ مهستان"],
  trust: [
    {
      icon: "details",
      title: "جزئیات روشن محصول",
      description: "جنس، تن‌خور، رنگ و ویژگی‌های هر قطعه پیش از انتخاب در دسترس است",
      href: "/shop",
      enabled: true,
    },
    {
      icon: "size",
      title: "انتخاب آگاهانه اندازه",
      description: "راهنمای اندازه و توضیح تن‌خور برای مقایسه و انتخاب دقیق‌تر",
      href: "/size-guide",
      enabled: true,
    },
    {
      icon: "location",
      title: "حضور در کرج",
      description: BRAND_COPY.storeLocationLabel,
      href: "/contact",
      enabled: true,
    },
  ],
  sectionCopy: {
    hero: {
      helperText: "قیمت، رنگ، سایزهای موجود و تن‌خور هر محصول را قبل از انتخاب بررسی کن.",
      categoryPrompt: "دسته موردنظرت را سریع پیدا کن:",
      categoryAnchorLabel: "دیدن دسته‌بندی‌ها",
    },
    categories: {
      label: "دسته‌بندی محصولات",
      title: "دنبال چی می‌گردی؟",
      lede: "مستقیم وارد دسته دلخواهت شو و مدل‌ها، رنگ‌ها و سایزهای موجود را با هم مقایسه کن.",
      actionLabel: "همه محصولات",
    },
    products: {
      label: "انتخاب‌های ال‌بی‌بی",
      title: "تازه‌ها و انتخاب‌های این هفته",
      lede: "چند انتخاب آماده برای شروع؛ قیمت، رنگ و سایز موجود همین‌جا مشخص است.",
      actionLabel: "کاتالوگ کامل",
    },
    instagram: {
      followCta: "دنبال ما در اینستاگرام",
      lookbookCta: "مشاهده لوک‌بوک",
    },
  },
  decisionSupport: {
    enabled: true,
    label: "راهنمای انتخاب",
    title: "قبل از انتخاب، جواب‌ها را داشته باش",
    lede: "اگر بین دو سایز یا مدل مرددی، این راهنماها انتخاب را سریع‌تر و مطمئن‌تر می‌کنند.",
    checkLabel: "قبل از خرید بررسی کن",
    checks: [
      "تن‌خور و جدول اندازه را پیش از انتخاب ببین",
      "رنگ و سایزهای موجود هر محصول را همان لحظه بررسی کن",
      "جنس پارچه و روش نگهداری را در صفحه محصول بخوان",
      "برای پرو و خرید حضوری به فروشگاه مهستان سر بزن",
    ],
    links: [
      {
        label: "راهنمای انتخاب سایز",
        latin: "SIZE / FIT",
        description: "قبل از خرید، فیت و اندازه مناسب را مقایسه کن.",
        href: "/size-guide",
      },
      {
        label: "ارسال و مرجوعی",
        latin: "DELIVERY / RETURNS",
        description: "پیش از سفارش، شرایط ارسال و امکان مرجوعی را بررسی کن.",
        href: "/shipping-returns",
      },
    ],
  },
  localStore: {
    enabled: true,
    eyebrow: "فروشگاه حضوری ال‌بی‌بی",
    title: "آنلاین ببین، در مهستان از نزدیک انتخاب کن.",
    body: "مدل‌ها را در سایت مقایسه کن و اگر دوست داشتی برای دیدن رنگ، جنس و تن‌خور از نزدیک به فروشگاه ال‌بی‌بی در پاساژ مهستان کرج سر بزن.",
    imageUrl: null,
    addressTitle: "آدرس فروشگاه",
    instagramTitle: "مدل‌های تازه در اینستاگرام",
    contactCta: "اطلاعات تماس و مراجعه",
    instagramCta: "پیام در اینستاگرام",
    shopCta: "قبل از مراجعه محصولات را ببین",
  },
  featuredStory: {
    enabled: false,
    collectionSlug: "",
    eyebrow: "استایل پیشنهادی ال‌بی‌بی",
    storyPoints: [],
    collectionCta: "دیدن کالکشن",
    lookbookCta: "ایده‌های بیشتر برای استایل",
    inventoryNote: "برای دیدن موجودی و سایزهای هر قطعه وارد صفحه همان محصول شو.",
  },
  policies: {
    returns: {
      enabled: STORE_SETTINGS.returns.isEnabled,
      verification: STORE_SETTINGS.returns.verification,
      exchangeEnabled: STORE_SETTINGS.returns.exchangeEnabled,
      returnWindowDays: STORE_SETTINGS.returns.returnWindowDays,
      refundTimeLabel: STORE_SETTINGS.returns.refundTimeLabel,
      customerPaysReturnShipping: STORE_SETTINGS.returns.customerPaysReturnShipping,
      quickIssueNoticeHours: null,
    },
    enamad: {
      enabled: STORE_SETTINGS.enamad.isEnabled,
      verification: STORE_SETTINGS.enamad.verification,
      identifier: STORE_SETTINGS.enamad.identifier,
      verificationUrl: STORE_SETTINGS.enamad.verificationUrl,
      badgeImageUrl: STORE_SETTINGS.enamad.badgeImageUrl,
      altText: STORE_SETTINGS.enamad.altText,
      displayLocation: STORE_SETTINGS.enamad.displayLocation,
    },
  },
  runtime: {
    checkoutEnabled: false,
    payment: { enabled: false, provider: "disabled" },
  },
  seo: {
    siteName: BRAND.name,
    locale: "fa_IR",
    organizationDescription: "برند پوشاک خیابانی و استریت‌ویر LBB",
    instagramUrl: BRAND.instagramUrl,
  },
};

function objectSetting<T>(settings: BootstrapDto["settings"], group: string, key: string): T {
  const value = settings[group]?.[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new BackendApiError(`تنظیم ${key} در Backend معتبر نیست.`, {
      code: "storefront_config_invalid",
    });
  }
  return value as T;
}

function arraySetting<T>(settings: BootstrapDto["settings"], group: string, key: string): T[] {
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
    source: "live",
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
      shop: arraySetting<MerchantNavigationItem>(
        bootstrap.settings,
        "navigation",
        "navigation.shop",
      ),
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
    ticker: arraySetting<string>(bootstrap.settings, "home", "home.ticker"),
    trust: arraySetting<HomeTrustItem>(bootstrap.settings, "home", "home.trust"),
    sectionCopy: objectSetting<HomeSectionCopy>(bootstrap.settings, "home", "home.section_copy"),
    decisionSupport: objectSetting<DecisionSupportControl>(
      bootstrap.settings,
      "home",
      "home.decision_support",
    ),
    localStore: objectSetting<LocalStoreControl>(bootstrap.settings, "home", "home.local_store"),
    featuredStory: objectSetting<FeaturedStoryControl>(
      bootstrap.settings,
      "home",
      "home.featured_story",
    ),
    policies: {
      returns: objectSetting<ReturnsPolicyControl>(bootstrap.settings, "policy", "policy.returns"),
      enamad: objectSetting<EnamadControl>(bootstrap.settings, "trust", "trust.enamad"),
    },
    runtime: bootstrap.runtime ?? {
      checkoutEnabled: false,
      payment: { enabled: false, provider: "disabled" },
    },
    seo: objectSetting<SeoDefaults>(bootstrap.settings, "seo", "seo.defaults"),
  };
}

export async function resolveStorefrontPage(slug: string) {
  if (!isLiveBackend()) return null;
  return fetchStorefront<StorefrontPageDto>(`/api/v1/storefront/pages/${encodeURIComponent(slug)}`);
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
