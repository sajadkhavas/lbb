import { Truck, RotateCcw, MapPin } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

/** Only factual, verifiable statements — no fabricated guarantees. */
const ITEMS = [
  { Icon: MapPin, title: "ارسال از تهران", sub: "بسته‌بندی و ارسال از انبار تهران" },
  { Icon: RotateCcw, title: "تبادل سایز تا ۷ روز", sub: "امکان تعویض سایز طی یک هفته از دریافت" },
  { Icon: Truck, title: "پرداخت در محل تهران", sub: "برای سفارش‌های داخل تهران" },
];

export function TrustStrip() {
  const ref = useReveal<HTMLElement>({ selector: ".trust-item", y: 16 });

  return (
    <section
      ref={ref}
      dir="rtl"
      className="hairline-t bg-obsidian px-5 py-10 md:px-10"
      aria-label="اطلاعات ارسال و مرجوعی"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 md:grid-cols-3 md:divide-x md:divide-hairline-soft">
        {ITEMS.map(({ Icon, title, sub }) => (
          <div key={title} className="trust-item flex items-start gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-carbon/60">
            <Icon size={22} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
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
