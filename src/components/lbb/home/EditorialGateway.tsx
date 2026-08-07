import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { Frame, SectionHead, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { heroMain, lifestyle1, lifestyle2 } from "@/lib/product-images";

function CardBody({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <Frame
        src={eyebrow === "DROP STORY" ? heroMain : eyebrow === "LOOKBOOK" ? lifestyle1 : lifestyle2}
        alt=""
        ratio="4/3"
        width={1000}
        height={750}
        sizes="(max-width: 767px) 100vw, 33vw"
        className="border-b border-hairline"
        imgClassName="opacity-75 transition-[transform,opacity] duration-500 group-hover:scale-[1.035] group-hover:opacity-100"
        zoom={false}
      />
      <span className="flex flex-1 flex-col p-5 md:p-6">
        <TechLabel tone="signal">{eyebrow}</TechLabel>
        <span className="mt-4 block text-title text-bone">{title}</span>
        <span className="mt-3 block text-sm leading-7 text-metal">{description}</span>
        <span className="mt-auto flex items-center justify-between border-t border-hairline pt-5 text-xs font-black text-bone">
          ادامه مسیر
          <ArrowUpLeft size={17} aria-hidden="true" className="text-mute group-hover:text-signal" />
        </span>
      </span>
    </>
  );
}

export function EditorialGateway() {
  return (
    <section
      dir="rtl"
      aria-labelledby="editorial-gateway-title"
      className="border-t border-hairline bg-obsidian py-14 md:py-20"
      data-f17-editorial="home-gateway"
    >
      <Shell>
        <SectionHead
          index="06"
          label="EDITORIAL PATHS"
          title={<span id="editorial-gateway-title">داستان را ببین و مسیر مرتبط را ادامه بده</span>}
          lede="کالکشن، لوک‌بوک و ژورنال برای توضیح فرم، ترکیب و نگهداری‌اند؛ لینک مستقیم محصول فقط وقتی نمایش داده می‌شود که داده همان محصول برای انتشار عمومی آماده باشد."
          action={
            <Link
              to="/journal"
              className="tech inline-flex min-h-11 items-center gap-2 text-signal"
            >
              همه مقاله‌ها
              <ArrowUpLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          <Link
            to="/collections/$slug"
            params={{ slug: "drop-01-shabgard" }}
            className="group flex min-w-0 flex-col border border-hairline bg-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <CardBody
              eyebrow="DROP STORY"
              title="شبگرد؛ روایت یک پالت تیره"
              description="رنگ، فرم و لایه‌سازی را در یک روایت ادیتوریال ببین و از آن‌جا به مسیرهای مرتبط ادامه بده."
            />
          </Link>

          <Link
            to="/lookbook"
            className="group flex min-w-0 flex-col border border-hairline bg-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <CardBody
              eyebrow="LOOKBOOK"
              title="فرم‌ها را در قاب‌های مختلف ببین"
              description="سیلوئت، حجم و لایه‌سازی را مقایسه کن؛ هر قاب فقط به مقصدی وصل می‌شود که داده معتبر داشته باشد."
            />
          </Link>

          <Link
            to="/journal/$slug"
            params={{ slug: "chetori-hoodie-eversayz-ro-bepoosim" }}
            className="group flex min-w-0 flex-col border border-hairline bg-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            <CardBody
              eyebrow="FIT GUIDE"
              title="چطور هودی اورسایز را متعادل ست کنیم؟"
              description="راهنمای عملی برای حجم، قد لباس، فرم پایین‌تنه و رنگ شاخص، همراه با مسیرهای مرتبط برای ادامه کشف."
            />
          </Link>
        </div>
      </Shell>
    </section>
  );
}
