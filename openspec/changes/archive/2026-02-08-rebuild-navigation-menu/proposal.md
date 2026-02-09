## Why

The current Navi implementation in `original.tsx` is brittle, bug-riddled, and relies heavily on direct DOM manipulation rather than React state. It uses external dependencies (`@mantine/hooks`), has incorrect ARIA semantics (buttons instead of links for triggers, divs instead of ul for menus), and its nested `Sub` component pattern creates duplicated context providers. The implementation needs to be rebuilt from scratch as a headless, unstyled primitive that is 1:1 compliant with the WAI-ARIA Menubar Navigation pattern.

## What Changes

- **BREAKING** Replace all existing components (`Root`, `List`, `Item`, `Trigger`, `Content`, `Link`, `Sub`, `Back`, `Viewport`, `Portal`, `Separator`) with new implementations
- **BREAKING** Remove `asChild`/`Slot` pattern in favor of `render` prop via `useRender` from `@base-ui/react`
- **BREAKING** Remove `Sub` component — `Item` + `Trigger` + `Content` now works recursively at any depth
- **BREAKING** Change state model from single `value: string | null` to `openPath: string[]` representing the full hierarchy of open menus
- **BREAKING** `Content` renders as `<ul role="menu">` instead of `<div>`
- **BREAKING** `Trigger` renders as `<a>` by default instead of `<button>`
- All elements stay in the DOM at all times; visibility controlled by consumer CSS via `data-state` attribute
- Full WAI-ARIA keyboard support: roving tabindex, character search, cross-menu navigation
- Hover open/close with configurable delay and armed state
- Click-outside-to-close behavior
- Peer dependency on `@base-ui/react` (for `useRender` and `mergeProps`)
- Remove dependency on `@mantine/hooks`

## Capabilities

### New Capabilities

- `menubar-structure`: Component composition API (Root, List, Item, Trigger, Content, Link, Separator) producing WAI-ARIA compliant DOM structure
- `keyboard-navigation`: Full WAI-ARIA menubar keyboard interaction — arrow keys, Enter/Space, Escape, Home/End, Tab, character search across menubar and nested submenus
- `focus-management`: Roving tabindex across the entire menubar tree, imperative focus control
- `hover-interaction`: Open-on-hover with armed state machine, configurable delay, mouse leave grace period
- `portal-viewport`: Optional Viewport and Portal components for repositioning Content in the DOM

### Modified Capabilities

## Impact

- **Code**: Complete rewrite of `src/` — new files: `constants.ts`, `context.ts`, `components.tsx`, `keyboard.ts`, `focus.ts`; existing `types.ts` and `index.ts` rewritten
- **APIs**: All component props change; consumers must update usage
- **Dependencies**: Add `@base-ui/react` as peer dependency; remove `@mantine/hooks`, remove internal `useControllableState`, `useListFocusController`, `Slot` dependencies
- **Playground**: `App.tsx` must be rewritten to use new component API with full Mythical University example
- **CSS**: Consumer CSS must target `data-state="open|closed"` on `<ul role="menu">` elements instead of div-based content
