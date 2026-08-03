import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const artifactsDir = path.join(root, "artifacts", "dead-code");
const binary = path.join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "knip.cmd" : "knip",
);
const result = spawnSync(binary, ["--config", "knip.json", "--reporter", "json"], {
  cwd: root,
  encoding: "utf8",
  env: process.env,
});

await mkdir(artifactsDir, { recursive: true });
const rawOutput = result.stdout?.trim() || "{}";
await writeFile(path.join(artifactsDir, "knip-report.json"), `${rawOutput}\n`);

const markdown = [
  "# LBB dead-code report",
  "",
  "This phase is report-only. No feature-owned file is deleted or rewritten from these findings.",
  "",
  `- Knip exit code: ${result.status ?? "not started"}`,
  `- Signal: ${result.signal ?? "none"}`,
  result.stderr?.trim()
    ? `- Diagnostics: \`${result.stderr.trim().replaceAll("`", "'")}\``
    : "- Diagnostics: none",
  "",
  "Review `knip-report.json` during Final Review before removing any file or export.",
  "",
].join("\n");
await writeFile(path.join(artifactsDir, "README.md"), markdown);

if (result.error) {
  console.warn(`Dead-code report could not start: ${result.error.message}`);
} else {
  console.log(
    `Dead-code report generated (Knip exit ${result.status}). Findings do not fail F8-A.`,
  );
}
