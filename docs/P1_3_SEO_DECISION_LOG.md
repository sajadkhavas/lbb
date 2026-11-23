# P1.3 — SEO Decision Log

## D1 — GitHub-first completion

Decision: complete research, implementation, tests and frontend freeze evidence in GitHub before the next production activation.

Reason: keeps the server as a deployment target rather than an editing environment, preserves immutable release/rollback discipline, and prevents partially researched SEO changes from leaking directly to production.

## D2 — Evidence before final metadata

Decision: current P1.2 metadata is a safe baseline, not automatically the final keyword strategy.

Reason: P1.2 focused on truthful content and technical safety; P1.3 owns the dedicated intent/semantic reconciliation.

## D3 — Local vs category intent

Decision: do not assume `کرج` belongs in every category title. Homepage/contact/store-location surfaces carry strong local intent; category titles follow transactional product-family intent unless evidence later justifies a dedicated local landing page.

## D4 — Category intent is transactional, not templated-local

Decision: current public product categories target buying/browsing the product family. `کرج` is not appended mechanically to every category title.

Reason: representative live SERP composition supports ecommerce category/product intent for these query families, while local-store intent is stronger on Home/Contact/store surfaces.

## D5 — Do not force unsupported gender modifiers

Decision: do not template `مردانه` into category metadata until the catalog has an authoritative gender/audience field or production evidence explicitly justifies a dedicated landing strategy.

Reason: business audience demographics are not the same thing as a per-product gender data contract.

## D6 — Retired search-feature markup is not a content requirement

Decision: remove legacy `meta keywords`, homepage `SearchAction`, FAQPage and HowTo search-feature markup where it no longer provides a current Google Search feature benefit, while keeping useful visible FAQ and sizing content.

Reason: useful content remains valuable independently of retired or unsupported rich-result/search-box features.

## D7 — Filter/search states remain discovery states, not accidental landing pages

Decision: preserve `noindex` for filtered/search states and canonicalize to clean indexable routes unless a future SEO landing page is deliberately created with distinct demand/content.

Reason: avoids duplicate/thin competing URLs while preserving user discovery.

## D8 — Visual baseline changes require review, not blind snapshot updates

Decision: the P1.3 category snapshot was updated only after reviewing the actual/diff output and confirming the 64px height change came from the intentional Size Guide link/content delta.

Reason: snapshot acceptance must validate intended UI change rather than hide a regression.
