# LBB — Final Admin-Driven Storefront Audit

Date: `2026-09-09`

## هدف

این سند مرجع نهایی ownership داده‌های عمومی Storefront است. در Production، محتوای تجاری/فروشگاهی نباید از fixture یا prototype Frontend به‌عنوان حقیقت استفاده کند. Frontend فقط مصرف‌کننده قراردادهای Backend است و Admin مرجع ویرایش داده‌های قابل‌مدیریت است.

## اصول نهایی

1. `live` و `prototype` دو مرز صریح هستند. Prototype فقط برای محیط نمونه/تست نگه‌داری می‌شود.
2. تنظیمات عمومی Storefront از `/api/v1/storefront/bootstrap` می‌آیند.
3. محصول، دسته، کالکشن، موجودی، قیمت، تصاویر، variant، اندازه و mannequin از Catalog Backend می‌آیند.
4. متن صفحات عمومی از `ContentPage` و محتوای FAQ/Journal/Lookbook از مدل‌های مدیریت‌شده Backend می‌آید.
5. Checkout و Payment از runtime config امن Backend می‌آیند و با setting نمایشی Admin فعال نمی‌شوند.
6. لینک قابل‌ویرایش عمومی فقط مسیر داخلی `/...` یا HTTPS است؛ scheme ناامن fail-closed می‌شود.
7. اطلاعات تأییدنشده مثل متن حقوقی نهایی، Enamad، ساعات کاری یا شرایط مرجوعی حدس زده نمی‌شوند.
8. `checkout.enabled=false`، `payment.enabled=false` و `provider=disabled` تا gate خارجی مستقل حفظ می‌شوند.

## Authority Matrix

| Surface                    | Backend authority                                     | Admin                             | Public API / contract                    | Frontend consumer           | Live fallback                                 |
| -------------------------- | ----------------------------------------------------- | --------------------------------- | ---------------------------------------- | --------------------------- | --------------------------------------------- |
| هویت برند                  | `StoreSetting brand.identity`                         | Site Settings                     | storefront bootstrap                     | root/Footer/Home/About      | ندارد؛ invalid contract fail                  |
| Hero و SEO خانه            | `brand.copy`, `seo.defaults`                          | Site Settings                     | storefront bootstrap                     | `index`, `HeroNarrative`    | ندارد                                         |
| محصول Hero                 | Product catalog + `home.presentation.heroProductSlug` | Products + Site Settings          | `/api/v1/products/{slug}`                | Home loader                 | missing product => no fake product            |
| ترتیب سکشن‌های Home        | `home.presentation.sections`                          | Site Settings                     | storefront bootstrap                     | `index.tsx`                 | ندارد                                         |
| نوار متحرک                 | `home.ticker`                                         | Site Settings                     | storefront bootstrap                     | `TickerStrip`               | Backend safe default only                     |
| Trust cards                | `home.trust`                                          | Site Settings                     | storefront bootstrap                     | `TrustStrip`                | Backend safe default only                     |
| دسته‌های Home/Header       | Category fields + `categoryOrder`                     | Category Resource + Site Settings | `/api/v1/categories`                     | Navbar/Hero/CategoryGateway | ندارد                                         |
| تازه‌های محصولات           | Product catalog                                       | Products                          | `/api/v1/products?sort=newest`           | ProductMoments              | empty state                                   |
| Quick View / card gallery  | Product summary/detail/media                          | Products / Media                  | Product APIs                             | ProductCard/QuickView       | ندارد                                         |
| 2D mannequin               | Product mannequin fields + verified media             | Product Admin                     | Product APIs                             | ProductCard                 | invalid/missing => hidden                     |
| Decision Support           | `home.decision_support`                               | Site Settings                     | storefront bootstrap                     | DecisionSupport             | Backend safe default only                     |
| فروشگاه حضوری              | `home.local_store` + `contact.public`                 | Site Settings                     | storefront bootstrap                     | LocalStoreVisit / Contact   | missing image/details => explicit empty state |
| Featured Story             | `home.featured_story` + Collection catalog            | Site Settings + Collections       | bootstrap + `/api/v1/collections/{slug}` | Home loader / DropStory     | disabled/missing => hidden                    |
| Lookbook / social strip    | `GalleryItem`                                         | Gallery Admin                     | `/api/v1/storefront/lookbook`            | InstagramStrip/Lookbook     | empty => hidden                               |
| Journal                    | `Post`                                                | Post Admin                        | storefront journal APIs                  | Journal routes              | ندارد                                         |
| FAQ                        | `Faq`                                                 | FAQ Admin                         | `/api/v1/storefront/faqs`                | FAQ route                   | ندارد                                         |
| About                      | `ContentPage about` + Brand settings                  | Content Page Admin                | page API + bootstrap                     | About                       | live page authority                           |
| Contact copy               | `ContentPage contact`                                 | Content Page Admin                | page API                                 | Contact                     | safe generic shell only                       |
| Contact channels           | `contact.public`                                      | Site Settings                     | storefront bootstrap                     | Contact/Footer/JSON-LD      | missing optional fields hidden                |
| Contact form               | `Inquiry`                                             | Inquiry Admin                     | `POST /api/v1/inquiries`                 | Contact form                | no fake success                               |
| Global size guide          | `ContentPage size-guide`                              | Content Page Admin                | page API                                 | Size Guide                  | missing => noindex + explicit state           |
| Product size guide         | Product SizeGuide domain                              | Product/Size Guide Admin          | product detail API                       | PDP                         | product-specific only                         |
| Terms                      | `ContentPage terms`                                   | Content Page Admin                | page API                                 | Terms                       | missing => noindex/no invented terms          |
| Privacy                    | `ContentPage privacy`                                 | Content Page Admin                | page API                                 | Privacy                     | missing => noindex/no invented policy         |
| Shipping methods           | Delivery policy/runtime                               | Delivery configuration            | `/api/v1/delivery/options`               | Shipping/Checkout           | none in live                                  |
| Returns policy             | `policy.returns`                                      | Site Settings                     | storefront bootstrap                     | Shipping/Terms              | unverified => not published                   |
| Enamad                     | `trust.enamad`                                        | Site Settings                     | storefront bootstrap                     | TrustMarks                  | unverified/invalid => hidden                  |
| Cart/Wishlist account sync | customer storefront state                             | customer account                  | v1 account APIs                          | Cart/Wishlist               | anonymous local continuity only               |
| Order tracking             | Order backend                                         | Orders Admin                      | `POST /api/v1/orders/track`              | Track Order                 | no browser demo order                         |
| Checkout state             | Backend runtime config                                | server operations                 | bootstrap runtime + commerce APIs        | Checkout/Terms/Privacy      | fail closed                                   |
| Payment state              | Backend runtime config/provider                       | server operations                 | bootstrap runtime + payment APIs         | Checkout/Terms/Privacy      | fail closed                                   |

## Live surfaces explicitly removed from static `STORE_SETTINGS`

- `TrustMarks`
- `/shipping-returns`
- `/terms`
- `/privacy`

`STORE_SETTINGS` may remain as prototype/readiness compatibility data, but is not accepted as Production merchant truth for the surfaces above.

## Safe public link policy

Admin-managed public hrefs are normalized by `src/lib/public-href.ts`:

- `/internal/path` accepted.
- `https://example.com/...` accepted.
- protocol-relative `//...`, `http:`, `javascript:`, `data:` and malformed values rejected.

Applied to merchant navigation, Announcement Bar, Trust cards and Decision Support cards.

## No schema migration in this final pass

The existing `StoreSetting` model already owns typed public JSON settings. New presentation controls use the same model and public bootstrap contract. Existing saved values override server defaults; defaults only fill missing keys. This avoids an unnecessary production schema mutation.

## Official implementation references

- Laravel 12 — Eloquent Mutators & Casting / Array and JSON Casting: https://laravel.com/docs/12.x/eloquent-mutators
- Filament 3 — Repeater: https://filamentphp.com/docs/3.x/forms/fields/repeater
- TanStack Router — Data Loading / route loaders: https://tanstack.com/router/latest/docs/guide/data-loading
- TanStack Router — External Data Loading / loaders for critical render data: https://tanstack.com/router/latest/docs/guide/external-data-loading
- Playwright — Assertions: https://playwright.dev/docs/test-assertions

## Acceptance requirements before closure

- Backend Pint/test suite green on exact head.
- Frontend format/lint/build/typecheck/audits/Playwright green on exact head.
- Review threads = 0.
- PRs merged with expected-head lock.
- Immutable production releases activated without rerunning the three already-applied additive migrations.
- Production bootstrap shows commerce fail-closed until external activation.
- Live routes render Backend data and do not expose prototype/sample fallback as Production truth.
- Final MySQL backup/restore and final reboot remain handoff acceptance steps after the final release is live.
