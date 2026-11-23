# Frontend Node production build

Use Node 24 and the committed lockfile:

```sh
npm ci
VITE_SITE_URL=https://lbbclo.com VITE_LBB_BACKEND_MODE=live VITE_LBB_API_BASE_URL=https://api.lbbclo.com NITRO_PRESET=node-server npm run build
npm run typecheck
node scripts/test-home-autoplay.cjs
```

Run `.output/server/index.mjs` using the existing `lbb.service` as user `lbb`.
Install `99-iran-node.conf` as a systemd drop-in when Node lives in
`/usr/local/bin/node`. Preserve the existing service environment and securely
provision `/etc/lbb/ssr-rate-limit.env`; a missing mandatory EnvironmentFile
prevents systemd from starting the service. Never ship tokens in VITE variables.

The generated Node output includes runtime dependencies. Top-level node_modules
is a build dependency and is not needed by the deployed standalone Node output.
Review build output and smoke-test a separate candidate before switching current.
