export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number; // tomans
  originalPrice?: number;
  colors: string[]; // hex
  sizes: string[];
  inStock: boolean;
  isNew?: boolean;
  shortDescription: string;
  description: string;
  material: string;
  sku: string;
  avgRating?: number;
  reviewCount?: number;
};

export type CategorySlug = "hoodies" | "pants" | "tshirts" | "shoes" | "accessories";

export const fmtToman = (n: number) =>
  n.toLocaleString("fa-IR") + " تومان";

export const products: Product[] = [
  {
    id: "1", slug: "lbb-classic-hoodie", name: "هودی کلاسیک LBB",
    category: "hoodies", price: 1850000, originalPrice: 2100000,
    colors: ["#0A0A0A", "#FFFFFF", "#E8001D"],
    sizes: ["S", "M", "L", "XL", "XXL"], inStock: true, isNew: true,
    shortDescription: "هودی اورسایز با پارچه ضخیم پنبه‌ای و طرح گلدوزی LBB روی سینه.",
    description: "هودی کلاسیک LBB از پارچه فرنچ‌تری ۳۲۰ گرم دوخته شده. برش اورسایز، سرشانه افتاده و کیفیت دوخت پریمیوم. ایده‌آل برای ست استریت‌ویر روزانه.",
    material: "پنبه ۱۰۰٪", sku: "LBB-HD-001", avgRating: 4.6, reviewCount: 23,
  },
  {
    id: "2", slug: "cargo-street-pants", name: "شلوار کارگو استریت",
    category: "pants", price: 1250000,
    colors: ["#0A0A0A", "#888"], sizes: ["S", "M", "L", "XL"], inStock: true,
    shortDescription: "شلوار کارگو با جیب‌های عملیاتی و کمر کش‌دار.",
    description: "شلوار کارگو LBB با شش جیب کارآمد، پارچه ریپ‌استاپ نازک و مچ کش‌دار. طراحی شده برای حرکت روان.",
    material: "پنبه ۹۵٪ + الاستان ۵٪", sku: "LBB-PT-001", avgRating: 4.4, reviewCount: 12,
  },
  {
    id: "3", slug: "lbb-signature-tee", name: "تیشرت سیگنیچر LBB",
    category: "tshirts", price: 780000,
    colors: ["#FFFFFF", "#0A0A0A", "#E8001D"], sizes: ["S", "M", "L", "XL"], inStock: true, isNew: true,
    shortDescription: "تیشرت پنبه سنگین با لوگوی سوزن‌دوزی LBB.",
    description: "تیشرت سیگنیچر با پارچه ۲۲۰ گرمی، برش باکسی و لوگوی گلدوزی روی سینه. یک قطعه پایه که با همه چیز ست می‌شود.",
    material: "پنبه ۱۰۰٪", sku: "LBB-TS-001", avgRating: 4.8, reviewCount: 41,
  },
  {
    id: "4", slug: "urban-runner-sneaker", name: "کتونی اربن رانر",
    category: "shoes", price: 2400000, originalPrice: 2700000,
    colors: ["#FFFFFF", "#0A0A0A"], sizes: ["40", "41", "42", "43", "44"], inStock: true,
    shortDescription: "کتونی سبک با زیره EVA و رویه چرم مصنوعی.",
    description: "کتونی اربن رانر LBB با تکنولوژی زیره EVA برای راحتی طولانی مدت و رویه چرم مصنوعی مقاوم. طراحی مینیمال، رنگ‌بندی نرم.",
    material: "چرم مصنوعی + EVA", sku: "LBB-SH-001", avgRating: 4.5, reviewCount: 18,
  },
  {
    id: "5", slug: "lbb-cap", name: "کلاه لبه‌دار LBB",
    category: "accessories", price: 420000,
    colors: ["#0A0A0A", "#E8001D"], sizes: ["ONE"], inStock: true,
    shortDescription: "کلاه شش‌ترک با گلدوزی LBB.",
    description: "کلاه لبه‌دار LBB با گلدوزی سه‌بعدی جلو و بند تنظیم پشت. یک قطعه ضروری استریت.",
    material: "پنبه توییل", sku: "LBB-AC-001", avgRating: 4.7, reviewCount: 9,
  },
  {
    id: "6", slug: "oversized-black-hoodie", name: "هودی اورسایز مشکی",
    category: "hoodies", price: 1950000,
    colors: ["#0A0A0A"], sizes: ["M", "L", "XL", "XXL"], inStock: true,
    shortDescription: "هودی مشکی اورسایز با پرینت پشت بزرگ.",
    description: "هودی اورسایز LBB با پرینت گرافیک پشت و برش دراپ‌شولدر.",
    material: "پنبه ۱۰۰٪", sku: "LBB-HD-002",
  },
  {
    id: "7", slug: "denim-baggy-jean", name: "جین بگی دنیم",
    category: "pants", price: 1650000,
    colors: ["#1a3c6e", "#0A0A0A"], sizes: ["30", "32", "34", "36"], inStock: true, isNew: true,
    shortDescription: "شلوار جین با برش بگی و شست‌شوی دستی.",
    description: "جین بگی LBB با پارچه دنیم ۱۴ اونس و برش کلاسیک ۹۰s.",
    material: "دنیم پنبه ۱۰۰٪", sku: "LBB-PT-002",
  },
  {
    id: "8", slug: "graphic-tee-red", name: "تیشرت گرافیک قرمز",
    category: "tshirts", price: 720000,
    colors: ["#E8001D"], sizes: ["S", "M", "L", "XL"], inStock: false,
    shortDescription: "تیشرت گرافیک با پرینت استریت.",
    description: "تیشرت گرافیک قرمز کلاسیک با پرینت خیابانی.",
    material: "پنبه ۱۰۰٪", sku: "LBB-TS-002",
  },
];

export const productBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const productsByCategory = (cat: CategorySlug) =>
  products.filter((p) => p.category === cat);
