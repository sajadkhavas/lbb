import { spawn } from "node:child_process";
import process from "node:process";

const host = "127.0.0.1";
const port = 4287;
const origin = `http://${host}:${port}`;
const productionOrigin = process.env.VITE_SITE_URL;

if (!productionOrigin) {
  throw new Error("VITE_SITE_URL is required for the production smoke test.");
}

let logs = "";
const executable =
  process.platform === "win32" ? "node_modules/.bin/vite.cmd" : "node_modules/.bin/vite";
const server = spawn(
  executable,
  ["preview", "--host", host, "--port", String(port), "--strictPort"],
  {
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  },
);

server.stdout.on("data", (chunk) => {
  logs += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  logs += chunk.toString();
});

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Production preview exited early (${server.exitCode}).
${logs}`);
    }
    try {
      const response = await fetch(`${origin}/`);
      if (response.ok) return;
    } catch {
      // Preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Production preview did not become ready.
${logs}`);
}

async function assertResponse(path, expectedType, requiredText) {
  const response = await fetch(`${origin}${path}`, { redirect: "manual" });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}.
${body.slice(0, 500)}`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes(expectedType)) {
    throw new Error(`${path} returned unexpected content type: ${contentType}`);
  }
  for (const text of requiredText) {
    if (!body.includes(text)) throw new Error(`${path} is missing expected content: ${text}`);
  }
}

try {
  await waitForServer();
  await assertResponse("/", "text/html", ["<html", 'dir="rtl"', "LBB"]);
  await assertResponse("/product/lbb-classic-hoodie", "text/html", [
    "LBB Classic Hoodie",
    'dir="rtl"',
  ]);
  await assertResponse("/sitemap.xml", "application/xml", [`<loc>${productionOrigin}/</loc>`]);
  await assertResponse("/robots.txt", "text/plain", [`Sitemap: ${productionOrigin}/sitemap.xml`]);
  console.log("Production preview smoke test passed.");
} finally {
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}
