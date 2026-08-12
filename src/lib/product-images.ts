import hoodieClassic from "@/assets/products/hoodie-classic.jpg";
import cargoPants from "@/assets/products/cargo-pants.jpg";
import signatureTee from "@/assets/products/signature-tee.jpg";
import urbanRunner from "@/assets/products/urban-runner.jpg";
import lbbSocks from "@/assets/products/lbb-socks.jpg";
import oversizedBlackHoodie from "@/assets/products/oversized-black-hoodie.jpg";
import denimBaggy from "@/assets/products/denim-baggy.jpg";
import graphicTeeRed from "@/assets/products/graphic-tee-red.jpg";
import lifestyle1 from "@/assets/editorial/lifestyle-1.jpg";
import lifestyle2 from "@/assets/editorial/lifestyle-2.jpg";
import heroMain from "@/assets/editorial/generated/home-hero-v2.webp";
import dropShabgard from "@/assets/editorial/generated/drop-shabgard-v2.webp";
import communityStudio from "@/assets/editorial/generated/community-studio-v2.webp";

export { communityStudio, dropShabgard, lifestyle1, lifestyle2, heroMain };

const MAIN: Record<string, string> = {
  "lbb-classic-hoodie": hoodieClassic,
  "cargo-street-pants": cargoPants,
  "lbb-signature-tee": signatureTee,
  "urban-runner-sneaker": urbanRunner,
  "lbb-crew-socks": lbbSocks,
  "oversized-black-hoodie": oversizedBlackHoodie,
  "denim-baggy-jean": denimBaggy,
  "graphic-tee-red": graphicTeeRed,
};

/** Primary product shot for a slug (falls back to the classic hoodie). */
export const productImage = (slug: string) => MAIN[slug] ?? hoodieClassic;

/** Full gallery: primary shot + editorial context shots. */
export const productGallery = (slug: string) => [
  productImage(slug),
  lifestyle2,
  lifestyle1,
  heroMain,
];
