import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const artifactsDir = path.join(root, "artifacts", "typecheck");
const binary = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsc.cmd" : "tsc",
);

const ownedFiles = new Set([
  "src/components/lbb/Logo.tsx",
  "src/lib/pwa.ts",
  "src/lib/site.ts",
  "src/routes/__root.tsx",
  "src/routes/sitemap[.]xml.ts",
  "vite.config.ts",
  "playwright.config.ts",
  "playwright.visual.config.ts",
]);
const ownedPrefixes = ["tests/", "scripts/"];

const result = spawnSync(binary, ["--noEmit", "--pretty", "false"], {
  cwd: root,
  encoding: "utf8",
  env: process.env,
  maxBuffer: 20 * 1024 * 1024,
});

if (result.error) {
  throw result.error;
}

const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
const diagnosticLines = output ? output.split(/\r?\n/) : [];
const parsedDiagnostics = diagnosticLines.flatMap((line) => {
  const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+):\s*(.*)$/);
  if (!match) return [];

  const file = match[1].replaceAll("\\", "/").replace(/^\.\//, "");
  return [
    {
      file,
      line: Number(match[2]),
      column: Number(match[3]),
      code: match[4],
      message: match[5],
      raw: line,
    },
  ];
});

const isOwned = (file) =>
  ownedFiles.has(file) || ownedPrefixes.some((prefix) => file.startsWith(prefix));
const ownedDiagnostics = parsedDiagnostics.filter((diagnostic) => isOwned(diagnostic.file));
const integrationDiagnostics = parsedDiagnostics.filter((diagnostic) => !isOwned(diagnostic.file));
const unparsedFailure = result.status !== 0 && parsedDiagnostics.length === 0;

const report = {
  generatedAt: new Date().toISOString(),
  compilerExitCode: result.status,
  status: ownedDiagnostics.length === 0 && !unparsedFailure ? "PASS_F8A_SCOPE" : "FAIL_F8A_SCOPE",
  ownedDiagnosticCount: ownedDiagnostics.length,
  integrationDiagnosticCount: integrationDiagnostics.length,
  ownedDiagnostics,
  integrationDiagnostics,
};

await mkdir(artifactsDir, { recursive: true });
await writeFile(path.join(artifactsDir, "integration-diagnostics.txt"), `${output}\n`, "utf8");
await writeFile(
  path.join(artifactsDir, "typecheck-summary.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);

if (ownedDiagnostics.length > 0) {
  console.error(`F8-A owned typecheck failed with ${ownedDiagnostics.length} diagnostic(s):`);
  for (const diagnostic of ownedDiagnostics) console.error(diagnostic.raw);
  process.exitCode = 1;
} else if (unparsedFailure) {
  console.error("TypeScript failed without parseable diagnostics:");
  console.error(output);
  process.exitCode = result.status || 1;
} else if (integrationDiagnostics.length > 0) {
  const files = [...new Set(integrationDiagnostics.map((diagnostic) => diagnostic.file))].sort();
  console.warn(
    `PASS F8-A ownership typecheck; ${integrationDiagnostics.length} out-of-scope integration diagnostic(s) were reported across ${files.length} feature-owned file(s).`,
  );
  console.warn(`Integration report: artifacts/typecheck/integration-diagnostics.txt`);
  for (const file of files) console.warn(`HANDOFF ${file}`);
} else {
  console.log("PASS full-project TypeScript check; no diagnostics found.");
}
