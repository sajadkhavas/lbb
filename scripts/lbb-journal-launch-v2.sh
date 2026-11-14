#!/usr/bin/env bash
set -Eeuo pipefail
[[ $(id -u) == 0 ]] || { echo RUN_AS_ROOT; exit 1; }
[[ ${1:-} =~ ^[a-f0-9]{40}$ ]] || { echo PASS_GITHUB_COMMIT >&2; exit 1; }
asset_commit=$1
raw="https://raw.githubusercontent.com/sajadkhavas/lbb/$asset_commit/editorial/journal"
[[ $(df -PB1 /var/www/lbb/releases | awk 'NR==2 { print $4 }') -ge 2147483648 ]] || { echo INSUFFICIENT_DISK; exit 1; }
previous=$(readlink -f /var/www/lbb/current)
[[ -f "$previous/src/components/lbb/home/DropStory.tsx" ]] || { echo SOURCE_NOT_FOUND; exit 1; }
[[ -z $(ss -H -ltn 'sport = :18574') ]] || { echo CANARY_PORT_BUSY; exit 1; }
release=$(mktemp -d /var/www/lbb/releases/journal-XXXXXXXX)
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
base64 -d > "$state/journal.patch" <<'PATCH'
LS0tIGEvc3JjL3JvdXRlcy9qb3VybmFsLiRzbHVnLnRzeAorKysgYi9zcmMvcm91dGVzL2pvdXJuYWwuJHNsdWcudHN4CkBAIC0xLDMgKzEsNCBAQAoraW1wb3J0IHsgSm91cm5hbENvbnRlbnQgfSBmcm9tICJAL2xpYi9qb3VybmFsLWNvbnRlbnQiOwogaW1wb3J0IHsgY3JlYXRlRmlsZVJvdXRlLCBub3RGb3VuZCwgTGluayB9IGZyb20gIkB0YW5zdGFjay9yZWFjdC1yb3V0ZXIiOwogaW1wb3J0IHsgQXJyb3dVcExlZnQsIEJvb2tPcGVuVGV4dCwgQ2xvY2szIH0gZnJvbSAibHVjaWRlLXJlYWN0IjsKIGltcG9ydCB7IE5hdmJhciB9IGZyb20gIkAvY29tcG9uZW50cy9sYmIvTmF2YmFyIjsKQEAgLTE4OSwyMCArMTkwLDcgQEAKICAgKTsKIH0KIAotZnVuY3Rpb24gbGl2ZUFydGljbGVQYXJhZ3JhcGhzKGNvbnRlbnQ6IHN0cmluZyB8IHVuZGVmaW5lZCkgewotICBpZiAoIWNvbnRlbnQpIHJldHVybiBbXTsKLSAgcmV0dXJuIGNvbnRlbnQKLSAgICAucmVwbGFjZSgvPGJyXHMqXC8/Pig/PS4pL2dpLCAiXG4iKQotICAgIC5yZXBsYWNlKC88XC9wPi9naSwgIlxuXG4iKQotICAgIC5yZXBsYWNlKC88W14+XSs+L2csICIgIikKLSAgICAucmVwbGFjZSgvJm5ic3A7L2csICIgIikKLSAgICAuc3BsaXQoL1xuKy8pCi0gICAgLm1hcCgocGFydCkgPT4gcGFydC5yZXBsYWNlKC9ccysvZywgIiAiKS50cmltKCkpCi0gICAgLmZpbHRlcihCb29sZWFuKTsKLX0KLQogZnVuY3Rpb24gTGl2ZUpvdXJuYWxEZXRhaWxQYWdlKHsgYXJ0aWNsZSB9OiB7IGFydGljbGU6IFN0b3JlZnJvbnRKb3VybmFsRHRvIH0pIHsKLSAgY29uc3QgcGFyYWdyYXBocyA9IGxpdmVBcnRpY2xlUGFyYWdyYXBocyhhcnRpY2xlLmNvbnRlbnQpOwogICByZXR1cm4gKAogICAgIDw+CiAgICAgICA8TmF2YmFyIHRoZW1lPSJsaWdodCIgLz4KQEAgLTI1MSwxNiArMjM5LDcgQEAKICAgICAgICAgKSA6IG51bGx9CiAgICAgICAgIDxCYW5kPgogICAgICAgICAgIDxTaGVsbCBjbGFzc05hbWU9Im1heC13LVs3NjBweF0iPgotICAgICAgICAgICAgPGFydGljbGUgY2xhc3NOYW1lPSJzcGFjZS15LTYiPgotICAgICAgICAgICAgICB7cGFyYWdyYXBocy5tYXAoKHBhcmFncmFwaCwgaW5kZXgpID0+ICgKLSAgICAgICAgICAgICAgICA8cAotICAgICAgICAgICAgICAgICAga2V5PXtgJHtpbmRleH0tJHtwYXJhZ3JhcGguc2xpY2UoMCwgMjQpfWB9Ci0gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9InRleHQtWzE1cHhdIGxlYWRpbmctOSB0ZXh0LW1ldGFsIgotICAgICAgICAgICAgICAgID4KLSAgICAgICAgICAgICAgICAgIHtwYXJhZ3JhcGh9Ci0gICAgICAgICAgICAgICAgPC9wPgotICAgICAgICAgICAgICApKX0KLSAgICAgICAgICAgIDwvYXJ0aWNsZT4KKyAgICAgICAgICAgIDxKb3VybmFsQ29udGVudCBjb250ZW50PXthcnRpY2xlLmNvbnRlbnR9IC8+CiAgICAgICAgICAgPC9TaGVsbD4KICAgICAgICAgPC9CYW5kPgogICAgICAgPC9tYWluPgotLS0gYS9zcmMvY29tcG9uZW50cy9sYmIvaG9tZS9EZWNpc2lvblN1cHBvcnQudHN4CisrKyBiL3NyYy9jb21wb25lbnRzL2xiYi9ob21lL0RlY2lzaW9uU3VwcG9ydC50c3gKQEAgLTIxLDcgKzIxLDcgQEAKICAgcmV0dXJuICgKICAgICA8PgogICAgICAgPGRpdj4KLSAgICAgICAgPGRpdiBjbGFzc05hbWU9ImhpZGRlbiBpdGVtcy1zdGFydCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTQgbWQ6ZmxleCI+CisgICAgICAgIDxkaXYgY2xhc3NOYW1lPSJmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlbiBnYXAtNCI+CiAgICAgICAgICAgPFRlY2hMYWJlbCB0b25lPSJpbnZlcnNlIj4KICAgICAgICAgICAgIDB7aW5kZXggKyAxfSAvIHtsYXRpbn0KICAgICAgICAgICA8L1RlY2hMYWJlbD4KQEAgLTI5LDExICsyOSwxMSBAQAogICAgICAgICAgICAgPEd1aWRlSWNvbiBjbGFzc05hbWU9InNpemUtNyIgYXJpYS1oaWRkZW49InRydWUiIC8+CiAgICAgICAgICAgPC9zcGFuPgogICAgICAgICA8L2Rpdj4KLSAgICAgICAgPGgzIGNsYXNzTmFtZT0idGV4dC1zbSBmb250LWJvbGQgdGV4dC1vYnNpZGlhbiBtZDptdC01IG1kOnRleHQtdGl0bGUiPntsYWJlbH08L2gzPgotICAgICAgICA8cCBjbGFzc05hbWU9Im10LTMgaGlkZGVuIHRleHQtc20gbGVhZGluZy03IHRleHQtZ3JhcGhpdGUgbWQ6YmxvY2siPntkZXNjcmlwdGlvbn08L3A+CisgICAgICAgIDxoMyBjbGFzc05hbWU9Im10LTUgdGV4dC10aXRsZSB0ZXh0LW9ic2lkaWFuIj57bGFiZWx9PC9oMz4KKyAgICAgICAgPHAgY2xhc3NOYW1lPSJtdC0zIHRleHQtc20gbGVhZGluZy03IHRleHQtZ3JhcGhpdGUiPntkZXNjcmlwdGlvbn08L3A+CiAgICAgICA8L2Rpdj4KLSAgICAgIDxzcGFuIGNsYXNzTmFtZT0iZmxleCBzaHJpbmstMCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHRleHQteHMgZm9udC1ibGFjayB0ZXh0LW9ic2lkaWFuIG1kOm10LTggbWQ6Ym9yZGVyLXQgbWQ6Ym9yZGVyLWhhaXJsaW5lLWluayBtZDpwdC00Ij4KLSAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSJoaWRkZW4gbWQ6aW5saW5lIj7YqNin2LLaqdix2K/ZhiDYsdin2YfZhtmF2Kc8L3NwYW4+CisgICAgICA8c3BhbiBjbGFzc05hbWU9Im10LTggZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGJvcmRlci10IGJvcmRlci1oYWlybGluZS1pbmsgcHQtNCB0ZXh0LXhzIGZvbnQtYmxhY2sgdGV4dC1vYnNpZGlhbiI+CisgICAgICAgINio2KfYstqp2LHYr9mGINix2KfZh9mG2YXYpwogICAgICAgICA8QXJyb3dVcExlZnQKICAgICAgICAgICBzaXplPXsxN30KICAgICAgICAgICBhcmlhLWhpZGRlbj0idHJ1ZSIKQEAgLTQ1LDcgKzQ1LDcgQEAKIH0KIAogY29uc3QgQ0FSRF9DTEFTUyA9Ci0gICJncm91cCBmbGV4IG1pbi1oLTEyIHNocmluay0wIHNuYXAtc3RhcnQgaXRlbXMtY2VudGVyIGdhcC0yIHdoaXRlc3BhY2Utbm93cmFwIG1kOm1pbi1oLVsyMjBweF0gbWQ6ZmxleC1jb2wgbWQ6aXRlbXMtc3RyZXRjaCBtZDpqdXN0aWZ5LWJldHdlZW4gbWQ6d2hpdGVzcGFjZS1ub3JtYWwgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1oYWlybGluZS1pbmsgYmctYm9uZSBweC0zIHB5LTIgbWQ6cC01IHNoYWRvdy1bMF8xNnB4XzQ1cHhfcmdiYSgwLDAsMCwwLjA4KV0gdHJhbnNpdGlvbi1bdHJhbnNmb3JtLGJhY2tncm91bmQtY29sb3IsYm94LXNoYWRvd10gaG92ZXI6LXRyYW5zbGF0ZS15LTEgaG92ZXI6Ymctc3RlYW0gaG92ZXI6c2hhZG93LVswXzIycHhfNjBweF9yZ2JhKDAsMCwwLDAuMTMpXSI7CisgICJncm91cCBmbGV4IG1pbi1oLVsyMjBweF0gdy1bbWluKDc2dncsMThyZW0pXSBzaHJpbmstMCBzbmFwLXN0YXJ0IGZsZXgtY29sIGp1c3RpZnktYmV0d2VlbiBtZDp3LWF1dG8gcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1oYWlybGluZS1pbmsgYmctYm9uZSBwLTUgc2hhZG93LVswXzE2cHhfNDVweF9yZ2JhKDAsMCwwLDAuMDgpXSB0cmFuc2l0aW9uLVt0cmFuc2Zvcm0sYmFja2dyb3VuZC1jb2xvcixib3gtc2hhZG93XSBob3ZlcjotdHJhbnNsYXRlLXktMSBob3ZlcjpiZy1zdGVhbSBob3ZlcjpzaGFkb3ctWzBfMjJweF82MHB4X3JnYmEoMCwwLDAsMC4xMyldIjsKIAogZXhwb3J0IGZ1bmN0aW9uIERlY2lzaW9uU3VwcG9ydCgpIHsKICAgY29uc3QgeyBzb3VyY2UsIGRlY2lzaW9uU3VwcG9ydCB9ID0gdXNlU3RvcmVmcm9udENvbnRyb2woKTsKLS0tIC9kZXYvbnVsbAorKysgYi9zcmMvbGliL2pvdXJuYWwtY29udGVudC50c3gKQEAgLTAsMCArMSwzNyBAQAoraW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgdHlwZSBSZWFjdE5vZGUgfSBmcm9tICJyZWFjdCI7CitpbXBvcnQgeyBwYXJzZUZyYWdtZW50LCB0eXBlIERlZmF1bHRUcmVlQWRhcHRlclR5cGVzIH0gZnJvbSAicGFyc2U1IjsKK2ltcG9ydCB7IHNhZmVQdWJsaWNIcmVmIH0gZnJvbSAiQC9saWIvcHVibGljLWhyZWYiOworCitjb25zdCB0YWdzID0gbmV3IFNldChbInAiLCAiaDIiLCAiaDMiLCAidWwiLCAib2wiLCAibGkiLCAic3Ryb25nIiwgImVtIiwgImJsb2NrcXVvdGUiLCAiZmlndXJlIiwgImZpZ2NhcHRpb24iLCAiYnIiXSk7Citjb25zdCBjbGFzc2VzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0geworICBoMjogInB0LTMgdGV4dC0yeGwgZm9udC1ib2xkIHRleHQtYm9uZSIsCisgIGgzOiAidGV4dC1sZyBmb250LWJvbGQgdGV4dC1ib25lIiwKKyAgdWw6ICJsaXN0LWRpc2Mgc3BhY2UteS0yIHBzLTYiLAorICBvbDogImxpc3QtZGVjaW1hbCBzcGFjZS15LTIgcHMtNiIsCisgIGZpZ2NhcHRpb246ICJtdC0yIHRleHQtc20gdGV4dC1tdXRlIiwKK307CisKK2Z1bmN0aW9uIHJlbmRlcihub2RlOiBEZWZhdWx0VHJlZUFkYXB0ZXJUeXBlcy5DaGlsZE5vZGUsIGtleTogbnVtYmVyKTogUmVhY3ROb2RlIHsKKyAgaWYgKCJ2YWx1ZSIgaW4gbm9kZSkgcmV0dXJuIG5vZGUudmFsdWU7CisgIGlmICghKCJ0YWdOYW1lIiBpbiBub2RlKSkgcmV0dXJuIG51bGw7CisgIGNvbnN0IHsgdGFnTmFtZSwgYXR0cnMsIGNoaWxkTm9kZXMgfSA9IG5vZGU7CisgIGlmIChub2RlLm5hbWVzcGFjZVVSSSAhPT0gImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiKSByZXR1cm4gbnVsbDsKKyAgY29uc3QgYXR0cmlidXRlID0gKG5hbWU6IHN0cmluZykgPT4gYXR0cnMuZmluZCgoaXRlbSkgPT4gaXRlbS5uYW1lID09PSBuYW1lKT8udmFsdWU7CisgIGlmICh0YWdOYW1lID09PSAiaW1nIikgeworICAgIGNvbnN0IHNyYyA9IHNhZmVQdWJsaWNIcmVmKGF0dHJpYnV0ZSgic3JjIikpOworICAgIHJldHVybiBzcmMgPyA8aW1nIGtleT17a2V5fSBzcmM9e3NyY30gYWx0PXthdHRyaWJ1dGUoImFsdCIpID8/ICIifSBsb2FkaW5nPSJsYXp5IiBkZWNvZGluZz0iYXN5bmMiIGNsYXNzTmFtZT0iaC1hdXRvIHctZnVsbCByb3VuZGVkLXhsIiAvPiA6IG51bGw7CisgIH0KKyAgaWYgKHRhZ05hbWUgPT09ICJzY3JpcHQiIHx8IHRhZ05hbWUgPT09ICJzdHlsZSIgfHwgdGFnTmFtZSA9PT0gImlmcmFtZSIpIHJldHVybiBudWxsOworICBjb25zdCBjaGlsZHJlbiA9IGNoaWxkTm9kZXMubWFwKHJlbmRlcik7CisgIGlmICh0YWdOYW1lID09PSAiYSIpIHsKKyAgICBjb25zdCBocmVmID0gc2FmZVB1YmxpY0hyZWYoYXR0cmlidXRlKCJocmVmIikpOworICAgIHJldHVybiBocmVmID8gPGEga2V5PXtrZXl9IGhyZWY9e2hyZWZ9IGNsYXNzTmFtZT0iZm9udC1zZW1pYm9sZCB0ZXh0LXNpZ25hbCB1bmRlcmxpbmUgdW5kZXJsaW5lLW9mZnNldC00Ij57Y2hpbGRyZW59PC9hPiA6IGNoaWxkcmVuOworICB9CisgIHJldHVybiBjcmVhdGVFbGVtZW50KHRhZ3MuaGFzKHRhZ05hbWUpID8gdGFnTmFtZSA6ICJzcGFuIiwgeyBrZXksIGNsYXNzTmFtZTogY2xhc3Nlc1t0YWdOYW1lXSB9LCB0YWdOYW1lID09PSAiYnIiID8gdW5kZWZpbmVkIDogY2hpbGRyZW4pOworfQorCitleHBvcnQgZnVuY3Rpb24gSm91cm5hbENvbnRlbnQoeyBjb250ZW50IH06IHsgY29udGVudD86IHN0cmluZyB9KSB7CisgIGlmICghY29udGVudCkgcmV0dXJuIG51bGw7CisgIGNvbnN0IG5vZGVzID0gcGFyc2VGcmFnbWVudChjb250ZW50KS5jaGlsZE5vZGVzOworICByZXR1cm4gPGFydGljbGUgZGlyPSJydGwiIGNsYXNzTmFtZT0ic3BhY2UteS02IHRleHQtWzE1cHhdIGxlYWRpbmctOSB0ZXh0LW1ldGFsIj57bm9kZXMubWFwKHJlbmRlcil9PC9hcnRpY2xlPjsKK30K
PATCH
patch --batch --forward --dry-run -p1 -i "$state/journal.patch"
patch --batch --forward -p1 -i "$state/journal.patch"
python3 - <<'PY_HOME'
from pathlib import Path
import re

SECTION = '        {journal?.length ? (\n          <section dir="rtl" aria-labelledby="home-journal-title" data-home-journal className="border-t border-hairline py-10 md:py-14">\n            <div className="lbb-shell">\n              <header className="mb-6 flex flex-wrap items-center justify-between gap-3">\n                <h2 id="home-journal-title" className="text-display-3">از ژورنال LBB</h2>\n                <Link to="/journal" className="text-sm font-bold text-signal">همه مقاله\u200cها</Link>\n              </header>\n              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">\n                {journal.map((article) => (\n                  <Link key={article.slug} to="/journal/$slug" params={{ slug: article.slug }} className="group overflow-hidden rounded-2xl border border-hairline bg-carbon">\n                    {article.coverUrl && <img src={article.coverUrl} alt="" loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />}\n                    <div className="p-4">\n                      <h3 className="text-lg font-bold group-hover:text-signal">{article.title}</h3>\n                      {article.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-7 text-metal">{article.excerpt}</p>}\n                    </div>\n                  </Link>\n                ))}\n              </div>\n            </div>\n          </section>\n        ) : null}\n'

route = Path("src/routes/index.tsx")
source = route.read_text()
if "data-home-journal" in source:
    raise SystemExit("HOME_JOURNAL_ALREADY_PRESENT")

def replace_once(old, new):
    global source
    if source.count(old) != 1:
        raise SystemExit("HOME_ROUTE_ANCHOR_CHANGED: " + old.strip())
    source = source.replace(old, new, 1)

replace_once('import { createFileRoute } from "@tanstack/react-router";',
             'import { createFileRoute, Link } from "@tanstack/react-router";')
source = 'import { resolveStorefrontJournal, type StorefrontJournalDto } from "@/lib/storefront-control";\n' + source
replace_once('type HomeLoaderData = {', 'type HomeLoaderData = {\n  journal?: StorefrontJournalDto[];')

# Wrap the existing loader without matching its catalog or lookbook implementation.
match = re.search(r'^  loader: async \(\): Promise<HomeLoaderData> => \{\n(.*?)^  \},\n(?=  head:)', source, re.M | re.S)
if match is None:
    raise SystemExit("HOME_LOADER_BOUNDARIES_CHANGED")
body = ''.join('  ' + line if line.strip() else line for line in match[1].splitlines(keepends=True))
loader = '''  loader: async (): Promise<HomeLoaderData> => {
    const loadHome = async (): Promise<HomeLoaderData> => {
''' + body + '''    };
    const [home, articles] = await Promise.all([
      loadHome(),
      resolveStorefrontJournal().catch(() => []),
    ]);
    return { ...home, journal: home.control.source === "live" ? (articles ?? []).slice(0, 3) : [] };
  },
'''
source = source[:match.start()] + loader + source[match.end():]
replace_once('  } = Route.useLoaderData();', '    journal,\n  } = Route.useLoaderData();')
replace_once('      </main>', SECTION + '      </main>')
route.write_text(source)
PY_HOME
mkdir -p "$state/editorial"
cat > "$state/editorial/SHA256SUMS" <<'SUMS'
2faa48054bde82a18264e58cf0f9d4f09e89ea3ca9a7cf97ef155df6b7f9c755  fabric-1.webp
28b2e353b75de2adb89a3519aa872b0360120f1dc3644d0c16daa4c63dd762a8  fabric-2.webp
0391ebaa3ba154c46b5d837ff6f61ef985cd82ba1e643e9ec8bc37b1396df77b  fabric-3.webp
2c7c53b325ed99167bd1e6838c89ebe8192b29471e0657aad6f99b224a347014  fabric-4.webp
866ca903546c5f121905de6315b099de86bd66c7edfd617d1bfd7685b56a0a07  materials-101-parche-shenasi.html
979c8c1c26c31ad5203a5b6dfc3f4c3fd7b490b5ed146bbfce89a8098619605e  streetwear-1.webp
6f6e1d5effe297df49827ba7bb4391d7d6c8d63eb222932b29de3ed4bef3ccea  streetwear-2.webp
e1d4cbc3c5585b2bb2e92b163f281fc6737aac38c0a1f6a30f33858549a1f5fe  streetwear-3.webp
21123b7b924a7d5d6584bf838908cf3b3dee8864046632cf1ada8443d6b81d5b  streetwear-4.webp
a7edb80552b842362202e38fe686cd8252366c4ee9e601d627b3aee6321b6bfc  streetwear-guide.html
SUMS
while read -r checksum name; do
  curl -fsSL --retry 3 --max-time 30 "$raw/$name" -o "$state/editorial/$name"
done < "$state/editorial/SHA256SUMS"
(cd "$state/editorial" && sha256sum -c SHA256SUMS)
mkdir -p public/journal-media
install -m 0644 "$state/editorial/"*.webp public/journal-media/
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
curl -fsS --max-time 15 http://127.0.0.1:5173/journal-media/streetwear-1.webp -o "$state/served.webp"
cmp "$state/served.webp" public/journal-media/streetwear-1.webp
(
  trap - ERR
  cd /var/www/lbb/backend/current
  php /dev/stdin "$state/editorial" "$state/journal-before.json" <<'PHP'
<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$dir = $argv[1];
$asset = 'https://lbbclo.com/journal-media';
$posts = [
    'materials-101-parche-shenasi' => [
        'title' => 'راهنمای پارچه‌شناسی ال بی بی | جنس تیشرت، هودی و جین',
        'excerpt' => 'جرسی تیشرت، داخل هودی و بافت جین را مقایسه کن و با نکات شست‌وشو و تن‌خور، موقع خرید آنلاین دقیق‌تر انتخاب کن.',
        'category' => 'راهنمای خرید و نگهداری',
        'tags' => ['پارچه‌شناسی', 'جنس لباس', 'ال بی بی'],
        'cover_url' => "$asset/fabric-1.webp",
        'meta_title' => 'راهنمای پارچه‌شناسی تیشرت، هودی و جین | ال بی بی',
    ],
    'streetwear-guide' => [
        'title' => 'استریت ویر چیست؟ راهنمای ساخت استایل خیابانی با ال بی بی',
        'excerpt' => 'استریت ویر چیست و چطور ست می‌شود؟ با مثال‌های تیشرت باکسی، هودی، جین بگ و کتونی، تناسب لباس و ترکیب رنگ را یاد بگیر.',
        'category' => 'استایل خیابانی',
        'tags' => ['استریت ویر', 'استایل خیابانی', 'ال بی بی'],
        'cover_url' => "$asset/streetwear-1.webp",
        'meta_title' => 'استریت ویر چیست؟ راهنمای استایل خیابانی | ال بی بی',
    ],
];
DB::transaction(function () use ($posts, $dir, $asset, $argv) {
    $existing = App\Models\Post::query()->whereIn('slug', array_keys($posts))->lockForUpdate()->get();
    if (file_put_contents($argv[2], $existing->toJson(JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) === false) {
        throw new RuntimeException('JOURNAL_BACKUP_FAILED');
    }
    foreach ($posts as $slug => $fields) {
        $post = $existing->firstWhere('slug', $slug) ?? new App\Models\Post(['slug' => $slug]);
        $body = file_get_contents("$dir/$slug.html");
        if ($body === false || substr_count($body, '<img ') !== 4) {
            throw new RuntimeException("INVALID_ARTICLE_BODY $slug");
        }
        $post->fill($fields + [
            'content' => str_replace('{{asset}}', $asset, $body),
            'cover_image_path' => null,
            'author' => 'تحریریه ال بی بی',
            'meta_description' => $fields['excerpt'],
            'status' => 'published',
            'published_at' => $post->published_at && $post->published_at <= now() ? $post->published_at : now(),
        ])->saveOrFail();
    }
});
PHP
)
trap - ERR
for slug in streetwear-guide materials-101-parche-shenasi; do
  curl -fsS --max-time 15 "http://127.0.0.1:5173/journal/$slug" -o "$state/$slug.html"
  grep -q '/journal-media/' "$state/$slug.html"
done
curl -fsS --max-time 15 http://127.0.0.1:5173/ -o "$state/home-journal.html"
grep -q 'data-home-journal' "$state/home-journal.html"
echo "LBB_JOURNAL_DEPLOY_OK $release"
echo "JOURNAL_BACKUP=$state/journal-before.json"
echo "ROLLBACK_COMMAND=bash $rollback_file"
