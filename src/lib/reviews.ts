export type Review = {
  id: string;
  author: string;
  rating: number; // 1-5
  date: string; // fa display
  isoDate: string;
  title: string;
  body: string;
};

const NAMES = [
  "امیرحسین", "سارا", "علی", "نگار", "محمد", "پریسا", "رضا", "الناز", "حسین", "مهسا",
];

const TITLES = [
  "کیفیت عالی بود", "خیلی راضی‌ام", "ارزش خرید داره", "کمی سایزش بزرگه ولی خوبه",
  "دقیقاً مثل عکس", "بهترین خریدم امسال", "دوخت و پارچه محشره",
];

const BODIES = [
  "پارچه‌ش خیلی خوبه و دوخت هم مرتبه. ارسال هم سریع بود.",
  "رنگش دقیقاً همونی بود که تو عکس‌ها دیدم. راضی‌ام از خریدم.",
  "کیفیت بالاتر از قیمتشه. حتماً باز هم از LBB خرید می‌کنم.",
  "سایزش یکم بزرگ بود برام، پیشنهاد می‌کنم یه سایز کوچیک‌تر بگیرید.",
  "بسته‌بندی و ارسال عالی بود، خود محصول هم فوق‌العاده‌ست.",
  "بعد از چند بار شستشو هم رنگش ثابت مونده، خیلی خوبه.",
];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic sample reviews for a product slug. */
export function reviewsForSlug(slug: string, count = 5): Review[] {
  const base = hashStr(slug);
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const seed = base + i * 97;
    const rating = 3 + (seed % 3); // 3..5, skewed positive
    const day = 1 + ((seed >> 3) % 27);
    const month = 1 + ((seed >> 6) % 12);
    reviews.push({
      id: `${slug}-${i}`,
      author: NAMES[seed % NAMES.length],
      rating,
      date: `${day} ${["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"][month - 1]} ۱۴۰۳`,
      isoDate: `1403-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      title: TITLES[seed % TITLES.length],
      body: BODIES[(seed >> 2) % BODIES.length],
    });
  }
  return reviews;
}

/** Aggregate rating derived from sample reviews (kept consistent with product.avgRating/reviewCount where present). */
export function reviewSummary(slug: string, count = 5) {
  const reviews = reviewsForSlug(slug, count);
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  return { avg: Math.round(avg * 10) / 10, count: reviews.length, reviews };
}
