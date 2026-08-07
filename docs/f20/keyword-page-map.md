# Keyword-to-Page Architecture

F20-A does not fabricate search volume, traffic forecasts, keyword difficulty or conversion estimates. Until Search Console and a keyword tool provide evidence, this document maps **intent**, not fake numbers.

## Intent map

| Intent family                | Preferred page family                                         | Example intent language                     | Must not compete with                                           |
| ---------------------------- | ------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| Brand                        | `/`                                                           | LBB, ال‌بی‌بی, LBB clothing                 | `/shop`, categories                                             |
| Broad commercial catalogue   | `/shop`                                                       | خرید لباس استریت‌ویر / پوشاک شهری LBB       | individual categories, collections                              |
| Product-type commercial      | `/$category`                                                  | هودی LBB، شلوار بگی، تیشرت، کتونی           | `/shop`, same-theme collections                                 |
| Exact product / SKU          | `/product/$slug`                                              | product name, SKU, exact model              | category/collection copy                                        |
| Merchandising / drop / story | `/collections/$slug`                                          | named drop, curated capsule, style grouping | taxonomy category unless intent is genuinely different          |
| Collection discovery         | `/collections`                                                | کالکشن‌های LBB، دراپ‌ها                     | `/shop`                                                         |
| Editorial/informational      | `/journal/$slug`                                              | styling, fabric, care, trend guidance       | PDP factual specs                                               |
| Editorial discovery          | `/journal`                                                    | ژورنال LBB، راهنماها                        | `/lookbook`                                                     |
| Visual inspiration           | `/lookbook`                                                   | لوک‌بوک، استایل LBB                         | collection/category commercial landing pages                    |
| Local / entity               | `/` + `/contact`                                              | فروشگاه LBB کرج، پاساژ مهستان               | any Tehran store-location page                                  |
| Brand/entity information     | `/about`                                                      | درباره LBB                                  | homepage brand intent where not necessary                       |
| Sizing support               | `/size-guide`                                                 | راهنمای سایز LBB                            | product-specific measurements if they differ by product         |
| Support / policy             | `/faq`, `/shipping-returns`, `/terms`, `/privacy`, `/contact` | policy/support questions                    | journal unless the content is editorial rather than operational |
| Internal search              | `/search`                                                     | user-generated query combinations           | all indexable landing pages; search is always noindex           |

## Category vs collection boundary

### Category

A category is a stable commercial taxonomy based primarily on **what the product is**: hoodie, pants, T-shirt, shoes, socks. Category routes own durable product-type intent.

### Collection

A collection is merchandising/editorial grouping based on **why these products are presented together**: a named drop, seasonal capsule, color story, collaboration or styling narrative.

A collection must not be created merely to produce a second page for an already-owned category keyword. If a collection cannot explain a materially different user intent, it should not target that category query.

## `/shop` boundary

`/shop` owns the broad “all products / catalogue” intent. It should not be rewritten to aggressively target every category phrase. Category links and concise contextual copy are sufficient to distribute authority to specific product-type landings.

## Product boundary

PDPs own exact product/model/SKU intent. PDP metadata must not be generated for draft/unverified products as if they are publicly saleable. A product only graduates to an indexable SEO page when the publication/evidence contract permits it.

## Journal boundary

Journal content may explain style, care, materials and trends, but must not override product-specific facts. For example, a generic article can explain how to measure a hoodie; it must not claim the measurements, fabric composition or care method of a particular SKU unless those facts are verified on that PDP.

## Local intent

Confirmed location identity in the F20-A baseline:

- City: کرج
- Venue: پاساژ مهستان
- Province: البرز

There is no verified Tehran store identity. Therefore no route, metadata field, schema address or keyword landing page may imply an LBB store in Tehran. If Tehran later becomes a real location, it requires a new verified business-location record rather than an SEO-only page.

## Cannibalization guardrails

1. Each indexable page declares one primary intent family and a small set of subordinate concepts.
2. `/shop`, `/$category` and `/collections/$slug` cannot intentionally target the same primary commercial phrase.
3. Query-string filter states do not become alternate category pages.
4. Search-result pages never graduate to indexable pages by accumulating links.
5. Journal titles should answer informational intent and link to the relevant commercial destination rather than duplicating its conversion copy.
6. Product titles use product identity; category titles use product type; collection titles use the collection/drop identity.
7. Local terms are attached only to verified entity/location pages.

## Future evidence loop

When Search Console and a keyword tool are available, F20-B/ongoing SEO may add:

- observed queries and impressions per preferred landing page;
- cannibalization alerts when multiple URLs receive impressions for the same intent;
- click-through and position trends;
- intentional landing-page proposals backed by demand data.

Those measurements must be stored as observed data with source/date. They must not be retroactively invented in F20-A.
