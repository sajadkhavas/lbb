import { StatusTag, TechLabel } from "@/components/lbb/ui/primitives";
import { fmtToman } from "@/lib/products";
import type { ProductDecisionViewModel } from "@/lib/product-decision";

export function ProductIdentity({ model }: { model: ProductDecisionViewModel }) {
  const { identity, pricing, stock } = model;
  const hasIdentity = Boolean(identity.name);
  const effectivePrice = pricing.priceToman ?? pricing.fromToman ?? null;
  const priceRange =
    pricing.fromToman !== null &&
    pricing.fromToman !== undefined &&
    pricing.toToman !== null &&
    pricing.toToman !== undefined &&
    pricing.fromToman !== pricing.toToman;
  const discount =
    effectivePrice !== null &&
    pricing.originalPriceToman !== null &&
    pricing.originalPriceToman > effectivePrice
      ? Math.round(
          ((pricing.originalPriceToman - effectivePrice) / pricing.originalPriceToman) * 100,
        )
      : 0;

  return (
    <section aria-labelledby="pdp-product-title" data-testid="pdp-identity">
      <TechLabel tone={hasIdentity ? "signal" : "metal"}>
        {hasIdentity
          ? [identity.categoryLabel, identity.latinName].filter(Boolean).join(" / ")
          : "PRODUCT DATA PENDING"}
      </TechLabel>
      <h1 id="pdp-product-title" className="mt-2 text-display-2 text-bone">
        {identity.name ?? "اطلاعات محصول در انتظار تأیید"}
      </h1>
      {identity.shortDescription ? (
        <p className="mt-3 text-sm leading-7 text-metal">{identity.shortDescription}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="وضعیت محصول">
        {stock.availability === "available" ? <StatusTag tone="success">موجود</StatusTag> : null}
        {stock.availability === "sold-out" ? <StatusTag tone="out">ناموجود</StatusTag> : null}
        {stock.availability === "unknown" ? (
          <StatusTag tone="neutral">موجودی منتشر نشده</StatusTag>
        ) : null}
        {discount > 0 ? <StatusTag tone="bone">{discount}٪ تخفیف</StatusTag> : null}
      </div>

      {effectivePrice !== null ? (
        <div className="mt-5 flex flex-wrap items-baseline gap-3" aria-label="قیمت محصول">
          <span className="num text-2xl font-bold text-bone">
            {priceRange && pricing.toToman
              ? `${fmtToman(pricing.fromToman!)} تا ${fmtToman(pricing.toToman)}`
              : fmtToman(effectivePrice)}
          </span>
          {pricing.originalPriceToman !== null ? (
            <span className="num text-sm text-mute line-through">
              {fmtToman(pricing.originalPriceToman)}
            </span>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 text-sm font-semibold text-metal">قیمت عمومی در دسترس نیست.</p>
      )}
    </section>
  );
}
