## Context

The current `original.tsx` implementation has structural problems: wrong ARIA semantics, heavy DOM manipulation via Mantine hooks, duplicated context providers for nested menus, and incomplete keyboard support. A working WAI-ARIA reference implementation exists in `wai-aria-spec/` (vanilla JS) running at `localhost:3001`. The goal is a clean React reimplementation that produces identical behavior.

Constraints carried from exploration:
- Elements SHALL NOT be removed from the DOM (SEO requirement)
- Same data attributes as original (`data-navi-trigger`, `data-navi-content`, etc.)
- Consumer CSS controls visibility via `data-state="open|closed"`
- Peer dependency on `@base-ui/react` for `useRender` / `mergeProps`
- Zero other runtime dependencies beyond React

## Goals / Non-Goals

**Goals:**
- 1:1 WAI-ARIA Menubar Navigation pattern compliance
- Headless, unstyled component primitive
- Recursive composition — same components work at any nesting depth
- Full keyboard navigation matching the W3C spec
- React-first state management (openPath array, context-driven)
- Roving tabindex managed imperatively for performance
- Open-on-hover with armed state machine

**Non-Goals:**
- Animation/transition system — consumer responsibility
- `aria-current="page"` management — consumer passes prop to Link
- Responsive/mobile behavior — out of scope for this change
- SSR hydration edge cases — standard React SSR behavior is sufficient
- Radix-style "force mount" prop — elements are always in DOM by design

## Decisions

### 1. State Model: openPath array

**Decision**: Use `openPath: string[]` to represent the hierarchy of open menus.

`openPath = ["about", "facts"]` means the About menu is open and the Facts submenu within it is open. Opening an item at depth N slices the array to N and appends the new value, automatically closing deeper submenus.

**Alternatives considered**:
- `URLSearchParams` — Explored in discovery. Natural key-value API but overkill since you can never have parallel open branches. Array is simpler.
- Single `value: string | null` per context level (original approach) — Requires duplicated context providers at each nesting depth. Fragile, hard to coordinate cross-level operations like "close everything."
- `Map<depth, value>` — Equivalent to array but with more ceremony.

### 2. Drop Sub Component

**Decision**: Remove `Sub` entirely. `Item` + `Trigger` + `Content` works recursively at any depth.

`Sub` in the original creates a new `NaviContext.Provider` with independent state. With the array path model, depth is tracked via `DepthContext` that increments at each `Content` boundary. No need for a separate component.

**Alternatives considered**:
- Keep `Sub` as alias for `Item` — Adds API surface without value.
- Keep `Sub` with different semantics — No meaningful difference in the new model.

### 3. Three Contexts

**Decision**: Three React contexts with distinct responsibilities.

| Context | Scope | Contents |
|---------|-------|----------|
| `RootContext` | Single, at `<Root>` | `openPath`, `setOpenPath`, `openOnHover`, `armed`, `hideDelay`, `hideTimeout`, `closeOnClick`, `navRef`, `viewport`, `setViewport` |
| `DepthContext` | Increments at each `<Content>` | `depth: number`, `parentValue: string \| null` |
| `ItemContext` | Per `<Item>` with value | `value: string`, `depth: number` |

**Alternatives considered**:
- Single context with everything — Too many re-renders, items re-render on unrelated state changes.
- Two contexts (merge Depth into Item) — Depth needs to be available to components that aren't direct children of Item (e.g., Link inside Content).

### 4. Single Keyboard Handler on Root

**Decision**: One `onKeyDown` handler on the `<nav>` element. It reads DOM structure (target's containing menu, siblings) to determine context, then dispatches state changes through React (`openPath`).

The DOM reads are read-only (finding siblings, determining if menubar vs submenu). All mutations flow through React state. This mirrors the WAI-ARIA reference implementation's architecture.

**Alternatives considered**:
- Distributed handlers (each Content/List has its own) — Harder to coordinate cross-menu navigation (ArrowRight on leaf → close all → next menubar item → open its menu).
- Hybrid (menubar keys on List, submenu keys on Content) — Split responsibility makes the complex cross-menu cases harder.

### 5. Imperative Roving Tabindex

**Decision**: Manage `tabIndex` imperatively via DOM. Only one `[role="menuitem"]` has `tabIndex=0` at any time; all others have `-1`. Managed by `focus.ts` utilities.

React state for tabIndex across potentially dozens of menuitems would cause re-renders on every focus change. Roving tabindex is inherently an imperative pattern. This is the single exception to "prefer React over DOM manipulation."

**Alternatives considered**:
- React state (`activeItemId` in context, each item derives tabIndex) — Causes cascade re-renders on every arrow key press. Unacceptable for a performance-sensitive interaction.

### 6. Element Polymorphism via useRender

**Decision**: Use `useRender` + `mergeProps` from `@base-ui/react` instead of `asChild`/`Slot`.

Each component accepts an optional `render` prop to override the default element. E.g., `<Trigger render={<button />}>` overrides the default `<a>`.

**Alternatives considered**:
- `asChild` + `Slot` (Radix pattern, used in original) — Requires custom Slot implementation. `useRender` is maintained by the MUI/Base UI team and handles ref merging, prop merging correctly.
- `as` prop — Type-unsafe, doesn't compose well.

### 7. Content Always in DOM

**Decision**: `Content` (`<ul role="menu">`) is always rendered in the DOM. `data-state="open|closed"` attribute lets consumer CSS control visibility.

This satisfies the SEO requirement and matches the WAI-ARIA reference implementation where all submenus exist in markup.

### 8. File Organization: Grouped by Concern

**Decision**: Group files by concern rather than one-per-component or single-file.

```
src/
  index.ts          # Barrel exports
  types.ts          # All interfaces/types
  constants.ts      # Data attributes, selectors
  context.ts        # RootContext, DepthContext, ItemContext + hooks
  components.tsx    # All components
  keyboard.ts       # useMenuKeyboard hook
  focus.ts          # Roving tabindex + DOM focus helpers
```

## Risks / Trade-offs

- **[DOM queries in keyboard handler]** → Read-only queries are minimal and scoped to the nav element. No external DOM is touched. Acceptable trade-off for a clean single-handler architecture.
- **[Imperative tabIndex]** → Can desync from React's virtual DOM if components re-render unexpectedly. Mitigated by re-applying tabIndex in a useEffect whenever openPath changes.
- **[Peer dep on @base-ui/react]** → Consumer must install it. Mitigated by the fact that it's a lightweight, well-maintained library from the MUI team. Only `useRender` and `mergeProps` are used.
- **[Breaking API changes]** → This is a v0.0.1 library so no external consumers yet. No migration needed.
- **[Viewport breaking semantic structure]** → When Content is portaled into Viewport, the `<ul role="menu">` is no longer a sibling of its trigger `<a>`. Mitigated by `aria-controls` + `id` linking. Documented as an opt-in trade-off.
