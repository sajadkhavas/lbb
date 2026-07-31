import hoodies from "@/assets/categories/hoodies.jpg";
import pants from "@/assets/categories/pants.jpg";
import tshirts from "@/assets/categories/tshirts.jpg";
import shoes from "@/assets/categories/shoes.jpg";
import accessories from "@/assets/categories/accessories.jpg";
import type { CategorySlug } from "./products";

const IMAGES: Record<CategorySlug, string> = {
  hoodies,
  pants,
  tshirts,
  shoes,
  accessories,
};

/** Editorial cover shot for a category. */
export const categoryImage = (slug: CategorySlug) => IMAGES[slug] ?? hoodies;