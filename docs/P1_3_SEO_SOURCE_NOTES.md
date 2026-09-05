# LBB P1.3 — Source Notes

Status: **IN PROGRESS**

## Authoritative technical sources

Implementation decisions in this phase are grounded in current Google Search Central documentation, including:

- canonicalization and duplicate URL consolidation;
- faceted/filter URL crawl/index handling;
- structured-data eligibility and validation;
- Search Essentials / spam policies, including avoiding keyword stuffing;
- Search Console as the post-indexing operational source for real query/impression/click data.

## Evidence classification

- **Official implementation guidance:** current Google Search Central documentation.
- **Live intent evidence:** current search-result composition for representative Persian query families.
- **Business truth:** `docs/LBB_MASTER_HANDOFF_FA.md` and verified storefront data.
- **Real search-volume evidence:** intentionally not claimed in-repository without Keyword Planner/Search Console export.

## Initial live-intent findings

Representative local Karaj clothing queries currently surface a mix of:

- local boutique/store pages;
- mall/store-directory pages;
- ecommerce storefront/category pages;
- local commercial listings.

Examples include current Karaj store/mall results for menswear/clothing as well as ecommerce storefronts with Karaj showroom context. This supports keeping strong local relevance on the homepage/contact/store-location surfaces. It does not, by itself, prove that every category should use a local-first title.

## Guardrail

P1.3 must not turn observed competitor wording into copied text or unsupported claims. SERP review is used to understand intent/page type, not to imitate claims.
