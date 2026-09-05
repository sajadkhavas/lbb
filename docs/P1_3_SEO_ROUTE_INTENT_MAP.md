# LBB P1.3 — Route / Intent Map

Status: **IMPLEMENTED — exact-head quality gate pending**

## Final principles

- One dominant search intent per indexable route.
- Homepage carries brand, broad streetwear discovery and verified Karaj/store context.
- Category pages prioritize transactional product-category intent and do not force `کرج` or gender modifiers without evidence.
- Product pages use product-specific verified facts only.
- About, FAQ and Contact serve brand, trust, support and local-navigation intent rather than artificial keyword landing pages.
- Filter and query states remain `noindex` and canonicalize to their clean route.
- Internal links use useful human anchors rather than repeated exact-match keyword anchors.

## Final route map

- `/`: brand + broad commercial discovery. Strong verified Karaj/store context. Indexable.
- `/shop`: broad ecommerce discovery across category, size, color, price and stock. No forced local modifier in the title. Indexable.
- `/tshirts`: buy/browse T-shirts. Support with fit, size, price and stock; use oversized/box wording only when real catalog data supports it. Indexable.
- `/hoodies`: buy/browse hoodies. Support with fit, size, price and stock. Indexable.
- `/pants`: buy/browse pants. Support with fit, size, price and stock; use baggy/cargo wording only when real catalog data supports it. Indexable.
- `/shoes`: buy/browse sneakers. Support with size, color, price and stock. Indexable.
- `/socks`: buy/browse socks. Support with size, color, price and stock. Indexable while real inventory exists.
- `/about`: brand story and trust. Local context may appear naturally in factual body copy, not as a forced title target. Indexable.
- `/contact`: local navigation and support. Strong verified Karaj/store context. Indexable.
- `/faq`: pre-purchase support around size, product facts, shipping and ordering truth. Indexable.
- `/size-guide`: sizing and fit guidance. Indexable.
- Product detail routes: specific product research/purchase using verified product facts. Index only when the product is publishable.
- Search and filtered states: narrow browsing only. `noindex` with clean canonicals.

## Keyword decisions

- `کرج` is strategically concentrated on Home, Contact and factual store context instead of every ecommerce title.
- `مردانه` is not forced into category metadata because the current catalog contract has no authoritative gender field.
- `استریت‌ویر`, `پوشاک خیابانی` and product modifiers such as `اورسایز`, `بگی` and `کارگو` are used only where natural and supported by actual brand/catalog content.
- No KD, CPC or search-volume number is claimed without Keyword Planner or Search Console evidence.
