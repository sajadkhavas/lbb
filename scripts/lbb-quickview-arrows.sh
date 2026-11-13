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
payload=json.loads(r'''{"patch": "--- a/src/components/lbb/BackendProductQuickView.tsx\n+++ b/src/components/lbb/BackendProductQuickView.tsx\n@@ -205,10 +205,10 @@\n               if (gallery.length <= 1) return;\n               if (event.key === \"ArrowLeft\") {\n                 event.preventDefault();\n-                setImage(img + 1);\n+                setImage(img - 1);\n               } else if (event.key === \"ArrowRight\") {\n                 event.preventDefault();\n-                setImage(img - 1);\n+                setImage(img + 1);\n               } else if (event.key === \"Home\") {\n                 event.preventDefault();\n                 setImg(0);\n@@ -229,7 +229,7 @@\n               const delta = end - touchStart.current;\n               touchStart.current = null;\n               if (Math.abs(delta) < 45) return;\n-              setImage(delta > 0 ? img + 1 : img - 1);\n+              setImage(delta > 0 ? img - 1 : img + 1);\n             }}\n           >\n             {gallery[img] ? (\n@@ -261,17 +261,17 @@\n                   type=\"button\"\n                   onClick={() => setImage(img - 1)}\n                   aria-label=\"\u062a\u0635\u0648\u06cc\u0631 \u0642\u0628\u0644\u06cc\"\n-                  className=\"tap-target absolute right-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-xl bg-obsidian/70 text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:grid\"\n-                >\n-                  <ChevronRight size={18} aria-hidden=\"true\" />\n+                  className=\"tap-target absolute left-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-xl bg-obsidian/70 text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:grid\"\n+                >\n+                  <ChevronLeft size={18} aria-hidden=\"true\" />\n                 </button>\n                 <button\n                   type=\"button\"\n                   onClick={() => setImage(img + 1)}\n                   aria-label=\"\u062a\u0635\u0648\u06cc\u0631 \u0628\u0639\u062f\u06cc\"\n-                  className=\"tap-target absolute left-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-xl bg-obsidian/70 text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:grid\"\n-                >\n-                  <ChevronLeft size={18} aria-hidden=\"true\" />\n+                  className=\"tap-target absolute right-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-xl bg-obsidian/70 text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:grid\"\n+                >\n+                  <ChevronRight size={18} aria-hidden=\"true\" />\n                 </button>\n                 <div\n                   dir=\"ltr\"\n", "files": {}}''')
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
check_home 18574 || { journalctl -u "$unit" -n 25 --no-pager; false; }
check_shop 18574
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
prod_pid=$(systemctl show lbb.service -p MainPID --value)
[[ $(readlink -f "/proc/$prod_pid/cwd") == "$release" ]]
systemctl is-active --quiet lbb.service
systemctl stop "$unit.service"
rm -f "$state/runtime.env"
trap - ERR
echo "LBB_HOME_DEPLOY_OK $release"
echo "ROLLBACK_COMMAND=bash $rollback_file"
