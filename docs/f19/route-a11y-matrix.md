# Route Accessibility Matrix

Legend:

- **Axe** — serious/critical gate in `tests/accessibility.spec.ts`
- **K/F** — keyboard and/or focus behavior has a direct interaction gate
- **RTL** — sampled at the required responsive widths or covered by the global route/RTL contracts
- **State** — loading, empty, invalid or error behavior that must remain understandable without pointer input

| Family | Production route / representative | Axe | K/F | RTL | State / semantic contract |
| --- | --- | --- | --- | --- | --- |
| Home | `/` | Yes | Navbar, search, menu, cart | 390/768/1440/1920 sample | 1 H1, 1 main, skip/focus-visible shell, reduced motion |
| Shop | `/shop` | Yes | filters, sort, Quick View | 390/768/1440/1920 sample | loading-safe catalogue, empty-filter state, result announcement |
| Category | `/hoodies` plus pants/tshirts/shoes/socks in existing all-route suite | Yes | listing controls | 390/768/1440/1920 sample | valid category H1, filtered/deep-link state |
| Search | `/search?q=هودی` | Yes | searchbox, overlay arrows/Enter | 390/768/1440/1920 sample | no-result state, live suggestion/result count |
| Product | `/product/lbb-classic-hoodie` | Yes | gallery, size guide, add-to-cart flow | 390/768/1440/1920 sample | sold-out/size error semantics, invalid product routes to 404 |
| Cart | `/cart` | Yes | Cart Drawer Escape/focus | global all-route RTL + drawer audit | hydrated/loading, empty, quantity controls |
| Checkout preview | `/checkout` | Yes | form labels/errors | global all-route RTL | loading, empty-cart, validation, storage error |
| Account | `/account` | Yes | normal link navigation | 390/768/1440/1920 sample | explicit frontend-only state; no fake auth form |
| Collections index | `/collections` | Yes | normal links | global all-route RTL | empty-safe editorial listing |
| Collection detail | `/collections/drop-01-shabgard` | Yes | normal links | global all-route RTL | invalid collection Axe/heading gate |
| Lookbook | `/lookbook` | Yes | dialog arrows/Escape/restore | 390/768/1440/1920 sample | lightbox dialog; focus-trap debt `F19B-P1-001` |
| Journal index | `/journal` | Yes | normal links | global all-route RTL | 1 H1 / landmark contract |
| Journal detail | `/journal/materials-101-parche-shenasi` | Yes | normal links | global all-route RTL | invalid article Axe/heading gate |
| About | `/about` | Yes | normal links | global all-route RTL | 1 H1 / landmark contract |
| FAQ | `/faq` | Yes | Enter/Space native disclosure | 390/768/1440/1920 sample | semantic `details/summary`; text-spacing stress |
| Shipping | `/shipping-returns` | Yes | normal links | 390/768/1440/1920 sample | truth-safe combined policy page |
| Returns | `/shipping-returns` | Yes | normal links | 390/768/1440/1920 sample | same combined route as Shipping |
| Terms | `/terms` | Yes | normal links | global all-route RTL | 1 H1 / landmark contract |
| Privacy | `/privacy` | Yes | normal links | global all-route RTL | 1 H1 / landmark contract |
| Contact | `/contact` | Yes | links only; no contact form exists | global all-route RTL | explicit LTR Instagram handle island |
| Wishlist | `/wishlist` | Yes | product/link interactions in existing suite | global all-route RTL | empty/local-only state |
| Size guide page | `/size-guide` | Yes | normal links/tables | global all-route RTL | table captions/headers; separate PDP dialog gate |
| Track order | `/track-order` | Yes | existing route flow | global all-route RTL | frontend/demo-state semantics |
| Order confirmation | `/order-confirmation` | Yes | existing route flow | global all-route RTL | no stored-preview state supported |
| 404 | `/f19-route-does-not-exist` | Yes | suggested destinations | 390/768/1440/1920 sample | exactly one main/H1, understandable invalid route |
| Invalid product | `/product/f19-invalid-product` | Yes | n/a | root RTL | resolves through root not-found UI |
| Invalid collection | `/collections/f19-invalid-collection` | Yes | n/a | root RTL | dedicated invalid collection state where route provides it |
| Invalid journal | `/journal/f19-invalid-journal` | Yes | n/a | root RTL | dedicated invalid article state where route provides it |

## Existing broader route regression

`tests/all-routes.spec.ts` remains the broad production inventory and checks the full set of static and dynamic routes for:

- runtime/resource failures
- `html[dir="rtl"]`
- exactly one H1
- horizontal page overflow
- refresh stability
- generic and dynamic invalid routes

F19-A intentionally layers specialized accessibility gates on top of that existing inventory instead of duplicating every assertion for every slug.

## Loading / empty / error review

| State | Current route/component evidence | Gate / result |
| --- | --- | --- |
| Cart hydration | Cart Drawer and Cart page expose status text while browser state hydrates | Axe + existing route tests; status role present in drawer |
| Empty cart | Cart/Checkout expose a usable route back to Shop | Axe on `/cart` and `/checkout` |
| Empty filtered catalogue | Existing discovery suite resets to complete results | `tests/catalog-discovery.spec.ts` |
| No search result | Search route/overlay expose explicit no-match messaging | Axe + existing search tests |
| Invalid route | Root 404 has `main`, H1 and suggested destinations | Axe + F19 landmark/RTL tests |
| Invalid product | Product loader throws not-found instead of rendering partial product data | Axe invalid-product route |
| Invalid collection/article | Dedicated invalid dynamic states covered by Axe and existing all-route tests | Axe + existing route suite |
| Checkout validation | Custom errors exist but are not programmatically associated/focused | expected regression `F19B-P1-002` |
| Storage failure | Checkout exposes `role="alert"` storage error | source audit; retain in F19-B verification |

## Heading and landmark gate

F19-A requires one logical H1 and one `main` landmark for every major route family and invalid route. Existing route inventory extends the H1 check to the wider production route set. Nested H2/H3 use is reviewed structurally in route/components; no P0/P1 heading defect was found in the baseline audit.

## Screen-reader semantic notes

- Navbar has an explicit navigation label.
- Breadcrumb uses `nav` + ordered list + `aria-current="page"`.
- Dialogs use `role="dialog"` / `aria-modal` or Radix dialog primitives.
- Product cards use articles, real product links and named action buttons.
- Quantity outputs and search result counts use live regions where state changes in place.
- Contact currently has no form, so no placeholder-only-label risk exists there.
- Account currently exposes no fake authentication form; it is intentionally a frontend-only destination.
