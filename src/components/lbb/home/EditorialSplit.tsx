import { heroMain, lifestyle1, lifestyle2 } from "@/lib/product-images";

const BLOCKS = [
  {
    img: heroMain,
    eyebrow: "طراحی ایرانی",
    title: "ساخته‌شده برای خیابون‌های ما",
    text: "هر تکه از LBB با نگاه به فرهنگ خیابونی ایران طراحی می‌شه؛ نه کپی، نه تقلید. الگوهایی که مال خودمونه.",
  },
  {
    img: lifestyle2,
    eyebrow: "کیفیت پریمیوم",
    title: "پارچه‌ای که دووم میاره",
    text: "از پنبه ۱۰۰٪ و دوخت‌های تقویت‌شده استفاده می‌کنیم تا بعد از ده‌ها بار شست‌وشو هم شکل و حسش عوض نشه.",
  },
  {
    img: lifestyle1,
    eyebrow: "جامعه LBB",
    title: "بیشتر از یه برند، یه جریان",
    text: "هزاران نفر همین الان با LBB استایل خودشونو تعریف کردن. یکی از اون‌ها باش.",
  },
];

export function EditorialSplit() {
  return (
    <section dir="rtl" className="bg-black px-5 py-8 md:px-10 md:py-16" aria-label="روایت برند">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16 md:gap-24">
        {BLOCKS.map((b, i) => (
          <div
            key={b.title}
            className={`flex flex-col items-center gap-8 md:gap-14 ${
              i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            <div className="w-full overflow-hidden rounded-2xl md:w-1/2">
              <img
                src={b.img}
                alt={b.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="w-full md:w-1/2 font-body">
              <span
                className="text-[11px] uppercase text-[var(--lbb-red)]"
                style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.3em" }}
              >
                {b.eyebrow}
              </span>
              <h3
                className="mt-4 text-[26px] font-bold text-white md:text-[36px] font-display"
              >
                {b.title}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/55">{b.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
