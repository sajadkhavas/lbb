import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const artifactsDir = path.join(root, "artifacts", "lint");
const binary = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "eslint.cmd" : "eslint",
);

const ownedFiles = new Set([
  "eslint.config.js",
  "playwright.config.ts",
  "playwright.visual.config.ts",
  "src/components/lbb/Logo.tsx",
  "src/lib/pwa.ts",
  "src/lib/site.ts",
  "src/routes/__root.tsx",
  "src/routes/sitemap[.]xml.ts",
  "vite.config.ts",
]);
const ownedPrefixes = ["scripts/", "tests/"];

const result = spawnSync(binary, [".", "--format", "json"], {
  cwd: root,
  encoding: "utf8",
  env: process.env,
  maxBuffer: 50 * 1024 * 1024,
});

if (result.error) {
  throw result.error;
}

const rawOutput = result.stdout.trim();
let reports;
try {
  reports = rawOutput ? JSON.parse(rawOutput) : [];
} catch (error) {
  await mkdir(artifactsDir, { recursive: true });
  await writeFile(
    path.join(artifactsDir, "eslint-unparsed-output.txt"),
    `${result.stdout}\n${result.stderr}`,
    "utf8",
  );
  console.error("ESLint failed without a parseable JSON report.");
  console.error(error);
  process.exitCode = result.status || 1;
  reports = [];
}

const normalizedReports = reports.map((report) => ({
  ...report,
  relativePath: path.relative(root, report.filePath).replaceAll(path.sep, "/"),
}));
const isOwned = (file) =>
  ownedFiles.has(file) || ownedPrefixes.some((prefix) => file.startsWith(prefix));
const ownedReports = normalizedReports.filter((report) => isOwned(report.relativePath));
const integrationReports = normalizedReports.filter((report) => !isOwned(report.relativePath));
const ownedErrors = ownedReports.flatMap((report) =>
  report.messages
    .filter((message) => message.severity === 2)
    .map((message) => ({ file: report.relativePath, ...message })),
);
const ownedWarnings = ownedReports.reduce((total, report) => total + report.warningCount, 0);
const integrationErrors = integrationReports.reduce(
  (total, report) => total + report.errorCount,
  0,
);
const integrationWarnings = integrationReports.reduce(
  (total, report) => total + report.warningCount,
  0,
);
const cliFailure = result.status === 2;

const summary = {
  generatedAt: new Date().toISOString(),
  eslintExitCode: result.status,
  status: ownedErrors.length === 0 && !cliFailure ? "PASS_F8A_SCOPE" : "FAIL_F8A_SCOPE",
  ownedErrorCount: ownedErrors.length,
  ownedWarningCount: ownedWarnings,
  integrationErrorCount: integrationErrors,
  integrationWarningCount: integrationWarnings,
  ownedErrors,
};

await mkdir(artifactsDir, { recursive: true });
await writeFile(
  path.join(artifactsDir, "eslint-report.json"),
  `${JSON.stringify(normalizedReports, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(artifactsDir, "lint-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

if (cliFailure) {
  console.error("ESLint encountered a configuration or execution failure.");
  if (result.stderr) console.error(result.stderr);
  process.exitCode = 2;
} else if (ownedErrors.length > 0) {
  console.error(`F8-A owned lint failed with ${ownedErrors.length} error(s):`);
  for (const error of ownedErrors) {
    console.error(
      `${error.file}:${error.line}:${error.column} ${error.ruleId ?? "parse"} ${error.message}`,
    );
  }
  process.exitCode = 1;
} else if (integrationErrors > 0 || integrationWarnings > 0) {
  const files = integrationReports
    .filter((report) => report.errorCount > 0 || report.warningCount > 0)
    .map((report) => report.relativePath)
    .sort();
  console.warn(
    `PASS F8-A ownership lint; ${integrationErrors} error(s) and ${integrationWarnings} warning(s) remain in ${files.length} out-of-scope file(s).`,
  );
  console.warn("Integration report: artifacts/lint/eslint-report.json");
  for (const file of files) console.warn(`HANDOFF ${file}`);
} else {
  console.log("PASS full-project lint; no diagnostics found.");
}
