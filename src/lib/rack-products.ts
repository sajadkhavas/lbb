export const RACK_MODELS = {
  "tyshrt-baksy-dupu-thghaly": {
    url: "/models/collection-rack/lbb-dupu-boxy-charcoal-web.glb",
    format: "glb",
    bytes: 1403456,
    garment: "tee",
  },
  "shloar-gyn-prynty-acne-studios": {
    url: "/models/collection-rack/lbb-nature-printed-denim-web.glb",
    format: "glb",
    bytes: 1798828,
    garment: "trousers",
  },
} as const;

export const rackProductSlugs = Object.keys(RACK_MODELS) as Array<keyof typeof RACK_MODELS>;

export type RackProduct = {
  slug: keyof typeof RACK_MODELS;
  name: string;
  image: string | null;
};
