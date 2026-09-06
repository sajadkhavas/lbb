# LBB P3 — Frontend ↔ Backend Live Integration Control Surface Matrix

Status: **AUDIT IN PROGRESS**

## Governing rule
Every frontend business/content/config/data surface must have an explicit backend owner, admin control surface, versioned API contract and frontend consumer. Developer-owned layout/component/design-system code stays in Git; merchant-editable truth must not remain the authoritative live source in frontend code.

## Required live-control surfaces
Catalog, variants/media/price/stock, categories, collections, navigation, announcement bar, homepage/hero, brand intro, footer/contact/social, FAQ, static pages, journal, lookbook, category merchandising/SEO, global/page SEO, shipping/business settings, customers/auth, cart/checkout/orders/returns, inventory, payment and notifications.

## Verified backend/admin truth
- Backend CMS/domain models and Filament resources already exist for StoreSetting, ContentPage, FAQ, GalleryItem, Category, Collection, Post and DeliveryZone.
- Existing `/api/v1` catalog/auth/commerce contracts already cover products/categories/collections/delivery and commerce operations.
- Legacy unversioned storefront endpoints cover settings/pages/FAQ/gallery/posts, but P3 needs additive versioned storefront-content contracts.

## Verified frontend gaps
- Collection metadata still resolves from local frontend data in backend mode.
- Journal content still resolves locally in backend mode.
- Lookbook content still resolves locally in backend mode.
- Category merchandising/SEO copy remains locally authoritative in parts of the frontend despite a rich backend category contract.
- Brand/global SEO, announcement bar, navigation, homepage/hero/brand-intro and footer/contact content remain hardcoded/local.

## Ownership boundary
Developer controlled: component/route/layout implementation, styling/design system, security/validation, API implementation shape, accessibility and performance engineering.

Business controlled: visible content/data/configuration and operational commerce truth.

## P3 implementation direction
- Domain data stays on dedicated backend models/resources.
- Structured global UI business configuration uses typed public StoreSetting values.
- Frontend prototype mode may keep current local defaults as explicit fallback.
- Backend/live mode must treat backend data as authoritative and must not silently masquerade local content as live truth.
- A surface is not PASS merely because a database table or endpoint exists; admin + approved API + live consumer + tests must all be present.
