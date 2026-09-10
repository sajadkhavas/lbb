import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];
const read = (relative) => readFile(path.join(root, relative), "utf8").catch(() => "");

const files = Object.fromEntries(
  await Promise.all(
    [
      "src/lib/storefront-presentation.tsx",
      "src/routes/__root.tsx",
      "src/routes/index.tsx",
      "src/components/lbb/home/HeroNarrative.tsx",
      "src/components/lbb/home/ProductMoments.tsx",
      "src/components/lbb/home/CategoryGateway.tsx",
      "src/components/lbb/Navbar.tsx",
      "src/components/lbb/Footer.tsx",
      "src/components/lbb/home/LocalStoreVisit.tsx",
      "src/components/lbb/InstagramStrip.tsx",
      "src/components/lbb/home/DropStory.tsx",
      "src/components/lbb/ManagedPageIntro.tsx",
      "src/routes/shop.tsx",
      "src/routes/collections.index.tsx",
      "src/routes/lookbook.tsx",
      "src/routes/journal.index.tsx",
      "src/routes/journal.$slug.tsx",
      "src/routes/faq.tsx",
    ].map(async (name) => [name, await read(name)]),
  ),
);

for (const [name, source] of Object.entries(files)) {
  if (!source) failures.push(`Missing admin-control source: ${name}`);
}

const requireTokens = (name, tokens) => {
  const source = files[name] ?? "";
  for (const token of tokens) {
    if (!source.includes(token)) failures.push(`${name} missing required admin-control token: ${token}`);
  }
};

requireTokens("src/lib/storefront-presentation.tsx", [
  "home.presentation",
  "page.presentation",
  "faq.presentation",
  "/api/v1/storefront/home-products",
  "safePublicHref",
]);
requireTokens("src/routes/__root.tsx", [
  "resolveStorefrontPresentation",
  "StorefrontPresentationProvider",
]);
requireTokens("src/routes/index.tsx", [
  "resolveStorefrontHomeProducts",
  "presentation.hero.enabled",
]);
requireTokens("src/components/lbb/home/HeroNarrative.tsx", [
  "presentation.hero.imageUrl",
  "presentation.hero.imageFit",
  "presentation.hero.imagePosition",
  "presentation.hero.primaryCtaHref",
  "presentation.hero.secondaryCtaHref",
]);
requireTokens("src/components/lbb/home/ProductMoments.tsx", [
  "liveProducts",
  "presentation.sectionLinks.products",
]);
requireTokens("src/components/lbb/home/CategoryGateway.tsx", [
  "presentation.sectionLinks.categories",
]);
requireTokens("src/components/lbb/Navbar.tsx", ["presentation.shell.shopMenuLabel"]);
requireTokens("src/components/lbb/Footer.tsx", [
  "presentation.shell.footerGroups",
  "presentation.shell.utilityLinks",
  "new Date().getFullYear()",
]);
requireTokens("src/components/lbb/home/LocalStoreVisit.tsx", [
  "presentation.localStoreLinks.contact",
  "presentation.localStoreLinks.instagram",
  "presentation.localStoreLinks.shop",
]);
requireTokens("src/components/lbb/InstagramStrip.tsx", [
  "presentation.sectionLinks.instagramLookbook",
]);
requireTokens("src/components/lbb/home/DropStory.tsx", ["coverImage", "collectionCover"]);
requireTokens("src/components/lbb/ManagedPageIntro.tsx", [
  "ManagedPageHead",
  "ManagedPageIntro",
  "og:title",
  "twitter:description",
]);

for (const route of [
  "src/routes/shop.tsx",
  "src/routes/collections.index.tsx",
  "src/routes/lookbook.tsx",
  "src/routes/journal.index.tsx",
  "src/routes/faq.tsx",
]) {
  requireTokens(route, ["ManagedPageHead", "useStorefrontPresentation"]);
}

requireTokens("src/routes/journal.$slug.tsx", ["metaTitle", "metaDescription"]);
requireTokens("src/routes/faq.tsx", ["presentation.faqCategories"]);
requireTokens("src/routes/lookbook.tsx", ["MerchantNavigationLink"]);

if ((files["src/components/lbb/Footer.tsx"] ?? "").includes("© 2026")) {
  failures.push("Footer copyright year is still hardcoded to 2026.");
}

if ((files["src/components/lbb/home/HeroNarrative.tsx"] ?? "").includes('source === "live" ? (heroProduct?.image ?? null)')) {
  failures.push("Live Hero still ignores the independent Admin-uploaded Hero image.");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Final Admin control completion frontend audit passed.");
