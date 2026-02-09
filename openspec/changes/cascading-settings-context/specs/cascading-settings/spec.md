## ADDED Requirements

### Requirement: SettingsContext cascades through component tree
A `SettingsContext` SHALL provide configuration values that cascade from Root through Content components. Each Content MAY override settings for its subtree. Child components SHALL inherit settings from the nearest ancestor provider.

#### Scenario: Root provides initial settings
- **WHEN** `Root` renders with `openOnHover={true}`
- **THEN** all descendants SHALL inherit `openOnHover=true` from the settings context

#### Scenario: Content overrides inherited settings
- **WHEN** `Root` has `openOnHover={true}` and a `Content` has `openOnHover={false}`
- **THEN** descendants of that Content SHALL inherit `openOnHover=false`; descendants outside that Content SHALL still inherit `openOnHover=true`

#### Scenario: Nested Content inherits from nearest ancestor
- **WHEN** `Root` has `openOnHover={true}`, outer Content has `openOnHover={false}`, and inner Content omits `openOnHover`
- **THEN** descendants of inner Content SHALL inherit `openOnHover=false` from the outer Content

#### Scenario: Nested Content can re-override
- **WHEN** outer Content has `openOnHover={false}` and inner Content has `openOnHover={true}`
- **THEN** descendants of inner Content SHALL inherit `openOnHover=true`

### Requirement: Content provides SettingsContext
Content SHALL accept an `openOnHover` prop. When provided, Content SHALL render a `SettingsContext.Provider` that merges the override with inherited values. When omitted, Content SHALL NOT create a new provider (children inherit from the nearest ancestor).

#### Scenario: Content with openOnHover prop
- **WHEN** `Content` has `openOnHover={false}`
- **THEN** a new `SettingsContext.Provider` SHALL be rendered with `openOnHover=false`

#### Scenario: Content without settings props
- **WHEN** `Content` omits all settings props
- **THEN** no new `SettingsContext.Provider` SHALL be rendered; children inherit from nearest ancestor

### Requirement: Trigger accepts openOnHover override
Trigger SHALL accept an `openOnHover` prop that overrides the value from the nearest `SettingsContext` for that trigger only. This SHALL NOT affect sibling or descendant triggers.

#### Scenario: Trigger prop overrides context
- **WHEN** settings context has `openOnHover=false` and a Trigger has `openOnHover={true}`
- **THEN** that Trigger SHALL behave as if `openOnHover=true`; sibling triggers SHALL still use `openOnHover=false`

#### Scenario: Trigger without prop uses context
- **WHEN** settings context has `openOnHover=true` and Trigger omits the prop
- **THEN** that Trigger SHALL behave as if `openOnHover=true`

### Requirement: Settings resolution priority
The effective `openOnHover` value for a Trigger SHALL be resolved in this priority order:
1. Trigger's own `openOnHover` prop (highest)
2. Nearest `SettingsContext` value (from Content or Root)
3. `undefined` (armed state machine applies)

#### Scenario: Full priority chain
- **WHEN** Root has `openOnHover={true}`, Content has `openOnHover={false}`, and Trigger has `openOnHover={true}`
- **THEN** that Trigger SHALL behave as `openOnHover=true` (Trigger prop wins)

#### Scenario: Context wins over root when trigger omits
- **WHEN** Root has `openOnHover={true}`, Content has `openOnHover={false}`, and Trigger omits the prop
- **THEN** that Trigger SHALL behave as `openOnHover=false` (nearest Content wins)

### Requirement: Default settings context
When no explicit settings are provided at any level, the settings context SHALL have `openOnHover=undefined`, preserving the existing armed state machine behavior.

#### Scenario: No settings anywhere
- **WHEN** Root omits `openOnHover`, Content omits `openOnHover`, and Trigger omits `openOnHover`
- **THEN** the effective `openOnHover` SHALL be `undefined` and the armed state machine SHALL apply
