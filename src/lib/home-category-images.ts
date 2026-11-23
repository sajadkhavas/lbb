import hoodies from "@/assets/categories/catalog/hoodies-white-v3.webp";
import pants from "@/assets/categories/client/pants-client.webp";
import tshirts from "@/assets/categories/client/tshirt-client.webp";
import shoes from "@/assets/categories/client/shoes-client.webp";
import socks from "@/assets/categories/client/socks-client.webp";
import type { CategorySlug } from "./products";

const HOME_CATEGORY_IMAGES: Record<CategorySlug, string> = {
  hoodies,
  pants,
  tshirts,
  shoes,
  socks,
};

export const homeCategoryImage = (slug: CategorySlug) => HOME_CATEGORY_IMAGES[slug] ?? hoodies;
