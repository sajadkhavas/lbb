# LBB P3 — Frontend ↔ Backend Live Integration Control Surface Matrix

Status: **IMPLEMENTED / ACCEPTANCE CANDIDATE**

## Locked identity

- Frontend P3 START/base: `a866fc778a29f541fbccfcffaeb53cec7360acc7`
- Historical P1.4 `FRONTEND_FREEZE_SHA`: `2bc1347bb092172350415ac21019eb09f9dd746d`
- Backend P3 exact-head source: `a93f21a7c2c1bb2961a722c2748cf952cb4d399f`
- Backend exact-head source Gate: `34046093131` — **SUCCESS**
- Backend PR #18: **MERGED** after PR Gate `34046189517` — **SUCCESS**
- Backend P3 merge SHA: `5a874d66b5d031fd1ab739a4b7bd8b7c04d4acf6`
- P3 storefront contract: `2026-09-06-p3-storefront-v1`
- Production/server mutation: **NO**

## Governing rule

Every merchant-editable business, content, configuration or data surface rendered by the storefront must have an explicit Backend owner, a usable Admin/Filament control surface where applicable, a versioned API contract, and a live Frontend consumer. Developer-owned route/layout/component/design-system code remains in Git.

Prototype data is permitted only in explicit `prototype` mode. In `live` mode a Backend or contract failure must remain visible/fail closed and must not silently fall back to local business truth.

## Final matrix

| Frontend surface                                | Backend/Admin owner                             | API / live consumer                                                                  | P3 result                                       |
| ----------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Products, variants, media, price, stock         | Existing catalog/inventory domain + Admin       | Existing `/api/v1` catalog transport                                                 | **PASS**                                        |
| Categories and category SEO                     | Existing Category domain + Filament             | Existing versioned category API/Frontend consumers                                   | **PASS**                                        |
| Collections                                     | Existing Collection domain + Filament           | Existing `/api/v1/collections*`; index/detail are Backend-authoritative in live mode | **PASS**                                        |
| Journal                                         | `Post` + existing Filament                      | `/api/v1/storefront/journal` + detail; index/detail live consumers                   | **PASS**                                        |
| Lookbook                                        | `GalleryItem` + existing Filament               | `/api/v1/storefront/lookbook`; live consumer                                         | **PASS**                                        |
| FAQ                                             | `Faq` + existing Filament                       | `/api/v1/storefront/faqs`; live consumer                                             | **PASS**                                        |
| Safe static pages / page SEO                    | `ContentPage` + existing Filament               | `/api/v1/storefront/pages/{slug}`; `about` and `contact` live consumers              | **PASS**                                        |
| Announcement bar                                | Typed public `StoreSetting`                     | storefront bootstrap + moving/dismissible existing UI                                | **PASS**                                        |
| Shop/editorial/service/brand navigation         | Typed public `StoreSetting`                     | storefront bootstrap + Navbar/Mega/Mobile consumers                                  | **PASS**                                        |
| Homepage copy, Hero selection and section order | Typed public `StoreSetting` + catalog           | bootstrap + real Hero product API consumer                                           | **PASS**                                        |
| First-visit Brand Intro                         | Typed public `StoreSetting`                     | bootstrap + versioned Intro consumer                                                 | **PASS**                                        |
| Footer/contact/social/location                  | Typed public `StoreSetting` + safe Contact page | bootstrap/page API + Footer/Contact consumers                                        | **PASS**                                        |
| Global SEO merchant defaults                    | Typed public `StoreSetting`                     | bootstrap consumed by SSR/global surfaces                                            | **PASS**                                        |
| Auth/account/cart/checkout/orders/returns       | Existing customer/commerce domains              | Existing `/api/v1` integrations retained and regression-covered                      | **PASS — activation deferred to P4**            |
| Shipping/business rules                         | Existing DeliveryZone/StoreSetting domains      | Existing delivery/commerce contract                                                  | **PASS — real go-live deferred to P4**          |
| Payment/inventory/notifications                 | Existing operational domains                    | Existing commerce APIs                                                               | **PASS — production activation deferred to P4** |

## SSR / live-boundary acceptance

- Root SSR loader resolves the storefront control before render and provides it through a global context.
- Header, announcement bar, navigation, footer, homepage, Hero and Brand Intro consume the same resolved control surface.
- Journal, Lookbook, FAQ and safe static pages consume the additive versioned storefront-content contract.
- Collections remain on their existing Backend contract and do not fall back to local data in live mode.
- `about` and `contact` use Backend content/settings for live metadata and visible business truth.
- Prototype behavior remains explicitly selectable for baseline QA and local demonstration.
- Contract-version mismatch, invalid configuration and Backend/network failure do not masquerade local defaults as live data.

## Truth gates retained

- Historical inherited `SiteDataSeeder` content mentioning another business is **not** a live LBB source.
- Terms, Privacy and Returns policy text is not fabricated by P3; legal/business truth remains gated until explicitly verified.
- No unsupported address, store unit or opening hours are invented.
- P3 completes code-path integration only. It does **not** switch the Production server to live mode and does not activate payments or real commerce.

## Closure gate

P3 is complete only after:

1. exact-head Frontend `frontend-contract` and `full-quality` jobs succeed;
2. Backend P3 source PR and Frontend P3 source PR are merged with expected-head protection;
3. zero unresolved review blockers remain;
4. post-merge registration updates the Master Handoff and advances CURRENT NEXT to P4;
5. tracking issues are closed as completed.
