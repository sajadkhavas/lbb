export const MANNEQUIN_SLOTS = [
  "top",
  "outerwear",
  "bottom",
  "full",
  "footwear",
  "accessory",
] as const;

export type MannequinSlot = (typeof MANNEQUIN_SLOTS)[number];

export type MannequinProfileDto = {
  enabled: boolean;
  assetUrl: string | null;
  slot: MannequinSlot | null;
  offsetX: number;
  offsetY: number;
  scale: number;
  layer: number;
  preset: string | null;
};

export type UsableMannequinProfile = MannequinProfileDto & {
  enabled: true;
  assetUrl: string;
  slot: MannequinSlot;
};

const validSlot = (value: unknown): value is MannequinSlot =>
  typeof value === "string" && (MANNEQUIN_SLOTS as readonly string[]).includes(value);

const finiteInRange = (value: unknown, min: number, max: number) =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;

/**
 * The storefront deliberately fails closed. A partially configured profile must
 * leave the normal product photograph untouched instead of showing a broken fit view.
 */
export function isUsableMannequinProfile(
  profile: MannequinProfileDto | null | undefined,
): profile is UsableMannequinProfile {
  return Boolean(
    profile?.enabled === true &&
      typeof profile.assetUrl === "string" &&
      profile.assetUrl.trim().length > 0 &&
      validSlot(profile.slot) &&
      finiteInRange(profile.offsetX, -50, 50) &&
      finiteInRange(profile.offsetY, -50, 50) &&
      finiteInRange(profile.scale, 0.5, 2) &&
      Number.isInteger(profile.layer) &&
      profile.layer >= 1 &&
      profile.layer <= 100,
  );
}

export function mannequinAssetTransform(profile: UsableMannequinProfile): string {
  return `translate(-50%, -50%) translate(${profile.offsetX}%, ${profile.offsetY}%) scale(${profile.scale})`;
}
