import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];

const settingsPath = path.join(root, "src/lib/store-settings.ts");
const readinessPath = path.join(root, "src/lib/launch-readiness.ts");
const trustMarksPath = path.join(root, "src/components/lbb/TrustMarks.tsx");

const settings = await readFile(settingsPath, "utf8").catch(() => "");
const readiness = await readFile(readinessPath, "utf8").catch(() => "");
const trustMarks = await readFile(trustMarksPath, "utf8").catch(() => "");

if (!settings) failures.push("Typed public store settings are missing.");
if (!readiness) failures.push("Launch-readiness evaluator is missing.");
if (!trustMarks) failures.push("Controlled trust-mark component is missing.");

for (const forbidden of [
  "merchantSecret",
  "clientSecret",
  "apiSecret",
  "webhookSecret",
  "privateKey",
  "dangerouslySetInnerHTML",
  "rawHtml",
  "rawScript",
]) {
  if (`${settings}\n${trustMarks}`.includes(forbidden)) {
    failures.push(`Forbidden public settings or rendering capability found: ${forbidden}`);
  }
}

for (const required of [
  "VerificationState",
  "PaymentPublicSettings",
  "EnamadPublicSettings",
  "canDisplayEnamad",
  "canOfferPayment",
  "getVisibleTrustClaims",
]) {
  if (!settings.includes(required)) {
    failures.push(`Store settings contract is missing: ${required}`);
  }
}

for (const required of [
  "storefrontContentReady",
  "commerceLaunchReady",
  "backend.paymentIntegration",
  "VITE_SITE_URL",
]) {
  if (!readiness.includes(required)) {
    failures.push(`Launch-readiness contract is missing: ${required}`);
  }
}

if (!trustMarks.includes("canDisplayEnamad()")) {
  failures.push("Trust mark must remain gated by verified Enamad settings.");
}
if (!trustMarks.includes('rel="noopener noreferrer"')) {
  failures.push("External trust verification link must prevent opener access.");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Store settings boundary audit passed.");
