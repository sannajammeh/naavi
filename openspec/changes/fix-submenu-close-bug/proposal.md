## Why

Mouse-leave handlers on Trigger and Content always close ALL menus (`setOpenPath([])`) regardless of depth. When a user clicks "About" to open its menu, hovers "Facts" to open a submenu, then moves to a sibling like "Administration", both the submenu AND the parent menu close. Only the submenu should close. The reference implementation at localhost:3001 handles this correctly. Additionally, the Link component lacks mouse-enter handling, so hovering a link sibling never cancels the pending close timer.

## What Changes

- Trigger `handleMouseLeave` will scope its close to the current depth (`openPath.slice(0, depth)`) instead of closing all menus
- Content `handleMouseLeave` will scope its close to the content's depth instead of closing all menus
- Only disarm the armed state when closing from depth 0 (top-level), not from submenu depths
- Link component will gain a `handleMouseEnter` that cancels the hide timeout, preventing premature closure when hovering sibling links within an open menu

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `hover-interaction`: Mouse-leave close behavior must be depth-scoped rather than global; Link elements must participate in hide-timer cancellation

## Impact

- `src/components.tsx`: Trigger `handleMouseLeave`, Content `handleMouseLeave`, and Link component
- `src/types.ts`: No changes expected (single hideTimeout ref is sufficient)
- Existing tests for hover interaction may need updates to verify depth-scoped closing
- No API/prop changes — this is a behavioral bugfix
