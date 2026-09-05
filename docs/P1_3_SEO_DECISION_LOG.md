# P1.3 — SEO Decision Log

## D1 — GitHub-first completion

Decision: complete research, implementation, tests and frontend freeze evidence in GitHub before the next production activation.

Reason: keeps the server as a deployment target rather than an editing environment, preserves immutable release/rollback discipline, and prevents partially researched SEO changes from leaking directly to production.

## D2 — Evidence before final metadata

Decision: current P1.2 metadata is a safe baseline, not automatically the final keyword strategy.

Reason: P1.2 focused on truthful content and technical safety; P1.3 owns the dedicated intent/semantic reconciliation.

## D3 — Local vs category intent

Decision: do not assume `کرج` belongs in every category title. Homepage/contact/store-location surfaces can carry strong local intent; category titles will be finalized only after route-level evidence review.
