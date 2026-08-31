import type { CategorySlug } from "@/lib/products";

export type CatalogTaxonomyNode = {
  slug: string;
  label: string;
  latin?: string;
  note?: string;
  children?: readonly CatalogTaxonomyNode[];
};

export type CatalogTaxonomyGroup = CatalogTaxonomyNode & {
  strategy: "subcategory" | "filter-first";
  filters?: readonly string[];
};

/**
 * LBB merchandising taxonomy approved from employer-provided business truth.
 *
 * Important:
 * This is the target merchandising taxonomy, not proof that every node already
 * has inventory or a public indexable route.
 */
export const APPROVED_CATALOG_TAXONOMY = [
  {
    slug: "tshirts",
    label: "تیشرت",
    latin: "T-SHIRTS",
    strategy: "subcategory",
    children: [
      { slug: "oversized", label: "اورسایز" },
      { slug: "boxy", label: "باکس" },
      { slug: "collared", label: "یقه‌دار" },
      {
        slug: "long-sleeve",
        label: "آستین‌بلند",
        latin: "LONG SLEEVE",
      },
      {
        slug: "sleeveless",
        label: "حلقه‌ای",
        latin: "VEST / SLEEVELESS",
      },
    ],
  },
  {
    slug: "sweatshirts",
    label: "سویشرت",
    latin: "SWEATSHIRTS",
    strategy: "subcategory",
    children: [
      { slug: "hoodie", label: "هودی" },
      { slug: "crewneck", label: "دورس" },
      { slug: "zip-sweatshirt", label: "سویشرت زیپی" },
      { slug: "knit", label: "بافت" },
    ],
  },
  {
    slug: "pants",
    label: "شلوار",
    latin: "PANTS",
    strategy: "subcategory",
    children: [
      {
        slug: "denim",
        label: "جین",
        children: [
          { slug: "baggy", label: "بگ" },
          { slug: "full-baggy", label: "فول‌بگ" },
          { slug: "bootcut", label: "بوت‌کات" },
        ],
      },
      {
        slug: "trousers",
        label: "پارچه‌ای",
        children: [
          { slug: "balloon", label: "بالون" },
          { slug: "baggy", label: "بگ" },
          { slug: "full-baggy", label: "فول‌بگ" },
        ],
      },
      {
        slug: "sweatpants",
        label: "اسلش",
        children: [
          { slug: "balloon", label: "بالون" },
          { slug: "baggy", label: "بگ" },
          { slug: "full-baggy", label: "فول‌بگ" },
        ],
      },
      {
        slug: "jorts",
        label: "جورتز",
        latin: "JORTS",
        note: "شلوارک بلند",
      },
      {
        slug: "shorts",
        label: "شرت",
        latin: "SHORTS",
        note: "مدل کوتاه",
      },
    ],
  },
  {
    slug: "shirts",
    label: "پیراهن",
    latin: "SHIRTS",
    strategy: "subcategory",
    children: [
      {
        slug: "crop-shirt",
        label: "کراپ‌شرت",
        note: "پیراهن باکس",
      },
      {
        slug: "oversized-shirt",
        label: "اورسایز",
        note: "پیراهن آزاد",
      },
      {
        slug: "patterned-shirt",
        label: "چهارخانه / راه‌راه",
        note: "طرح‌دار",
      },
      {
        slug: "basic-shirt",
        label: "ساده",
        note: "بیسیک",
      },
    ],
  },
  {
    slug: "jackets",
    label: "جکت‌ها",
    latin: "JACKETS",
    strategy: "subcategory",
    children: [
      {
        slug: "winter-jackets",
        label: "کاپشن",
        children: [
          {
            slug: "puffer-vest",
            label: "پافر وست",
            latin: "PUFFER VEST",
          },
          {
            slug: "puffer",
            label: "پافر",
            latin: "PUFFER",
          },
        ],
      },
      {
        slug: "coat",
        label: "کت",
      },
    ],
  },
  {
    slug: "shoes",
    label: "کتونی",
    latin: "SNEAKERS",
    strategy: "filter-first",
    filters: ["برند", "سایز", "رنگ", "استایل", "موجودی", "محدوده قیمت"],
  },
] as const satisfies readonly CatalogTaxonomyGroup[];

/**
 * Prototype routes that currently have actual catalogue support.
 * Do not expand this list merely to make empty taxonomy pages.
 */
export const CURRENT_PROTOTYPE_CATEGORY_ROUTES = [
  "hoodies",
  "pants",
  "tshirts",
  "shoes",
  "socks",
] as const satisfies readonly CategorySlug[];

/**
 * Compatibility notes while real Backend taxonomy is introduced.
 *
 * - Current /hoodies remains valid until Sweatshirts is represented by the
 *   authoritative backend taxonomy.
 * - Current /socks remains valid because real prototype inventory exists,
 *   even though socks were not part of the employer category sheet.
 */
export const CATALOG_TAXONOMY_COMPATIBILITY = {
  hoodieRoute: {
    current: "hoodies",
    targetGroup: "sweatshirts",
    targetNode: "hoodie",
  },
  retainedInventoryOnlyRoutes: ["socks"],
} as const;

export function taxonomyGroup(slug: string) {
  return APPROVED_CATALOG_TAXONOMY.find((group) => group.slug === slug);
}

export type CatalogNavigationAvailability = "live" | "partial" | "planned";

export type CatalogNavigationEntry = {
  groupSlug: CatalogTaxonomyGroup["slug"];
  availability: CatalogNavigationAvailability;
  currentRoute?: CategorySlug;
  ctaLabel?: string;
  note: string;
};

/**
 * Navigation contract:
 *
 * `live`:
 * the approved merchandising group has a real current route.
 *
 * `partial`:
 * only part of the approved group has real current inventory/route support.
 *
 * `planned`:
 * the approved group is visible as merchandising taxonomy but MUST NOT
 * generate a public link or indexable empty route.
 */
export const CATALOG_NAVIGATION: readonly CatalogNavigationEntry[] = [
  {
    groupSlug: "tshirts",
    availability: "live",
    currentRoute: "tshirts",
    ctaLabel: "مشاهده تیشرت‌ها",
    note: "دسته فعال",
  },
  {
    groupSlug: "sweatshirts",
    availability: "partial",
    currentRoute: "hoodies",
    ctaLabel: "مشاهده هودی‌های موجود",
    note: "فعلاً هودی دارای مسیر و موجودی واقعی است",
  },
  {
    groupSlug: "pants",
    availability: "live",
    currentRoute: "pants",
    ctaLabel: "مشاهده شلوارها",
    note: "دسته فعال",
  },
  {
    groupSlug: "shirts",
    availability: "planned",
    note: "با ورود موجودی واقعی فعال می‌شود",
  },
  {
    groupSlug: "jackets",
    availability: "planned",
    note: "با ورود موجودی واقعی فعال می‌شود",
  },
  {
    groupSlug: "shoes",
    availability: "live",
    currentRoute: "shoes",
    ctaLabel: "مشاهده کتونی‌ها",
    note: "فیلترمحور؛ بدون ساخت دسته‌های اضافی",
  },
] as const;

export const RETAINED_CURRENT_CATEGORY_NAVIGATION = [
  {
    route: "socks",
    label: "جوراب",
    latin: "SOCKS",
    note: "موجودی فعلی کاتالوگ",
  },
] as const satisfies readonly {
  route: CategorySlug;
  label: string;
  latin: string;
  note: string;
}[];

export function catalogNavigationGroup(entry: CatalogNavigationEntry) {
  return taxonomyGroup(entry.groupSlug);
}
