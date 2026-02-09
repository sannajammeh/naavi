## Wave 1 — Scaffold (2 tasks)

> Zero dependencies. Clears the slate and installs the new peer dep.

- [x] 1.1 Add `@base-ui/react` as peer dependency and dev dependency in package.json
- [x] 1.2 Remove old source files (`src/Navi.tsx`, `src/NaviItem.tsx`) and clear existing `src/types.ts` and `src/index.ts`

## Wave 2 — Foundation (3 tasks)

> Pure types, constants, and context. No component logic yet. All three are independent of each other.

- [x] 2.1 Create `src/constants.ts` — data attribute constants (`TRIGGER_ATTR`, `CONTENT_ATTR`, `VIEWPORT_ATTR`, `LINK_ATTR`), selector strings, and `Ids` helper for generating trigger/content IDs
- [x] 2.2 Create `src/types.ts` — all component prop interfaces (`RootProps`, `ListProps`, `ItemProps`, `TriggerProps`, `ContentProps`, `LinkProps`, `SeparatorProps`, `ViewportProps`, `PortalProps`), `RootContext` type, `DepthContext` type, `ItemContext` type
- [x] 2.3 Create `src/context.ts` — `RootContext`, `DepthContext`, `ItemContext` with `createContext`, plus `useRoot()`, `useDepth()`, `useItem()` consumer hooks with error messages

## Wave 3 — Focus Utilities (4 tasks)

> Depends on constants (selectors). Pure DOM helpers, no React.

- [x] 3.1 Create `src/focus.ts` — `getContainingMenu(el)`, `getMenuItems(menu)`, `getMenuDepth(menu)`, `getParentTrigger(menu)`, `getMenubarItems(nav)`, `isMenubar(menu)` helper functions
- [x] 3.2 Add `focusItem(navEl, item)` — sets `tabindex="0"` on target, `tabindex="-1"` on previous active item within nav, calls `element.focus()`
- [x] 3.3 Add `focusFirstItem(menu)`, `focusLastItem(menu)`, `focusNextItem(menu, current)`, `focusPrevItem(menu, current)` — wrapping navigation within a menu scope
- [x] 3.4 Add `focusByChar(menu, current, char)` — first-character search with wrap-around

## Wave 4 — Keyboard Handler + Core Components (11 tasks)

> Keyboard handler depends on focus utils + context. Core components depend on context + constants + types. These can be built in parallel across two files (`keyboard.ts` and `components.tsx`), but within each file tasks are sequential.

**keyboard.ts** (sequential):

- [x] 4.1 Create `src/keyboard.ts` — `useMenuKeyboard` hook that returns an `onKeyDown` handler for the Root `<nav>`
- [x] 4.2 Implement menubar key mappings: ArrowRight/Left (move + open if armed), ArrowDown (open submenu focus first), ArrowUp (open submenu focus last), Home/End, character search
- [x] 4.3 Implement submenu key mappings: ArrowDown/Up (move within submenu with wrap), ArrowRight (open nested or close-all + advance menubar), ArrowLeft (close submenu + parent logic)
- [x] 4.4 Implement Enter/Space (open submenu or activate link), Escape (close submenu + focus parent), Tab (close all + disarm)

**components.tsx** (sequential):

- [x] 5.1 Implement `Root` — renders `<nav>`, provides `RootContext`, wires `onKeyDown` from `useMenuKeyboard`, manages `openPath` state (with controlled mode via `value`/`onValueChange`), manages `armed` state, manages `hideTimeout` ref
- [x] 5.2 Implement `List` — renders `<ul role="menubar">`, provides `DepthContext` with `depth=0`
- [x] 5.3 Implement `Item` — renders `<li role="none">`, provides `ItemContext` with value (auto-generated via `useId()` if not provided) and current depth
- [x] 5.4 Implement `Trigger` — renders `<a>` by default via `useRender`, sets `role="menuitem"`, `aria-haspopup="true"`, `aria-expanded`, `aria-controls`, `data-navi-trigger`, `data-value`; handles click toggle, mouseenter/mouseleave for hover
- [x] 5.5 Implement `Content` — renders `<ul role="menu">` via `useRender`, sets `data-state`, `data-navi-content`, `data-value`, `aria-label`, `aria-labelledby`; provides `DepthContext` with incremented depth; portals into Viewport if available; handles mouseenter/mouseleave for hover delay
- [x] 5.6 Implement `Link` — renders `<a>` by default via `useRender`, sets `role="menuitem"`, `data-navi-link`; handles click to close menus (respects `closeOnClick`)
- [x] 5.7 Implement `Separator` — renders `<li role="separator">`

## Wave 5 — Hover & Interaction (5 tasks)

> Depends on Root and Trigger/Content from Wave 4. Wires mouse/pointer/blur behavior into existing components.

- [x] 6.1 Wire armed state machine into Root — arm on submenu open (click/keyboard), disarm on close-all (Escape, Tab, blur, click-outside)
- [x] 6.2 Wire `openOnHover` prop — `true` = always armed, `false` = never armed, `undefined` = state machine
- [x] 6.3 Implement hide delay on Trigger and Content — `mouseenter` cancels timer, `mouseleave` starts timer with `hideDelay` ms
- [x] 6.4 Implement click-outside handler on Root — `pointerdown` on window, close all if target outside nav
- [x] 6.5 Implement blur handler on Root — close all menus on focus leaving nav (respects `hideOnBlur` prop)

## Wave 6 — Optional Components + Barrel (3 tasks)

> Viewport and Portal depend on RootContext. Barrel export depends on all components existing.

- [x] 7.1 Implement `Viewport` — renders `<div data-navi-viewport>`, registers element via `RootContext.setViewport`, sets `data-state` based on any open content
- [x] 7.2 Implement `Portal` — renders children via `createPortal` to selector target or auto-created body div, cleanup on unmount
- [x] 8.1 Update `src/index.ts` — export all components (`Root`, `List`, `Item`, `Trigger`, `Content`, `Link`, `Separator`, `Viewport`, `Portal`) and all public types

## Wave 7 — Playground & Verification (5 tasks)

> Depends on everything above. Integration testing against the reference implementation.

- [x] 9.1 Update `playground/App.tsx` — full Mythical University example matching the WAI-ARIA reference, using all components with nested submenus and separators
- [x] 9.2 Add playground CSS — style targeting `data-navi-*` and `data-state` attributes to control visibility, positioning, and focus styling
- [x] 9.3 Browser verify at `localhost:3000` — visual rendering matches `localhost:3001` reference
- [x] 9.4 Keyboard verify — test all key mappings (arrows, Enter, Space, Escape, Home, End, character, Tab) against the reference implementation at `localhost:3001`
- [x] 9.5 Run `bunx tsc --noEmit` — zero type errors
