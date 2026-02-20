## 1. Constants & Types

- [x] 1.1 Add `CLOSE_ATTR = "data-naavi-close"` and `CLOSE_SELECTOR` to `src/constants.ts`
- [x] 1.2 Add `CloseProps` interface to `src/types.ts` — extends `useRender.ComponentProps<"button">` with `target?: "root" | "current"`

## 2. Close Component

- [x] 2.1 Implement `Close` component in `src/components.tsx` — useRender with button, role="menuitem", tabIndex=-1, CLOSE_ATTR, click handler with target-based close logic
- [x] 2.2 Focus management for `target="root"`: resolve menubar trigger via `Ids.trigger(openPath[0])`, call `focusItem` after closing

## 3. Keyboard Handler Update

- [x] 3.1 Update Enter/Space leaf activation branch in `src/keyboard.ts` to recognize `CLOSE_ATTR` and call `target.click()`

## 4. Exports

- [x] 4.1 Add `Close` to named exports and `NavigationMenu` namespace in `src/index.ts`
- [x] 4.2 Add `CloseProps` to type exports in `src/index.ts`

## 5. Tests

- [x] 5.1 Test: click Close with default target closes all menus
- [x] 5.2 Test: click Close with target="current" closes only containing menu
- [x] 5.3 Test: focus returns to menubar trigger after target="root" close
- [x] 5.4 Test: Enter/Space activates Close menuitem
- [x] 5.5 Test: Close renders with correct ARIA attributes
