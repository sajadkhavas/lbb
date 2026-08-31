import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }

  return files;
}

const sourceFiles = (await walk(sourceRoot)).filter((file) =>
  /\.(?:ts|tsx|js|mjs|json|css)$/.test(file),
);

function isAllowedTehranReference(relative, line) {
  const trimmed = line.trim();

  if (relative === "src/routes/checkout.tsx" && trimmed === '"تهران",') {
    return true;
  }

  // Internal shipping identifier: not user-facing brand copy.
  if (relative === "src/lib/store-settings.ts" && trimmed === 'id: "courier-karaj-tehran",') {
    return true;
  }

  // Tehran is a verified delivery geography, not a brand-location claim.
  if (
    (relative === "src/lib/store-settings.ts" || relative === "src/routes/faq.tsx") &&
    /ارسال فوری.*کرج و تهران/.test(trimmed)
  ) {
    return true;
  }

  return false;
}

for (const file of sourceFiles) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const content = await readFile(file, "utf8");

  content.split(/\r?\n/).forEach((line, index) => {
    if (!/تهران|\bTEHRAN\b/i.test(line)) return;
    if (isAllowedTehranReference(relative, line)) return;

    failures.push(
      `Incorrect Tehran brand reference remains: ${relative}:${index + 1} — ${line.trim()}`,
    );
  });
}

const brandModulePath = path.join(sourceRoot, "lib", "brand.ts");
const brandModule = await readFile(brandModulePath, "utf8").catch(() => "");

for (const required of [
  'city: "کرج"',
  'physicalLocation: "پاساژ مهستان"',
  'category: "پوشاک خیابانی و استریت‌ویر"',
  'slogan: "الهام‌گرفته از ذهنی خلاق"',
]) {
  if (!brandModule.includes(required)) {
    failures.push(`Verified brand identity is missing from src/lib/brand.ts: ${required}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Brand copy audit passed across ${sourceFiles.length} source files.`);
