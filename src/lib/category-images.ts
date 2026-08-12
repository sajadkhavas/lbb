import hoodies from "@/assets/categories/generated/hoodies-v2.webp";
import pants from "@/assets/categories/generated/pants-v2.webp";
import tshirts from "@/assets/categories/generated/tshirts-v2.webp";
import shoes from "@/assets/categories/generated/shoes-v2.webp";
import socks from "@/assets/categories/generated/socks-v2.webp";
import type { CategorySlug } from "./products";

const IMAGES: Record<CategorySlug, string> = {
  hoodies,
  pants,
  tshirts,
  shoes,
  socks,
};

/** Editorial cover shot for a category. */
export const categoryImage = (slug: CategorySlug) => IMAGES[slug] ?? hoodies;
