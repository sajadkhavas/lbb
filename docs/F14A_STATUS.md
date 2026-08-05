# F14A — Implementation Status

## Implemented

- Verified brand location: Karaj, Mahestan Passage
- Persian-first brand and commerce language constitution
- Central brand and SEO copy module
- Karaj-based homepage metadata and store schema
- Updated hero, announcement bar, trust strip, ticker, brand statement and footer
- Updated About, Contact and Size Guide routes
- Automated audit preventing Tehran from returning as the brand location
- Tehran retained only as a legitimate delivery province in Checkout
- Removal of unsupported sizing, return and international-standard claims
- Removal of outdated Tehran identity from legacy and design-system files

## Validation

- Diagnostic checkout confirmed the exact F14A branch revision.
- Playwright currently discovers 119 tests across 11 files.
- No stale `home.spec.ts`, old Tehran hero contract or obsolete hero claim exists in the branch.
- The pull request remains in draft until the fresh full quality run passes.
