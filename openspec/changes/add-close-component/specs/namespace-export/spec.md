## MODIFIED Requirements

### Requirement: NavigationMenu namespace export
The library SHALL export a `NavigationMenu` object from the package entry point that contains all component exports from `components.tsx` as properties.

#### Scenario: Import namespace and use components
- **WHEN** a consumer writes `import { NavigationMenu } from "naavi"`
- **THEN** `NavigationMenu.Root`, `NavigationMenu.List`, `NavigationMenu.Item`, `NavigationMenu.Trigger`, `NavigationMenu.Content`, `NavigationMenu.Link`, `NavigationMenu.Close`, `NavigationMenu.Separator`, `NavigationMenu.Viewport`, and `NavigationMenu.Portal` SHALL all be valid React components

#### Scenario: Namespace components are identical to named exports
- **WHEN** a consumer imports both `import { Close } from "naavi"` and `import { NavigationMenu } from "naavi"`
- **THEN** `Close` and `NavigationMenu.Close` SHALL be the same reference (strict equality)

### Requirement: Named exports preserved
The library SHALL export all named component exports (`Root`, `List`, `Item`, `Trigger`, `Content`, `Link`, `Close`, `Separator`, `Viewport`, `Portal`) and their corresponding type exports.

#### Scenario: Existing named imports still work
- **WHEN** a consumer writes `import { Root, List, Item, Trigger, Content, Link, Close, Separator, Viewport, Portal } from "naavi"`
- **THEN** all imports SHALL resolve to valid components

### Requirement: Type exports unchanged
The library SHALL continue to export all existing type exports as named type exports, including the new `CloseProps` type. Types SHALL NOT be included in the `NavigationMenu` namespace object (they are compile-time only).

#### Scenario: Type imports still work
- **WHEN** a consumer writes `import type { CloseProps } from "naavi"`
- **THEN** the type import SHALL resolve correctly
