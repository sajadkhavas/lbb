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
payload=json.loads(r'''{"patch": "--- a/src/routes/collections.$slug.tsx\n+++ b/src/routes/collections.$slug.tsx\n@@ -30,6 +30,11 @@\n import { pageMeta, canonical, breadcrumbLd, absUrl } from \"@/lib/site\";\n import { backendCanonicalPath } from \"@/lib/seo-live\";\n \n+function collectionSummary(collection: CollectionDto): string {\n+  const text = (collection.seo.metaDescription || collection.description || \"\").trim();\n+  return text.length > 190 ? text.slice(0, 190).replace(/\\s+\\S*$/, \"\") + \"…\" : text;\n+}\n+\n type LiveLoader = {\n   mode: \"live\";\n   collection: CollectionDto | null;\n@@ -96,8 +101,8 @@\n       const title = collection.seo.metaTitle || `${collection.name} | LBB`;\n       const description =\n         collection.seo.metaDescription ||\n-        collection.description ||\n-        \"کالکشن منتشرشده LBB و محصولات مرتبط آن.\";\n+        collectionSummary(collection) ||\n+        `محصولات کالکشن ${collection.name} در فروشگاه LBB.`;\n       const collectionLd = {\n         \"@context\": \"https://schema.org\",\n         \"@type\": \"CollectionPage\",\n@@ -276,7 +281,10 @@\n     );\n   }\n \n-  const image = collection.seo.primaryImage;\n+  const image =\n+    (collection as CollectionDto & { coverImage?: string }).coverImage ||\n+    collection.seo.primaryImage;\n+  const summary = collectionSummary(collection);\n   const categories = Array.from(\n     new Map(\n       loader.products.map((product) => [\n@@ -288,51 +296,53 @@\n \n   return (\n     <PageChrome breadcrumbLabel={collection.name}>\n-      <Band hairline={false} className=\"pb-10 pt-8 md:pb-14 md:pt-12\">\n-        <Shell className=\"grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12\">\n-          <div className=\"flex flex-col justify-center\">\n-            <TechLabel tone=\"signal\">PUBLISHED COLLECTION</TechLabel>\n-            <h1 className=\"mt-5 text-display-1 text-bone\">{collection.name}</h1>\n-            <p className=\"mt-5 max-w-[64ch] text-sm leading-8 text-metal\">\n-              {collection.description || \"توضیح عمومی برای این کالکشن منتشر نشده است.\"}\n-            </p>\n-            <div className=\"mt-7 flex flex-wrap gap-2\">\n-              {collection.isFeatured ? <StatusTag tone=\"signal\">FEATURED</StatusTag> : null}\n-              <StatusTag tone=\"neutral\">\n-                {loader.products.length.toLocaleString(\"fa-IR\")} محصول منتشرشده\n-              </StatusTag>\n-            </div>\n-            <div className=\"mt-8 flex flex-wrap gap-3\">\n-              <a href=\"#collection-products\" className={CtaClasses(\"signal\")}>\n-                مشاهده محصولات\n+      <Shell className=\"pb-6 pt-2 md:pb-10\">\n+        <header\n+          dir=\"rtl\"\n+          data-collection-detail-redesign\n+          className={`grid overflow-hidden rounded-2xl border border-hairline bg-carbon ${image ? \"md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]\" : \"\"}`}\n+        >\n+          <div className=\"flex min-w-0 flex-col justify-center p-5 md:p-9 lg:p-12\">\n+            <h1 className=\"text-2xl font-black leading-snug text-bone sm:text-3xl lg:text-5xl\">\n+              {collection.name}\n+            </h1>\n+            {summary && <p className=\"mt-3 max-w-prose text-sm leading-7 text-metal\">{summary}</p>}\n+            {loader.products.length > 0 && (\n+              <a href=\"#collection-products\" className={`mt-4 self-start ${CtaClasses(\"signal\")}`}>\n+                دیدن {loader.products.length.toLocaleString(\"fa-IR\")} محصول\n               </a>\n-              <Link to=\"/collections\" className={CtaClasses(\"line\")}>\n-                همه کالکشن‌ها\n-              </Link>\n-            </div>\n+            )}\n           </div>\n-\n-          {image ? (\n-            <Frame\n-              src={image}\n-              alt={`تصویر کالکشن ${collection.name}`}\n-              ratio=\"4/5\"\n-              priority\n-              sizes=\"(max-width: 1024px) 100vw, 46vw\"\n-              className=\"rounded-2xl border border-hairline\"\n-              width={1200}\n-              height={1500}\n-            />\n-          ) : (\n-            <div className=\"grid min-h-80 place-items-center rounded-2xl border border-hairline bg-carbon px-8 text-center text-sm leading-7 text-mute\">\n-              تصویر عمومی تأییدشده‌ای برای این کالکشن منتشر نشده است.\n+          {image && (\n+            <div className=\"relative aspect-[4/3] overflow-hidden bg-carbon md:aspect-auto md:min-h-[390px]\">\n+              <img\n+                src={image}\n+                alt={`پوشش و استایل کالکشن ${collection.name}`}\n+                width={900}\n+                height={1200}\n+                fetchPriority=\"high\"\n+                decoding=\"async\"\n+                className=\"absolute inset-0 w-full object-cover object-[center_38%]\"\n+                style={{ height: \"100%\" }}\n+              />\n             </div>\n           )}\n-        </Shell>\n-      </Band>\n-\n-      <Band id=\"collection-products\" label={`محصولات ${collection.name}`}>\n+        </header>\n+      </Shell>\n+\n+      <section\n+        id=\"collection-products\"\n+        dir=\"rtl\"\n+        aria-labelledby=\"collection-products-title\"\n+        className=\"scroll-mt-24 border-t border-hairline py-6 md:py-10\"\n+      >\n         <Shell>\n+          <h2\n+            id=\"collection-products-title\"\n+            className=\"mb-4 text-xl font-black text-bone md:mb-6 md:text-3xl\"\n+          >\n+            محصولات این کالکشن\n+          </h2>\n           {loader.products.length === 0 ? (\n             <EmptyState\n               icon={<Layers3 aria-hidden=\"true\" size={32} />}\n@@ -346,7 +356,9 @@\n             />\n           ) : (\n             <>\n-              <div className=\"grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4\">\n+              <div\n+                className={`grid grid-cols-2 gap-2 sm:gap-4 ${loader.products.length <= 2 ? \"mx-auto max-w-3xl\" : \"md:grid-cols-3 lg:grid-cols-4\"}`}\n+              >\n                 {loader.products.map((product, index) => (\n                   <ProductCard\n                     key={product.publicId}\n@@ -372,7 +384,31 @@\n             </>\n           )}\n         </Shell>\n-      </Band>\n+      </section>\n+      {collection.description && collection.description.trim() !== summary && (\n+        <section\n+          dir=\"rtl\"\n+          aria-labelledby=\"collection-about\"\n+          className=\"border-t border-hairline py-8 md:py-12\"\n+        >\n+          <Shell>\n+            <div className=\"max-w-3xl rounded-2xl border border-hairline bg-carbon p-5 md:p-8\">\n+              <h2 id=\"collection-about\" className=\"text-xl font-black text-bone\">\n+                دربارهٔ این کالکشن\n+              </h2>\n+              {collection.description\n+                .trim()\n+                .split(/\\n+/)\n+                .filter(Boolean)\n+                .map((paragraph, index) => (\n+                  <p key={index} className=\"mt-3 text-sm leading-8 text-metal\">\n+                    {paragraph}\n+                  </p>\n+                ))}\n+            </div>\n+          </Shell>\n+        </section>\n+      )}\n     </PageChrome>\n   );\n }\n--- a/src/routes/collections.index.tsx\n+++ b/src/routes/collections.index.tsx\n@@ -2,7 +2,7 @@\n import { ArrowUpLeft, RefreshCcw } from \"lucide-react\";\n import { Navbar } from \"@/components/lbb/Navbar\";\n import { Footer } from \"@/components/lbb/Footer\";\n-import { ManagedPageHead, ManagedPageIntro } from \"@/components/lbb/ManagedPageIntro\";\n+import { ManagedPageHead } from \"@/components/lbb/ManagedPageIntro\";\n import { MobileBottomBar } from \"@/components/lbb/MobileBottomBar\";\n import { Breadcrumb } from \"@/components/lbb/Breadcrumb\";\n import { COLLECTIONS } from \"@/lib/collections\";\n@@ -100,11 +100,26 @@\n   return (\n     <Chrome>\n       <ManagedPageHead presentation={page} path=\"/collections\" />\n-      <Band hairline={false} className=\"pb-8 pt-8 md:pb-12 md:pt-12\">\n-        <ManagedPageIntro presentation={page} />\n-      </Band>\n-      <Band>\n-        <Shell>\n+      <Shell className=\"pb-16\">\n+        <header\n+          dir=\"rtl\"\n+          className=\"border-b border-hairline pb-5 pt-3 md:flex md:items-end md:justify-between md:gap-6 md:pb-7\"\n+        >\n+          <div>\n+            <h1 className=\"text-3xl font-black leading-tight text-bone sm:text-5xl\">\n+              {page.title}\n+            </h1>\n+            <p className=\"mt-3 max-w-xl text-sm leading-7 text-metal\">{page.lede}</p>\n+          </div>\n+          <Link\n+            to=\"/shop\"\n+            search={{}}\n+            className=\"mt-3 inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-signal\"\n+          >\n+            همه محصولات <ArrowUpLeft size={16} aria-hidden=\"true\" />\n+          </Link>\n+        </header>\n+        <div dir=\"rtl\" className=\"mt-5 md:mt-8\" data-collections-redesign>\n           {error ? (\n             <EmptyState\n               icon={<RefreshCcw size={40} aria-hidden=\"true\" />}\n@@ -126,43 +141,62 @@\n               body=\"کالکشن‌های تازه LBB به‌زودی در این بخش قرار می‌گیرند.\"\n             />\n           ) : (\n-            <div className=\"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3\">\n-              {collections.map((collection) => {\n+            <div className=\"grid gap-5 md:grid-cols-2\">\n+              {collections.map((collection, index) => {\n                 const managed = collection as ManagedCollection;\n+                const cover = managed.coverImage || collection.seo.primaryImage;\n+                const lead = index === 0;\n+                const summary = (\n+                  collection.seo.metaDescription ||\n+                  collection.description ||\n+                  \"\"\n+                ).trim();\n                 return (\n                   <Link\n                     key={collection.publicId}\n                     to=\"/collections/$slug\"\n                     params={{ slug: collection.slug }}\n-                    className=\"group flex min-h-64 flex-col overflow-hidden rounded-2xl border border-hairline bg-carbon transition hover:-translate-y-1 hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal\"\n+                    className={`group grid overflow-hidden rounded-2xl border border-hairline bg-carbon hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${lead ? \"md:col-span-2 md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)]\" : \"\"}`}\n                   >\n-                    {managed.coverImage ? (\n-                      <img\n-                        src={managed.coverImage}\n-                        alt={`تصویر کالکشن ${collection.name}`}\n-                        width={900}\n-                        height={600}\n-                        loading=\"lazy\"\n-                        className=\"aspect-[3/2] w-full object-cover\"\n-                      />\n+                    {cover ? (\n+                      <div\n+                        className={`relative overflow-hidden bg-carbon ${lead ? \"aspect-[4/3] md:aspect-auto md:min-h-[360px]\" : \"aspect-[4/3]\"}`}\n+                      >\n+                        <img\n+                          src={cover}\n+                          alt={`ویترین کالکشن ${collection.name}`}\n+                          width={900}\n+                          height={1200}\n+                          loading={lead ? \"eager\" : \"lazy\"}\n+                          fetchPriority={lead ? \"high\" : \"auto\"}\n+                          decoding=\"async\"\n+                          className=\"absolute inset-0 w-full object-cover object-[center_38%]\"\n+                          style={{ height: \"100%\" }}\n+                        />\n+                      </div>\n                     ) : null}\n-                    <div className=\"flex flex-1 flex-col justify-between p-6\">\n-                      <div>\n-                        <TechLabel tone=\"signal\">\n-                          {collection.isFeatured ? \"FEATURED COLLECTION\" : \"COLLECTION\"}\n-                        </TechLabel>\n-                        <h2 className=\"mt-4 text-display-3 text-bone\">{collection.name}</h2>\n-                        <p className=\"mt-3 text-sm leading-7 text-metal\">\n-                          {collection.description || \"توضیح عمومی برای این کالکشن منتشر نشده است.\"}\n+                    <div\n+                      className={`flex min-w-0 flex-col justify-center p-5 sm:p-8 ${lead ? \"lg:p-12\" : \"\"} ${!cover && lead ? \"md:col-span-2\" : \"\"}`}\n+                    >\n+                      {typeof collection.productCount === \"number\" && (\n+                        <span className=\"mb-3 text-xs text-metal\">\n+                          {collection.productCount.toLocaleString(\"fa-IR\")} محصول\n+                        </span>\n+                      )}\n+                      <h2\n+                        className={`text-xl font-black leading-snug text-bone ${lead ? \"md:text-4xl\" : \"md:text-2xl\"}`}\n+                      >\n+                        {collection.name}\n+                      </h2>\n+                      {summary && (\n+                        <p className=\"mt-3 line-clamp-3 max-w-prose text-sm leading-7 text-metal\">\n+                          {summary.length > 220\n+                            ? summary.slice(0, 220).replace(/\\s+\\S*$/, \"\") + \"…\"\n+                            : summary}\n                         </p>\n-                        {typeof collection.productCount === \"number\" ? (\n-                          <StatusTag tone=\"neutral\" className=\"mt-5\">\n-                            {collection.productCount.toLocaleString(\"fa-IR\")} محصول منتشرشده\n-                          </StatusTag>\n-                        ) : null}\n-                      </div>\n-                      <span className=\"tech mt-8 inline-flex items-center gap-2 text-bone group-hover:text-signal\">\n-                        مشاهده کالکشن <ArrowUpLeft size={15} aria-hidden=\"true\" />\n+                      )}\n+                      <span className=\"mt-5 inline-flex min-h-11 items-center gap-2 self-start rounded-lg bg-signal px-4 text-sm font-bold text-black\">\n+                        دیدن کالکشن <ArrowUpLeft size={16} aria-hidden=\"true\" />\n                       </span>\n                     </div>\n                   </Link>\n@@ -170,8 +204,8 @@\n               })}\n             </div>\n           )}\n-        </Shell>\n-      </Band>\n+        </div>\n+      </Shell>\n     </Chrome>\n   );\n }\n", "files": {}}''')
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
echo "LBB_COLLECTIONS_DEPLOY_OK $release"
echo "ROLLBACK_COMMAND=bash $rollback_file"
