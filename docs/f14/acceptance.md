# F14 Acceptance Matrix

## Shop

- Base route renders eight catalogue pieces.
- Inventory summary distinguishes total, available and unavailable pieces.
- Category tabs use real routes.
- Filters serialize deterministically.
- Invalid or reordered query values canonicalize without losing meaning.
- Active filters render removable chips.
- Empty result state can restore the complete catalogue.

## Category

- Invalid category slugs render the designed not-found state.
- Category image, H1, description and inventory summary remain visible before the Grid.
- Category is locked and cannot leak into query filters.
- Filtered category URLs remain `noindex` with a clean canonical.
- Category guide and FAQ remain below the result workspace.

## Search

- Search query is normalized and stored in URL.
- Live typing uses History replacement rather than one entry per character.
- Explicit navigation from recent searches remains history-backed.
- Text match count is separated from filtered result count.
- Empty text match and filter-empty states have different recovery actions.
- Search route remains `noindex`.

## Mobile Filter Drawer

- Opens as a modal dialog.
- Focus is trapped while open.
- Escape or close button cancels the Draft.
- Trigger receives focus after close.
- Draft result count updates before apply.
- Apply writes one new URL state.
- Reset only changes the Draft until apply.

## Accessibility

- One H1 per route.
- Result counts use polite live regions.
- Color and size controls expose names, counts and pressed state.
- Unavailable Facets are disabled.
- Touch targets remain at least 44px.
- No serious or critical Axe violations.

## Responsive

Required widths:

- 390px
- 768px
- 1440px
- 1920px

At every width, `/shop`, `/hoodies` and `/search?q=هودی` must avoid horizontal overflow.

## Quality Gates

- Prettier
- ESLint
- Production build
- TypeScript
- Production dependency audit
- Output budget audit
- Source audit
- Cloudflare Worker smoke
- Playwright acceptance
- Linux/Chromium visual regression
