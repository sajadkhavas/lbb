# F14-BE — LBB Backend Migration & Apparel Customization

Status: `blocked_on_repository_creation`

## Safety boundary

- `sajadkhavas/cooci` is read-only reference material.
- `sajadkhavas/winimi-bakery-backend` is read-only reference material.
- No commits, branches, pull requests, database changes, or deployment changes are permitted on either Cooci repository during this phase.
- The implementation target must be a separate repository: `sajadkhavas/lbb-backend`.

## Execution order

1. F14-BE-A — create independent LBB backend repository and import the audited baseline.
2. F14-BE-B — remove Winimi, Bakery, cooling delivery, bakery catalog fields, demo data, and ToolMaster legacy surfaces.
3. F14-BE-C — implement apparel catalog models: categories, collections/drops, colors, sizes, size guides, products, variants, media, and inventory adjustments.
4. F14-BE-D — build the LBB Filament admin experience and publication-readiness workflow.
5. F14-BE-E — adapt checkout, reservation, orders, payments, delivery, wishlist, returns, exchanges, and notifications.
6. F14-BE-F — freeze the LBB API/OpenAPI contract for frontend integration.
7. F14-BE-G — run migrations, automated tests, security checks, concurrency tests, and final backend acceptance.

## Current environment blocker

The connected GitHub actions can create branches, commits, files, and pull requests inside an existing repository, but do not expose repository creation. The local GitHub CLI is also not installed in the execution environment. Therefore the independent target repository cannot be created automatically from this environment yet.

No backend source has been copied into the frontend repository. This status file only records the phase boundary and prevents accidental work against the Cooci repositories.
