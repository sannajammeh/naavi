## 1. Implementation

- [x] 1.1 Add `import * as NavigationMenu from "./components.tsx"` to `src/index.ts`
- [x] 1.2 Add `export { NavigationMenu }` to `src/index.ts` (alongside existing named exports)

## 2. Verification

- [x] 2.1 Run `bunx tsc --noEmit` to verify type-checking passes
- [x] 2.2 Add test confirming `NavigationMenu` namespace contains all expected components
- [x] 2.3 Add test confirming `NavigationMenu.Root === Root` (reference equality)
- [x] 2.4 Run `bun run build` to verify bunchee builds successfully with new export
