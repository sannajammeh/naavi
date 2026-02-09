## Why

Consumers currently import individual named exports (`Root`, `List`, `Item`, etc.). Many component libraries also expose a namespace object (`NavigationMenu.Root`, `NavigationMenu.Trigger`, etc.) which provides better discoverability, autocomplete, and a clear visual grouping at usage sites. We should offer both patterns.

## What Changes

- Add a `NavigationMenu` namespace export that re-exports all components as properties (e.g., `NavigationMenu.Root`, `NavigationMenu.Item`)
- Keep existing named exports intact — this is purely additive, not **BREAKING**
- The namespace object is created via `import * as NavigationMenu from "./components.tsx"` and re-exported

## Capabilities

### New Capabilities
- `namespace-export`: Defines the `NavigationMenu` namespace object export, its contents, and the public API contract for consumers using the namespace pattern

### Modified Capabilities
<!-- No existing spec-level requirements are changing. Named exports remain as-is. -->

## Impact

- **Code**: `src/index.ts` — add namespace re-export alongside existing named exports
- **APIs**: New public export `NavigationMenu` (additive, non-breaking)
- **Dependencies**: None
- **Consumers**: Can optionally switch to `import { NavigationMenu } from "naavi"` and use `NavigationMenu.Root`, etc.
