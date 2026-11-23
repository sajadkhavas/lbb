import { MerchantNavigationLink } from "@/components/lbb/navigation/MerchantNavigationLink";
import { CtaClasses, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { absUrl } from "@/lib/site";
import type { PagePresentation } from "@/lib/storefront-presentation";

export function ManagedPageHead({
  presentation,
  path,
}: {
  presentation: PagePresentation;
  path: string;
}) {
  return (
    <>
      <title>{presentation.metaTitle}</title>
      <meta name="description" content={presentation.metaDescription} />
      <meta property="og:title" content={presentation.metaTitle} />
      <meta property="og:description" content={presentation.metaDescription} />
      <meta property="og:url" content={absUrl(path)} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={presentation.metaTitle} />
      <meta name="twitter:description" content={presentation.metaDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      {presentation.socialImageUrl ? (
        <>
          <meta property="og:image" content={presentation.socialImageUrl} />
          <meta name="twitter:image" content={presentation.socialImageUrl} />
        </>
      ) : null}
    </>
  );
}

export function ManagedPageIntro({
  presentation,
  maxWidth = "max-w-[62ch]",
}: {
  presentation: PagePresentation;
  maxWidth?: string;
}) {
  return (
    <Shell>
      <TechLabel tone="signal">{presentation.eyebrow}</TechLabel>
      <h1 className="mt-5 max-w-[15ch] text-display-1 text-bone">{presentation.title}</h1>
      <p className={`text-lede mt-5 ${maxWidth}`}>{presentation.lede}</p>
      {presentation.primaryCtaLabel || presentation.secondaryCtaLabel ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {presentation.primaryCtaLabel && presentation.primaryCtaHref ? (
            <MerchantNavigationLink
              item={{
                label: presentation.primaryCtaLabel,
                latin: "PRIMARY CTA",
                href: presentation.primaryCtaHref,
              }}
              className={CtaClasses("signal")}
            />
          ) : null}
          {presentation.secondaryCtaLabel && presentation.secondaryCtaHref ? (
            <MerchantNavigationLink
              item={{
                label: presentation.secondaryCtaLabel,
                latin: "SECONDARY CTA",
                href: presentation.secondaryCtaHref,
              }}
              className={CtaClasses("line")}
            />
          ) : null}
        </div>
      ) : null}
    </Shell>
  );
}
