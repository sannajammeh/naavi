## ADDED Requirements

### Requirement: Close component renders as leaf menuitem
The `Close` component SHALL render a `<button>` element with `role="menuitem"`, `tabIndex={-1}`, and `data-naavi-close` attribute. It SHALL be placed inside an `<Item>` component (same pattern as `Link`). It SHALL support the `render` prop for polymorphic rendering via `useRender`.

#### Scenario: Default rendering
- **WHEN** `<Item><Close>Dismiss</Close></Item>` is rendered inside a Content
- **THEN** the output SHALL be a `<button>` with `role="menuitem"`, `tabindex="-1"`, `data-naavi-close`, and text "Dismiss"

#### Scenario: Custom render
- **WHEN** `<Close render={<span />}>Dismiss</Close>` is rendered
- **THEN** the output SHALL use `<span>` instead of `<button>` but retain all ARIA attributes

### Requirement: Close target="root" closes all menus
When `target` is `"root"` (the default), clicking Close SHALL close all open menus and disarm the armed state.

#### Scenario: Click Close with target="root"
- **WHEN** a submenu is open and user clicks `<Close target="root" />`
- **THEN** `openPath` SHALL become `[]` and armed state SHALL be `false`

#### Scenario: Default target is root
- **WHEN** a submenu is open and user clicks `<Close />` (no target prop)
- **THEN** `openPath` SHALL become `[]` and armed state SHALL be `false`

### Requirement: Close target="current" closes containing menu only
When `target` is `"current"`, clicking Close SHALL close only the menu containing the Close button, preserving parent menus.

#### Scenario: Click Close with target="current" in nested submenu
- **WHEN** openPath is `["about", "facts"]` and user clicks `<Close target="current" />` inside the "facts" submenu (depth 2)
- **THEN** `openPath` SHALL become `["about"]` — the "facts" submenu closes but "about" stays open

#### Scenario: Click Close with target="current" in top-level menu
- **WHEN** openPath is `["about"]` and user clicks `<Close target="current" />` inside the "about" menu (depth 1)
- **THEN** `openPath` SHALL become `[]` — equivalent to root close at this depth

### Requirement: Focus management after target="root" close
When Close with `target="root"` is activated, focus SHALL move to the menubar trigger that opened the menu chain. This mirrors Escape key behavior.

#### Scenario: Focus returns to menubar trigger after root close
- **WHEN** user clicks `<Close target="root" />` while openPath is `["about", "facts"]`
- **THEN** all menus SHALL close and focus SHALL move to the "about" trigger in the menubar

### Requirement: No focus management after target="current" close
When Close with `target="current"` is activated, the component SHALL NOT perform explicit focus management. This mirrors Link click behavior.

#### Scenario: No focus change after current close
- **WHEN** user clicks `<Close target="current" />` in a nested submenu
- **THEN** the submenu SHALL close and focus SHALL NOT be explicitly moved by the component

### Requirement: Close has no hover behavior
The Close component SHALL NOT have `onMouseEnter` or `onMouseLeave` handlers. It is activated only by click or keyboard (Enter/Space).

#### Scenario: Hovering over Close does nothing
- **WHEN** user hovers over a Close button
- **THEN** no menus SHALL open or close, and no timers SHALL be started or cancelled
