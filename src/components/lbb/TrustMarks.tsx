import { ExternalLink } from "lucide-react";
import { STORE_SETTINGS, canDisplayEnamad } from "@/lib/store-settings";

export function TrustMarks() {
  if (!canDisplayEnamad()) return null;

  const { enamad } = STORE_SETTINGS;
  if (!enamad.verificationUrl || !enamad.badgeImageUrl) return null;

  return (
    <section aria-label="نمادهای اعتماد فروشگاه" className="mt-6">
      <p className="tech text-mute">TRUST</p>
      <a
        href={enamad.verificationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-20 items-center gap-3 border border-hairline bg-carbon px-4 py-3 text-metal transition-colors hover:border-signal hover:text-bone"
      >
        <img
          src={enamad.badgeImageUrl}
          alt={enamad.altText}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          className="h-16 w-16 object-contain"
        />
        <span className="flex items-center gap-2 text-xs font-semibold">
          بررسی اعتبار نماد
          <ExternalLink size={14} aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
