# P1.3 — Research Findings

Status: **EVIDENCE RECORDED / IMPLEMENTATION APPLIED**

## Findings

1. P1.2 established safe metadata, truthful category copy, clean canonicals and filtered-state `noindex` behavior, but it was not a complete keyword-research phase.
2. Live Persian SERP checks for product-family queries such as hoodies, T-shirts, cargo pants and sneakers predominantly showed ecommerce category/product intent. That supports transactional category pages rather than forcing local-first titles.
3. Local clothing queries around Karaj showed local-store, directory and storefront intent. This supports strong Karaj context on Home and Contact, not boilerplate geo modifiers across every category.
4. The current prototype catalog has no authoritative gender field. Therefore `مردانه` is not used as a templated category target even if some SERPs commonly use it.
5. Category content is most useful when it supports decisions: size, fit, price, stock, color and verified product facts rather than repeated category keywords.
6. Google Search no longer provides the FAQ rich-result feature, and HowTo rich results were retired earlier. Visible FAQ and sizing guidance remain useful, while retired search-feature markup was removed in this phase.
7. Google does not use `meta keywords` for ranking, and the retired Sitelinks Search Box no longer justifies homepage `SearchAction`; both legacy contracts were removed.
8. Search and filter states remain crawlable enough to expose `noindex`, while canonical URLs point to clean indexable routes.
9. Product structured data remains conditional on publishability so draft or insufficiently evidenced products cannot become Product/Offer search facts.
10. Sitemap, robots and canonical contracts already followed the desired indexation model and were preserved rather than rewritten without cause.

## Operational limits

- No fabricated search-volume, CPC or KD values are recorded.
- Real demand measurement must come from Google Keyword Planner and, after indexing, Search Console query, impression and click data.
- Metadata should be revisited from Search Console evidence after production indexing rather than treated as permanently optimal.
