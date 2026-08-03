import type { CategorySlug } from "./products";

export type Collection = {
  slug: string;
  nameFa: string;
  latinName: string;
  tagline: string;
  metaTitle: string;
  metaDesc: string;
  description: string;
  editorialNote: string;
  storyPoints: string[];
  productSlugs: string[];
  categoryHint?: CategorySlug;
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "drop-01-shabgard",
    nameFa: "دراپ ۰۱ — شبگرد",
    latinName: "DROP 01 / SHABGARD",
    tagline: "پالت تیره، حجم‌های آزاد و یک جزئیات قرمز برای استایل شبانه",
    metaTitle: "کالکشن شبگرد | هودی، کارگو، کتونی و جوراب LBB",
    metaDesc:
      "کالکشن شبگرد LBB را ببینید؛ انتخابی هماهنگ از هودی مشکی، شلوار کارگو، کتونی و جوراب ساقدار برای ساخت یک ست تیره و یکدست.",
    description:
      "شبگرد یک انتخاب ادیتوریال از قطعه‌های تیره کاتالوگ LBB است. هودی اورسایز، کارگو، کتونی و جوراب ساقدار کنار هم قرار گرفته‌اند تا بدون شلوغی رنگی، یک سیلوئت کامل و قابل‌استفاده بسازند.",
    editorialNote:
      "برای حفظ تعادل، حجم هودی و کارگو را با کتونی روشن یا جوراب قرمز بشکنید. وضعیت موجودی و سایز هر قطعه در صفحه همان محصول نمایش داده می‌شود.",
    storyPoints: ["پالت مشکی و خاکستری", "تمرکز روی لایه‌سازی", "جزئیات قرمز کنترل‌شده"],
    productSlugs: [
      "oversized-black-hoodie",
      "cargo-street-pants",
      "urban-runner-sneaker",
      "lbb-crew-socks",
    ],
  },
  {
    slug: "drop-02-atashe-sorkh",
    nameFa: "دراپ ۰۲ — آتش سرخ",
    latinName: "DROP 02 / SIGNAL RED",
    tagline: "قرمز سیگنال در کنار قطعه‌های پایه مشکی و استخوانی",
    metaTitle: "کالکشن آتش سرخ | تیشرت، هودی و جوراب قرمز LBB",
    metaDesc:
      "کالکشن آتش سرخ LBB: ترکیبی از تیشرت گرافیک قرمز، هودی کلاسیک، تیشرت سیگنیچر و جوراب ساقدار با محوریت رنگ قرمز.",
    description:
      "آتش سرخ روی استفاده محدود و هدفمند از رنگ قرمز تمرکز دارد. یک قطعه شاخص در کنار رنگ‌های خنثی، استایل را قابل‌تشخیص نگه می‌دارد بدون این‌که ترکیب نهایی شلوغ شود.",
    editorialNote:
      "اگر تیشرت قرمز را انتخاب می‌کنید، باقی ست را خنثی نگه دارید. برای استفاده ملایم‌تر از رنگ، جوراب قرمز را به‌عنوان جزئیات پایانی وارد کنید.",
    storyPoints: ["یک رنگ شاخص", "پایه‌های خنثی", "قابل‌استفاده در چند فصل"],
    productSlugs: [
      "graphic-tee-red",
      "lbb-classic-hoodie",
      "lbb-signature-tee",
      "lbb-crew-socks",
    ],
  },
  {
    slug: "capsule-denim",
    nameFa: "کپسول دنیم",
    latinName: "DENIM CAPSULE",
    tagline: "بافت سنگین دنیم در کنار کارگو و یک تیشرت پایه",
    metaTitle: "کپسول دنیم LBB | جین بگی، کارگو و تیشرت سیگنیچر",
    metaDesc:
      "کپسول دنیم LBB را ببینید؛ انتخابی از جین بگی، شلوار کارگو و تیشرت سیگنیچر برای ساخت استایل‌های ساده و لایه‌پذیر.",
    description:
      "کپسول دنیم سه قطعه با نقش‌های روشن کنار هم می‌گذارد: جین بگی برای حجم، کارگو برای بافت تکنیکال و تیشرت سیگنیچر برای ایجاد یک پایه ساده. هر قطعه به‌تنهایی هم با محصولات دیگر فروشگاه قابل‌ترکیب است.",
    editorialNote:
      "برای انتخاب بین جین و کارگو، به فرم دلخواه پایین‌تنه و توضیح فیت هر محصول توجه کنید؛ اندازه‌های موجود مستقیماً در صفحه محصول مشخص شده‌اند.",
    storyPoints: ["دنیم و ریپ‌استاپ", "برش‌های ریلکس", "پایه مناسب برای لایه‌سازی"],
    productSlugs: ["denim-baggy-jean", "cargo-street-pants", "lbb-signature-tee"],
    categoryHint: "pants",
  },
];

export const collectionBySlug = (slug: string) => COLLECTIONS.find((collection) => collection.slug === slug);
