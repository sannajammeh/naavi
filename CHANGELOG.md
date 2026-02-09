# Changelog

## 0.1.0 (2026-02-09)

Initial release.

### Features

- WAI-ARIA compliant menubar with full keyboard navigation
- Nested submenus with hover state machine
- Polymorphic rendering via `@base-ui/react` (`render` prop)
- Components: `Root`, `List`, `Item`, `Trigger`, `Content`, `Link`, `Separator`, `Viewport`, `Portal`
- `NavigationMenu` namespace export for convenient dot-notation usage
- Data attribute styling API (`data-navi-trigger`, `data-navi-content`, `data-state`)
- Controlled & uncontrolled open state (`value` / `defaultValue` + `onValueChange`)

### Bug Fixes

- Fix submenu close behavior when hovering between items
- Fix hover close issue with nested menus
