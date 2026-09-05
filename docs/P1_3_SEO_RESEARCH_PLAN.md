# LBB P1.3 — SEO Research & Execution Plan

Status: **IN PROGRESS**

- Repository: `sajadkhavas/lbb`
- Base branch: `fix/lbb-local-boutique-homepage`
- START_SHA: `1d6fd9170788e9e765c17fc4b29987b87436d283`
- Phase branch: `phase/p1-3-seo-semantic-content-polish`
- Tracking issue: #61
- Production mutation during this phase: **NO**

## Why this phase exists

P1.2 removed unsupported SEO/content claims and established safe category metadata, clean canonical behavior and local Karaj context. P1.3 is the dedicated evidence-backed phase that decides the final search intent, semantic coverage and technical SEO contracts before frontend freeze.

## Research order

1. Inventory every important indexable route and current SSR head output.
2. Extract seed queries from approved LBB Business Truth and real catalog taxonomy.
3. Inspect current search-result intent and competitor page types for high-value query families.
4. Separate local-store intent from nationwide ecommerce/category intent.
5. Build a route → primary intent → supporting topics map.
6. Rewrite title/H1/meta/body/FAQ only after mapping is recorded.
7. Reconcile structured data, internal linking, canonical/indexation and filtered states.
8. Run SEO regressions plus full quality gates on the exact final head.

## Evidence rules

- No invented keyword volume, KD or CPC values.
- Real volume/performance decisions require Google Keyword Planner and, after indexing, Google Search Console.
- Current Google Search Central documentation is the authority for crawl/index/canonical/structured-data implementation decisions.
- Live search-result evidence is used for intent classification, not as fabricated search-volume evidence.
- No unsupported market-leading, quality, material, shipping, price, stock or product claims.

## Initial query families under investigation

### Brand / category

- LBB / ال‌بی‌بی
- پوشاک خیابانی
- استریت ویر / استریت‌ویر
- پوشاک وارداتی

### Local commercial

- فروشگاه لباس مردانه کرج
- پوشاک مردانه کرج
- پوشاک خیابانی کرج
- استریت ویر کرج
- هودی کرج
- تیشرت کرج
- پاساژ مهستان کرج

### Product/category commercial

- خرید هودی / هودی استریت‌ویر / هودی اورسایز
- خرید تیشرت / تیشرت اورسایز
- خرید شلوار / شلوار بگی / شلوار کارگو
- خرید کتونی
- خرید جوراب

## Initial SERP observation

Early live-result checks show that local clothing queries around Karaj often return local boutiques, mall/store directory pages and ecommerce storefront/category pages. This means local intent is real, but it does **not** justify forcing `کرج` into every ecommerce category title without route-level intent evidence. P1.3 must decide where local modifiers belong and where broader transactional category intent should remain primary.

## Current working hypothesis — NOT FINAL

- Homepage: brand + streetwear identity + Karaj/local-store intent.
- Contact/store-location surfaces: strongest local/navigation intent.
- Category pages: transactional category intent first; local modifier only where evidence supports it.
- Product pages: product-specific transactional intent and factual attributes only.
- FAQ/About: brand trust and support intent; do not make them artificial keyword landing pages.

This hypothesis must be validated by the route inventory and live SERP review before implementation is finalized.
