import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const removed = [
  "src/components/SmoothScroll.tsx",
  "src/components/lbb/CustomCursor.tsx",
  "src/components/lbb/MagneticButton.tsx",
  "src/hooks/use-reveal.ts",
  "src/components/lbb/home/BestSellers.tsx",
  "src/components/lbb/home/HeroSplit.tsx",
];
for (const file of removed) {
  if (exists(file)) throw new Error(`F18 audit failed: legacy motion file remains: ${file}`);
}

const packageJson = JSON.parse(read("package.json"));
for (const dependency of ["gsap", "lenis", "motion"]) {
  if (packageJson.dependencies?.[dependency] || packageJson.devDependencies?.[dependency]) {
    throw new Error(`F18 audit failed: unused motion dependency remains: ${dependency}`);
  }
}

const sourceFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(next);
    else if (/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) sourceFiles.push(next);
  }
};
walk(path.join(root, "src"));
const source = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
for (const token of [
  'from "gsap',
  'import("gsap',
  'from "lenis',
  'import("lenis',
  'from "motion',
  'import("motion',
]) {
  if (source.includes(token))
    throw new Error(`F18 audit failed: runtime motion import remains: ${token}`);
}

const ticker = read("src/components/lbb/home/TickerStrip.tsx");
for (const token of [
  "IntersectionObserver",
  "visibilitychange",
  "prefers-reduced-motion: reduce",
  'style.setProperty("animation-play-state"',
  'data-f18-motion="viewport-ticker"',
]) {
  if (!ticker.includes(token))
    throw new Error(`F18 audit failed: ticker contract missing ${token}`);
}

const styles = read("src/styles.css");
if (!styles.includes("@media (prefers-reduced-motion: reduce)")) {
  throw new Error("F18 audit failed: global reduced-motion contract missing");
}
if (!styles.includes(".marquee-track,\n  .skeleton-shimmer::after")) {
  throw new Error("F18 audit failed: marquee reduced-motion opt-out missing");
}
if (!styles.includes("animation-play-state: paused !important")) {
  throw new Error("F18 audit failed: reduced-motion playback state is not explicit");
}

const homepage = read("src/routes/index.tsx");
for (const banned of ["SmoothScroll", "CustomCursor", "MagneticButton", "gsap", "lenis"]) {
  if (homepage.includes(banned)) throw new Error(`F18 audit failed: homepage imports ${banned}`);
}

console.log("F18 motion/performance audit: PASS");
