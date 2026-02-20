## Why

No dedicated close button component exists. Closing menus currently requires clicking outside, pressing Escape, or navigating via Link. Users need an explicit close affordance — a button whose sole purpose is closing a menu, without navigating.

## What Changes

- Add `<Close />` component — a leaf menuitem (rendered inside `<Item>`) that closes menus on click
- `target` prop: `"root"` (default) closes all menus, `"current"` closes only the containing menu
- `target="root"` mirrors Escape behavior (focus returns to menubar trigger)
- `target="current"` mirrors Link click behavior (no explicit focus management)
- Add `CLOSE_ATTR` / `CLOSE_SELECTOR` constants
- Update keyboard handler to activate Close on Enter/Space (leaf menuitem branch)
- Export `Close` component and `CloseProps` type from barrel

## Capabilities

### New Capabilities
- `close-button`: Dedicated close button component with configurable close scope (`target="root" | "current"`)

### Modified Capabilities
- `keyboard-navigation`: Enter/Space on a Close menuitem must trigger its click handler (leaf activation branch needs to recognize `CLOSE_ATTR`)
- `namespace-export`: Add `Close` and `CloseProps` to public API exports

## Impact

- `src/components.tsx` — new `Close` component
- `src/types.ts` — new `CloseProps` interface
- `src/constants.ts` — new `CLOSE_ATTR`, `CLOSE_SELECTOR`
- `src/keyboard.ts` — update leaf activation branch in Enter/Space handler
- `src/index.ts` — add exports
- `src/components.spec.tsx` — new tests
