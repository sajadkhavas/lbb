import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, CheckCircle2 } from "lucide-react";
import { DeliveryIcon, TeeIcon } from "@/components/lbb/BrandIcon";
import { Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { HOME_DECISION_LINKS } from "@/lib/homepage";

const CHECKS = [
  "تن‌خور و جدول اندازه را پیش از انتخاب ببین",
  "رنگ و سایزهای موجود هر محصول را همان لحظه بررسی کن",
  "جنس پارچه و روش نگهداری را در صفحه محصول بخوان",
  "برای پرو و خرید حضوری به فروشگاه مهستان سر بزن",
];

function DecisionCard({
  index,
  label,
  latin,
  description,
}: {
  index: number;
  label: string;
  latin: string;
  description: string;
}) {
  const GuideIcon = index === 1 ? DeliveryIcon : TeeIcon;

  return (
    <>
      <div>
        <div className="flex items-start justify-between gap-4">
          <TechLabel tone="inverse">
            0{index + 1} / {latin}
          </TechLabel>
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-hairline-ink text-obsidian transition-colors group-hover:border-signal group-hover:bg-signal">
            <GuideIcon className="size-7" aria-hidden="true" />
          </span>
        </div>
        <h3 className="mt-5 text-title text-obsidian">{label}</h3>
        <p className="mt-3 text-sm leading-7 text-graphite">{description}</p>
      </div>
      <span className="mt-8 flex items-center justify-between border-t border-hairline-ink pt-4 text-xs font-black text-obsidian">
        بازکردن راهنما
        <ArrowUpLeft
          size={17}
          aria-hidden="true"
          className="transition-transform group-hover:-translate-x-1 group-hover:translate-y-1"
        />
      </span>
    </>
  );
}

const CARD_CLASS =
  "group flex min-h-[220px] flex-col justify-between rounded-2xl border border-hairline-ink bg-bone p-5 shadow-[0_16px_45px_rgba(0,0,0,0.08)] transition-[transform,background-color,box-shadow] hover:-translate-y-1 hover:bg-steam hover:shadow-[0_22px_60px_rgba(0,0,0,0.13)]";

export function DecisionSupport() {
  return (
    <section
      dir="rtl"
      aria-labelledby="decision-support-title"
      className="border-t border-hairline bg-carbon py-12 text-bone md:py-16"
    >
      <Shell>
        <header className="grid gap-5 border-b border-hairline pb-7 md:grid-cols-[auto_minmax(0,1fr)] md:items-end md:gap-10">
          <div className="flex items-center gap-3">
            <TechLabel tone="signal">04</TechLabel>
            <span aria-hidden="true" className="h-px w-8 bg-hairline" />
            <TechLabel>راهنمای انتخاب</TechLabel>
          </div>
          <div className="md:justify-self-end md:text-left">
            <h2 id="decision-support-title" className="text-display-3 text-bone">
              قبل از انتخاب، جواب‌ها را داشته باش
            </h2>
            <p className="mt-3 max-w-[58ch] text-sm leading-7 text-metal">
              اگر بین دو سایز یا مدل مرددی، این راهنماها انتخاب را سریع‌تر و مطمئن‌تر می‌کنند.
            </p>
          </div>
        </header>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)]">
          <div className="rounded-2xl border border-hairline bg-obsidian p-5 text-bone shadow-raised md:p-6">
            <TechLabel tone="signal">قبل از خرید بررسی کن</TechLabel>
            <ul className="mt-5 space-y-4">
              {CHECKS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-metal">
                  <CheckCircle2
                    size={18}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-signal"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="راهنماهای تصمیم خرید" className="grid gap-3 md:grid-cols-3">
            {HOME_DECISION_LINKS.map((item, index) =>
              item.kind === "journal" ? (
                <Link
                  key={item.label}
                  to="/journal/$slug"
                  params={item.params}
                  className={CARD_CLASS}
                >
                  <DecisionCard index={index} {...item} />
                </Link>
              ) : (
                <Link key={item.label} to={item.to} className={CARD_CLASS}>
                  <DecisionCard index={index} {...item} />
                </Link>
              ),
            )}
          </nav>
        </div>
      </Shell>
    </section>
  );
}
