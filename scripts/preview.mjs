import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

function readArgument(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) return fallback;
  return process.argv[index + 1];
}

const host = readArgument("--host", process.env.NITRO_HOST || process.env.HOST || "127.0.0.1");
const port = readArgument("--port", process.env.NITRO_PORT || process.env.PORT || "4173");

process.env.HOST = host;
process.env.PORT = port;
process.env.NITRO_HOST = host;
process.env.NITRO_PORT = port;

const serverEntry = path.join(process.cwd(), ".output", "server", "index.mjs");
await import(pathToFileURL(serverEntry).href);
