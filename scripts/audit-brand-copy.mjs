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

for (const file of sourceFiles) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const content = await readFile(file, "utf8");

  if (/تهران|\bTEHRAN\b/i.test(content)) {
    failures.push(`Incorrect Tehran brand reference remains: ${relative}`);
  }
}

const brandModulePath = path.join(sourceRoot, "lib", "brand.ts");
const brandModule = await readFile(brandModulePath, "utf8").catch(() => "");

for (const required of [
  'city: "کرج"',
  'physicalLocation: "پاساژ مهستان"',
  'slogan: "از مهستان، برای خیابان"',
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
