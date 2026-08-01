import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { lifestyle1, lifestyle2, heroMain } from "@/lib/product-images";

const REVIEWS = [
  {
    name: "امیرحسین",
    text: "کیفیت پارچه هودی واقعا فوق‌العاده‌ست. بعد چند بار شست‌وشو هنوز مثل روز اوله. ارسالم خیلی سریع بود.",
    rating: 5,
    img: lifestyle1,
  },
  {
    name: "نگار",
    text: "شلوار کارگو رو گرفتم، سایزبندیش دقیقا مطابق راهنمای سایز بود. دوختش هم خیلی تمیزه.",
    rating: 5,
    img: lifestyle2,
  },
  {
    name: "پارسا",
    text: "طرح‌ها متفاوت از بقیه برندهای بازاره. یه استایل خاص و خودمونی داره که دوستش دارم.",
    rating: 4,
    img: heroMain,
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % REVIEWS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section dir="rtl" className="bg-[#0A0A0A] px-5 py-20 md:px-10" aria-labelledby="testi-title">
      <div className="mx-auto max-w-[900px] text-center">
        <span
          className="text-[11px] uppercase text-[var(--lbb-red)]"
          style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.35em" }}
        >
          نظرات مشتریان
        </span>
        <h2
          id="testi-title"
          className="mt-4 text-[26px] font-bold text-white md:text-[36px] font-display"
        >
          حرف مشتری‌های واقعی
        </h2>

        <div className="relative mt-10 overflow-hidden">
          <div
            ref={trackRef}
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(${index * 100}%)` }}
          >
            {REVIEWS.map((r) => (
              <div key={r.name} className="w-full shrink-0 px-4">
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                  <img
                    src={r.img}
                    alt={r.name}
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < r.rating ? "fill-[var(--lbb-red)] text-[var(--lbb-red)]" : "text-white/20"}
                      />
                    ))}
                  </div>
                  <p className="max-w-md text-sm leading-7 text-white/70">{r.text}</p>
                  <span className="text-xs font-bold text-white/90">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {REVIEWS.map((r, i) => (
            <button
              key={r.name}
              aria-label={`نظر ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 24 : 8,
                background: i === index ? "var(--lbb-red)" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
