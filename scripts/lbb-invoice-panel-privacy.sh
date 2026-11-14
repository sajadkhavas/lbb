#!/usr/bin/env bash
set -Eeuo pipefail
[[ $(id -u) == 0 ]] || { echo RUN_AS_ROOT; exit 1; }
if [[ ${1:-} == --admin ]]; then
  cd /var/www/lbb/backend/current
  provider=app/Providers/Filament/AdminPanelProvider.php
  backup=$(mktemp -d /root/lbb-panel-privacy-XXXXXXXX)
  cp -a "$provider" "$backup/"
  python3 - "$provider" <<'PY_ADMIN'
from pathlib import Path
import subprocess, sys
p=Path(sys.argv[1])
s=p.read_text()
marker="->middleware(["
name="\\App\\Http\\Middleware\\PrivatePanelResponse::class,"
if name not in s:
    if s.count(marker) != 1:
        raise SystemExit("ADMIN_MIDDLEWARE_ANCHOR_MISMATCH")
    s=s.replace(marker, marker+"\n                "+name)
target=Path("app/Http/Middleware/PrivatePanelResponse.php")
code=r"""<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
final class PrivatePanelResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow, noarchive');
        $response->headers->set('Cache-Control', 'private, no-store');
        return $response;
    }
}
"""
if target.exists() and target.read_text() != code:
    raise SystemExit("ADMIN_MIDDLEWARE_EXISTS")
for source in (code, s):
    subprocess.run(["php", "-l"], input=source, text=True, check=True)
target.write_text(code)
p.write_text(s)
PY_ADMIN
  echo "LBB_ADMIN_PRIVACY_OK backup=$backup"
  exit
fi
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
payload=json.loads(r'''{"patch": "--- a/src/routes/account.tsx\n+++ b/src/routes/account.tsx\n@@ -1,2 +1,3 @@\n+import { OrderInvoiceButton } from \"@/components/lbb/OrderInvoiceButton\";\n import { useCallback, useEffect, useState, type FormEvent } from \"react\";\n import { createFileRoute, Link } from \"@tanstack/react-router\";\n@@ -690,4 +691,5 @@\n                       ) : null}\n                     </div>\n+                    <OrderInvoiceButton order={order} />\n                     {order.canCancel ? (\n                       <button\n--- a/src/routes/payment.result.tsx\n+++ b/src/routes/payment.result.tsx\n@@ -1,2 +1,3 @@\n+import { OrderInvoiceButton } from \"@/components/lbb/OrderInvoiceButton\";\n import { useEffect, useState } from \"react\";\n import { createFileRoute, Link } from \"@tanstack/react-router\";\n@@ -91,4 +92,5 @@\n                 </span>\n               </StatePanel>\n+              <OrderInvoiceButton order={result.order} />\n               <Link to=\"/account\" className={CtaClasses(\"signal\")}>\n                 مشاهده سفارش\n--- a/src/server.ts\n+++ b/src/server.ts\n@@ -53,5 +53,21 @@\n       const handler = await getServerEntry();\n       const response = await handler.fetch(request, env, ctx);\n-      return await normalizeCatastrophicSsrResponse(response);\n+      const normalized = await normalizeCatastrophicSsrResponse(response);\n+      const path = new URL(request.url).pathname;\n+      if (\n+        /^\\/(?:admin|account|checkout|cart|wishlist|track-order|payment|order-confirmation)(?:\\/|$)/.test(\n+          path,\n+        )\n+      ) {\n+        const headers = new Headers(normalized.headers);\n+        headers.set(\"X-Robots-Tag\", \"noindex, nofollow\");\n+        headers.set(\"Cache-Control\", \"private, no-store\");\n+        return new Response(normalized.body, {\n+          status: normalized.status,\n+          statusText: normalized.statusText,\n+          headers,\n+        });\n+      }\n+      return normalized;\n     } catch (error) {\n       console.error(error);\n", "files": {"src/components/lbb/OrderInvoiceButton.tsx": "import { useState } from \"react\";\nimport { getOrder, type OrderDto } from \"@/lib/backend-api\";\nimport { fmtToman } from \"@/lib/products\";\nimport { CtaClasses } from \"@/components/lbb/ui/primitives\";\n\nconst escape = (value: string | number | null | undefined) =>\n  String(value ?? \"—\").replace(\n    /[&<>\"']/g,\n    (char) =>\n      ({\n        \"&\": \"&amp;\",\n        \"<\": \"&lt;\",\n        \">\": \"&gt;\",\n        '\"': \"&quot;\",\n        \"'\": \"&#39;\",\n      })[char] ?? char,\n  );\n\nexport function OrderInvoiceButton({ order }: { order: OrderDto }) {\n  const [error, setError] = useState(\"\");\n  const [busy, setBusy] = useState(false);\n  if (!order.paidAt) return null;\n\n  const showInvoice = async () => {\n    const preview = window.open(\"\", \"_blank\");\n    if (!preview) {\n      setError(\"برای باز کردن فاکتور، اجازهٔ باز شدن پنجرهٔ جدید را بدهید.\");\n      return;\n    }\n    preview.opener = null;\n    preview.document.body.textContent = \"در حال دریافت فاکتور…\";\n    setBusy(true);\n    setError(\"\");\n    try {\n      const { data } = await getOrder(order.id);\n      const paid = data.order;\n      if (!paid.paidAt || !paid.items.length) throw new Error(\"Invoice unavailable\");\n      if (preview.closed) return;\n      const money = (value: number | undefined) => (value === undefined ? \"—\" : fmtToman(value));\n      const rows = paid.items\n        .map(\n          (item) =>\n            `<tr><td>${escape(item.productName)}<small>${escape([item.colorName, item.sizeName].filter(Boolean).join(\" / \"))}</small></td><td>${escape(item.quantity)}</td><td>${escape(money(item.unitPriceToman))}</td><td>${escape(money(item.lineTotalToman))}</td></tr>`,\n        )\n        .join(\"\");\n      const totals = [\n        [\"جمع کالاها\", paid.totals.subtotalToman],\n        [\"ارسال\", paid.totals.deliveryFeeToman],\n        [\"بسته‌بندی\", paid.totals.packagingFeeToman],\n        [\"تخفیف\", paid.totals.discountToman],\n        [\"مبلغ سفارش\", paid.totals.grandTotalToman],\n      ]\n        .map(\n          ([label, amount]) =>\n            `<div><dt>${escape(label)}</dt><dd>${escape(money(Number(amount)))}</dd></div>`,\n        )\n        .join(\"\");\n      preview.document.open();\n      preview.document.write(`<!doctype html><html lang=\"fa\" dir=\"rtl\"><head>\n        <meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex,nofollow\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n        <title>فاکتور سفارش ${escape(paid.number)} | LBB</title>\n        <style>\n          body{font:15px/1.8 Tahoma,Arial,sans-serif;color:#191919;background:#fff;margin:28px auto;padding:0 16px;max-width:800px}\n          header{border-bottom:3px solid #e63535;padding-bottom:14px}h1{font-size:24px;margin:4px 0}\n          table{width:100%;border-collapse:collapse;margin:24px 0}td,th{padding:8px 4px;text-align:right;border-bottom:1px solid #ddd}\n          small{display:block;color:#555}dl{max-width:360px;margin-inline-start:auto}dl div{display:flex;justify-content:space-between;border-bottom:1px solid #ddd;padding:6px}dd{margin:0}\n          button{padding:9px 16px;margin:10px 0;cursor:pointer} @media print{button{display:none}tr{break-inside:avoid}body{margin:0}}\n        </style></head><body>\n        <button id=\"save\" type=\"button\">چاپ یا ذخیره PDF</button>\n        <header><strong>LBB</strong><h1>فاکتور سفارش</h1><div>شماره سفارش: ${escape(paid.number)}</div>\n        <div>تاریخ پرداخت: ${escape(new Date(paid.paidAt).toLocaleString(\"fa-IR\", { timeZone: \"Asia/Tehran\" }))}</div>\n        <div>وضعیت پرداخت: ${escape(paid.paymentStatusLabel)}</div></header>\n        <p>خریدار: ${escape(paid.recipient.fullName)}</p>\n        <table><thead><tr><th>محصول</th><th>تعداد</th><th>قیمت واحد</th><th>مبلغ</th></tr></thead><tbody>${rows}</tbody></table>\n        <dl>${totals}</dl></body></html>`);\n      preview.document.close();\n      preview.document.getElementById(\"save\")?.addEventListener(\"click\", () => preview.print());\n    } catch {\n      preview.close();\n      setError(\"فاکتور دریافت نشد. از حساب کاربری دوباره امتحان کنید.\");\n    } finally {\n      setBusy(false);\n    }\n  };\n\n  return (\n    <div>\n      <button\n        type=\"button\"\n        className={CtaClasses(\"line\", \"sm\")}\n        disabled={busy}\n        onClick={showInvoice}\n      >\n        {busy ? \"در حال دریافت…\" : \"دریافت فاکتور\"}\n      </button>\n      {error && (\n        <p className=\"mt-2 text-sm text-signal\" role=\"alert\">\n          {error}\n        </p>\n      )}\n    </div>\n  );\n}\n"}}''')
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
check_private() {
  curl -fsS --max-time 15 -D "$state/private-headers" "http://127.0.0.1:$1/account" -o /dev/null
  grep -qi '^x-robots-tag:.*noindex' "$state/private-headers"
  grep -qi '^cache-control:.*no-store' "$state/private-headers"
}
check_home 18574 || { journalctl -u "$unit" -n 25 --no-pager; false; }
check_shop 18574
check_private 18574
check_collections 18574
curl -fsS --max-time 15 http://127.0.0.1:18574/lookbook -o "$state/lookbook.html"
grep -q data-shinethree-credit "$state/lookbook.html"
grep -q data-lookbook-carousel "$state/lookbook.html"
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
check_private 5173
check_collections 5173
prod_pid=$(systemctl show lbb.service -p MainPID --value)
[[ $(readlink -f "/proc/$prod_pid/cwd") == "$release" ]]
systemctl is-active --quiet lbb.service
systemctl stop "$unit.service"
rm -f "$state/runtime.env"
trap - ERR
echo "LBB_INVOICE_DEPLOY_OK $release"
echo "ROLLBACK_COMMAND=bash $rollback_file"
