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
  const enamad = policies.enamad;
  const visible = Boolean(
    enamad.enabled &&
      enamad.verification === "verified" &&
      enamad.identifier?.trim() &&
      isHttpsUrl(enamad.verificationUrl) &&
      isHttpsUrl(enamad.badgeImageUrl) &&
      enamad.displayLocation === placement,
  );

  if (!visible || !enamad.verificationUrl || !enamad.badgeImageUrl || !enamad.identifier) return null;

  return (
    <section aria-label="نمادهای اعتماد فروشگاه" className="mt-6">
      <p className="tech text-mute">TRUST</p>
      <a
        href={enamad.verificationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-20 items-center gap-3 border border-hairline bg-carbon px-4 py-3 text-metal transition-colors hover:border-signal hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
      >
        <img src={enamad.badgeImageUrl} alt={enamad.altText} width={64} height={64} loading="lazy" decoding="async" className="h-16 w-16 object-contain" />
        <span className="flex flex-col items-start gap-1 text-xs font-semibold">
          <span className="flex items-center gap-2">بررسی اعتبار نماد<ExternalLink size={14} aria-hidden="true" /></span>
          <span className="sr-only">شناسه نماد: {enamad.identifier}</span>
        </span>
      </a>
    </section>
  );
}
