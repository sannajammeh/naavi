# Changelog

## [0.3.1](https://github.com/sannajammeh/naavi/compare/v0.2.2...v0.3.1) (2026-02-20)

### Features

* **component:** Add Close button ([98c32df](https://github.com/sannajammeh/naavi/commit/98c32df671c5d34c854c8ce6dda5c28b7d78d872))

## [0.2.2](https://github.com/sannajammeh/naavi/compare/v0.2.1...v0.2.2) (2026-02-09)

### Bug Fixes

* **keyboard:** restore roving tabindex on Escape/Tab from menubar ([0f84d57](https://github.com/sannajammeh/naavi/commit/0f84d57c453e3bd08f2317bb303eb00ee357de27))

## [0.2.1](https://github.com/sannajammeh/naavi/compare/v0.2.0...v0.2.1) (2026-02-09)

### Bug Fixes

* **attrs:** replace data-navi with data-naavi ([615bbbb](https://github.com/sannajammeh/naavi/commit/615bbbb3f8672073e2eb21a8655420efd677b437))
* bundle size ([0a894cf](https://github.com/sannajammeh/naavi/commit/0a894cf18fad866a321b33c44a77b7b07731c54c))
* kb ([f59c15b](https://github.com/sannajammeh/naavi/commit/f59c15b440b4f878d6052af57a3327db803a3a08))

## [0.2.0](https://github.com/sannajammeh/naavi/compare/v0.1.1...v0.2.0) (2026-02-09)

### Features

* cascading settings context for per-depth openOnHover overrides ([f2239cd](https://github.com/sannajammeh/naavi/commit/f2239cd38267c3b8a4063812e9f1b6b4e8bef6a4))

### Documentation

* add compass SVG favicon and logo with light/dark support ([dc3059c](https://github.com/sannajammeh/naavi/commit/dc3059c14e00013f1c77618d01b0af92e2d50e72))
* show all import styles in basic example ([c3680f9](https://github.com/sannajammeh/naavi/commit/c3680f967841c05d582494e26f53f1a1f1ae59d2))
* simplify install cmd — inline pm select with copy icon ([0ded0ae](https://github.com/sannajammeh/naavi/commit/0ded0ae1faf338f8e3febd1abab1c9bba41dc838))
* use NavigationMenu namespace import in all examples ([c1a2102](https://github.com/sannajammeh/naavi/commit/c1a21022d08d6cf4d3a944cdccd68b89abf7440d))

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
- Data attribute styling API (`data-naavi-trigger`, `data-naavi-content`, `data-state`)
- Controlled & uncontrolled open state (`value` / `defaultValue` + `onValueChange`)

### Bug Fixes

- Fix submenu close behavior when hovering between items
- Fix hover close issue with nested menus
