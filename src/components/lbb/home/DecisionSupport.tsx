import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, CheckCircle2 } from "lucide-react";
import { SectionHead, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { HOME_DECISION_LINKS } from "@/lib/homepage";

const CHECKS = [
  "فیت هر محصول با واژه مشخص و توضیح عملی ثبت شده است",
  "سایز ناموجود قبل از افزودن به سبد قابل مشاهده است",
  "متریال، گرماژ و نگهداری برای تصمیم طولانی‌مدت نمایش داده می‌شود",
  "این نسخه سفارش یا پرداخت واقعی را شبیه‌سازی نمی‌کند",
];

export function DecisionSupport() {
  return (
    <section
      dir="rtl"
      aria-labelledby="decision-support-title"
      className="border-t border-hairline bg-bone py-14 text-obsidian md:py-20"
    >
      <Shell>
        <SectionHead
          index="05"
          label="DECISION SUPPORT"
          title={<span id="decision-support-title" className="text-obsidian">قبل از انتخاب، جواب‌ها را داشته باش</span>}
          lede={<span className="text-graphite">صفحه اصلی فقط الهام نمی‌دهد؛ مسیر رسیدن به اطلاعاتی که تصمیم خرید را عوض می‌کنند نیز مستقیم است.</span>}
        />

        <div className="mt-9 grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="border border-hairline-ink bg-obsidian p-5 text-bone md:p-7">
            <TechLabel tone="signal">PRODUCT TRUTH CHECKLIST</TechLabel>
            <ul className="mt-5 space-y-4">
              {CHECKS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-metal">
                  <CheckCircle2 size={18} aria-hidden="true" className="mt-1 shrink-0 text-signal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="راهنماهای تصمیم خرید" className="grid gap-3 md:grid-cols-3">
            {HOME_DECISION_LINKS.map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                className="group flex min-h-[250px] flex-col justify-between border border-hairline-ink bg-bone p-5 transition-colors hover:bg-steam md:p-6"
              >
                <div>
                  <TechLabel tone="inverse">0{index + 1} / {item.latin}</TechLabel>
                  <h3 className="mt-5 text-title text-obsidian">{item.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-graphite">{item.description}</p>
                </div>
                <span className="mt-8 flex items-center justify-between border-t border-hairline-ink pt-4 text-xs font-black text-obsidian">
                  بازکردن راهنما
                  <ArrowUpLeft
                    size={17}
                    aria-hidden="true"
                    className="transition-transform group-hover:-translate-x-1 group-hover:translate-y-1"
                  />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </Shell>
    </section>
  );
}
