import { heroMain, lifestyle1, lifestyle2 } from "@/lib/product-images";
import { Band, Frame, TechLabel } from "@/components/lbb/ui/primitives";

const BLOCKS = [
  {
    img: heroMain,
    eyebrow: "طراحی ایرانی",
    title: "ساخته‌شده برای خیابون‌های ما",
    text: "هر تکه از LBB با نگاه به فرهنگ خیابونی ایران طراحی می‌شه؛ نه کپی، نه تقلید. الگوهایی که مال خودمونه.",
  },
  {
    img: lifestyle2,
    eyebrow: "کیفیت پارچه",
    title: "پارچه‌ای که دووم میاره",
    text: "از پنبه ۱۰۰٪ و دوخت‌های تقویت‌شده استفاده می‌کنیم تا بعد از شست‌وشوهای مکرر هم شکل و حسش عوض نشه.",
  },
  {
    img: lifestyle1,
    eyebrow: "روایت برند",
    title: "بیشتر از یه برند، یه جریان",
    text: "LBB با دراپ‌های محدود شکل می‌گیره؛ هر دراپ یه فصل تازه از استایل خیابونی تهرانه.",
  },
];

export function EditorialSplit() {
  return (
    <Band label="روایت برند" className="bg-obsidian px-5 md:px-10">
      <div className="flex flex-col gap-16 md:gap-24">
        {BLOCKS.map((b, i) => (
          <div
            key={b.title}
            className={`flex flex-col items-center gap-8 md:gap-14 ${
              i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            <Frame src={b.img} alt={b.title} ratio="4/3" className="w-full md:w-1/2" width={1200} height={900} />
            <div className="w-full md:w-1/2">
              <TechLabel tone="signal">{b.eyebrow}</TechLabel>
              <h3 className="mt-4 text-display-3 text-bone">{b.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-metal">{b.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Band>
  );
}
