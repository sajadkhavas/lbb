import hoodies from "@/assets/products/hoodie-classic.jpg";
import pants from "@/assets/products/cargo-pants.jpg";
import tshirts from "@/assets/products/signature-tee.jpg";
import shoes from "@/assets/products/urban-runner.jpg";
import socks from "@/assets/products/lbb-socks.jpg";
import type { CategorySlug } from "./products";

const IMAGES: Record<CategorySlug, string> = {
  hoodies,
  pants,
  tshirts,
  shoes,
  socks,
};

/** Clean product-first cover shot for category discovery surfaces. */
export const categoryImage = (slug: CategorySlug) => IMAGES[slug] ?? hoodies;
