from pathlib import Path

handoff = Path("docs/LBB_MASTER_HANDOFF_FA.md")
text = handoff.read_text(encoding="utf-8")

old_p4 = """## P4 — Commerce Go-Live

1. Real product/catalog/business data readiness
2. Live environment/domain/CORS/Sanctum and deploy-candidate wiring
3. Cart / checkout / shipping / reservation / inventory production readiness
4. Production payment activation behind explicit gate
5. Order / inventory / notification and real E2E commerce acceptance
6. Controlled deployment/activation + rollback + post-activation health acceptance
"""

new_p4 = """## P4 — Commerce Go-Live — **CODE / DEPLOY CANDIDATE DONE / MERGED / REGISTERED 2026-09-07; PRODUCTION ACTIVATION PENDING**

GitHub-side Commerce Go-Live candidate کامل و Merge شده است؛ activation واقعی VPS عمداً به‌عنوان runtime gate جدا و انجام‌نشده ثبت می‌شود.

- Frontend issue #73: **CLOSED / COMPLETED**.
- Frontend PR #74: **MERGED**.
- Frontend exact source head: `6c57011146c4cf90c5ad337e81b5377b4395044f`.
- Frontend merge SHA: `4e572b580a38d4fd28420c8e6d8dd69de945f76d`.
- Frontend Quality Gates `34106986013`: **SUCCESS**.
- Frontend Live Integration `34106986019`: **SUCCESS** (`frontend-contract` + `full-quality`).
- Backend issue #19: **CLOSED / COMPLETED**.
- Backend PR #20: **MERGED**.
- Backend exact source head: `57aa03aa8c27ce24263c5abedd6332dec254060c`.
- Backend merge SHA: `0c068df2ea43c8706932a73424014c59a313fc6b`.
- Backend exact-head gate `34107023080`: **SUCCESS** (SQLite/P3 + full suite + Pint + MySQL regression + real two-process oversell race).
- Review threads: Frontend `0` / Backend `0`.
- API contract: `2026-09-06-p3-storefront-v1`.
- Inventory reservation truth: **30 minutes**.
- Official delivery methods: `immediate_courier`, `tipax`, `decapost`, `express_post`.
- Live delivery options و price/inventory/quote/order/payment state: **Backend-authoritative**.
- Checkout / Payment / official shipping methods در default candidate: **fail-closed / disabled**.
- Production/server mutation: **NO**.
- Production deployment of P4: **NOT EXECUTED**.
- Checkout activation: **NO**.
- Payment activation: **NO**.
- Closure record: `docs/P4_FINAL_REGISTRATION_FA.md`.

### P4 runtime identity rule

`4e572b580a38d4fd28420c8e6d8dd69de945f76d` frontend P4 runtime-code merge و `0c068df2ea43c8706932a73424014c59a313fc6b` backend P4 runtime-code merge پذیرفته‌شده‌اند. Registration/documentation commitها این runtime identityها را redefine نمی‌کنند. Production baseline فقط پس از VPS deployment/acceptance واقعی تغییر می‌کند.
"""

old_next = """### CURRENT NEXT

**`P4 — Commerce Go-Live`**

P4 باید GitHub-first از runtime-code identityهای پذیرفته‌شده P3 یعنی frontend merge `ab3aa654ae7c3a19508837fa6bda383f84fa5cbc` و backend merge `5a874d66b5d031fd1ab739a4b7bd8b7c04d4acf6` ادامه یابد؛ branch عملی می‌تواند از latest accepted base شامل registration docs ساخته شود، اما docs-only commitها runtime identity را تغییر نمی‌دهند. ابتدا real data، live env/domain/CORS/Sanctum، shipping/reservation/inventory/payment readiness و deploy candidate به‌صورت fail-closed verify شوند. هیچ Production/server mutation یا payment activation قبل از gate صریح activation انجام نشود.
"""

new_next = """### CURRENT NEXT

**`P4-ACT — Controlled Production Deployment & Activation`**

GitHub/code deploy candidate P4 کامل شده است. قدم بعد فقط runtime activation روی VPS مجاز است: exact merged frontend/backend SHAها deploy شوند، production env/domain/TLS/CORS/Sanctum و real data بررسی شوند، migration و service/process identity با rollback target کنترل شوند، سپس Checkout/Shipping و در نهایت Payment فقط پشت gate صریح و پس از real E2E acceptance فعال شوند. تا آن زمان Production baseline ثبت‌شده و `prototype` runtime قبلی authoritative باقی می‌ماند. پس از acceptance واقعی P4-ACT، CURRENT NEXT به `P5 — SEO / Operations / Final Acceptance & Handoff` منتقل شود.
"""

if old_p4 not in text:
    raise SystemExit("P4 roadmap context not found")
if old_next not in text:
    raise SystemExit("CURRENT NEXT context not found")

text = text.replace(old_p4, new_p4, 1)
text = text.replace(old_next, new_next, 1)
handoff.write_text(text, encoding="utf-8")
