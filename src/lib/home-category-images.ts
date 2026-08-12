import hoodies from "@/assets/categories/catalog/hoodies-white-v3.webp";
import pants from "@/assets/categories/catalog/pants-white-v3.webp";
import tshirts from "@/assets/categories/catalog/tshirts-white-v3.webp";
import shoes from "@/assets/categories/catalog/shoes-white-v3.webp";
import socks from "@/assets/categories/catalog/socks-white-v3.webp";
import type { CategorySlug } from "./products";

const HOME_CATEGORY_IMAGES: Record<CategorySlug, string> = {
  hoodies,
  pants,
  tshirts,
  shoes,
  socks,
};

export const homeCategoryImage = (slug: CategorySlug) => HOME_CATEGORY_IMAGES[slug] ?? hoodies;
