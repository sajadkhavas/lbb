import { CircleHelp, Headphones, MapPin, PackageCheck, Ruler, ScanText, type LucideIcon } from "lucide-react";
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
      className="border-t border-hairline bg-obsidian px-[var(--lbb-gutter)] py-8"
      aria-label="ویژگی‌های تجربه خرید از LBB"
    >
      <div className="mx-auto grid max-w-[var(--lbb-shell-max)] grid-cols-1 gap-4 md:grid-cols-3 md:divide-x md:divide-x-reverse md:divide-hairline-soft">
        {items.map((item, index) => {
          const Icon = ICONS[item.icon] ?? CircleHelp;
          const content = (
            <>
              <Icon size={21} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-bone">{item.title}</p>
                <p className="mt-1 text-xs leading-6 text-metal">{item.description}</p>
              </div>
            </>
          );

          return item.href ? (
            <a
              key={`${item.title}-${index}`}
              href={item.href}
              className="flex items-start gap-3 px-2 py-2 transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:px-5"
            >
              {content}
            </a>
          ) : (
            <div key={`${item.title}-${index}`} className="flex items-start gap-3 px-2 py-2 md:px-5">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
