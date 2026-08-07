import { BRAND } from "./brand";

export type VerificationState = "verified" | "pending" | "missing";
export type ContactChannelKind = "instagram" | "phone" | "email" | "whatsapp";
export type PaymentProvider = "zarinpal" | "idpay" | "payping" | "saman" | "mellat" | "custom";
export type TrustClaimKey =
  | "physical-store"
  | "product-details"
  | "size-guidance"
  | "secure-payment"
  | "enamad"
  | "shipping"
  | "returns"
  | "support";

export type ContactChannel = {
  kind: ContactChannelKind;
  label: string;
  value: string;
  href: string;
  isPublic: boolean;
  verification: VerificationState;
};

export type StoreLocationSettings = {
  isPublic: boolean;
  verification: VerificationState;
  countryCode: "IR";
  province: string;
  city: string;
  venue: string;
  floor: string | null;
  unit: string | null;
  addressLine: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  openingHours: string[];
};

export type ShippingMethodPublic = {
  id: string;
  title: string;
  description: string;
  feeToman: number | null;
  freeFromToman: number | null;
  processingTimeLabel: string | null;
  deliveryTimeLabel: string | null;
  isEnabled: boolean;
  verification: VerificationState;
};

export type ShippingSettings = {
  isEnabled: boolean;
  verification: VerificationState;
  methods: ShippingMethodPublic[];
  supportedProvinceCodes: string[];
  trackingEnabled: boolean;
  policyPath: "/shipping-returns";
};

export type ReturnsSettings = {
  isEnabled: boolean;
  verification: VerificationState;
  exchangeEnabled: boolean;
  returnWindowDays: number | null;
  refundTimeLabel: string | null;
  customerPaysReturnShipping: boolean | null;
  excludedCategories: string[];
  policyPath: "/shipping-returns";
};

export type PaymentPublicSettings = {
  isEnabled: boolean;
  verification: VerificationState;
  provider: PaymentProvider | null;
  displayName: string | null;
  iconUrl: string | null;
  callbackPath: "/payment/callback";
  paymentMethods: Array<"online-gateway" | "cash-on-delivery">;
};

export type EnamadPublicSettings = {
  isEnabled: boolean;
  verification: VerificationState;
  identifier: string | null;
  verificationUrl: string | null;
  badgeImageUrl: string | null;
  altText: string;
  displayLocation: "footer" | "trust-page";
};

export type LegalSettings = {
  businessOwnerName: string | null;
  businessRegistrationId: string | null;
  taxId: string | null;
  termsPublished: boolean;
  privacyPublished: boolean;
  shippingReturnsPublished: boolean;
  lastReviewedAt: string | null;
};

export type TrustClaim = {
  key: TrustClaimKey;
  title: string;
  description: string;
  href: string | null;
  verification: VerificationState;
  isEnabled: boolean;
};

export type StoreSettings = {
  schemaVersion: 1;
  location: StoreLocationSettings;
  contacts: ContactChannel[];
  shipping: ShippingSettings;
  returns: ReturnsSettings;
  payment: PaymentPublicSettings;
  enamad: EnamadPublicSettings;
  legal: LegalSettings;
  trustClaims: TrustClaim[];
};

/**
 * Public, non-secret storefront configuration.
 *
 * This object may later be hydrated from an admin API. It must never contain
 * merchant keys, gateway secrets, webhook secrets, private tokens or arbitrary HTML.
 */
export const STORE_SETTINGS: StoreSettings = {
  schemaVersion: 1,
  location: {
    isPublic: true,
    verification: "verified",
    countryCode: "IR",
    province: BRAND.province,
    city: BRAND.city,
    venue: BRAND.physicalLocation,
    floor: null,
    unit: null,
    addressLine: null,
    postalCode: null,
    latitude: null,
    longitude: null,
    openingHours: [],
  },
  contacts: [
    {
      kind: "instagram",
      label: "اینستاگرام رسمی LBB",
      value: BRAND.instagramHandle,
      href: BRAND.instagramUrl,
      isPublic: true,
      verification: "verified",
    },
  ],
  shipping: {
    isEnabled: false,
    verification: "missing",
    methods: [],
    supportedProvinceCodes: [],
    trackingEnabled: false,
    policyPath: "/shipping-returns",
  },
  returns: {
    isEnabled: false,
    verification: "missing",
    exchangeEnabled: false,
    returnWindowDays: null,
    refundTimeLabel: null,
    customerPaysReturnShipping: null,
    excludedCategories: [],
    policyPath: "/shipping-returns",
  },
  payment: {
    isEnabled: false,
    verification: "missing",
    provider: null,
    displayName: null,
    iconUrl: null,
    callbackPath: "/payment/callback",
    paymentMethods: [],
  },
  enamad: {
    isEnabled: false,
    verification: "missing",
    identifier: null,
    verificationUrl: null,
    badgeImageUrl: null,
    altText: "نماد اعتماد الکترونیکی LBB",
    displayLocation: "footer",
  },
  legal: {
    businessOwnerName: null,
    businessRegistrationId: null,
    taxId: null,
    termsPublished: false,
    privacyPublished: false,
    shippingReturnsPublished: false,
    lastReviewedAt: null,
  },
  trustClaims: [
    {
      key: "physical-store",
      title: "فروشگاه حضوری در کرج",
      description: "فروشگاه LBB در پاساژ مهستان کرج قرار دارد.",
      href: "/contact",
      verification: "verified",
      isEnabled: true,
    },
    {
      key: "product-details",
      title: "جزئیات روشن محصول",
      description: "جنس، تن‌خور، رنگ و اندازه‌های هر قطعه پیش از انتخاب نمایش داده می‌شود.",
      href: "/shop",
      verification: "verified",
      isEnabled: true,
    },
    {
      key: "size-guidance",
      title: "راهنمای انتخاب اندازه",
      description: "روش اندازه‌گیری و توضیح تن‌خور برای مقایسهٔ دقیق‌تر در دسترس است.",
      href: "/size-guide",
      verification: "verified",
      isEnabled: true,
    },
    {
      key: "secure-payment",
      title: "پرداخت برخط",
      description: "پرداخت از طریق درگاه بانکی تأییدشده انجام می‌شود.",
      href: null,
      verification: "missing",
      isEnabled: false,
    },
    {
      key: "enamad",
      title: "نماد اعتماد الکترونیکی",
      description: "اطلاعات نماد اعتماد فروشگاه از مرجع رسمی قابل بررسی است.",
      href: null,
      verification: "missing",
      isEnabled: false,
    },
    {
      key: "shipping",
      title: "ارسال سفارش",
      description: "روش، هزینه و بازهٔ تحویل پیش از پرداخت نمایش داده می‌شود.",
      href: "/shipping-returns",
      verification: "missing",
      isEnabled: false,
    },
    {
      key: "returns",
      title: "تعویض و مرجوعی",
      description: "شرایط و مهلت درخواست پیش از خرید به‌صورت روشن اعلام می‌شود.",
      href: "/shipping-returns",
      verification: "missing",
      isEnabled: false,
    },
    {
      key: "support",
      title: "پشتیبانی خرید",
      description: "راه ارتباطی تأییدشده برای پرسش‌های پیش و پس از خرید در دسترس است.",
      href: "/contact",
      verification: "verified",
      isEnabled: true,
    },
  ],
};

function isHttpsUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isSafeContactHref(channel: ContactChannel): boolean {
  if (!channel.href.trim()) return false;
  if (channel.kind === "email") return channel.href.startsWith("mailto:");
  if (channel.kind === "phone") return channel.href.startsWith("tel:");
  return isHttpsUrl(channel.href);
}

export function getPublicContactChannels(settings = STORE_SETTINGS): ContactChannel[] {
  return settings.contacts.filter(
    (channel) =>
      channel.isPublic && channel.verification === "verified" && isSafeContactHref(channel),
  );
}

export function getVisibleTrustClaims(settings = STORE_SETTINGS): TrustClaim[] {
  return settings.trustClaims.filter(
    (claim) => claim.isEnabled && claim.verification === "verified",
  );
}

export function getPublicStoreLocation(settings = STORE_SETTINGS): StoreLocationSettings | null {
  return settings.location.isPublic && settings.location.verification === "verified"
    ? settings.location
    : null;
}

export function getPublicShippingMethods(settings = STORE_SETTINGS): ShippingMethodPublic[] {
  if (!settings.shipping.isEnabled || settings.shipping.verification !== "verified") return [];
  return settings.shipping.methods.filter(
    (method) => method.isEnabled && method.verification === "verified",
  );
}

export function canPublishShipping(settings = STORE_SETTINGS): boolean {
  return getPublicShippingMethods(settings).length > 0;
}

export function canPublishReturns(settings = STORE_SETTINGS): boolean {
  return Boolean(
    settings.returns.isEnabled &&
      settings.returns.verification === "verified" &&
      settings.legal.shippingReturnsPublished,
  );
}

export function getPublicEnamad(
  settings = STORE_SETTINGS,
  placement?: EnamadPublicSettings["displayLocation"],
): EnamadPublicSettings | null {
  const { enamad } = settings;
  const allowed = Boolean(
    enamad.isEnabled &&
      enamad.verification === "verified" &&
      enamad.identifier?.trim() &&
      enamad.altText.trim() &&
      isHttpsUrl(enamad.verificationUrl) &&
      isHttpsUrl(enamad.badgeImageUrl) &&
      (!placement || enamad.displayLocation === placement),
  );
  return allowed ? enamad : null;
}

export function canDisplayEnamad(
  settings = STORE_SETTINGS,
  placement?: EnamadPublicSettings["displayLocation"],
): boolean {
  return getPublicEnamad(settings, placement) !== null;
}

export function canOfferPayment(settings = STORE_SETTINGS): boolean {
  const { payment } = settings;
  return Boolean(
    payment.isEnabled &&
      payment.verification === "verified" &&
      payment.provider &&
      payment.displayName?.trim() &&
      payment.paymentMethods.length,
  );
}

export function getPublicPaymentSettings(
  settings = STORE_SETTINGS,
): PaymentPublicSettings | null {
  return canOfferPayment(settings) ? settings.payment : null;
}
