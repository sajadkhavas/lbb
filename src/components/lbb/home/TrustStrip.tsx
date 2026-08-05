import { MapPin, Ruler, ScanText } from "lucide-react";
import { BRAND_COPY } from "@/lib/brand";

const ITEMS = [
  {
    Icon: ScanText,
    title: "جزئیات روشن محصول",
    sub: "جنس، تن‌خور، رنگ و ویژگی‌های هر قطعه پیش از انتخاب در دسترس است",
  },
  {
    Icon: Ruler,
    title: "انتخاب آگاهانه اندازه",
    sub: "راهنمای اندازه و توضیح تن‌خور برای مقایسه و انتخاب دقیق‌تر",
  },
  {
    Icon: MapPin,
    title: "حضور در کرج",
    sub: BRAND_COPY.storeLocationLabel,
  },
];

export function TrustStrip() {
  return (
    <section
      dir="rtl"
      className="border-t border-hairline bg-obsidian px-[var(--lbb-gutter)] py-8"
      aria-label="ویژگی‌های تجربه خرید از LBB"
    >
      <div className="mx-auto grid max-w-[var(--lbb-shell-max)] grid-cols-1 gap-4 md:grid-cols-3 md:divide-x md:divide-x-reverse md:divide-hairline-soft">
        {ITEMS.map(({ Icon, title, sub }) => (
          <div key={title} className="flex items-start gap-3 px-2 py-2 md:px-5">
            <Icon size={21} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-bone">{title}</p>
              <p className="mt-1 text-xs leading-6 text-metal">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
