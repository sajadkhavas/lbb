import { parseFragment, type DefaultTreeAdapterTypes } from "parse5";
import type { ProductDetailDto, VariantDto } from "./backend-api";
import { absAsset, absUrl } from "./site";

function textContent(node: DefaultTreeAdapterTypes.ChildNode): string {
  if ("value" in node) return node.value;
  if (!("tagName" in node) || ["script", "style", "template"].includes(node.tagName)) return "";
  return node.childNodes.map(textContent).join(" ");
}

export function productPlainText(value: string | null | undefined) {
  if (!value) return "";
  const nodes = parseFragment(value).childNodes;
  const decoded = nodes.map(textContent).join(" ");
  const text =
    nodes.length === 1 && nodes[0].nodeName === "#text" && /<\/?[a-z]/i.test(decoded)
      ? parseFragment(decoded).childNodes.map(textContent).join(" ")
      : decoded;
  return text.replace(/\s+/g, " ").trim();
}

function images(product: ProductDetailDto, variant?: VariantDto) {
  const relevant = product.media.filter((image) => {
    if (!variant) return true;
    if (image.variantPublicId) return image.variantPublicId === variant.publicId;
    return !image.colorPublicId || image.colorPublicId === variant.color?.publicId;
  });
  const preferred = variant
    ? relevant.filter((image) => image.variantPublicId || image.colorPublicId)
    : [];
  const primary = product.seo.primaryImage || product.primaryImage;
  const urls = [...preferred, ...relevant].map((image) => image.url);
  if (primary && !variant) urls.unshift(primary);
  if (primary && !urls.length && !product.media.some((image) => image.url === primary)) {
    urls.push(primary);
  }
  return [...new Set(urls.filter(Boolean).map(absAsset))];
}

function offer(url: string, amount: number, available: boolean) {
  return {
    "@type": "Offer",
    url,
    priceCurrency: "IRR",
    price: amount * 10,
    availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  };
}

export function productStructuredData(product: ProductDetailDto, path: string) {
  const url = absUrl(path);
  const description =
    productPlainText(product.shortDescription) || productPlainText(product.description);
  const common = {
    "@context": "https://schema.org",
    name: product.name,
    url,
    description: description || undefined,
    material: product.material || undefined,
    image: images(product),
  };
  const variants = product.variants.filter((variant) => variant.color && variant.size);
  if (variants.length > 1) {
    const groupId = product.publicId;
    return {
      ...common,
      "@type": "ProductGroup",
      productGroupID: groupId,
      variesBy: ["color", "size"]
        .filter(
          (attribute) =>
            new Set(variants.map((v) => (attribute === "color" ? v.color : v.size)?.publicId))
              .size > 1,
        )
        .map((attribute) => `https://schema.org/${attribute}`),
      hasVariant: variants.map((variant) => {
        const variantUrl = `${url}?variant=${encodeURIComponent(variant.publicId)}`;
        return {
          "@type": "Product",
          url: variantUrl,
          name: [product.name, variant.color?.name, variant.size?.name].filter(Boolean).join("، "),
          description: description || undefined,
          inProductGroupWithID: groupId,
          sku: variant.sku || variant.publicId,
          color: variant.color?.name,
          size: variant.size?.code || variant.size?.name,
          image: images(product, variant),
          offers: offer(variantUrl, variant.price.amount, variant.availability),
        };
      }),
    };
  }

  const variant = variants[0];
  const amount = variant?.price.amount ?? product.price.from?.amount;
  return {
    ...common,
    "@type": "Product",
    sku: variant?.sku || undefined,
    color: variant?.color?.name,
    size: variant?.size?.code || variant?.size?.name,
    offers:
      amount === undefined
        ? undefined
        : offer(url, amount, variant?.availability ?? product.availability),
  };
}
