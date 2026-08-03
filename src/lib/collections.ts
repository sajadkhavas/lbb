import type { CategorySlug } from "./products";

export type Collection = {
  slug: string;
  nameFa: string;
  tagline: string;
  metaTitle: string;
  metaDesc: string;
  description: string;
  productSlugs: string[];
  categoryHint?: CategorySlug;
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "drop-01-shabgard",
    nameFa: "دراپ ۰۱ — شبگرد",
    tagline: "کالکشن تمام‌مشکی برای شب‌های تهران",
    metaTitle: "کالکشن شبگرد (Drop 01) | استریت‌ویر مشکی LBB",
    metaDesc:
      "دراپ ۰۱ شبگرد از LBB: کالکشن محدود تمام‌مشکی شامل هودی اورسایز، کتونی و جوراب. ساخته‌شده برای خیابون‌های تاریک شهر.",
    description:
      "شبگرد اولین دراپ کپسولی LBB است؛ مجموعه‌ای محدود که حول رنگ مشکی و برش‌های اورسایز شکل گرفته. این کالکشن برای کسایی طراحی شده که شب‌های شهر رو با استایل خودشون تسخیر می‌کنن. تعداد محدود، تولید محدود.",
    productSlugs: ["oversized-black-hoodie", "cargo-street-pants", "urban-runner-sneaker", "lbb-crew-socks"],
  },
  {
    slug: "drop-02-atashe-sorkh",
    nameFa: "دراپ ۰۲ — آتش سرخ",
    tagline: "قرمز سیگنیچر LBB در قلب کالکشن",
    metaTitle: "کالکشن آتش سرخ (Drop 02) | قرمز سیگنیچر LBB",
    metaDesc:
      "دراپ ۰۲ آتش سرخ: کالکشنی جسورانه با رنگ قرمز سیگنیچر LBB. تیشرت گرافیک، هودی کلاسیک و جوراب قرمز.",
    description:
      "آتش سرخ دومین دراپ LBB است که رنگ قرمز امضای برند رو به مرکز توجه می‌آره. این کالکشن برای اونایی ساخته شده که می‌خوان توی جمع دیده بشن، بدون این‌که از اصالت استریت‌ویر فاصله بگیرن.",
    productSlugs: ["graphic-tee-red", "lbb-classic-hoodie", "lbb-signature-tee", "lbb-crew-socks"],
  },
  {
    slug: "capsule-denim",
    nameFa: "کپسول دنیم",
    tagline: "بازگشت به ریشه‌های خیابونی با دنیم سنگین",
    metaTitle: "کپسول دنیم LBB | جین بگی و کارگو",
    metaDesc:
      "کپسول دنیم LBB: انتخابی از بهترین شلوارهای جین و کارگوی برند. برش‌های بگی و ریپ‌استاپ برای استایل خیابونی.",
    description:
      "کپسول دنیم روی پارچه‌های سنگین و برش‌های بگی تمرکز داره. الهام گرفته از فرهنگ خیابونی دهه ۹۰ میلادی و بازطراحی‌شده با استاندارد امروز LBB.",
    productSlugs: ["denim-baggy-jean", "cargo-street-pants", "lbb-signature-tee"],
  },
];

export const collectionBySlug = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
