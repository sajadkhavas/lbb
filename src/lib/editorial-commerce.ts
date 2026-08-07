import { CATEGORIES } from "./categories";
import { collectionBySlug, type Collection } from "./collections";
import { JOURNAL_ARTICLES, type JournalArticle } from "./journal";
import { heroMain, lifestyle1, lifestyle2, productImage } from "./product-images";
import { evaluateProductEvidence, type ProductEvidenceEvaluation } from "./product-evidence";
import { productBySlug, type CategorySlug, type Product } from "./products";

export type EditorialCollectionKind = "collection" | "drop";
export type EditorialMediaKey = "hero" | "l1" | "l2";

export type EditorialProductReference = {
  slug: string;
  product: Product;
  evidence: ProductEvidenceEvaluation;
  publishable: boolean;
  image: string;
};

export type EditorialCollectionView = {
  collection: Collection;
  kind: EditorialCollectionKind;
  media: string;
  primaryCategory?: CategorySlug;
  productReferences: EditorialProductReference[];
  publicProducts: EditorialProductReference[];
  withheldProductCount: number;
};

const COLLECTION_EDITORIAL_CONFIG: Record<
  string,
  { kind: EditorialCollectionKind; media: EditorialMediaKey; primaryCategory?: CategorySlug }
> = {
  "drop-01-shabgard": { kind: "drop", media: "l2", primaryCategory: "hoodies" },
  "drop-02-atashe-sorkh": { kind: "drop", media: "hero", primaryCategory: "tshirts" },
  "capsule-denim": { kind: "collection", media: "l1", primaryCategory: "pants" },
};

const MEDIA: Record<EditorialMediaKey, string> = {
  hero: heroMain,
  l1: lifestyle1,
  l2: lifestyle2,
};

export function resolveEditorialProductReferences(slugs: string[]): EditorialProductReference[] {
  return slugs.flatMap((slug) => {
    const product = productBySlug(slug);
    if (!product) return [];
    const evidence = evaluateProductEvidence(product);
    return [
      {
        slug,
        product,
        evidence,
        publishable: evidence.publishable,
        image: productImage(slug),
      },
    ];
  });
}

export function getCollectionEditorialView(collection: Collection): EditorialCollectionView {
  const config = COLLECTION_EDITORIAL_CONFIG[collection.slug] ?? {
    kind: "collection" as const,
    media: "hero" as const,
    primaryCategory: collection.categoryHint,
  };
  const productReferences = resolveEditorialProductReferences(collection.productSlugs);
  const publicProducts = productReferences.filter((reference) => reference.publishable);

  return {
    collection,
    kind: config.kind,
    media: MEDIA[config.media],
    primaryCategory: config.primaryCategory ?? collection.categoryHint,
    productReferences,
    publicProducts,
    withheldProductCount: productReferences.length - publicProducts.length,
  };
}

export function getCollectionEditorialViewBySlug(slug: string) {
  const collection = collectionBySlug(slug);
  return collection ? getCollectionEditorialView(collection) : undefined;
}

export type LookbookScene = {
  id: string;
  src: string;
  alt: string;
  label: string;
  className: string;
  ratio: string;
  collectionSlug?: string;
  productSlugs?: string[];
  categorySlug?: CategorySlug;
};

export const LOOKBOOK_SCENES: LookbookScene[] = [
  {
    id: "night-layer",
    src: heroMain,
    alt: "استایل تیره با بالاتنه حجیم و شلوار آزاد زیر نور قرمز",
    label: "LOOK 01 / NIGHT LAYER",
    className: "col-span-2 md:col-span-2 md:row-span-2",
    ratio: "4 / 5",
    collectionSlug: "drop-01-shabgard",
    categorySlug: "hoodies",
  },
  {
    id: "double-volume",
    src: lifestyle1,
    alt: "دو استایل خیابانی با لایه‌های حجیم در فضای شبانه",
    label: "LOOK 02 / DOUBLE VOLUME",
    className: "",
    ratio: "3 / 4",
    collectionSlug: "drop-01-shabgard",
    categorySlug: "hoodies",
  },
  {
    id: "black-hoodie-study",
    src: productImage("oversized-black-hoodie"),
    alt: "نمای نزدیک از هودی مشکی با چاپ گرافیکی پشت",
    label: "PIECE STUDY / BLACK HOODIE",
    className: "",
    ratio: "3 / 4",
    collectionSlug: "drop-01-shabgard",
    productSlugs: ["oversized-black-hoodie"],
    categorySlug: "hoodies",
  },
  {
    id: "flat-lay",
    src: lifestyle2,
    alt: "چیدمان تخت از لایه بالاتنه، شلوار و کتونی روی سطح بتنی",
    label: "LOOK 03 / FLAT LAY",
    className: "col-span-2 md:col-span-2",
    ratio: "16 / 10",
    collectionSlug: "drop-01-shabgard",
  },
  {
    id: "cargo-study",
    src: productImage("cargo-street-pants"),
    alt: "نمای شلوار کارگو مشکی با جیب‌های جانبی",
    label: "PIECE STUDY / CARGO",
    className: "",
    ratio: "3 / 4",
    collectionSlug: "drop-01-shabgard",
    productSlugs: ["cargo-street-pants"],
    categorySlug: "pants",
  },
  {
    id: "runner-study",
    src: productImage("urban-runner-sneaker"),
    alt: "نمای کتونی روشن با جزئیات تیره",
    label: "PIECE STUDY / RUNNER",
    className: "",
    ratio: "3 / 4",
    collectionSlug: "drop-01-shabgard",
    productSlugs: ["urban-runner-sneaker"],
    categorySlug: "shoes",
  },
  {
    id: "denim-study",
    src: productImage("denim-baggy-jean"),
    alt: "نمای شلوار جین بگی با برش آزاد",
    label: "PIECE STUDY / BAGGY DENIM",
    className: "",
    ratio: "3 / 4",
    collectionSlug: "capsule-denim",
    productSlugs: ["denim-baggy-jean"],
    categorySlug: "pants",
  },
  {
    id: "socks-study",
    src: productImage("lbb-crew-socks"),
    alt: "نمای جوراب ساقدار با جزئیات قرمز روی ساق",
    label: "PIECE STUDY / CREW SOCKS",
    className: "",
    ratio: "3 / 4",
    collectionSlug: "drop-02-atashe-sorkh",
    productSlugs: ["lbb-crew-socks"],
    categorySlug: "socks",
  },
];

export type LookbookSceneView = LookbookScene & {
  collection?: Collection;
  publicProducts: EditorialProductReference[];
  productReferences: EditorialProductReference[];
};

export function getLookbookSceneView(scene: LookbookScene): LookbookSceneView {
  const productReferences = resolveEditorialProductReferences(scene.productSlugs ?? []);
  return {
    ...scene,
    collection: scene.collectionSlug ? collectionBySlug(scene.collectionSlug) : undefined,
    productReferences,
    publicProducts: productReferences.filter((reference) => reference.publishable),
  };
}

export type JournalCommerceConfig = {
  productSlugs?: string[];
  collectionSlugs?: string[];
  categorySlugs?: CategorySlug[];
};

const JOURNAL_COMMERCE: Record<string, JournalCommerceConfig> = {
  "chetori-hoodie-eversayz-ro-bepoosim": {
    productSlugs: ["oversized-black-hoodie", "cargo-street-pants"],
    collectionSlugs: ["drop-01-shabgard"],
    categorySlugs: ["hoodies", "pants"],
  },
  "tarikhche-farhang-khiaboni-iran": {
    collectionSlugs: ["drop-01-shabgard"],
    categorySlugs: ["hoodies", "pants", "tshirts"],
  },
  "rahnama-negahdari-libas-streetwear": {
    categorySlugs: ["hoodies", "tshirts", "pants", "shoes"],
  },
  "rangbandi-dar-street-fashion": {
    productSlugs: ["graphic-tee-red", "lbb-crew-socks"],
    collectionSlugs: ["drop-02-atashe-sorkh"],
    categorySlugs: ["tshirts", "socks"],
  },
  "materials-101-parche-shenasi": {
    productSlugs: ["denim-baggy-jean", "cargo-street-pants"],
    collectionSlugs: ["capsule-denim"],
    categorySlugs: ["hoodies", "tshirts", "pants"],
  },
};

export type JournalCommerceView = {
  article: JournalArticle;
  publicProducts: EditorialProductReference[];
  productReferences: EditorialProductReference[];
  collections: Collection[];
  categories: Array<{ slug: CategorySlug; label: string }>;
};

export function getJournalCommerceView(article: JournalArticle): JournalCommerceView {
  const config = JOURNAL_COMMERCE[article.slug] ?? {};
  const productReferences = resolveEditorialProductReferences(config.productSlugs ?? []);
  const collections = (config.collectionSlugs ?? []).flatMap((slug) => {
    const collection = collectionBySlug(slug);
    return collection ? [collection] : [];
  });
  const categories = (config.categorySlugs ?? []).map((slug) => ({
    slug,
    label: CATEGORIES[slug].nameFaPlural,
  }));

  return {
    article,
    productReferences,
    publicProducts: productReferences.filter((reference) => reference.publishable),
    collections,
    categories,
  };
}

export function getEditorialInventory() {
  const collectionViews = Object.values(COLLECTION_EDITORIAL_CONFIG).length;
  const dropCount = Object.values(COLLECTION_EDITORIAL_CONFIG).filter(
    (config) => config.kind === "drop",
  ).length;
  const productReferences = LOOKBOOK_SCENES.flatMap((scene) => scene.productSlugs ?? []);
  const publicLookbookProducts = resolveEditorialProductReferences(productReferences).filter(
    (reference) => reference.publishable,
  );

  return {
    collections: collectionViews,
    drops: dropCount,
    lookbookScenes: LOOKBOOK_SCENES.length,
    journalArticles: JOURNAL_ARTICLES.length,
    publicLookbookProducts: publicLookbookProducts.length,
  } as const;
}
