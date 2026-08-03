import { brotliCompressSync, gzipSync } from "node:zlib";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const clientDir = path.join(root, "dist", "client");
const artifactsDir = path.join(root, "artifacts", "bundle");
const shouldCheck = process.argv.includes("--check");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }
  return files;
}

function kind(file) {
  const extension = path.extname(file).toLowerCase();
  if ([".js", ".mjs"].includes(extension)) return "javascript";
  if (extension === ".css") return "css";
  if ([".woff", ".woff2", ".ttf", ".otf"].includes(extension)) return "font";
  if ([".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg", ".ico"].includes(extension)) return "image";
  return "other";
}

function sum(items, key) {
  return items.reduce((total, item) => total + item[key], 0);
}

await stat(clientDir).catch(() => {
  throw new Error("dist/client does not exist. Run npm run build before bundle reporting.");
});

const files = [];
for (const absolutePath of await walk(clientDir)) {
  if (absolutePath.endsWith(".map")) continue;
  const bytes = await readFile(absolutePath);
  files.push({
    file: path.relative(clientDir, absolutePath).replaceAll(path.sep, "/"),
    kind: kind(absolutePath),
    rawBytes: bytes.byteLength,
    gzipBytes: gzipSync(bytes, { level: 9 }).byteLength,
    brotliBytes: brotliCompressSync(bytes).byteLength,
  });
}

const javascript = files.filter((file) => file.kind === "javascript");
const css = files.filter((file) => file.kind === "css");
const fonts = files.filter((file) => file.kind === "font");
const largestJs = [...javascript].sort((a, b) => b.gzipBytes - a.gzipBytes)[0] ?? null;
const budgets = JSON.parse(
  await readFile(path.join(root, "config", "bundle-budgets.json"), "utf8"),
);

const totals = {
  clientRawBytes: sum(files, "rawBytes"),
  javascriptRawBytes: sum(javascript, "rawBytes"),
  javascriptGzipBytes: sum(javascript, "gzipBytes"),
  javascriptBrotliBytes: sum(javascript, "brotliBytes"),
  cssRawBytes: sum(css, "rawBytes"),
  cssGzipBytes: sum(css, "gzipBytes"),
  fontRawBytes: sum(fonts, "rawBytes"),
  largestJavascriptGzipBytes: largestJs?.gzipBytes ?? 0,
};

const checks = [
  {
    name: "total JavaScript gzip",
    actual: totals.javascriptGzipBytes,
    budget: budgets.maxTotalJsGzipBytes,
  },
  {
    name: "largest JavaScript chunk gzip",
    actual: totals.largestJavascriptGzipBytes,
    budget: budgets.maxLargestJsGzipBytes,
  },
  {
    name: "total CSS gzip",
    actual: totals.cssGzipBytes,
    budget: budgets.maxTotalCssGzipBytes,
  },
  {
    name: "total font raw",
    actual: totals.fontRawBytes,
    budget: budgets.maxTotalFontRawBytes,
  },
  {
    name: "total client raw",
    actual: totals.clientRawBytes,
    budget: budgets.maxTotalClientRawBytes,
  },
].map((check) => ({ ...check, pass: check.actual <= check.budget }));

const report = {
  generatedAt: new Date().toISOString(),
  clientDir: "dist/client",
  totals,
  budgets,
  checks,
  files: [...files].sort((a, b) => b.rawBytes - a.rawBytes),
};

const formatKb = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;
const markdown = [
  "# LBB production bundle report",
  "",
  `Generated: ${report.generatedAt}`,
  "",
  "## Budget checks",
  "",
  "| Metric | Actual | Budget | Status |",
  "| --- | ---: | ---: | :---: |",
  ...checks.map(
    (check) =>
      `| ${check.name} | ${formatKb(check.actual)} | ${formatKb(check.budget)} | ${check.pass ? "PASS" : "FAIL"} |`,
  ),
  "",
  "## Largest files",
  "",
  "| File | Type | Raw | Gzip | Brotli |",
  "| --- | --- | ---: | ---: | ---: |",
  ...report.files
    .slice(0, 25)
    .map(
      (file) =>
        `| \`${file.file}\` | ${file.kind} | ${formatKb(file.rawBytes)} | ${formatKb(file.gzipBytes)} | ${formatKb(file.brotliBytes)} |`,
    ),
  "",
].join("\n");

await mkdir(artifactsDir, { recursive: true });
await writeFile(path.join(artifactsDir, "bundle-report.json"), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(path.join(artifactsDir, "bundle-report.md"), markdown);

for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}: ${formatKb(check.actual)} / ${formatKb(check.budget)}`);
}

if (shouldCheck && checks.some((check) => !check.pass)) {
  process.exitCode = 1;
}
