import { evaluateCatalogEvidence } from "./product-evidence";
import { products } from "./products";
import {
  STORE_SETTINGS,
  canDisplayEnamad,
  canOfferPayment,
  getPublicContactChannels,
  getPublicStoreLocation,
  type StoreSettings,
} from "./store-settings";

export type ReadinessSeverity = "blocker" | "required" | "recommended";
export type ReadinessArea =
  | "identity"
  | "location"
  | "contact"
  | "catalog"
  | "shipping"
  | "returns"
  | "payment"
  | "enamad"
  | "legal"
  | "seo";

export type ReadinessCheck = {
  id: string;
  area: ReadinessArea;
  label: string;
  severity: ReadinessSeverity;
  passed: boolean;
  adminField: string;
};

export type LaunchReadinessReport = {
  storefrontContentReady: boolean;
  commerceLaunchReady: boolean;
  checks: ReadinessCheck[];
  blockers: ReadinessCheck[];
  requiredMissing: ReadinessCheck[];
  recommendedMissing: ReadinessCheck[];
};

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

export function evaluateLaunchReadiness(
  settings: StoreSettings = STORE_SETTINGS,
): LaunchReadinessReport {
  const location = getPublicStoreLocation(settings);
  const publicContacts = getPublicContactChannels(settings);
  const catalogEvidence = evaluateCatalogEvidence(products);

  const checks: ReadinessCheck[] = [
    {
      id: "identity.brand",
      area: "identity",
      label: "نام، شهر و جایگاه برند تأیید شده است",
      severity: "blocker",
      passed: true,
      adminField: "brand",
    },
    {
      id: "location.public",
      area: "location",
      label: "حداقل محل عمومی فروشگاه تأیید شده است",
      severity: "required",
      passed: Boolean(location?.city && location.venue),
      adminField: "location.city, location.venue",
    },
    {
      id: "location.complete",
      area: "location",
      label: "نشانی مراجعه شامل طبقه یا واحد و ساعت کاری تکمیل شده است",
      severity: "recommended",
      passed: Boolean(
        location && (location.floor || location.unit) && location.openingHours.length,
      ),
      adminField: "location.floor, location.unit, location.openingHours",
    },
    {
      id: "contact.public",
      area: "contact",
      label: "حداقل یک راه ارتباطی عمومی و تأییدشده وجود دارد",
      severity: "blocker",
      passed: publicContacts.length > 0,
      adminField: "contacts",
    },
    {
      id: "catalog.structure",
      area: "catalog",
      label: "کاتالوگ دارای شناسه، نام و ساختار کامل اطلاعات محصول است",
      severity: "blocker",
      passed:
        products.length > 0 &&
        products.every(
          (product) =>
            hasText(product.slug) &&
            hasText(product.name) &&
            hasText(product.sku) &&
            product.price > 0 &&
            product.sizes.length > 0,
        ),
      adminField: "products",
    },
    {
      id: "catalog.evidence",
      area: "catalog",
      label: "قیمت، موجودی، جنس، اندازه و توضیحات همهٔ کالاها منبع و تاریخ بازبینی دارند",
      severity: "blocker",
      passed: catalogEvidence.ready,
      adminField: "products[].evidence, products[].publication",
    },
    {
      id: "shipping.active",
      area: "shipping",
      label: "حداقل یک روش ارسال تأییدشده و فعال وجود دارد",
      severity: "blocker",
      passed:
        settings.shipping.isEnabled &&
        settings.shipping.verification === "verified" &&
        settings.shipping.methods.some(
          (method) => method.isEnabled && method.verification === "verified",
        ),
      adminField: "shipping",
    },
    {
      id: "returns.policy",
      area: "returns",
      label: "شرایط تعویض، مرجوعی و بازپرداخت تأیید و منتشر شده است",
      severity: "blocker",
      passed:
        settings.returns.isEnabled &&
        settings.returns.verification === "verified" &&
        settings.legal.shippingReturnsPublished,
      adminField: "returns, legal.shippingReturnsPublished",
    },
    {
      id: "payment.public",
      area: "payment",
      label: "تنظیمات عمومی درگاه برای نمایش در فرانت تأیید شده است",
      severity: "blocker",
      passed: canOfferPayment(settings),
      adminField: "payment",
    },
    {
      id: "payment.server",
      area: "payment",
      label: "ایجاد تراکنش، بازگشت از درگاه و تأیید پرداخت سمت سرور پیاده‌سازی شده است",
      severity: "blocker",
      passed: false,
      adminField: "backend.paymentIntegration",
    },
    {
      id: "enamad.public",
      area: "enamad",
      label: "شناسه، نشانی تأیید و تصویر رسمی اینماد ثبت شده است",
      severity: "recommended",
      passed: canDisplayEnamad(settings),
      adminField: "enamad",
    },
    {
      id: "legal.terms",
      area: "legal",
      label: "قوانین فروش و حریم خصوصی نهایی منتشر شده‌اند",
      severity: "blocker",
      passed: settings.legal.termsPublished && settings.legal.privacyPublished,
      adminField: "legal.termsPublished, legal.privacyPublished",
    },
    {
      id: "seo.origin",
      area: "seo",
      label: "دامنهٔ اصلی برای نشانی معیار و داده‌های ساختاریافته تنظیم شده است",
      severity: "blocker",
      passed: Boolean(import.meta.env["VITE_SITE_URL"]),
      adminField: "deployment.VITE_SITE_URL",
    },
  ];

  const blockers = checks.filter((check) => check.severity === "blocker" && !check.passed);
  const requiredMissing = checks.filter((check) => check.severity === "required" && !check.passed);
  const recommendedMissing = checks.filter(
    (check) => check.severity === "recommended" && !check.passed,
  );

  const storefrontContentReady = checks
    .filter((check) => ["identity", "location", "contact", "catalog"].includes(check.area))
    .filter((check) => check.severity !== "recommended")
    .every((check) => check.passed);

  return {
    storefrontContentReady,
    commerceLaunchReady: blockers.length === 0 && requiredMissing.length === 0,
    checks,
    blockers,
    requiredMissing,
    recommendedMissing,
  };
}

export const CATALOG_EVIDENCE_REPORT = evaluateCatalogEvidence(products);
export const LAUNCH_READINESS = evaluateLaunchReadiness();
