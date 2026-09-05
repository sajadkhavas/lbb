# LBB P1.3 — Route / Intent Map

Status: **DRAFT — research in progress**

This document is intentionally created before final metadata/content edits so implementation follows evidence rather than assumptions.

## Principles

- One dominant search intent per indexable route.
- Homepage carries brand + broad streetwear + local-store context.
- Category pages prioritize category-shopping intent; local modifiers are secondary unless SERP evidence supports local-first targeting.
- Product pages use product-specific factual attributes only.
- About, FAQ and Contact serve trust/navigation/support intent rather than acting as artificial keyword landing pages.
- Filter/query states must not become competing indexable landing pages by accident.

## Working route map

| Route family       | Primary intent                            | Supporting semantic topics                                                    | Local modifier policy                                    | Indexation                                                  |
| ------------------ | ----------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| `/`                | Brand + broad commercial discovery        | LBB, streetwear, imported selected items, category discovery, size guidance   | Strong: Karaj/store context belongs here                 | Index                                                       |
| `/tshirts`         | Buy/browse T-shirts                       | oversized/box/long-sleeve where actually represented, size, fit, price, stock | Secondary, not forced into title until evidence supports | Index                                                       |
| `/hoodies`         | Buy/browse hoodies                        | hoodie variants, size, fit, price, stock                                      | Secondary                                                | Index                                                       |
| `/pants`           | Buy/browse pants                          | baggy/cargo where actually represented, size, fit, price, stock               | Secondary                                                | Index                                                       |
| `/shoes`           | Buy/browse sneakers/shoes                 | size, color, price, stock, model facts                                        | Secondary                                                | Index                                                       |
| `/socks`           | Buy/browse socks                          | size, color, price, stock, model facts                                        | Secondary                                                | Index while real inventory exists                           |
| `/about`           | Brand trust / story                       | LBB story, positioning, physical + online presence                            | Natural factual mention only                             | Index                                                       |
| `/contact`         | Navigation / local store / support        | Karaj, store location, phone, WhatsApp, Instagram, shipping/support channels  | Strong                                                   | Index                                                       |
| `/faq`             | Customer support / pre-purchase questions | sizing, product facts, shipping/returns only where verified                   | Natural only                                             | Index                                                       |
| Product detail     | Specific product purchase/research        | real product name, category, size, color, fit/material if verified            | Avoid templated local stuffing                           | Index if real public product                                |
| Filter/query state | Narrow browsing                           | selected filters                                                              | None                                                     | Noindex/canonical to clean category as currently contracted |

## Open research questions before final metadata

1. Should `کرج` remain in category title tags, or move primarily to homepage/contact/local-store surfaces?
2. Which user wording is stronger in current Persian SERPs: `استریت ویر`, `استریت‌ویر`, or `پوشاک خیابانی`?
3. Which category modifiers deserve dedicated semantic coverage without creating unsupported empty subcategory routes: `اورسایز`, `بگی`, `کارگو`, etc.?
4. Are current FAQ blocks useful decision-support content, or are some too repetitive across categories?
5. Which internal links can connect homepage → category → relevant support content naturally without optimized-anchor repetition?

No final keyword-volume claim is made in this document.
