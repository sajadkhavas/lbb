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
LS0tIGEvc3JjL3JvdXRlcy9qb3VybmFsLiRzbHVnLnRzeAorKysgYi9zcmMvcm91dGVzL2pvdXJuYWwuJHNsdWcudHN4CkBAIC0xLDMgKzEsNCBAQAoraW1wb3J0IHsgSm91cm5hbENvbnRlbnQgfSBmcm9tICJAL2xpYi9qb3VybmFsLWNvbnRlbnQiOwogaW1wb3J0IHsgY3JlYXRlRmlsZVJvdXRlLCBub3RGb3VuZCwgTGluayB9IGZyb20gIkB0YW5zdGFjay9yZWFjdC1yb3V0ZXIiOwogaW1wb3J0IHsgQXJyb3dVcExlZnQsIEJvb2tPcGVuVGV4dCwgQ2xvY2szIH0gZnJvbSAibHVjaWRlLXJlYWN0IjsKIGltcG9ydCB7IE5hdmJhciB9IGZyb20gIkAvY29tcG9uZW50cy9sYmIvTmF2YmFyIjsKQEAgLTE4OSwyMCArMTkwLDcgQEAKICAgKTsKIH0KIAotZnVuY3Rpb24gbGl2ZUFydGljbGVQYXJhZ3JhcGhzKGNvbnRlbnQ6IHN0cmluZyB8IHVuZGVmaW5lZCkgewotICBpZiAoIWNvbnRlbnQpIHJldHVybiBbXTsKLSAgcmV0dXJuIGNvbnRlbnQKLSAgICAucmVwbGFjZSgvPGJyXHMqXC8/Pig/PS4pL2dpLCAiXG4iKQotICAgIC5yZXBsYWNlKC88XC9wPi9naSwgIlxuXG4iKQotICAgIC5yZXBsYWNlKC88W14+XSs+L2csICIgIikKLSAgICAucmVwbGFjZSgvJm5ic3A7L2csICIgIikKLSAgICAuc3BsaXQoL1xuKy8pCi0gICAgLm1hcCgocGFydCkgPT4gcGFydC5yZXBsYWNlKC9ccysvZywgIiAiKS50cmltKCkpCi0gICAgLmZpbHRlcihCb29sZWFuKTsKLX0KLQogZnVuY3Rpb24gTGl2ZUpvdXJuYWxEZXRhaWxQYWdlKHsgYXJ0aWNsZSB9OiB7IGFydGljbGU6IFN0b3JlZnJvbnRKb3VybmFsRHRvIH0pIHsKLSAgY29uc3QgcGFyYWdyYXBocyA9IGxpdmVBcnRpY2xlUGFyYWdyYXBocyhhcnRpY2xlLmNvbnRlbnQpOwogICByZXR1cm4gKAogICAgIDw+CiAgICAgICA8TmF2YmFyIHRoZW1lPSJsaWdodCIgLz4KQEAgLTI1MSwxNiArMjM5LDcgQEAKICAgICAgICAgKSA6IG51bGx9CiAgICAgICAgIDxCYW5kPgogICAgICAgICAgIDxTaGVsbCBjbGFzc05hbWU9Im1heC13LVs3NjBweF0iPgotICAgICAgICAgICAgPGFydGljbGUgY2xhc3NOYW1lPSJzcGFjZS15LTYiPgotICAgICAgICAgICAgICB7cGFyYWdyYXBocy5tYXAoKHBhcmFncmFwaCwgaW5kZXgpID0+ICgKLSAgICAgICAgICAgICAgICA8cAotICAgICAgICAgICAgICAgICAga2V5PXtgJHtpbmRleH0tJHtwYXJhZ3JhcGguc2xpY2UoMCwgMjQpfWB9Ci0gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9InRleHQtWzE1cHhdIGxlYWRpbmctOSB0ZXh0LW1ldGFsIgotICAgICAgICAgICAgICAgID4KLSAgICAgICAgICAgICAgICAgIHtwYXJhZ3JhcGh9Ci0gICAgICAgICAgICAgICAgPC9wPgotICAgICAgICAgICAgICApKX0KLSAgICAgICAgICAgIDwvYXJ0aWNsZT4KKyAgICAgICAgICAgIDxKb3VybmFsQ29udGVudCBjb250ZW50PXthcnRpY2xlLmNvbnRlbnR9IC8+CiAgICAgICAgICAgPC9TaGVsbD4KICAgICAgICAgPC9CYW5kPgogICAgICAgPC9tYWluPgotLS0gYS9zcmMvcm91dGVzL2luZGV4LnRzeAorKysgYi9zcmMvcm91dGVzL2luZGV4LnRzeApAQCAtMSw0ICsxLDQgQEAKLWltcG9ydCB7IGNyZWF0ZUZpbGVSb3V0ZSB9IGZyb20gIkB0YW5zdGFjay9yZWFjdC1yb3V0ZXIiOworaW1wb3J0IHsgY3JlYXRlRmlsZVJvdXRlLCBMaW5rIH0gZnJvbSAiQHRhbnN0YWNrL3JlYWN0LXJvdXRlciI7CiBpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUsIHR5cGUgUmVhY3ROb2RlIH0gZnJvbSAicmVhY3QiOwogaW1wb3J0IHsgQW5ub3VuY2VtZW50QmFyLCBBTk5PVU5DRU1FTlRfSEVJR0hUIH0gZnJvbSAiQC9jb21wb25lbnRzL2xiYi9Bbm5vdW5jZW1lbnRCYXIiOwogaW1wb3J0IHsgRm9vdGVyIH0gZnJvbSAiQC9jb21wb25lbnRzL2xiYi9Gb290ZXIiOwpAQCAtMjQsNiArMjQsOCBAQAogaW1wb3J0IHsKICAgcmVzb2x2ZVN0b3JlZnJvbnRDb250cm9sLAogICByZXNvbHZlU3RvcmVmcm9udExvb2tib29rLAorICByZXNvbHZlU3RvcmVmcm9udEpvdXJuYWwsCisgIHR5cGUgU3RvcmVmcm9udEpvdXJuYWxEdG8sCiAgIHR5cGUgU3RvcmVmcm9udENvbnRyb2wsCiAgIHR5cGUgU3RvcmVmcm9udExvb2tEdG8sCiB9IGZyb20gIkAvbGliL3N0b3JlZnJvbnQtY29udHJvbCI7CkBAIC00Nyw2ICs0OSw3IEBACiAgIGNhdGVnb3JpZXM6IFN0b3JlZnJvbnRDYXRlZ29yeUR0b1tdIHwgbnVsbDsKICAgcHJvZHVjdHM6IEJhY2tlbmRDYXRhbG9nQ2FyZFtdIHwgbnVsbDsKICAgbG9va2Jvb2s6IFN0b3JlZnJvbnRMb29rRHRvW10gfCBudWxsOworICBqb3VybmFsPzogU3RvcmVmcm9udEpvdXJuYWxEdG9bXTsKICAgZmVhdHVyZWRTdG9yeTogTGl2ZUZlYXR1cmVkU3RvcnkgfCBudWxsOwogICByYWNrUHJvZHVjdHM6IFJhY2tQcm9kdWN0W107CiB9OwpAQCAtMTE3LDEyICsxMjAsMTMgQEAKICAgICAgIH07CiAgICAgfQogCi0gICAgY29uc3QgW2NhdGVnb3JpZXMsIGNhdGFsb2csIGxvb2tib29rLCBmZWF0dXJlZFN0b3J5LCByYWNrUHJvZHVjdHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoWworICAgIGNvbnN0IFtjYXRlZ29yaWVzLCBjYXRhbG9nLCBsb29rYm9vaywgZmVhdHVyZWRTdG9yeSwgcmFja1Byb2R1Y3RzLCBqb3VybmFsXSA9IGF3YWl0IFByb21pc2UuYWxsKFsKICAgICAgIGxpc3RTdG9yZWZyb250Q2F0ZWdvcmllcygpLAogICAgICAgbG9hZEhvbWVDYXRhbG9nKCksCiAgICAgICByZXNvbHZlU3RvcmVmcm9udExvb2tib29rKCksCiAgICAgICByZXNvbHZlTGl2ZUZlYXR1cmVkU3RvcnkoY29udHJvbCksCiAgICAgICByZXNvbHZlUmFja1Byb2R1Y3RzKCksCisgICAgICByZXNvbHZlU3RvcmVmcm9udEpvdXJuYWwoKS5jYXRjaCgoKSA9PiBbXSksCiAgICAgXSk7CiAKICAgICBjb25zdCBzZWxlY3RlZCA9IEFycmF5LmlzQXJyYXkoY29udHJvbC5ob21lLmhlcm9Qcm9kdWN0U2x1Z3MpCkBAIC0xNTEsNiArMTU1LDcgQEAKICAgICAgIGhlcm9Qcm9kdWN0cywKICAgICAgIHByb2R1Y3RzOiBjYXRhbG9nLAogICAgICAgbG9va2Jvb2s6IGxvb2tib29rID8/IFtdLAorICAgICAgam91cm5hbDogKGpvdXJuYWwgPz8gW10pLnNsaWNlKDAsIDMpLAogICAgICAgZmVhdHVyZWRTdG9yeSwKICAgICAgIHJhY2tQcm9kdWN0cywKICAgICB9OwpAQCAtMjI0LDYgKzIyOSw3IEBACiAgICAgY2F0ZWdvcmllcywKICAgICBwcm9kdWN0cywKICAgICBsb29rYm9vaywKKyAgICBqb3VybmFsLAogICAgIGZlYXR1cmVkU3RvcnksCiAgICAgcmFja1Byb2R1Y3RzLAogICB9ID0gUm91dGUudXNlTG9hZGVyRGF0YSgpOwpAQCAtMjcxLDYgKzI3NywyNyBAQAogICAgICAgICAgIDxkaXYga2V5PXtrZXl9PntzZWN0aW9uc1trZXldID8/IG51bGx9PC9kaXY+CiAgICAgICAgICkpfQogICAgICAgICB7IWNvbnRyb2wuaG9tZS5zZWN0aW9ucy5pbmNsdWRlcygicHJvZHVjdHMiKSAmJiA8Q29sbGVjdGlvblJhY2sgcHJvZHVjdHM9e3JhY2tQcm9kdWN0c30gLz59CisgICAgICAgIHtqb3VybmFsPy5sZW5ndGggPyAoCisgICAgICAgICAgPHNlY3Rpb24gZGlyPSJydGwiIGFyaWEtbGFiZWxsZWRieT0iaG9tZS1qb3VybmFsLXRpdGxlIiBkYXRhLWhvbWUtam91cm5hbCBjbGFzc05hbWU9ImJvcmRlci10IGJvcmRlci1oYWlybGluZSBweS0xMCBtZDpweS0xNCI+CisgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ibGJiLXNoZWxsIj4KKyAgICAgICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9Im1iLTYgZmxleCBmbGV4LXdyYXAgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtMyI+CisgICAgICAgICAgICAgICAgPGgyIGlkPSJob21lLWpvdXJuYWwtdGl0bGUiIGNsYXNzTmFtZT0idGV4dC1kaXNwbGF5LTMiPtin2LIg2pjZiNix2YbYp9mEIExCQjwvaDI+CisgICAgICAgICAgICAgICAgPExpbmsgdG89Ii9qb3VybmFsIiBjbGFzc05hbWU9InRleHQtc20gZm9udC1ib2xkIHRleHQtc2lnbmFsIj7Zh9mF2Ycg2YXZgtin2YTZh+KAjNmH2Kc8L0xpbms+CisgICAgICAgICAgICAgIDwvaGVhZGVyPgorICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0iZ3JpZCBnYXAtNCBzbTpncmlkLWNvbHMtMiBsZzpncmlkLWNvbHMtMyI+CisgICAgICAgICAgICAgICAge2pvdXJuYWwubWFwKChhcnRpY2xlKSA9PiAoCisgICAgICAgICAgICAgICAgICA8TGluayBrZXk9e2FydGljbGUuc2x1Z30gdG89Ii9qb3VybmFsLyRzbHVnIiBwYXJhbXM9e3sgc2x1ZzogYXJ0aWNsZS5zbHVnIH19IGNsYXNzTmFtZT0iZ3JvdXAgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItaGFpcmxpbmUgYmctY2FyYm9uIj4KKyAgICAgICAgICAgICAgICAgICAge2FydGljbGUuY292ZXJVcmwgJiYgPGltZyBzcmM9e2FydGljbGUuY292ZXJVcmx9IGFsdD0iIiBsb2FkaW5nPSJsYXp5IiBkZWNvZGluZz0iYXN5bmMiIGNsYXNzTmFtZT0iYXNwZWN0LVsxNi85XSB3LWZ1bGwgb2JqZWN0LWNvdmVyIiAvPn0KKyAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9InAtNCI+CisgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT0idGV4dC1sZyBmb250LWJvbGQgZ3JvdXAtaG92ZXI6dGV4dC1zaWduYWwiPnthcnRpY2xlLnRpdGxlfTwvaDM+CisgICAgICAgICAgICAgICAgICAgICAge2FydGljbGUuZXhjZXJwdCAmJiA8cCBjbGFzc05hbWU9Im10LTIgbGluZS1jbGFtcC0yIHRleHQtc20gbGVhZGluZy03IHRleHQtbWV0YWwiPnthcnRpY2xlLmV4Y2VycHR9PC9wPn0KKyAgICAgICAgICAgICAgICAgICAgPC9kaXY+CisgICAgICAgICAgICAgICAgICA8L0xpbms+CisgICAgICAgICAgICAgICAgKSl9CisgICAgICAgICAgICAgIDwvZGl2PgorICAgICAgICAgICAgPC9kaXY+CisgICAgICAgICAgPC9zZWN0aW9uPgorICAgICAgICApIDogbnVsbH0KICAgICAgIDwvbWFpbj4KICAgICAgIDxGb290ZXIgdGhlbWU9ImRhcmsiIC8+CiAgICAgICA8TW9iaWxlQm90dG9tQmFyIC8+Ci0tLSBhL3NyYy9jb21wb25lbnRzL2xiYi9ob21lL0RlY2lzaW9uU3VwcG9ydC50c3gKKysrIGIvc3JjL2NvbXBvbmVudHMvbGJiL2hvbWUvRGVjaXNpb25TdXBwb3J0LnRzeApAQCAtMjEsNyArMjEsNyBAQAogICByZXR1cm4gKAogICAgIDw+CiAgICAgICA8ZGl2PgotICAgICAgICA8ZGl2IGNsYXNzTmFtZT0iaGlkZGVuIGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlbiBnYXAtNCBtZDpmbGV4Ij4KKyAgICAgICAgPGRpdiBjbGFzc05hbWU9ImZsZXggaXRlbXMtc3RhcnQganVzdGlmeS1iZXR3ZWVuIGdhcC00Ij4KICAgICAgICAgICA8VGVjaExhYmVsIHRvbmU9ImludmVyc2UiPgogICAgICAgICAgICAgMHtpbmRleCArIDF9IC8ge2xhdGlufQogICAgICAgICAgIDwvVGVjaExhYmVsPgpAQCAtMjksMTEgKzI5LDExIEBACiAgICAgICAgICAgICA8R3VpZGVJY29uIGNsYXNzTmFtZT0ic2l6ZS03IiBhcmlhLWhpZGRlbj0idHJ1ZSIgLz4KICAgICAgICAgICA8L3NwYW4+CiAgICAgICAgIDwvZGl2PgotICAgICAgICA8aDMgY2xhc3NOYW1lPSJ0ZXh0LXNtIGZvbnQtYm9sZCB0ZXh0LW9ic2lkaWFuIG1kOm10LTUgbWQ6dGV4dC10aXRsZSI+e2xhYmVsfTwvaDM+Ci0gICAgICAgIDxwIGNsYXNzTmFtZT0ibXQtMyBoaWRkZW4gdGV4dC1zbSBsZWFkaW5nLTcgdGV4dC1ncmFwaGl0ZSBtZDpibG9jayI+e2Rlc2NyaXB0aW9ufTwvcD4KKyAgICAgICAgPGgzIGNsYXNzTmFtZT0ibXQtNSB0ZXh0LXRpdGxlIHRleHQtb2JzaWRpYW4iPntsYWJlbH08L2gzPgorICAgICAgICA8cCBjbGFzc05hbWU9Im10LTMgdGV4dC1zbSBsZWFkaW5nLTcgdGV4dC1ncmFwaGl0ZSI+e2Rlc2NyaXB0aW9ufTwvcD4KICAgICAgIDwvZGl2PgotICAgICAgPHNwYW4gY2xhc3NOYW1lPSJmbGV4IHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdGV4dC14cyBmb250LWJsYWNrIHRleHQtb2JzaWRpYW4gbWQ6bXQtOCBtZDpib3JkZXItdCBtZDpib3JkZXItaGFpcmxpbmUtaW5rIG1kOnB0LTQiPgotICAgICAgICA8c3BhbiBjbGFzc05hbWU9ImhpZGRlbiBtZDppbmxpbmUiPtio2KfYstqp2LHYr9mGINix2KfZh9mG2YXYpzwvc3Bhbj4KKyAgICAgIDxzcGFuIGNsYXNzTmFtZT0ibXQtOCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gYm9yZGVyLXQgYm9yZGVyLWhhaXJsaW5lLWluayBwdC00IHRleHQteHMgZm9udC1ibGFjayB0ZXh0LW9ic2lkaWFuIj4KKyAgICAgICAg2KjYp9iy2qnYsdiv2YYg2LHYp9mH2YbZhdinCiAgICAgICAgIDxBcnJvd1VwTGVmdAogICAgICAgICAgIHNpemU9ezE3fQogICAgICAgICAgIGFyaWEtaGlkZGVuPSJ0cnVlIgpAQCAtNDUsNyArNDUsNyBAQAogfQogCiBjb25zdCBDQVJEX0NMQVNTID0KLSAgImdyb3VwIGZsZXggbWluLWgtMTIgc2hyaW5rLTAgc25hcC1zdGFydCBpdGVtcy1jZW50ZXIgZ2FwLTIgd2hpdGVzcGFjZS1ub3dyYXAgbWQ6bWluLWgtWzIyMHB4XSBtZDpmbGV4LWNvbCBtZDppdGVtcy1zdHJldGNoIG1kOmp1c3RpZnktYmV0d2VlbiBtZDp3aGl0ZXNwYWNlLW5vcm1hbCByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWhhaXJsaW5lLWluayBiZy1ib25lIHB4LTMgcHktMiBtZDpwLTUgc2hhZG93LVswXzE2cHhfNDVweF9yZ2JhKDAsMCwwLDAuMDgpXSB0cmFuc2l0aW9uLVt0cmFuc2Zvcm0sYmFja2dyb3VuZC1jb2xvcixib3gtc2hhZG93XSBob3ZlcjotdHJhbnNsYXRlLXktMSBob3ZlcjpiZy1zdGVhbSBob3ZlcjpzaGFkb3ctWzBfMjJweF82MHB4X3JnYmEoMCwwLDAsMC4xMyldIjsKKyAgImdyb3VwIGZsZXggbWluLWgtWzIyMHB4XSB3LVttaW4oNzZ2dywxOHJlbSldIHNocmluay0wIHNuYXAtc3RhcnQgZmxleC1jb2wganVzdGlmeS1iZXR3ZWVuIG1kOnctYXV0byByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWhhaXJsaW5lLWluayBiZy1ib25lIHAtNSBzaGFkb3ctWzBfMTZweF80NXB4X3JnYmEoMCwwLDAsMC4wOCldIHRyYW5zaXRpb24tW3RyYW5zZm9ybSxiYWNrZ3JvdW5kLWNvbG9yLGJveC1zaGFkb3ddIGhvdmVyOi10cmFuc2xhdGUteS0xIGhvdmVyOmJnLXN0ZWFtIGhvdmVyOnNoYWRvdy1bMF8yMnB4XzYwcHhfcmdiYSgwLDAsMCwwLjEzKV0iOwogCiBleHBvcnQgZnVuY3Rpb24gRGVjaXNpb25TdXBwb3J0KCkgewogICBjb25zdCB7IHNvdXJjZSwgZGVjaXNpb25TdXBwb3J0IH0gPSB1c2VTdG9yZWZyb250Q29udHJvbCgpOwotLS0gL2Rldi9udWxsCisrKyBiL3NyYy9saWIvam91cm5hbC1jb250ZW50LnRzeApAQCAtMCwwICsxLDM3IEBACitpbXBvcnQgeyBjcmVhdGVFbGVtZW50LCB0eXBlIFJlYWN0Tm9kZSB9IGZyb20gInJlYWN0IjsKK2ltcG9ydCB7IHBhcnNlRnJhZ21lbnQsIHR5cGUgRGVmYXVsdFRyZWVBZGFwdGVyVHlwZXMgfSBmcm9tICJwYXJzZTUiOworaW1wb3J0IHsgc2FmZVB1YmxpY0hyZWYgfSBmcm9tICJAL2xpYi9wdWJsaWMtaHJlZiI7CisKK2NvbnN0IHRhZ3MgPSBuZXcgU2V0KFsicCIsICJoMiIsICJoMyIsICJ1bCIsICJvbCIsICJsaSIsICJzdHJvbmciLCAiZW0iLCAiYmxvY2txdW90ZSIsICJmaWd1cmUiLCAiZmlnY2FwdGlvbiIsICJiciJdKTsKK2NvbnN0IGNsYXNzZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7CisgIGgyOiAicHQtMyB0ZXh0LTJ4bCBmb250LWJvbGQgdGV4dC1ib25lIiwKKyAgaDM6ICJ0ZXh0LWxnIGZvbnQtYm9sZCB0ZXh0LWJvbmUiLAorICB1bDogImxpc3QtZGlzYyBzcGFjZS15LTIgcHMtNiIsCisgIG9sOiAibGlzdC1kZWNpbWFsIHNwYWNlLXktMiBwcy02IiwKKyAgZmlnY2FwdGlvbjogIm10LTIgdGV4dC1zbSB0ZXh0LW11dGUiLAorfTsKKworZnVuY3Rpb24gcmVuZGVyKG5vZGU6IERlZmF1bHRUcmVlQWRhcHRlclR5cGVzLkNoaWxkTm9kZSwga2V5OiBudW1iZXIpOiBSZWFjdE5vZGUgeworICBpZiAoInZhbHVlIiBpbiBub2RlKSByZXR1cm4gbm9kZS52YWx1ZTsKKyAgaWYgKCEoInRhZ05hbWUiIGluIG5vZGUpKSByZXR1cm4gbnVsbDsKKyAgY29uc3QgeyB0YWdOYW1lLCBhdHRycywgY2hpbGROb2RlcyB9ID0gbm9kZTsKKyAgaWYgKG5vZGUubmFtZXNwYWNlVVJJICE9PSAiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCIpIHJldHVybiBudWxsOworICBjb25zdCBhdHRyaWJ1dGUgPSAobmFtZTogc3RyaW5nKSA9PiBhdHRycy5maW5kKChpdGVtKSA9PiBpdGVtLm5hbWUgPT09IG5hbWUpPy52YWx1ZTsKKyAgaWYgKHRhZ05hbWUgPT09ICJpbWciKSB7CisgICAgY29uc3Qgc3JjID0gc2FmZVB1YmxpY0hyZWYoYXR0cmlidXRlKCJzcmMiKSk7CisgICAgcmV0dXJuIHNyYyA/IDxpbWcga2V5PXtrZXl9IHNyYz17c3JjfSBhbHQ9e2F0dHJpYnV0ZSgiYWx0IikgPz8gIiJ9IGxvYWRpbmc9ImxhenkiIGRlY29kaW5nPSJhc3luYyIgY2xhc3NOYW1lPSJoLWF1dG8gdy1mdWxsIHJvdW5kZWQteGwiIC8+IDogbnVsbDsKKyAgfQorICBpZiAodGFnTmFtZSA9PT0gInNjcmlwdCIgfHwgdGFnTmFtZSA9PT0gInN0eWxlIiB8fCB0YWdOYW1lID09PSAiaWZyYW1lIikgcmV0dXJuIG51bGw7CisgIGNvbnN0IGNoaWxkcmVuID0gY2hpbGROb2Rlcy5tYXAocmVuZGVyKTsKKyAgaWYgKHRhZ05hbWUgPT09ICJhIikgeworICAgIGNvbnN0IGhyZWYgPSBzYWZlUHVibGljSHJlZihhdHRyaWJ1dGUoImhyZWYiKSk7CisgICAgcmV0dXJuIGhyZWYgPyA8YSBrZXk9e2tleX0gaHJlZj17aHJlZn0gY2xhc3NOYW1lPSJmb250LXNlbWlib2xkIHRleHQtc2lnbmFsIHVuZGVybGluZSB1bmRlcmxpbmUtb2Zmc2V0LTQiPntjaGlsZHJlbn08L2E+IDogY2hpbGRyZW47CisgIH0KKyAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQodGFncy5oYXModGFnTmFtZSkgPyB0YWdOYW1lIDogInNwYW4iLCB7IGtleSwgY2xhc3NOYW1lOiBjbGFzc2VzW3RhZ05hbWVdIH0sIHRhZ05hbWUgPT09ICJiciIgPyB1bmRlZmluZWQgOiBjaGlsZHJlbik7Cit9CisKK2V4cG9ydCBmdW5jdGlvbiBKb3VybmFsQ29udGVudCh7IGNvbnRlbnQgfTogeyBjb250ZW50Pzogc3RyaW5nIH0pIHsKKyAgaWYgKCFjb250ZW50KSByZXR1cm4gbnVsbDsKKyAgY29uc3Qgbm9kZXMgPSBwYXJzZUZyYWdtZW50KGNvbnRlbnQpLmNoaWxkTm9kZXM7CisgIHJldHVybiA8YXJ0aWNsZSBkaXI9InJ0bCIgY2xhc3NOYW1lPSJzcGFjZS15LTYgdGV4dC1bMTVweF0gbGVhZGluZy05IHRleHQtbWV0YWwiPntub2Rlcy5tYXAocmVuZGVyKX08L2FydGljbGU+OworfQo=
PATCH
patch --batch --forward --dry-run -p1 -i "$state/journal.patch"
patch --batch --forward -p1 -i "$state/journal.patch"
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
