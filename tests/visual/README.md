# Visual regression infrastructure

The Playwright visual project is configured now, but baseline images are intentionally not committed in F8-A.

During Final Review, after all feature branches are merged:

1. remove the suite-level `test.skip` from `home.visual.spec.ts`;
2. replace or extend the route list with the final integrated pages;
3. run `npm run test:visual -- --update-snapshots` on the approved Chromium version;
4. inspect every generated desktop and mobile image before committing it;
5. run `npm run test:visual` again without `--update-snapshots`.

Never update snapshots only to make CI green. A changed baseline must correspond to an approved visual change.
