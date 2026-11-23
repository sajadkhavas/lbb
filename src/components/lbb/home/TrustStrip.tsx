import {
  CircleHelp,
  Headphones,
  MapPin,
  PackageCheck,
  Ruler,
  ScanText,
  type LucideIcon,
} from "lucide-react";
import { safePublicHref } from "@/lib/public-href";
import { useStorefrontControl } from "@/lib/storefront-control";

const ICONS: Record<string, LucideIcon> = {
  details: ScanText,
  size: Ruler,
  location: MapPin,
  shipping: PackageCheck,
  support: Headphones,
};

export function TrustStrip() {
  const { trust } = useStorefrontControl();
  const items = trust.filter((item) => item.enabled);
  if (items.length === 0) return null;

  return (
    <section
      dir="rtl"
      className="border-t border-hairline bg-obsidian px-[var(--lbb-gutter)] py-2 md:py-8"
      aria-label="ویژگی‌های تجربه خرید از LBB"
    >
      <div className="mx-auto grid max-w-[var(--lbb-shell-max)] grid-flow-col auto-cols-fr gap-1 overflow-x-auto md:grid-flow-row md:gap-4 md:grid-cols-3 md:divide-x md:divide-x-reverse md:divide-hairline-soft">
        {items.map((item, index) => {
          const Icon = ICONS[item.icon] ?? CircleHelp;
          const href = safePublicHref(item.href);
          const content = (
            <>
              <Icon
                size={21}
                className="mt-0.5 size-4 shrink-0 md:size-[21px] text-signal"
                aria-hidden="true"
              />
              <div>
                <p className="text-center text-[10px] leading-4 font-semibold md:text-start md:text-sm text-bone">
                  {item.title}
                </p>
                <p className="mt-1 hidden text-xs md:block leading-6 text-metal">
                  {item.description}
                </p>
              </div>
            </>
          );

          return href ? (
            <a
              key={`${item.title}-${index}`}
              href={href}
              target={href.startsWith("https://") ? "_blank" : undefined}
              rel={href.startsWith("https://") ? "noopener noreferrer" : undefined}
              className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 px-1 py-1 md:flex-row md:items-start md:justify-start md:gap-3 md:px-2 md:py-2 transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:px-5"
            >
              {content}
            </a>
          ) : (
            <div
              key={`${item.title}-${index}`}
              className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 px-1 py-1 md:flex-row md:items-start md:justify-start md:gap-3 md:px-2 md:py-2 md:px-5"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
