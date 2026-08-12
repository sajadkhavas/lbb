import { categoryImage } from "@/lib/category-images";
import { communityStudio, dropShabgard, heroMain } from "@/lib/product-images";

const SHOTS = [
  heroMain,
  communityStudio,
  categoryImage("hoodies"),
  dropShabgard,
  categoryImage("shoes"),
];

export function InstagramStrip() {
  return (
    <section dir="rtl" className="bg-black px-6 py-24 md:px-10" aria-label="اینستاگرام LBB">
      <div className="mx-auto max-w-[1600px] text-center">
        <p className="tech text-white/50">@lbbclo</p>
        <div
          dir="rtl"
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0"
        >
          {SHOTS.map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/lbbclo"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square w-[70vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/[0.08] transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:w-auto"
              aria-label="مشاهده پست اینستاگرام LBB"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-4xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                ✦
              </span>
            </a>
          ))}
        </div>
        <div className="mt-10">
          <a
            href="https://www.instagram.com/lbbclo"
            target="_blank"
            rel="noreferrer"
            className="tap-target inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            دنبال ما در اینستاگرام
          </a>
        </div>
      </div>
    </section>
  );
}
