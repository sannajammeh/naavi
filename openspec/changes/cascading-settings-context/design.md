## Context

Currently `openOnHover` is a single prop on `Root` stored in `RootContextValue`. Every `Trigger` reads this value from the root context — there is no per-depth or per-trigger override mechanism. The user's LiveFull example demonstrates the desired API: `Root openOnHover={true}` for top-level hover, `Content openOnHover={false}` to make submenus click-only, with Trigger also able to override.

The existing pattern for per-component overrides is `closeOnClick` on `Link`, which overrides the root value. This change generalizes that pattern into a cascading context.

## Goals / Non-Goals

**Goals:**
- Cascading settings context that flows Root → Content → Trigger with merge semantics
- `openOnHover` as the first setting to use this cascade
- Non-breaking: omitting all new props preserves current behavior exactly
- Clean precedence: Trigger prop > nearest Content settings > parent Content settings > Root props

**Non-Goals:**
- Cascading `hideDelay`, `closeOnClick`, or other settings (future work, but the context shape supports it)
- Changing keyboard navigation behavior per-depth (keyboard always opens submenus regardless of `openOnHover`)
- Per-item `hideDelay` override

## Decisions

### 1. New `SettingsContext` rather than extending `RootContext`

**Decision**: Create a separate `SettingsContext` with its own provider and `useSettings()` hook.

**Rationale**: `RootContext` carries operational state (openPath, armed, hideTimeout, navRef, viewport) that is inherently global to the navigation tree. Settings like `openOnHover` are configuration that should cascade. Mixing them forces all consumers of root state to also re-render on settings changes and vice versa.

**Alternative considered**: Adding `openOnHover` resolution logic directly in Trigger/Content by walking up contexts. Rejected — fragile, no clear override point.

### 2. Content as the settings boundary (not Item)

**Decision**: `Content` accepts settings override props and wraps its children in a new `SettingsContext.Provider`.

**Rationale**: Content defines a submenu scope. When you set `openOnHover={false}` on a Content, you mean "everything inside this submenu should not open on hover." Item is too granular — it wraps a single menu entry, not a submenu tree. Content already provides `DepthContext` for its children, so it's the natural boundary.

### 3. Trigger reads settings with local prop override

**Decision**: Trigger accepts `openOnHover` prop. Resolution: `triggerProp ?? settingsContext.openOnHover ?? undefined`.

**Rationale**: Matches the `closeOnClick` pattern on Link (local prop overrides context). Allows one specific trigger within a submenu to behave differently without wrapping in extra providers.

### 4. Settings context value shape

```ts
interface SettingsContextValue {
  openOnHover: boolean | undefined;
}
```

**Decision**: Start with only `openOnHover`. The context shape is extensible — future settings (hideDelay, closeOnClick) can be added without changing the cascade mechanism.

### 5. Trigger hover logic changes

**Decision**: Trigger's `handleMouseEnter` resolves `openOnHover` from the cascading settings chain. The existing `ctx.armed` check on `RootContext` remains — armed state is still global (opening any menu arms the menubar). But the `openOnHover` override determines whether that armed state is respected for a given trigger.

Resolution logic in Trigger:
```
effectiveOpenOnHover = triggerProp ?? settings.openOnHover
```
- `true`: always respond to hover (ignore armed state)
- `false`: never respond to hover
- `undefined`: use armed state machine (existing behavior)

This replaces the current pattern where Trigger reads `ctx.openOnHover` from RootContext.

### 6. Remove `openOnHover` from RootContextValue

**Decision**: `openOnHover` moves out of `RootContextValue` and into `SettingsContextValue`. Root still accepts the prop but feeds it into the initial `SettingsContext.Provider` value instead of `RootContext`.

**Rationale**: Avoids two sources of truth. Trigger/Content only need to look at `SettingsContext`.

## Risks / Trade-offs

- **Extra context provider per Content**: Each Content that passes settings props adds a provider. React context providers are lightweight — this is negligible for typical menu depths (2-3 levels).
- **Breaking change if consumers read `ctx.openOnHover` from RootContext**: Internal-only. Not part of public API. Keyboard hook reads from root context — needs updating.
- **`armed` remains global**: A submenu with `openOnHover={false}` still participates in the global armed state machine. This is correct — arming/disarming is about the menubar interaction mode, not per-submenu configuration.
