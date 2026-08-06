import fs from "node:fs";

const catalogPath = "src/lib/product-catalog.ts";
const evidencePath = "src/lib/product-evidence.ts";
const readinessPath = "src/lib/launch-readiness.ts";

const catalog = fs.readFileSync(catalogPath, "utf8");
const evidence = fs.readFileSync(evidencePath, "utf8");
const readiness = fs.readFileSync(readinessPath, "utf8");

const catalogSlugs = [...catalog.matchAll(/\n\s*slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const evidenceBlock = evidence.match(/PRODUCT_EVIDENCE:[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
const evidenceSlugs = evidenceBlock
  ? [...evidenceBlock[1].matchAll(/^\s*"([^"]+)":\s*draftProductEvidence\(\),/gm)].map(
      (match) => match[1],
    )
  : [];

const problems = [];
const duplicates = catalogSlugs.filter((slug, index) => catalogSlugs.indexOf(slug) !== index);
const missingEvidence = catalogSlugs.filter((slug) => !evidenceSlugs.includes(slug));
const orphanEvidence = evidenceSlugs.filter((slug) => !catalogSlugs.includes(slug));

if (catalogSlugs.length === 0)
  problems.push("No product slugs were discovered in product-catalog.ts.");
if (duplicates.length)
  problems.push(`Duplicate catalogue slugs: ${[...new Set(duplicates)].join(", ")}`);
if (missingEvidence.length)
  problems.push(`Products without evidence records: ${missingEvidence.join(", ")}`);
if (orphanEvidence.length)
  problems.push(`Evidence records without products: ${orphanEvidence.join(", ")}`);

for (const field of [
  "name",
  "media",
  "price",
  "originalPrice",
  "colors",
  "sizes",
  "stock",
  "description",
  "material",
  "care",
  "fit",
  "sku",
  "collection",
]) {
  if (!evidence.includes(`"${field}"`) && !evidence.includes(`${field}:`)) {
    problems.push(`Evidence contract is missing field: ${field}`);
  }
}

if (!evidence.includes('publication: "draft"')) {
  problems.push("Current unverified catalogue must remain explicitly marked as draft.");
}
if (/state:\s*"verified"/.test(evidence) && !/source:\s*"https?:\/\//.test(evidence)) {
  problems.push("A verified product field requires an attributable source URL.");
}
if (!readiness.includes("evaluateCatalogEvidence")) {
  problems.push("Launch readiness does not consume the product evidence report.");
}
if (!readiness.includes("catalog.evidence")) {
  problems.push("Launch readiness is missing the catalog.evidence blocker.");
}

if (problems.length) {
  console.error(
    "Product evidence audit failed:\n" + problems.map((item) => `- ${item}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  `Product evidence audit passed: ${catalogSlugs.length} catalogue records are explicitly tracked and remain blocked until verified.`,
);
