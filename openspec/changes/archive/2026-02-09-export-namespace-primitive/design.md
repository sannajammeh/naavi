## Context

The library currently exports individual named components (`Root`, `List`, `Item`, `Trigger`, `Content`, `Link`, `Separator`, `Viewport`, `Portal`) and their type definitions from `src/index.ts`. Consumers use `import { Root, Trigger } from "naavi"`. Many React component libraries (Radix, Ark UI, shadcn patterns) also offer a namespace object pattern: `NavigationMenu.Root`, `NavigationMenu.Trigger`, etc.

## Goals / Non-Goals

**Goals:**
- Export a `NavigationMenu` namespace object containing all components
- Preserve existing named exports (fully backwards-compatible)
- Ensure tree-shaking still works for bundlers that support it

**Non-Goals:**
- Changing the component implementations
- Adding new components
- Modifying type exports (types remain named exports only)
- Creating a default export

## Decisions

### 1. Namespace via `import * as` re-export

Use `import * as NavigationMenu from "./components.tsx"` and re-export it. This leverages ES module namespace objects directly.

**Alternatives considered:**
- Manual object literal (`const NavigationMenu = { Root, List, ... }`): Requires maintaining a parallel list, easy to forget new components. The `import *` approach automatically includes everything exported from components.tsx.
- Barrel re-export with `export * as NavigationMenu`: Equivalent and more concise. However, `import * as` + named export is more explicit about what's happening and avoids potential tooling issues with `export * as` syntax support.

**Decision**: Use `import * as NavigationMenu from "./components.tsx"` then `export { NavigationMenu }`.

### 2. Keep types as separate named exports

Types cannot be properties of a runtime namespace object. They stay as `export type { ... }` in the barrel file.

## Risks / Trade-offs

- [Tree-shaking] → The namespace object itself is a single binding. Bundlers that don't support deep tree-shaking through namespace objects may include all components. Mitigation: modern bundlers (esbuild, Rollup, webpack 5) handle this correctly. Consumers who care about bundle size can continue using named imports.
- [Naming collision] → If a consumer has another `NavigationMenu` in scope. Mitigation: standard JS aliasing (`import { NavigationMenu as NavMenu }`). Not a real concern.
