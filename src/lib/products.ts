export type CategorySlug = "hoodies" | "pants" | "tshirts" | "shoes" | "socks";

export type FitKey = "oversized" | "boxy" | "relaxed" | "regular" | "true";

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Latin identifier shown as technical metadata next to the Persian name. */
  latinName: string;
  category: CategorySlug;
  price: number; // tomans
  originalPrice?: number;
  colors: string[]; // hex
  sizes: string[];
  /** Sizes that exist in the size run but are currently unavailable. */
  soldOutSizes?: string[];
  inStock: boolean;
  isNew?: boolean;
  /** Curated merchandising order — lower is featured earlier. */
  rank: number;
  shortDescription: string;
  description: string;
  material: string;
  care: string[];
  fit: FitKey;
  fitNote: string;
  sku: string;
  /** Drop the piece belongs to, e.g. "DROP 001". */
  drop: string;
};

export const FIT_LABELS: Record<FitKey, string> = {
  oversized: "اورسایز",
  boxy: "باکسی",
  relaxed: "ریلکس",
  regular: "رگولار",
  true: "اندازه واقعی",
};

const CARE_KNIT = [
  "شست‌وشو با آب سرد و برنامهٔ ملایم",
  "بدون سفیدکننده؛ اتو روی طرح چاپی ممنوع",
  "خشک کردن افقی برای حفظ فرم پارچه",
];
const CARE_DENIM = [
  "شست‌وشوی جداگانه در دفعات اول",
  "پشت‌ورو بشویید تا رنگ ثابت بماند",
  "خشک کردن در سایه، بدون خشک‌کن داغ",
];
const CARE_HARD = [
  "تمیز کردن با پارچهٔ نرم و نم‌دار",
  "دور از حرارت مستقیم و ماشین لباس‌شویی",
  "خشک کردن در دمای محیط",
];

export const fmtToman = (n: number) => n.toLocaleString("fa-IR") + " تومان";

/** Latin/technical numerals for monospace metadata. */
export const fmtNum = (n: number) => n.toLocaleString("fa-IR");

export const products: Product[] = [
  {
    id: "1",
    slug: "lbb-classic-hoodie",
    name: "هودی کلاسیک LBB",
    latinName: "LBB Classic Hoodie",
    category: "hoodies",
    price: 1850000,
    originalPrice: 2100000,
    colors: ["#0A0A0A", "#F2EFE8", "#E6291E"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    soldOutSizes: ["S"],
    inStock: true,
    isNew: true,
    rank: 1,
    shortDescription: "هودی اورسایز با فرنچ‌تری ۳۲۰ گرم و گلدوزی LBB روی سینه.",
    description:
      "هودی کلاسیک LBB از فرنچ‌تری ۳۲۰ گرم دوخته شده؛ برش اورسایز، سرشانهٔ افتاده، کاپشن دولایه و کش دوبل در مچ و پایین‌تنه. قطعهٔ پایهٔ دراپ ۰۰۱ که با هر ست استریت کار می‌کند.",
    material: "پنبه ۱۰۰٪ — فرنچ‌تری ۳۲۰g",
    care: CARE_KNIT,
    fit: "oversized",
    fitNote: "دو سایز بزرگ‌تر از تن‌خور معمول. برای فیت جمع‌تر یک سایز کوچک‌تر بگیرید.",
    sku: "LBB-HD-001",
    drop: "DROP 001",
  },
  {
    id: "2",
    slug: "cargo-street-pants",
    name: "شلوار کارگو استریت",
    latinName: "Street Cargo Pant",
    category: "pants",
    price: 1250000,
    colors: ["#0A0A0A", "#6F6F6F"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    rank: 4,
    shortDescription: "کارگو ریپ‌استاپ با شش جیب عملیاتی و مچ کش‌دار.",
    description:
      "شلوار کارگو LBB با پارچهٔ ریپ‌استاپ سبک، شش جیب کاربردی، کمر کش‌دار با بند و مچ جمع‌شو. ساخته شده برای حرکت روان در شهر.",
    material: "پنبه ۹۵٪ + الاستان ۵٪ — ریپ‌استاپ",
    care: CARE_KNIT,
    fit: "relaxed",
    fitNote: "فیت ریلکس با ساق مخروطی؛ اندازهٔ معمول خودتان را بگیرید.",
    sku: "LBB-PT-001",
    drop: "DROP 001",
  },
  {
    id: "3",
    slug: "lbb-signature-tee",
    name: "تیشرت سیگنیچر LBB",
    latinName: "LBB Signature Tee",
    category: "tshirts",
    price: 780000,
    colors: ["#F2EFE8", "#0A0A0A", "#E6291E"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    isNew: true,
    rank: 2,
    shortDescription: "پنبهٔ سنگین ۲۲۰ گرمی با لوگوی گلدوزی روی سینه.",
    description:
      "تیشرت سیگنیچر با پارچهٔ ۲۲۰ گرمی، برش باکسی، یقهٔ ریب دوبل و لوگوی گلدوزی‌شده. قطعهٔ پایه‌ای که شکلش را از دست نمی‌دهد.",
    material: "پنبه ۱۰۰٪ — جرسی ۲۲۰g",
    care: CARE_KNIT,
    fit: "boxy",
    fitNote: "برش باکسی با آستین کوتاه‌تر؛ برای تن‌خور بلندتر یک سایز بالاتر.",
    sku: "LBB-TS-001",
    drop: "DROP 001",
  },
  {
    id: "4",
    slug: "urban-runner-sneaker",
    name: "کتونی اربن رانر",
    latinName: "Urban Runner",
    category: "shoes",
    price: 2400000,
    originalPrice: 2700000,
    colors: ["#F2EFE8", "#0A0A0A"],
    sizes: ["40", "41", "42", "43", "44"],
    soldOutSizes: ["44"],
    inStock: true,
    rank: 3,
    shortDescription: "زیرهٔ EVA سبک با رویهٔ چرم مصنوعی مقاوم.",
    description:
      "کتونی اربن رانر با زیرهٔ EVA تزریقی برای راحتی طولانی‌مدت، رویهٔ چرم مصنوعی مقاوم و زبانهٔ مشبک. طراحی مینیمال با جزئیات تکنیکال.",
    material: "چرم مصنوعی + زیرهٔ EVA",
    care: CARE_HARD,
    fit: "true",
    fitNote: "اندازهٔ واقعی. برای پای پهن نیم‌سایز بالاتر پیشنهاد می‌شود.",
    sku: "LBB-SH-001",
    drop: "DROP 001",
  },
  {
    id: "5",
    slug: "lbb-crew-socks",
    name: "جوراب ساقدار LBB",
    latinName: "LBB Crew Socks",
    category: "socks",
    price: 180000,
    colors: ["#0A0A0A", "#E6291E"],
    sizes: ["ONE"],
    inStock: true,
    rank: 6,
    shortDescription: "جوراب ساقدار پنبه‌ای با دو خط قرمز سیگنیچر روی ساق.",
    description:
      "جوراب ساقدار LBB از نخ پنبه‌ای فشرده با کشباف ریب، پاشنه و پنجه تقویت‌شده و دو خط قرمز سیگنیچر روی ساق. کش بالای ساق شکل خودش را پس از شست‌وشوهای مکرر حفظ می‌کند.",
    material: "۸۰٪ پنبه، ۱۷٪ پلی‌استر، ۳٪ الاستان",
    care: CARE_HARD,
    fit: "regular",
    fitNote: "فری‌سایز؛ مناسب سایز پای ۳۹ تا ۴۴.",
    sku: "LBB-SO-001",
    drop: "DROP 001",
  },

  {
    id: "6",
    slug: "oversized-black-hoodie",
    name: "هودی اورسایز مشکی",
    latinName: "Oversized Black Hoodie",
    category: "hoodies",
    price: 1950000,
    colors: ["#0A0A0A"],
    sizes: ["M", "L", "XL", "XXL"],
    inStock: true,
    rank: 5,
    shortDescription: "هودی مشکی با پرینت گرافیک بزرگ پشت.",
    description:
      "هودی اورسایز LBB با پرینت گرافیک تمام‌پشت، برش دراپ‌شولدر و پارچهٔ فلیس ضخیم. یکی از سنگین‌وزن‌های دراپ ۰۰۱.",
    material: "پنبه ۱۰۰٪ — فلیس",
    care: CARE_KNIT,
    fit: "oversized",
    fitNote: "اورسایز واقعی؛ اندازهٔ معمول برای تن‌خور بلوکی.",
    sku: "LBB-HD-002",
    drop: "DROP 001",
  },
  {
    id: "7",
    slug: "denim-baggy-jean",
    name: "جین بگی دنیم",
    latinName: "Baggy Denim",
    category: "pants",
    price: 1650000,
    colors: ["#1a3c6e", "#0A0A0A"],
    sizes: ["30", "32", "34", "36"],
    inStock: true,
    isNew: true,
    rank: 7,
    shortDescription: "دنیم ۱۴ اونس با برش بگی ۹۰s.",
    description:
      "جین بگی LBB از دنیم ۱۴ اونس با شست‌شوی دستی، برش بگی الهام‌گرفته از دههٔ نود و دوخت زنجیره‌ای در پاچه.",
    material: "دنیم پنبه ۱۰۰٪ — ۱۴oz",
    care: CARE_DENIM,
    fit: "relaxed",
    fitNote: "کمر روی استخوان لگن می‌نشیند؛ پاچهٔ گشاد و بلند.",
    sku: "LBB-PT-002",
    drop: "DROP 001",
  },
  {
    id: "8",
    slug: "graphic-tee-red",
    name: "تیشرت گرافیک قرمز",
    latinName: "Graphic Tee — Signal",
    category: "tshirts",
    price: 720000,
    colors: ["#E6291E"],
    sizes: ["S", "M", "L", "XL"],
    inStock: false,
    rank: 8,
    shortDescription: "پرینت خیابانی روی جرسی سنگین.",
    description:
      "تیشرت گرافیک قرمز سیگنال با پرینت اسکرین خیابانی و برش رگولار. دوباره موجود می‌شود.",
    material: "پنبه ۱۰۰٪ — جرسی ۲۰۰g",
    care: CARE_KNIT,
    fit: "regular",
    fitNote: "برش رگولار؛ اندازهٔ معمول خودتان را بگیرید.",
    sku: "LBB-TS-002",
    drop: "DROP 001",
  },
];

export const PRODUCT_COUNT = products.length;

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const productsByCategory = (cat: CategorySlug) =>
  products.filter((p) => p.category === cat);

/** Curated bestsellers (merchandising order, not fabricated sales data). */
export const bestSellers = (n = 4) =>
  [...products].sort((a, b) => a.rank - b.rank).slice(0, n);

export const isSizeAvailable = (p: Product, size: string) =>
  p.inStock && !(p.soldOutSizes ?? []).includes(size);

export const discountPercent = (p: Product) =>
  p.originalPrice && p.originalPrice > p.price
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;
