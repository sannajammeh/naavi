## 1. Types & Context

- [x] 1.1 Add `SettingsContextValue` interface to `src/types.ts` with `openOnHover: boolean | undefined`
- [x] 1.2 Add `openOnHover?: boolean` to `ContentProps` in `src/types.ts`
- [x] 1.3 Add `openOnHover?: boolean` to `TriggerProps` in `src/types.ts`
- [x] 1.4 Remove `openOnHover` from `RootContextValue` in `src/types.ts`
- [x] 1.5 Create `SettingsContext` and `useSettings()` hook in `src/context.ts`

## 2. Component Changes

- [x] 2.1 Update `Root` to provide `SettingsContext.Provider` with initial `openOnHover` value; remove `openOnHover` from `RootContextValue` memo
- [x] 2.2 Update `Content` to accept `openOnHover` prop, read inherited settings via `useSettings()`, and conditionally wrap children in `SettingsContext.Provider` when overrides are provided
- [x] 2.3 Update `Trigger` to accept `openOnHover` prop, resolve effective value via `triggerProp ?? settings.openOnHover`, and use it in `handleMouseEnter` instead of `ctx.openOnHover`
- [x] 2.4 Update `Root`'s `setArmed` callback to resolve `openOnHover` from settings context instead of local prop (or keep prop reference since Root is the initial provider)

## 3. Keyboard Hook

- [x] 3.1 Update `useMenuKeyboard` if it references `ctx.openOnHover` — ensure it no longer depends on the removed field

## 4. Barrel Export

- [x] 4.1 Export `SettingsContextValue` type from `src/index.ts` if needed for consumers

## 5. Tests

- [x] 5.1 Add test: Root `openOnHover={true}` cascades to all triggers (existing behavior preserved)
- [x] 5.2 Add test: Content `openOnHover={false}` overrides Root `openOnHover={true}` for triggers inside that Content
- [x] 5.3 Add test: Trigger `openOnHover={true}` overrides Content `openOnHover={false}`
- [x] 5.4 Add test: nested Content without override inherits from nearest ancestor Content
- [x] 5.5 Add test: no settings anywhere preserves armed state machine behavior
- [x] 5.6 Verify existing tests pass (no regressions from RootContextValue change)

## 6. Docs / Playground

- [x] 6.1 Update LiveFull example in `docs/page.tsx` — verify `Content openOnHover={false}` now works without type errors
- [x] 6.2 Verify playground and docs render correctly via browser
