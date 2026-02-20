## Context

naavi has leaf menuitems (`Link`) but no dedicated close button. `Link` navigates and optionally closes. The new `Close` component is a pure close action — no navigation, just menu dismissal. It follows the same rendering pipeline: placed inside `<Item>`, uses `useRender` with `defaultTagName: "button"`, gets `role="menuitem"`.

The `target` prop controls close scope: `"root"` (default) closes the entire menu tree, `"current"` closes only the containing menu level.

## Goals / Non-Goals

**Goals:**
- Provide a declarative close button component matching existing component patterns
- Support two close scopes: entire menu tree (`root`) and current menu only (`current`)
- Correct focus management per WAI-ARIA patterns
- Keyboard activation (Enter/Space) works like other leaf menuitems

**Non-Goals:**
- Animated close transitions (consumer's responsibility via `data-state`)
- Close-on-delay / close-after-timeout behavior
- Programmatic close API (separate concern)

## Decisions

### 1. Default tag: `<button>` not `<a>`

Close is an action, not a navigation. `<button>` is semantically correct. `Link` uses `<a>` because it navigates. Consumers can override via `render` prop.

### 2. `target` prop with `"root" | "current"`, default `"root"`

- `"root"` — `setOpenPath([])` + `setArmed(false)`. Most common use case: "dismiss the menu."
- `"current"` — `setOpenPath(openPath.slice(0, depth - 1))`. Closes only the menu the Close is in, preserving parent menus.

Naming considered: `depth`, `close`, `scope`. Settled on `target` — reads naturally (`target="root"`) and avoids collision with the numeric `depth` concept in context.

### 3. Focus after close mirrors existing patterns

| target | Focus behavior | Rationale |
|--------|---------------|-----------|
| `"root"` | Focus menubar trigger via `Ids.trigger(openPath[0])` + `focusItem` | Mirrors Escape — closing everything returns focus to the trigger that opened the chain |
| `"current"` | No explicit focus management | Mirrors Link click — the menu closes, browser handles focus naturally |

For `"root"`, we read `openPath[0]` before clearing it, resolve the trigger element by ID, and call `focusItem`. This avoids DOM tree traversal.

### 4. Keyboard handler update: recognize CLOSE_ATTR in leaf activation

`keyboard.ts` Enter/Space on leaf menuitems currently checks `LINK_ATTR || tagName === "A"`. Add `CLOSE_ATTR` to this check. Considered broadening to "activate any leaf menuitem" but that changes behavior for unknown future components — safer to stay explicit.

### 5. No mouseEnter/mouseLeave handlers

Unlike `Link` (which closes deeper submenus on hover), Close has no hover behavior. It's a button — it acts on click/Enter/Space only.

## Risks / Trade-offs

- **`target="current"` at depth 1 closes everything** — `openPath.slice(0, 0)` = `[]`, same as `"root"` but without focus management. This is correct behavior (there's no parent menu to preserve) but could surprise consumers. Acceptable — documenting is sufficient.
- **Focus on hidden element with `target="current"`** — after close, the Close button may no longer be visible. Focus falls to `<body>`. Consumer's responsibility to manage if needed. Same trade-off Link already makes.
