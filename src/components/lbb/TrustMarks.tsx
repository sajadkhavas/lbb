import { ExternalLink } from "lucide-react";
import { useStorefrontControl } from "@/lib/storefront-control";

function isHttpsUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function TrustMarks({ placement = "footer" }: { placement?: "footer" | "trust-page" }) {
  const { policies } = useStorefrontControl();
  const enamad =
    placement === "footer" && !policies.enamad.enabled
      ? {
          enabled: true,
          verification: "verified",
          identifier: "774761",
          verificationUrl:
            "https://trustseal.enamad.ir/?id=774761&Code=pslPwTUJtNnXneJQwC9e0LuaO09OexUP",
          badgeImageUrl:
            "https://trustseal.enamad.ir/logo.aspx?id=774761&Code=pslPwTUJtNnXneJQwC9e0LuaO09OexUP",
          altText: "نماد اعتماد الکترونیکی فروشگاه LBB",
          displayLocation: "footer",
        }
      : policies.enamad;
  const visible = Boolean(
    enamad.enabled &&
    enamad.verification === "verified" &&
    enamad.identifier?.trim() &&
    isHttpsUrl(enamad.verificationUrl) &&
    isHttpsUrl(enamad.badgeImageUrl) &&
    enamad.displayLocation === placement,
  );

  if (!visible || !enamad.verificationUrl || !enamad.badgeImageUrl || !enamad.identifier)
    return null;

  return (
    <section aria-label="نمادهای اعتماد فروشگاه" className="mt-6">
      <p className="tech text-mute">TRUST</p>
      <a
        href={enamad.verificationUrl}
        target="_blank"
        referrerPolicy="origin"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-20 items-center gap-3 border border-hairline bg-carbon px-4 py-3 text-metal transition-colors hover:border-signal hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
      >
        <img
          src={enamad.badgeImageUrl}
          referrerPolicy="origin"
          alt={enamad.altText}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          className="h-16 w-16 object-contain"
        />
        <span className="flex flex-col items-start gap-1 text-xs font-semibold">
          <span className="flex items-center gap-2">
            بررسی اعتبار نماد
            <ExternalLink size={14} aria-hidden="true" />
          </span>
          <span className="sr-only">شناسه نماد: {enamad.identifier}</span>
        </span>
      </a>
    </section>
  );
}
