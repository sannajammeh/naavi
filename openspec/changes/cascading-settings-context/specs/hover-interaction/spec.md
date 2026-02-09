## MODIFIED Requirements

### Requirement: openOnHover prop override
The effective `openOnHover` value for each Trigger SHALL be resolved from the cascading settings context rather than directly from Root. Root SHALL accept an `openOnHover` prop that feeds the initial `SettingsContext`. Content SHALL accept an `openOnHover` prop that overrides the inherited value for its subtree. Trigger SHALL accept an `openOnHover` prop that overrides the nearest context value for that trigger only. When the effective value is `true`, the trigger SHALL always respond to hover. When `false`, hover SHALL never open menus for that trigger. When `undefined`, the armed state machine SHALL apply.

#### Scenario: openOnHover true at root level
- **WHEN** `openOnHover={true}` is set on Root and no overrides exist
- **THEN** hovering over any trigger SHALL open its submenu regardless of armed state

#### Scenario: openOnHover false at root level
- **WHEN** `openOnHover={false}` is set on Root and no overrides exist
- **THEN** hovering over triggers SHALL never open submenus

#### Scenario: Root hover true with Content override false
- **WHEN** `openOnHover={true}` on Root and `openOnHover={false}` on a Content
- **THEN** triggers inside that Content SHALL NOT open on hover; triggers outside that Content SHALL open on hover

#### Scenario: Trigger overrides Content setting
- **WHEN** Content has `openOnHover={false}` and a Trigger within it has `openOnHover={true}`
- **THEN** that specific Trigger SHALL open on hover; sibling triggers in the same Content SHALL NOT

#### Scenario: Armed state machine with no overrides
- **WHEN** no `openOnHover` is set on Root, Content, or Trigger
- **THEN** the armed state machine SHALL apply (hover opens only when armed)

### Requirement: Hover opens submenus within open menus
When a submenu is open and the mouse hovers over a menuitem with a nested submenu, that nested submenu SHALL open — but only if the effective `openOnHover` for that trigger is `true` or `undefined` (armed state applies). When the effective `openOnHover` is `false`, hover SHALL NOT open the nested submenu even when a parent menu is open.

#### Scenario: Hover in open submenu opens nested menu (default)
- **WHEN** About submenu is open, no openOnHover overrides, and user hovers over "Facts" (has nested submenu)
- **THEN** Facts submenu SHALL open

#### Scenario: Hover in open submenu blocked by openOnHover false
- **WHEN** About submenu is open, About's Content has `openOnHover={false}`, and user hovers "Facts" trigger
- **THEN** Facts submenu SHALL NOT open on hover; click SHALL still open it

## ADDED Requirements

### Requirement: openOnHover removed from RootContextValue
The `openOnHover` field SHALL be removed from `RootContextValue`. Components SHALL read `openOnHover` from the `SettingsContext` instead of the root context. The `armed` state and `setArmed` SHALL remain on `RootContextValue` as they are global to the navigation tree.

#### Scenario: Trigger reads from SettingsContext
- **WHEN** a Trigger resolves its effective `openOnHover`
- **THEN** it SHALL read from `useSettings()` (with local prop override), NOT from `useRoot().openOnHover`
