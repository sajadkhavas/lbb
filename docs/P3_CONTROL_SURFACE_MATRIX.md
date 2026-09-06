# LBB P3 — Frontend ↔ Backend Live Integration Control Surface Matrix

Status: **AUDIT IN PROGRESS**

## Governing rule
Every frontend business/content/config/data surface must have an explicit backend owner, admin control surface, versioned API contract and frontend consumer. Developer-owned layout/component/design-system code stays in Git; merchant-editable truth must not remain the authoritative live source in frontend code.

## Required live-control surfaces
Catalog, variants/media/price/stock, collections, navigation, announcement bar, homepage/hero, brand intro, footer/contact/social, FAQ, static pages, journal, lookbook, category merchandising/SEO, global/page SEO, shipping/business settings, customers/auth, cart/checkout/orders/returns, inventory, payment and notifications.

## Initial verified gaps
- Collection metadata still resolves from local frontend editorial data in backend mode.
- Journal content still resolves locally in backend mode.
- Lookbook content still resolves locally in backend mode.
- Backend CMS models exist for settings/pages/FAQ/gallery, but matching Filament resources were not found in the P2 baseline.
- Existing unversioned `/api/storefront/*` content endpoints must not become the final P3 contract; P3 content APIs should be additive under `/api/v1`.

## Ownership boundary
Developer controlled: component/route/layout implementation, styling/design system, security/validation, API implementation shape, accessibility and performance engineering.

Business controlled: visible content/data/configuration and operational commerce truth.

A surface is not PASS merely because a database table or endpoint exists; it must be editable through admin, available through the approved API contract, and consumed by the live frontend path.
