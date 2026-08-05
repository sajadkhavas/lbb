import { Database, ShieldCheck, WalletCards } from "lucide-react";

const ITEMS = [
  {
    Icon: ShieldCheck,
    title: "نسخه نمایشی شفاف",
    sub: "هیچ سفارش، ارسال یا مرجوعی واقعی در این نسخه انجام نمی‌شود",
  },
  {
    Icon: Database,
    title: "ذخیره محلی سبد",
    sub: "سبد و علاقه‌مندی فقط در مرورگر همین دستگاه نگه‌داری می‌شوند",
  },
  {
    Icon: WalletCards,
    title: "پرداخت غیرفعال",
    sub: "هیچ درگاه بانکی یا پرداخت در محل به سایت متصل نیست",
  },
];

export function TrustStrip() {
  return (
    <section
      dir="rtl"
      className="border-t border-hairline bg-obsidian px-[var(--lbb-gutter)] py-8"
      aria-label="وضعیت فعلی فروشگاه نمایشی"
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
