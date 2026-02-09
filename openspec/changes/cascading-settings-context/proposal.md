## Why

`openOnHover` is currently a Root-level-only prop. In real-world navigation menus, top-level items often open on hover while nested submenus should require a click (or vice versa). There is no way to configure hover behavior per-depth or per-trigger — the entire tree shares a single setting. This also applies to future settings like `hideDelay` and `closeOnClick` which would benefit from the same cascading override pattern.

## What Changes

- Introduce a `SettingsContext` that cascades through the component tree, inheriting from its nearest ancestor and allowing local overrides
- `Root` provides the initial settings context (from its props)
- `Content` accepts settings override props (e.g., `openOnHover`) and provides a new settings context to its children that merges overrides with inherited values
- `Trigger` accepts an `openOnHover` prop that overrides the nearest settings context for that specific trigger only
- Priority chain: Trigger prop > nearest SettingsContext > parent SettingsContext > Root props

## Capabilities

### New Capabilities
- `cascading-settings`: Cascading settings context that flows through the component tree with override semantics at Content and Trigger level

### Modified Capabilities
- `hover-interaction`: `openOnHover` resolution changes from reading a single Root-level value to resolving through the cascading settings chain. Trigger and Content gain `openOnHover` props.

## Impact

- **Types**: New `SettingsContextValue` type, new props on `ContentProps` and `TriggerProps`
- **Context**: New `SettingsContext` + `useSettings()` hook
- **Components**: `Root` provides initial `SettingsContext`, `Content` wraps children in override `SettingsContext`, `Trigger` reads from settings context (with local prop override)
- **Keyboard**: `useMenuKeyboard` may need to resolve `openOnHover` per-item rather than from root context
- **Public API**: Non-breaking — all new props are optional, existing behavior unchanged when omitted
