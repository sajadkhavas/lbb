import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const host = process.env.PLAYWRIGHT_WEB_SERVER_HOST ?? "127.0.0.1";

const port = Number(process.env.PLAYWRIGHT_WEB_SERVER_PORT ?? "4173");

const siteUrl = process.env.VITE_SITE_URL ?? "https://lbb.example.test";

const backendMode = process.env.VITE_LBB_BACKEND_MODE ?? "prototype";

const compatibilityDate = process.env.PLAYWRIGHT_CLOUDFLARE_COMPATIBILITY_DATE ?? "2026-08-06";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid Playwright web server port: ${port}`);
}

const build = spawnSync(process.execPath, [path.join(root, "scripts", "build-production.mjs")], {
  cwd: root,
  env: {
    ...process.env,
    VITE_SITE_URL: siteUrl,
    VITE_LBB_BACKEND_MODE: backendMode,
  },
  stdio: "inherit",
});

if (build.error) {
  throw build.error;
}

if (build.status !== 0) {
  throw new Error(`Production test build failed with exit code ${build.status}.`);
}

const executable =
  process.platform === "win32"
    ? path.join(root, "node_modules", ".bin", "wrangler.cmd")
    : path.join(root, "node_modules", ".bin", "wrangler");

const server = spawn(
  executable,
  [
    "dev",
    "--config",
    path.join(root, ".output", "server", "wrangler.json"),
    "--compatibility-date",
    compatibilityDate,
    "--ip",
    host,
    "--port",
    String(port),
    "--local",
    "--show-interactive-dev-session=false",
  ],
  {
    cwd: root,
    env: {
      ...process.env,
      CI: "true",
      VITE_LBB_BACKEND_MODE: backendMode,
    },
    stdio: "inherit",

    // Intentionally NOT detached.
    // Playwright must retain ownership of the
    // runtime process tree for reliable teardown.
    detached: false,
  },
);

let shuttingDown = false;
let forceTimer;

function stopServer(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (server.exitCode === null && server.signalCode === null) {
    server.kill(signal);
  }

  forceTimer = setTimeout(() => {
    if (server.exitCode === null && server.signalCode === null) {
      server.kill("SIGKILL");
    }
  }, 5_000);

  forceTimer.unref();
}

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.once(signal, () => {
    stopServer(signal);
  });
}

server.on("error", (error) => {
  console.error("Playwright production runtime failed:", error);

  process.exitCode = 1;
});

server.on("exit", (code, signal) => {
  if (forceTimer) {
    clearTimeout(forceTimer);
  }

  if (shuttingDown) {
    process.exit(0);
  }

  if (signal) {
    console.error(`Playwright production runtime exited from signal ${signal}.`);
    process.exit(1);
  }

  process.exit(code ?? 0);
});
