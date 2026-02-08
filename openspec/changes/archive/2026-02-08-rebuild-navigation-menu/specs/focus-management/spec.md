## ADDED Requirements

### Requirement: Roving tabindex
The menubar SHALL implement roving tabindex. Only one `[role="menuitem"]` across the entire navigation tree SHALL have `tabindex="0"` at any time. All other menuitems SHALL have `tabindex="-1"`.

#### Scenario: Initial tabindex
- **WHEN** the navigation menu is first rendered
- **THEN** the first menuitem in the menubar SHALL have `tabindex="0"` and all others SHALL have `tabindex="-1"`

#### Scenario: Focus moves to new item
- **WHEN** keyboard navigation moves focus to a different menuitem
- **THEN** the newly focused item SHALL have `tabindex="0"` and the previously focused item SHALL have `tabindex="-1"`

### Requirement: Imperative tabindex management
Roving tabindex SHALL be managed imperatively via DOM manipulation (not React state) to avoid re-renders across all menuitems on every focus change.

#### Scenario: No re-render on focus change
- **WHEN** ArrowRight moves focus from one menubar item to another
- **THEN** only `tabindex` attributes on the two affected DOM elements SHALL change; no React re-render SHALL occur for other menuitems

### Requirement: Focus restoration on submenu close
When a submenu is closed (via Escape, ArrowLeft, or click outside), focus SHALL return to the trigger that controls that submenu.

#### Scenario: Escape returns focus to trigger
- **WHEN** focus is inside About submenu and user presses Escape
- **THEN** focus SHALL move to the "About" trigger element

#### Scenario: ArrowLeft returns focus to parent
- **WHEN** focus is in Facts submenu and user presses ArrowLeft
- **THEN** focus SHALL move to the "Facts" trigger in About submenu

### Requirement: Focus preservation on re-focus
When the menubar loses and regains focus (via Tab), the last item that had `tabindex="0"` SHALL receive focus.

#### Scenario: Tab out and Tab back
- **WHEN** focus was on "Admissions" in menubar, user Tabs out and then Tabs back
- **THEN** focus SHALL return to "Admissions"

### Requirement: Focus into submenu on open
When a submenu opens via keyboard (Enter, Space, ArrowDown), focus SHALL move to the first menuitem in that submenu (or last for ArrowUp).

#### Scenario: ArrowDown focuses first submenu item
- **WHEN** user presses ArrowDown on "About" trigger
- **THEN** About submenu opens and focus moves to "Overview" (first item)

#### Scenario: ArrowUp focuses last submenu item
- **WHEN** user presses ArrowUp on "About" trigger
- **THEN** About submenu opens and focus moves to the last item

### Requirement: focusItem utility
A `focusItem` function SHALL set `tabindex="0"` on the target element, set `tabindex="-1"` on the previously focused element within the same navigation, and call `element.focus()`.

#### Scenario: focusItem changes tabindex and focuses
- **WHEN** `focusItem` is called with an element
- **THEN** that element SHALL have `tabindex="0"`, the previous active element SHALL have `tabindex="-1"`, and `document.activeElement` SHALL be the target element

### Requirement: Menu sibling query helpers
Helper functions SHALL exist to query menuitems within a specific menu scope: `getMenuItems(menu)` returns direct menuitem children (via `menu > li > [role="menuitem"]`), `getContainingMenu(el)` finds the nearest ancestor with `role="menu"` or `role="menubar"`.

#### Scenario: getMenuItems returns direct children only
- **WHEN** `getMenuItems` is called on a `<ul role="menu">` that contains nested submenus
- **THEN** it SHALL return only the direct menuitem children, not items from nested submenus
