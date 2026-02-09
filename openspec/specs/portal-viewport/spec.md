## ADDED Requirements

### Requirement: Portal moves children to target
Portal SHALL render its children into a target DOM element using `createPortal`. If a `selector` prop is provided, Portal SHALL use the matching DOM element. If no selector is provided, Portal SHALL create a `<div data-navi-portal>` appended to `document.body`.

#### Scenario: Portal with selector
- **WHEN** `<Portal selector="#my-container">` is used
- **THEN** children SHALL be rendered inside the element matching `#my-container`

#### Scenario: Portal without selector
- **WHEN** `<Portal>` is used without a selector
- **THEN** a `<div data-navi-portal>` SHALL be created in `document.body` and children SHALL be rendered inside it

#### Scenario: Portal cleanup
- **WHEN** Portal unmounts and it created its own container (no selector)
- **THEN** the created `<div data-navi-portal>` SHALL be removed from `document.body`

### Requirement: Viewport as optional Content target
Viewport SHALL render a `<div data-navi-viewport>` element. When Viewport is present in the component tree, Content components SHALL portal their `<ul role="menu">` into the Viewport element instead of rendering in-place.

#### Scenario: Content renders in Viewport
- **WHEN** Viewport is rendered and a Content is open
- **THEN** the Content's `<ul role="menu">` SHALL appear inside the Viewport `<div>`, not as a sibling of its Trigger

#### Scenario: Content renders in-place without Viewport
- **WHEN** no Viewport is present
- **THEN** Content SHALL render as a direct sibling of its Trigger within the `<li role="none">`

### Requirement: Viewport data-state
Viewport SHALL have a `data-state` attribute reflecting whether any content is currently open. `data-state="open"` when any menu is open, `data-state="closed"` when all are closed.

#### Scenario: Viewport state when menu open
- **WHEN** any submenu is open
- **THEN** Viewport SHALL have `data-state="open"`

#### Scenario: Viewport state when all closed
- **WHEN** no submenus are open
- **THEN** Viewport SHALL have `data-state="closed"`

### Requirement: Viewport preserves aria linkage
When Content is portaled into Viewport, the Trigger's `aria-controls` SHALL still reference the Content's `id`, maintaining the semantic relationship despite DOM separation.

#### Scenario: aria-controls with Viewport
- **WHEN** Content is rendered inside Viewport via portal
- **THEN** the Trigger SHALL have `aria-controls` matching the Content's `id`
