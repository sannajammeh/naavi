# Changelog

## 0.1.1 (2026-02-09)

### Bug Fixes

* fix submenu close bug ([eeb67ab](https://github.com/sannajammeh/naavi/commit/eeb67ab2703a708f9e095b5fe9f40ec002ce43d1))
* hover close issue ([a54a259](https://github.com/sannajammeh/naavi/commit/a54a259f73c38cc9ccec81fea814b022c3dccc13))

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
