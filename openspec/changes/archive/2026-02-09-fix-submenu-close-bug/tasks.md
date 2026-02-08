## 1. Depth-scoped close in Trigger

- [x] 1.1 In `Trigger.handleMouseLeave` (`src/components.tsx`), change `ctx.setOpenPath([])` to `ctx.setOpenPath(ctx.openPath.slice(0, depth))` so leaving a submenu trigger only closes that depth and deeper
- [x] 1.2 In `Trigger.handleMouseLeave`, only call `ctx.setArmed(false)` when `depth === 0`

## 2. Depth-scoped close in Content

- [x] 2.1 In `Content.handleMouseLeave` (`src/components.tsx`), change `ctx.setOpenPath([])` to `ctx.setOpenPath(ctx.openPath.slice(0, depth))` so leaving submenu content only closes that depth and deeper
- [x] 2.2 In `Content.handleMouseLeave`, only call `ctx.setArmed(false)` when `depth === 0`

## 3. Link mouse-enter handler

- [x] 3.1 Add `handleMouseEnter` to the `Link` component that cancels `ctx.hideTimeout` if pending
- [x] 3.2 Wire `onMouseEnter: handleMouseEnter` into the Link's `defaultProps`

## 4. Verification

- [x] 4.1 Run existing tests (`bun test`) and fix any failures caused by the changes
- [x] 4.2 Add test cases for depth-scoped closing: leaving a depth-1 trigger preserves parent menu
- [x] 4.3 Add test case for Link cancelling hide timer on mouse-enter
- [x] 4.4 Visually verify in browser at localhost:3000: click About → hover Facts → move to Administration; only Facts submenu should close
- [x] 4.5 Compare behavior against reference impl at localhost:3001
