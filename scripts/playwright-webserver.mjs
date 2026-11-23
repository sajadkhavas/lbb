import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const host = process.env.PLAYWRIGHT_WEB_SERVER_HOST ?? "127.0.0.1";

const port = Number(process.env.PLAYWRIGHT_WEB_SERVER_PORT ?? "4173");

const siteUrl = process.env.VITE_SITE_URL ?? "https://lbb.example.test";

const backendMode = process.env.VITE_LBB_BACKEND_MODE ?? "prototype";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid Playwright web server port: ${port}`);
}

const build = spawnSync(process.execPath, [path.join(root, "scripts", "build-production.mjs")], {
  cwd: root,
  env: {
    ...process.env,
    CI: "true",
    NITRO_PRESET: "node-server",
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

const entry = path.join(root, ".output", "server", "index.mjs");

const server = spawn(process.execPath, [entry], {
  cwd: root,
  env: {
    ...process.env,
    CI: "true",
    NODE_ENV: "production",
    HOST: host,
    PORT: String(port),
    NITRO_HOST: host,
    NITRO_PORT: String(port),
    VITE_LBB_BACKEND_MODE: backendMode,
  },
  stdio: "inherit",
  detached: false,
});

let shuttingDown = false;
let forceTimer;

function stopServer(signal) {
  if (shuttingDown) return;

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
  console.error("Playwright node-server runtime failed:", error);

  process.exitCode = 1;
});

server.on("exit", (code, signal) => {
  if (forceTimer) {
    clearTimeout(forceTimer);
  }

  if (shuttingDown) {
    process.exit(0);
    return;
  }

  if (signal) {
    console.error(`Playwright node-server runtime exited from signal ${signal}.`);

    process.exit(1);
    return;
  }

  process.exit(code ?? 0);
});
