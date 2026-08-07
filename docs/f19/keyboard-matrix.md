# Keyboard & Focus Matrix

Status legend:

- **Gated** — automated regression must pass.
- **Debt** — executable expected-failure test exists and remediation is assigned to F19-B.
- **Existing** — already covered by a pre-F19 suite and retained as part of `test:e2e`.

| Surface                       | Keys / behavior                                                | Focus contract                                                  | Automated coverage                                          | Status                                              |
| ----------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| Desktop Navbar / Shop trigger | Tab, Shift+Tab, Enter, ArrowDown, Escape                       | ArrowDown opens Mega Menu; focus enters; close restores trigger | `f19-interactions`, `navigation-shell`                      | Gated                                               |
| Mega Menu                     | Tab, Shift+Tab, Escape                                         | focus wraps inside dialog and cannot leak to page               | `f19-interactions`, Axe overlay                             | Gated                                               |
| Mobile Menu                   | Tab, Shift+Tab, Enter, Escape                                  | initial focus enters menu; wrap; restore trigger                | `f19-interactions`, Axe overlay                             | Gated                                               |
| Search Overlay                | Tab, Shift+Tab, ArrowUp/Down, Enter, Escape                    | input receives focus; option navigation; close restores trigger | `accessibility`, `navigation-shell`, existing history tests | Gated                                               |
| Cart Drawer                   | Tab, Shift+Tab, Escape                                         | focus stays in panel; restore trigger; Back closes              | `f19-interactions`, `navigation-shell`                      | Gated                                               |
| Filter Drawer                 | Tab, Shift+Tab, Space, Escape                                  | focus stays in drawer; cancel restores opener                   | `f19-interactions`, `catalog-discovery`                     | Gated                                               |
| Quick View                    | Tab, Shift+Tab, Enter/Space, Escape                            | focus traps/restores; validation moves to available size        | `f19-interactions`, Axe overlay                             | Gated                                               |
| PDP Gallery thumbnails        | ArrowDown/Up, Home, End; ArrowLeft/Right accepted by component | roving tab stop follows active thumbnail                        | `f19-interactions`, `navigation-history`                    | Gated; RTL direction debt is separate               |
| PDP Gallery main region       | ArrowLeft/Right, Home, End                                     | keyboard changes active image without pointer                   | existing `navigation-history`; component audit              | Existing                                            |
| Size Guide dialog             | Tab/Shift+Tab, Escape                                          | Radix dialog owns focus and restores trigger                    | Axe dialog coverage + Radix contract                        | Gated by overlay smoke/Axe                          |
| Lookbook lightbox             | Enter open, ArrowLeft/Right, Escape                            | enters close button and restores opener                         | `f19-interactions`                                          | arrows/restore Gated; focus trap Debt `F19B-P1-001` |
| FAQ disclosure                | Tab, Enter, Space                                              | native summary toggles without custom key handler               | `f19-interactions`                                          | Gated                                               |
| Sort Select                   | Tab, Enter/Space, arrows per Radix Select                      | trigger remains named and keyboard operable                     | existing catalogue tests + Axe                              | Existing                                            |
| Filter checkboxes             | Tab, Space                                                     | native/Radix checkbox semantics                                 | existing catalogue tests + Axe                              | Existing                                            |
| Product size/color            | Tab, Enter/Space                                               | named pressed-state buttons; disabled unavailable sizes         | PDP/Quick View audit + Axe                                  | Gated semantically                                  |
| Quantity controls             | Tab, Enter/Space                                               | named decrement/increment controls; live output                 | source/Axe; touch size tracked separately                   | Keyboard Gated                                      |
| Browser Back overlays         | browser Back                                                   | closes history-backed search/cart/menu where contract exists    | `navigation-shell`, `catalog-discovery`                     | Existing/Gated                                      |
| Route navigation from overlay | Enter on destination                                           | no focus remains in detached overlay                            | `f19-interactions`                                          | Gated                                               |

## Focus-management assertions

F19-A explicitly tests these invariants:

1. Dialog open moves focus inside the dialog.
2. `Tab` from the final focusable element returns to the first.
3. `Shift+Tab` from the first returns to the final focusable element.
4. `Escape` closes supported dialogs without requiring pointer input.
5. Ordinary close restores focus to the opener.
6. Navigation out of an overlay does not leave `document.activeElement` disconnected.
7. Existing browser-Back overlay contracts stay in the full Playwright suite.

## Known focus debt

### F19B-P1-001 — Lookbook lightbox has no Tab trap

File: `src/routes/lookbook.tsx`

The lightbox currently:

- focuses its close button on open,
- handles ArrowLeft/ArrowRight,
- closes on Escape,
- restores opener focus,
- locks body scroll,

but it does not cycle Tab/Shift+Tab. Footer/mobile navigation controls can therefore become keyboard reachable while the modal is open. The executable expected-failure case in `tests/f19-interactions.spec.ts` characterizes the missing invariant without redesigning the route in this Wave-1 audit branch.

F19-B acceptance: use the shared focus-trap contract (or equivalent dialog primitive), keep arrows/Escape/backdrop behavior, and convert the expected-failure case into a normal passing regression.

## Form keyboard/error behavior

Checkout fields have associated labels, `required`, and valid autocomplete tokens. A separate high-impact debt remains for custom error association and first-error focus (`F19B-P1-002`); see the remediation backlog.
