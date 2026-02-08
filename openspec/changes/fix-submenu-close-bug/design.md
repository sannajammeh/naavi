## Context

The navigation menu uses a flat `openPath` array as its single source of truth for which menus are open. Each element represents the open item's `value` at that depth level (e.g., `["about", "facts"]` means depth-0 "About" is open and depth-1 "Facts" submenu is open).

Currently, all `handleMouseLeave` handlers (on both Trigger and Content) call `ctx.setOpenPath([])`, which closes every menu at every depth. There is a single shared `hideTimeout` ref across the entire tree. The Link component has no mouse-enter handler, so it never cancels pending close timers.

This means leaving a depth-1 submenu trigger to hover a sibling link or item within the same parent content panel starts a timer that closes everything — including the parent menu that the mouse is still inside.

### Reference implementation analysis (`wai-aria-spec/spec.js`)

The WAI-ARIA reference uses a different strategy entirely:
- **No mouse-leave timers** — it only uses `pointerover`, not `pointerout`/`mouseleave`
- **`closePopupAll(menuitem)`** selectively closes popups whose DOM subtree does NOT contain the hovered menuitem (`doesNotContain` check at line 500)
- **All menuitems** (both triggers and links) receive the `pointerover` handler, so hovering any item naturally manages popup state
- Result: hovering "Administration" inside About's content closes the Facts popout (since Facts' popup doesn't contain Administration) but keeps About open (since About's popup does contain Administration)

Our React model can't use DOM containment checks the same way (we use a flat `openPath` array, not imperative DOM manipulation). However, `openPath.slice(0, depth)` achieves the equivalent outcome — it preserves ancestor menus while closing the current depth and deeper. Adding hover handling to Link ensures all menuitems participate in timer cancellation, matching how the reference attaches `pointerover` to every menuitem.

## Goals / Non-Goals

**Goals:**
- Mouse-leave from a submenu trigger/content SHALL only close menus at that depth and deeper, preserving parent menus
- The armed state SHALL only be cleared when closing from depth 0
- Link elements within an open menu SHALL cancel pending close timers on mouse-enter
- Behavior matches the WAI-ARIA reference implementation at localhost:3001

**Non-Goals:**
- Per-depth timers — the single shared `hideTimeout` ref is sufficient for this fix
- Refactoring the `openPath` state model or armed state machine
- Changes to keyboard navigation or focus management
- Changes to the `openOnHover` prop behavior

## Decisions

### Decision 1: Depth-scoped close in handleMouseLeave

**Choice**: Change `ctx.setOpenPath([])` to `ctx.setOpenPath(ctx.openPath.slice(0, depth))` in both Trigger and Content mouse-leave handlers.

**Rationale**: `openPath.slice(0, depth)` removes the current depth and everything deeper, while preserving all ancestors. For depth-0 triggers this produces `[]` (same as current behavior). For depth-1+ triggers it preserves the parent chain. This is a minimal, targeted change.

**Alternative considered**: Per-depth timers with separate refs. Rejected — adds complexity and the single timer is sufficient because re-entering any part of the menu tree cancels it.

### Decision 2: Conditional disarm

**Choice**: Only call `ctx.setArmed(false)` when `depth === 0` in the mouse-leave timeout callback.

**Rationale**: Disarming at submenu depth is incorrect — the user is still interacting with the menu. The armed state should only clear when the entire top-level menu closes.

### Decision 3: Add mouse-enter handler to Link

**Choice**: Add an `onMouseEnter` handler to the Link component that cancels the hide timeout.

**Rationale**: When moving from a submenu trigger to a sibling Link within the same Content panel, the Link must cancel the pending close timer. Without this, even with depth-scoped closing, the timer fires and closes menus the user is still hovering over.

## Risks / Trade-offs

- **[Stale closure on depth]** → The `depth` value is captured in the callback closure. Since depth is stable per component instance (provided by DepthContext), this is safe.
- **[Shared timer edge case]** → With a single timer, a rapid mouse-leave at depth 1 followed by mouse-leave at depth 0 could have the depth-0 timer overwrite the depth-1 timer. This is acceptable because depth-0 close (`[]`) is a superset of depth-1 close — closing more is never wrong when leaving the entire tree.
- **[Link handleMouseEnter perf]** → Negligible. It's a simple timeout clear, same as Content's existing handler.
