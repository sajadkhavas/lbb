#!/usr/bin/env bash
set -Eeuo pipefail
umask 022

root=/var/www/lbb
current="$root/current"
service=lbb.service
baseline="$root/releases/shop-layout-mZidhYvb"
mode="${1:-deploy}"

[[ $EUID == 0 && -L "$current" && -d "$baseline" ]]
exec 9>"$root/.shop-release.lock"
flock -n 9

switch_release() {
  local target="$1" stage
  stage="$(mktemp -d "$root/.shop-switch.XXXXXXXX")"
  ln -s -- "$target" "$stage/current" || return 1
  mv -Tf -- "$stage/current" "$current" || return 1
  rmdir -- "$stage" || true
}

check_release() {
  local target="$1" marker="${2:-}" pid attempt body http_code
  body="$(mktemp)" || return 1
  for attempt in {1..12}; do
    pid="$(systemctl show -p MainPID --value "$service")"
    if [[ "$pid" != 0 && "$(readlink -f "/proc/$pid/cwd" || true)" == "$target" ]] &&
      http_code="$(curl -fsS --compressed --max-time 5 -H 'Cache-Control: no-cache' \
        -o "$body" -w '%{http_code}' "https://lbbclo.com/shop?lbb_release=$(date +%s%N)")" &&
      [[ "$http_code" == 200 && -s "$body" ]]; then
      if [[ -z "$marker" ]] || LC_ALL=C grep -aqF 'id="shop-category-track"' "$body"; then
        rm -f -- "$body"
        return 0
      fi
      echo "SHOP_CHECK attempt=$attempt HTTP=200 release marker missing" >&2
    else
      echo "SHOP_CHECK attempt=$attempt HTTP=${http_code:-unavailable} PID=${pid:-unknown}" >&2
    fi
    sleep 2
  done
  rm -f -- "$body"
  return 1
}

if [[ "$mode" == rollback ]]; then
  active="$(readlink -f "$current")"
  if [[ "$active" != "$root"/releases/shop-layout-* || ! -f "$active/.lbb-shop-previous" ||
    "$(cat "$active/.lbb-shop-previous")" != "$baseline" ]]; then
    echo 'STOP: active release is not the release installed by this script.' >&2
    exit 1
  fi
  switch_release "$baseline"
  systemctl restart "$service"
  check_release "$baseline"
  echo "LBB_SHOP_ROLLBACK_OK $baseline"
  exit
fi

[[ "$mode" == deploy ]]
[[ "$(readlink -f "$current")" == "$baseline" ]]
[[ "$(systemctl show -p WorkingDirectory --value "$service")" == "$current" ]]
systemctl is-active --quiet "$service"
check_release "$baseline"

source_file=src/routes/shop.tsx
expected='6fc9d1a513d0e16ed1ed0a4252b055bbad59f258ee31c27a27ce507d7da3c797'
[[ "$(sha256sum "$baseline/$source_file" | cut -d' ' -f1)" == "$expected" ]] || {
  echo 'STOP: active shop source differs from the expected source.' >&2
  exit 1
}

candidate="$(mktemp -d "$root/releases/shop-layout-XXXXXXXX")"
chmod --reference="$baseline" "$candidate"
chown --reference="$baseline" "$candidate"
cp -a "$baseline/." "$candidate/"
cd "$candidate"
patch --batch --forward -p1 <<'PATCH'
--- a/src/routes/shop.tsx
+++ b/src/routes/shop.tsx
@@ -668,19 +668,20 @@
         </Shell>
         <header className="border-y border-hairline">
           <Shell className="py-3 md:py-5">
-            <div className="relative isolate min-h-[520px] overflow-hidden rounded-[24px] bg-carbon md:min-h-[590px] md:rounded-[32px]">
-              <img
-                src={page.socialImageUrl ?? homeCategoryImage("tshirts")}
-                alt=""
-                fetchPriority="high"
-                className={
-                  page.socialImageUrl
-                    ? "absolute inset-0 h-full w-full object-cover object-left"
-                    : "absolute inset-0 h-full w-full object-cover object-center"
-                }
-              />
-              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(9,9,11,.15)_30%,rgba(9,9,11,.96)_75%)] md:bg-[linear-gradient(to_left,rgba(9,9,11,.86)_0%,rgba(9,9,11,.58)_32%,transparent_67%)]" />
-              <div className="relative flex min-h-[520px] flex-col justify-end p-5 md:min-h-[590px] md:max-w-[680px] md:justify-center md:p-12 lg:p-16">
+            <div className="grid overflow-hidden rounded-3xl border border-hairline bg-carbon md:grid-cols-2">
+              <div className="bg-obsidian md:col-start-2 md:row-start-1">
+                <img
+                  src={
+                    presentation.hero.imageUrl ??
+                    page.socialImageUrl ??
+                    homeCategoryImage("tshirts")
+                  }
+                  alt="ویترین فروشگاه پوشاک LBB"
+                  fetchPriority="high"
+                  className="mx-auto h-[360px] w-full object-contain md:h-[590px]"
+                />
+              </div>
+              <div className="flex flex-col justify-center bg-carbon p-6 md:col-start-1 md:row-start-1 md:p-10 lg:p-12">
                 <TechLabel tone="signal">{page.eyebrow}</TechLabel>
                 <h1 className="mt-4 max-w-xl text-[clamp(2.75rem,7vw,6.5rem)] font-black leading-[.92] tracking-[-.06em] text-bone">
                   {page.title}
@@ -771,7 +772,7 @@
                   key={category.slug}
                   to="/$category"
                   params={{ category: category.slug }}
-                  className="group relative h-32 w-28 shrink-0 snap-start overflow-hidden rounded-xl border border-white/15 bg-bone hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal md:h-40 md:w-[calc((100%_-_3.75rem)/6)]"
+                  className="group flex min-h-32 w-36 shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl border border-hairline bg-carbon p-4 text-center text-bone transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:min-h-36 md:w-[calc((100%_-_3.75rem)/6)]"
                 >
                   {(category.image || Object.hasOwn(CATEGORIES, category.slug)) && (
                     <img
@@ -785,13 +786,10 @@
                       width={640}
                       height={800}
                       loading={index < 2 ? "eager" : "lazy"}
-                      className="absolute inset-0 h-full w-full object-contain px-3 pb-9 pt-2 transition-transform group-hover:scale-105"
+                      className="size-12 object-contain md:size-14"
                     />
                   )}
-                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-obsidian px-2 py-2 text-xs font-bold text-bone md:px-3 md:text-sm">
-                    {category.label}
-                    <ArrowUpLeft size={14} aria-hidden="true" className="shrink-0" />
-                  </span>
+                  <span className="text-sm font-bold">{category.label}</span>
                 </Link>
               ))}
             </div>
PATCH

# A fresh output directory keeps the previous release and its build intact.
if [[ -e .output || -L .output ]]; then
  mv -- .output .output-before-shop-build
fi
if [[ ! -x node_modules/.bin/vite ]]; then
  npm ci --include=dev
fi
NITRO_PRESET=node-server \
VITE_SITE_URL=https://lbbclo.com \
VITE_LBB_BACKEND_MODE=live \
VITE_LBB_API_BASE_URL=https://api.lbbclo.com \
npm run build
test -s .output/server/index.mjs
/usr/bin/node -e 'if (require("./.output/nitro.json").preset !== "node-server") process.exit(1)'
canary="lbb-shop-check-${candidate##*-}.service"
canary_body="$(mktemp)"
cleanup_canary() {
  systemctl stop "$canary" >/dev/null 2>&1 || true
  rm -f -- "$canary_body"
}
trap cleanup_canary EXIT
if [[ -n "$(ss -H -ltn 'sport = :18573')" ]]; then
  echo 'STOP: canary port 18573 is already in use.' >&2
  exit 1
fi
systemd-run --unit="$canary" --property=User=lbb --property=Group=lbb \
  --property="WorkingDirectory=$candidate" --setenv=NODE_ENV=production \
  --setenv=NITRO_HOST=127.0.0.1 --setenv=NITRO_PORT=18573 \
  /usr/bin/node "$candidate/.output/server/index.mjs"

canary_ok=0
for attempt in {1..12}; do
  if systemctl is-active --quiet "$canary" &&
    curl -fsS --compressed --max-time 5 -H 'Host: lbbclo.com' \
      -o "$canary_body" http://127.0.0.1:18573/shop &&
    LC_ALL=C grep -aqF 'id="shop-category-track"' "$canary_body"; then
    canary_ok=1
    break
  fi
  sleep 2
done
if [[ "$canary_ok" != 1 ]]; then
  journalctl -u "$canary" -n 30 --no-pager >&2 || true
  echo 'LBB_SHOP_CANARY_FAILED' >&2
  exit 1
fi
cleanup_canary
trap - EXIT
echo 'LBB_SHOP_CANARY_OK'
printf '%s\n' "$baseline" > .lbb-shop-previous

rollback_on_failure() {
  local status="$?"
  trap - EXIT HUP INT TERM
  if [[ "$(readlink -f "$current")" == "$candidate" ]]; then
    if switch_release "$baseline" && systemctl restart "$service" && check_release "$baseline"; then
      echo "LBB_SHOP_ROLLBACK_OK $baseline" >&2
    else
      echo "LBB_SHOP_ROLLBACK_CHECK_FAILED $baseline" >&2
    fi
  fi
  exit "$status"
}

trap rollback_on_failure EXIT
trap 'exit 130' HUP INT TERM
switch_release "$candidate"
systemctl restart "$service"
check_release "$candidate" new
trap - EXIT HUP INT TERM
echo "LBB_SHOP_DEPLOY_OK $candidate"
