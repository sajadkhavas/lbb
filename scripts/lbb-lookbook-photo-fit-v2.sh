#!/usr/bin/env bash
set -Eeuo pipefail
[[ $(id -u) == 0 ]] || { echo RUN_AS_ROOT; exit 1; }
[[ $(df -PB1 /var/www/lbb/releases | awk 'NR==2 { print $4 }') -ge 2147483648 ]] || { echo INSUFFICIENT_DISK; exit 1; }
previous=$(readlink -f /var/www/lbb/current)
[[ -f "$previous/src/components/lbb/home/DropStory.tsx" ]] || { echo SOURCE_NOT_FOUND; exit 1; }
[[ -z $(ss -H -ltn 'sport = :18574') ]] || { echo CANARY_PORT_BUSY; exit 1; }
release=$(mktemp -d /var/www/lbb/releases/home-motion-XXXXXXXX)
unit="lbb-home-check-$(basename "$release")"
state=$(mktemp -d /root/lbb-home-state-XXXXXXXX)
switched=0
rollback() {
  local result=$?
  trap - ERR
  if [[ "$switched" == 1 ]]; then
    ln -s "$previous" "/var/www/lbb/current.rollback.$$"
    mv -Tf "/var/www/lbb/current.rollback.$$" /var/www/lbb/current
    systemctl restart lbb.service
    echo "LBB_HOME_ROLLBACK_OK $previous"
  fi
  systemctl stop "$unit.service" >/dev/null 2>&1 || true
  rm -f "$state/runtime.env"
  if [[ "$(readlink -f /var/www/lbb/current)" != "$release" ]]; then rm -rf -- "$release"; fi
  echo "INSTALL_FAILED status=$result candidate=$release"
  exit "$result"
}
trap rollback ERR
tar -C "$previous" --exclude='./.output' --exclude='./.output-before-*' --exclude='./.*-build-backup-*' --exclude='./.git' -cf - . | tar -C "$release" -xf -
cd "$release"
python3 - "$state" <<'PY_PAYLOAD'
import base64,json,sys,pathlib,subprocess
payload=json.loads(r'''{"patch": "--- a/src/routes/$category.tsx\n+++ b/src/routes/$category.tsx\n@@ -1,4 +1,3 @@\n-import { homeCategoryImage } from \"@/lib/home-category-images\";\n import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from \"react\";\n import { createFileRoute, Link, notFound, redirect, useNavigate } from \"@tanstack/react-router\";\n import { PackageSearch, RefreshCcw } from \"lucide-react\";\n@@ -51,6 +50,7 @@\n   getCatalogFacets,\n   getCategory,\n   isLiveBackend,\n+  listCategories,\n   listProducts,\n   type CategoryDto,\n   type FacetsDto,\n@@ -70,6 +70,7 @@\n type LiveLoader = {\n   mode: \"live\";\n   category: CategoryDto | null;\n+  categoryDirectory?: CategoryDto[];\n   items: BackendCatalogCard[];\n   facets: FacetsDto | null;\n   filters: Filters;\n@@ -103,9 +104,10 @@\n     }\n \n     try {\n-      const [categoryResponse, facetsResponse] = await Promise.all([\n+      const [categoryResponse, facetsResponse, directoryResponse] = await Promise.all([\n         getCategory(params.category),\n         getCatalogFacets(),\n+        listCategories().catch(() => null),\n       ]);\n       const category = categoryResponse.data;\n       const facets = facetsResponse.data;\n@@ -131,6 +133,7 @@\n         return {\n           mode: \"live\",\n           category,\n+          categoryDirectory: directoryResponse?.data,\n           items: productsResponse.data.map(backendCard),\n           facets,\n           filters,\n@@ -142,6 +145,7 @@\n         return {\n           mode: \"live\",\n           category,\n+          categoryDirectory: directoryResponse?.data,\n           items: [],\n           facets,\n           filters,\n@@ -448,7 +452,7 @@\n       categorySlug={category.slug}\n       description={category.description || \"\u0645\u062d\u0635\u0648\u0644\u0627\u062a \u0645\u0646\u062a\u0634\u0631\u0634\u062f\u0647\u0654 \u0627\u06cc\u0646 \u062f\u0633\u062a\u0647 \u0631\u0627 \u0628\u0628\u06cc\u0646\u06cc\u062f.\"}\n       image={category.image}\n-      siblingCategories={facets?.categories\n+      siblingCategories={(loader.categoryDirectory ?? [])\n         .filter((item) => item.slug !== category.slug)\n         .slice(0, 4)}\n     >\n@@ -611,12 +615,9 @@\n                     params={{ category: category.slug }}\n                     className=\"flex min-h-32 w-36 shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl border border-hairline bg-carbon p-4 text-sm font-bold text-bone transition md:min-h-36 md:w-[calc((100%_-_3.75rem)/6)] hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal\"\n                   >\n-                    {category.image || Object.hasOwn(CATEGORIES, category.slug) ? (\n+                    {category.image ? (\n                       <img\n-                        src={\n-                          category.image ||\n-                          homeCategoryImage(category.slug as keyof typeof CATEGORIES)\n-                        }\n+                        src={category.image}\n                         alt=\"\"\n                         loading=\"lazy\"\n                         width={56}\n--- a/src/components/lbb/LookbookCarousel.tsx\n+++ b/src/components/lbb/LookbookCarousel.tsx\n@@ -16,10 +16,16 @@\n   const id = useId();\n   const move = (step: number) => {\n     const el = track.current;\n-    const card = el?.firstElementChild;\n-    if (!el || !card) return;\n+    if (!el) return;\n+    const edge = el.getBoundingClientRect().right;\n+    const cards = Array.from(el.children);\n+    const offsets = cards.map((card) => card.getBoundingClientRect().right - edge);\n+    const target =\n+      step < 0\n+        ? offsets.find((offset) => offset < -6)\n+        : offsets.reverse().find((offset) => offset > 6);\n     el.scrollBy({\n-      left: step * (card.getBoundingClientRect().width + 12),\n+      left: target ?? (step < 0 ? -el.clientWidth : el.clientWidth),\n       behavior: window.matchMedia(\"(prefers-reduced-motion: reduce)\").matches ? \"auto\" : \"smooth\",\n     });\n   };\n@@ -61,12 +67,9 @@\n               <img\n                 src={item.imageUrl}\n                 alt={item.title || \"\u062a\u0635\u0648\u06cc\u0631 \u0644\u0648\u06a9\u200c\u0628\u0648\u06a9 LBB\"}\n-                width={640}\n-                height={800}\n                 loading={!compact && index === 0 ? \"eager\" : \"lazy\"}\n                 decoding=\"async\"\n-                className=\"absolute inset-0 w-full object-contain\"\n-                style={{ height: \"100%\" }}\n+                className={`block h-auto w-auto max-w-[82vw] ${compact ? \"max-h-[220px] md:max-h-[300px]\" : \"max-h-[360px] md:max-h-[430px]\"}`}\n               />\n               {insta && (\n                 <span className=\"absolute end-2 top-2 grid size-9 place-items-center rounded-full bg-black/80 text-white transition-opacity [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100\">\n@@ -75,11 +78,11 @@\n               )}\n             </>\n           );\n-          const frameClass = `group relative block overflow-hidden rounded-xl bg-black ${compact ? \"aspect-square\" : \"aspect-[4/5] max-h-[430px]\"}`;\n+          const frameClass = \"group relative block w-fit overflow-hidden rounded-xl\";\n           return (\n             <article\n               key={`${item.imageUrl}-${index}`}\n-              className={`shrink-0 snap-start rounded-2xl border border-hairline bg-carbon p-1.5 ${compact ? \"w-[min(70vw,220px)] md:w-[calc((100%_-_3rem)/5)]\" : \"w-[min(82vw,360px)] md:w-[calc((100%_-_1.5rem)/3)]\"}`}\n+              className=\"w-min shrink-0 self-start snap-start overflow-hidden rounded-xl border border-hairline bg-carbon\"\n             >\n               {href ? (\n                 <a\n", "files": {}}''')
state=pathlib.Path(sys.argv[1])
patch=state/'home.patch'
patch.write_text(payload['patch'])
for name,content in payload['files'].items():
    p=pathlib.Path(name)
    if p.exists() and p.read_text()!=content:
        raise SystemExit('EXISTING_FILE_DIFFERS: '+name)
subprocess.run(['patch','--batch','--forward','--dry-run','-p1','-i',str(patch)],check=True)
subprocess.run(['patch','--batch','--forward','-p1','-i',str(patch)],check=True)
for name,content in payload['files'].items():
    p=pathlib.Path(name);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(content)
import base64
PY_PAYLOAD
if [[ -d .output ]]; then
  old_output=$(mktemp -d "$release/.home-build-backup-XXXXXXXX")
  mv .output "$old_output/output"
fi
VITE_SITE_URL=https://lbbclo.com VITE_LBB_BACKEND_MODE=live VITE_LBB_API_BASE_URL=https://api.lbbclo.com NITRO_PRESET=node-server npm run build
npm run typecheck
node scripts/test-home-autoplay.cjs
[[ -s .output/server/index.mjs ]]
chown -R lbb:lbb "$release"
chmod 755 "$release"
pid=$(systemctl show lbb.service -p MainPID --value)
python3 - "$pid" "$state/runtime.env" <<'PY_ENV'
import pathlib,sys,re
entries=pathlib.Path('/proc/'+sys.argv[1]+'/environ').read_bytes().split(b'\0')
lines=[]
for entry in entries:
    if b'=' not in entry: continue
    k,v=entry.split(b'=',1)
    key=k.decode()
    if not re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*',key): continue
    if not key.startswith(('VITE_','NITRO_','NODE_','LBB_','API_')): continue
    value=v.decode().replace('\\','\\\\').replace('"','\\"')
    if '\n' in value: raise SystemExit('MULTILINE_RUNTIME_ENV_NOT_SUPPORTED')
    lines.append(key+'="'+value+'"')
lines+=['NODE_ENV=production','HOST=127.0.0.1','PORT=18574','NITRO_HOST=127.0.0.1','NITRO_PORT=18574']
p=pathlib.Path(sys.argv[2]);p.write_text('\n'.join(lines)+'\n');p.chmod(0o600)
PY_ENV
systemd-run --unit="$unit" --property=User=lbb --property=Group=lbb --property="WorkingDirectory=$release" --property="EnvironmentFile=$state/runtime.env" /usr/bin/node "$release/.output/server/index.mjs"
check_home() {
  local port="$1" file="$state/home-$1.html"
  for attempt in $(seq 1 30); do
    if curl --compressed -fsS --connect-timeout 2 --max-time 10 "http://127.0.0.1:$port/" -o "$file" 2>/dev/null && grep -q 'data-compact-collection' "$file" && grep -q 'data-home-product-carousel' "$file"; then return 0; fi
    sleep 1
  done
  return 1
}
check_shop() {
  local port="$1"
  curl --compressed -fsS --max-time 15 "http://127.0.0.1:$port/shop" -o "$state/shop.html"
  grep -q '/brand/lbb-shop-storefront.webp' "$state/shop.html"
  curl -fsS --max-time 10 "http://127.0.0.1:$port/brand/lbb-shop-storefront.webp" -o "$state/shop.webp"
  cmp "$state/shop.webp" public/brand/lbb-shop-storefront.webp
}
check_collections() {
  local port="$1" origin="http://127.0.0.1:$1"
  curl --compressed -fsS --max-time 15 "$origin/collections" -o "$state/collections.html"
  grep -q 'data-collections-redesign' "$state/collections.html"
  curl --compressed -fsS --max-time 15 "$origin/collections/almas-o-tbyaat-st-hody-krap-o-gyn-bg" -o "$state/collection.html"
  grep -q 'data-collection-detail-redesign' "$state/collection.html"
  grep -q 'BreadcrumbList' "$state/collection.html"
  grep -q 'ItemList' "$state/collection.html"
  grep -q 'rel="canonical"' "$state/collection.html"
}
check_home 18574 || { journalctl -u "$unit" -n 25 --no-pager; false; }
check_shop 18574
check_collections 18574
curl -fsS --max-time 15 http://127.0.0.1:18574/lookbook -o "$state/lookbook.html"
grep -q data-shinethree-credit "$state/lookbook.html"
echo LBB_HOME_CANARY_OK
rollback_file="/root/lbb-home-rollback-$(date +%Y%m%d-%H%M%S).sh"
printf '#!/usr/bin/env bash\nset -euo pipefail\nln -s %q /var/www/lbb/current.manual-rollback.$$\nmv -Tf /var/www/lbb/current.manual-rollback.$$ /var/www/lbb/current\nsystemctl restart lbb.service\necho LBB_HOME_MANUAL_ROLLBACK_OK\n' "$previous" > "$rollback_file"
chmod 700 "$rollback_file"
ln -s "$release" "/var/www/lbb/current.home.$$"
switched=1
mv -Tf "/var/www/lbb/current.home.$$" /var/www/lbb/current
systemctl restart lbb.service
check_home 5173
check_shop 5173
check_collections 5173
prod_pid=$(systemctl show lbb.service -p MainPID --value)
[[ $(readlink -f "/proc/$prod_pid/cwd") == "$release" ]]
systemctl is-active --quiet lbb.service
systemctl stop "$unit.service"
rm -f "$state/runtime.env"
trap - ERR
echo "LBB_LOOKBOOK_DEPLOY_OK $release"
echo "ROLLBACK_COMMAND=bash $rollback_file"
