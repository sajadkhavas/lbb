import type { CategorySlug } from "@/lib/products";

export const HOME_CATEGORY_ORDER: CategorySlug[] = [
  "hoodies",
  "pants",
  "tshirts",
  "shoes",
  "socks",
];

export const HOME_DECISION_LINKS = [
  {
    kind: "static" as const,
    label: "راهنمای انتخاب سایز",
    latin: "SIZE / FIT",
    description: "قبل از خرید، فیت و اندازه مناسب را مقایسه کن.",
    to: "/size-guide" as const,
  },
  {
    kind: "static" as const,
    label: "ارسال و مرجوعی",
    latin: "DELIVERY / RETURNS",
    description: "شرایط نسخه نمایشی، هزینه و محدودیت‌ها را شفاف ببین.",
    to: "/shipping-returns" as const,
  },
  {
    kind: "journal" as const,
    label: "پارچه و نگهداری",
    latin: "MATERIAL / CARE",
    description: "گرماژ، ترکیب پارچه و روش شست‌وشوی هر قطعه.",
    to: "/journal/$slug" as const,
    params: { slug: "materials-101-parche-shenasi" },
  },
];

export const HOME_EDITORIAL_PATHS = [
  {
    kind: "collection" as const,
    eyebrow: "DROP STORY",
    title: "شبگرد؛ یک ست تیره برای حرکت شبانه",
    description: "هودی، کارگو، کتونی و جزئیات قرمز در یک مسیر خرید هماهنگ.",
    to: "/collections/$slug" as const,
    params: { slug: "drop-01-shabgard" },
    cover: "hero" as const,
  },
  {
    kind: "lookbook" as const,
    eyebrow: "LOOKBOOK",
    title: "فرم‌ها را قبل از انتخاب ببین",
    description: "سیلوئت اورسایز، بگی و لایه‌سازی در فضای شهری.",
    to: "/lookbook" as const,
    cover: "l1" as const,
  },
  {
    kind: "journal" as const,
    eyebrow: "FIT GUIDE",
    title: "چطور هودی اورسایز را متعادل ست کنیم؟",
    description: "راهنمای عملی برای حجم، قد لباس و انتخاب پایین‌تنه.",
    to: "/journal/$slug" as const,
    params: { slug: "chetori-hoodie-eversayz-ro-bepoosim" },
    cover: "l2" as const,
  },
];

export const HOME_NARRATIVE_ORDER = [
  "identity",
  "categories",
  "products",
  "drop-story",
  "decision-support",
  "editorial",
  "community",
] as const;
