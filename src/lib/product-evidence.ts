import type { Product } from "./product-catalog";

export type ProductEvidenceState = "verified" | "pending" | "missing";
export type ProductPublicationState = "draft" | "published" | "archived";

export const PRODUCT_EVIDENCE_FIELDS = [
  "name",
  "media",
  "price",
  "originalPrice",
  "colors",
  "sizes",
  "stock",
  "description",
  "material",
  "care",
  "fit",
  "sku",
  "collection",
] as const;

export type ProductEvidenceField = (typeof PRODUCT_EVIDENCE_FIELDS)[number];

export type EvidenceEntry = {
  state: ProductEvidenceState;
  source: string | null;
  reviewedAt: string | null;
  note: string;
};

export type ProductEvidenceRecord = {
  publication: ProductPublicationState;
  fields: Record<ProductEvidenceField, EvidenceEntry>;
};

const pendingEntry = (note: string): EvidenceEntry => ({
  state: "pending",
  source: null,
  reviewedAt: null,
  note,
});

function draftProductEvidence(): ProductEvidenceRecord {
  return {
    publication: "draft",
    fields: {
      name: pendingEntry("نام کالا باید با فهرست واقعی فروشگاه تطبیق داده شود."),
      media: pendingEntry("تصاویر باید به همان کالا، رنگ و نسخهٔ قابل فروش تعلق داشته باشند."),
      price: pendingEntry("قیمت باید از منبع عملیاتی فروشگاه یا پنل کالا دریافت شود."),
      originalPrice: pendingEntry("قیمت پیشین فقط با سابقهٔ واقعی قیمت قابل انتشار است."),
      colors: pendingEntry("رنگ‌ها باید با تنوع واقعی کالا و تصویر محصول تطبیق داده شوند."),
      sizes: pendingEntry("اندازه‌ها باید از جدول و موجودی واقعی همان کالا دریافت شوند."),
      stock: pendingEntry("موجودی باید از سامانهٔ انبار یا تأیید فروشگاه دریافت شود."),
      description: pendingEntry("توضیح محصول باید بر پایهٔ مشاهده یا مشخصات تأمین‌کننده باشد."),
      material: pendingEntry("جنس و درصد الیاف به برچسب کالا یا سند تأمین‌کننده نیاز دارد."),
      care: pendingEntry("روش نگهداری باید از برچسب شست‌وشو یا سازنده دریافت شود."),
      fit: pendingEntry("تن‌خور و پیشنهاد اندازه باید با اندازه‌گیری واقعی ثبت شوند."),
      sku: pendingEntry("شناسهٔ کالا باید با شناسهٔ عملیاتی فروشگاه یکسان باشد."),
      collection: pendingEntry("نام مجموعه یا دراپ باید توسط برند تأیید شود."),
    },
  };
}

/**
 * The eight current catalogue records are retained for interface development only.
 * None is production-publishable until its evidence entries are verified.
 */
export const PRODUCT_EVIDENCE: Record<string, ProductEvidenceRecord> = {
  "lbb-classic-hoodie": draftProductEvidence(),
  "cargo-street-pants": draftProductEvidence(),
  "lbb-signature-tee": draftProductEvidence(),
  "urban-runner-sneaker": draftProductEvidence(),
  "lbb-crew-socks": draftProductEvidence(),
  "oversized-black-hoodie": draftProductEvidence(),
  "denim-baggy-jean": draftProductEvidence(),
  "graphic-tee-red": draftProductEvidence(),
};

export type ProductEvidenceEvaluation = {
  slug: string;
  publication: ProductPublicationState | "untracked";
  publishable: boolean;
  pendingFields: ProductEvidenceField[];
  missingFields: ProductEvidenceField[];
};

export function evaluateProductEvidence(product: Product): ProductEvidenceEvaluation {
  const record = PRODUCT_EVIDENCE[product.slug];
  if (!record) {
    return {
      slug: product.slug,
      publication: "untracked",
      publishable: false,
      pendingFields: [],
      missingFields: [...PRODUCT_EVIDENCE_FIELDS],
    };
  }

  const pendingFields = PRODUCT_EVIDENCE_FIELDS.filter(
    (field) => record.fields[field].state === "pending",
  );
  const missingFields = PRODUCT_EVIDENCE_FIELDS.filter(
    (field) => record.fields[field].state === "missing",
  );
  const allVerified = PRODUCT_EVIDENCE_FIELDS.every((field) => {
    const entry = record.fields[field];
    return entry.state === "verified" && Boolean(entry.source?.trim()) && entry.reviewedAt !== null;
  });

  return {
    slug: product.slug,
    publication: record.publication,
    publishable: record.publication === "published" && allVerified,
    pendingFields,
    missingFields,
  };
}

export function evaluateCatalogEvidence(products: Product[]) {
  const records = products.map(evaluateProductEvidence);
  return {
    total: records.length,
    publishable: records.filter((record) => record.publishable).length,
    drafts: records.filter((record) => record.publication === "draft").length,
    untracked: records.filter((record) => record.publication === "untracked").length,
    ready: records.length > 0 && records.every((record) => record.publishable),
    records,
  } as const;
}
