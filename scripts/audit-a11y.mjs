import { access, readFile } from "node:fs/promises";

const REQUIRED_DOCS = [
  "docs/f19/README.md",
  "docs/f19/route-a11y-matrix.md",
  "docs/f19/keyboard-matrix.md",
  "docs/f19/rtl-audit.md",
  "docs/f19/touch-zoom-audit.md",
  "docs/f19/reduced-motion-audit.md",
  "docs/f19/f19b-remediation-backlog.md",
];

const REQUIRED_AXE_ROUTES = [
  "/",
  "/shop",
  "/hoodies",
  "/search?q=هودی",
  "/product/lbb-classic-hoodie",
  "/cart",
  "/checkout",
  "/account",
  "/collections",
  "/collections/drop-01-shabgard",
  "/lookbook",
  "/journal",
  "/journal/materials-101-parche-shenasi",
  "/about",
  "/faq",
  "/shipping-returns",
  "/terms",
  "/privacy",
  "/contact",
  "/f19-route-does-not-exist",
];

const failures = [];

async function text(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    failures.push(`${path}: cannot be read (${error.message})`);
    return "";
  }
}

function requireTokens(path, source, tokens) {
  for (const token of tokens) {
    if (!source.includes(token))
      failures.push(`${path}: missing contract token ${JSON.stringify(token)}`);
  }
}

for (const path of REQUIRED_DOCS) {
  try {
    await access(path);
  } catch {
    failures.push(`${path}: required F19 audit document is missing`);
  }
}

const axe = await text("tests/accessibility.spec.ts");
requireTokens("tests/accessibility.spec.ts", axe, REQUIRED_AXE_ROUTES);
requireTokens("tests/accessibility.spec.ts", axe, ["serious", "critical", "AxeBuilder"]);

const interactions = await text("tests/f19-interactions.spec.ts");
requireTokens("tests/f19-interactions.spec.ts", interactions, [
  "Tab",
  "Shift+Tab",
  "Escape",
  "ArrowLeft",
  "ArrowRight",
  "ArrowDown",
  "Home",
  "End",
  "aria-invalid",
  "aria-describedby",
  "lookbook",
  "Quick View",
  "filter drawer",
]);

const rtl = await text("tests/f19-rtl.spec.ts");
requireTokens("tests/f19-rtl.spec.ts", rtl, [
  "390",
  "768",
  "1440",
  "1920",
  'dir", "rtl',
  "prefers-reduced-motion: reduce",
  "0.12em",
  "0.16em",
  "44",
]);

for (const [path, source] of [
  ["tests/accessibility.spec.ts", axe],
  ["tests/f19-interactions.spec.ts", interactions],
  ["tests/f19-rtl.spec.ts", rtl],
]) {
  for (const forbidden of ["test.skip(", "test.fixme("]) {
    if (source.includes(forbidden))
      failures.push(`${path}: ${forbidden} is not allowed in F19-A gates`);
  }
}

const packageJson = JSON.parse(await text("package.json"));
const scripts = packageJson.scripts ?? {};
for (const command of ["test:a11y", "test:rtl", "audit:a11y"]) {
  if (!scripts[command]) failures.push(`package.json: missing ${command} script`);
}
if (!String(scripts.quality ?? "").includes("audit:a11y")) {
  failures.push("package.json: quality must execute audit:a11y");
}

if (failures.length > 0) {
  console.error("F19 accessibility audit gate failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `F19 accessibility audit gate passed: ${REQUIRED_AXE_ROUTES.length} required Axe routes, ` +
      `${REQUIRED_DOCS.length} audit documents, keyboard/RTL/touch/reduced-motion contracts present.`,
  );
}
