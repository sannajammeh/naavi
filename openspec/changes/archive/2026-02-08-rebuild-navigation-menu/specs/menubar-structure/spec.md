## ADDED Requirements

### Requirement: Root renders nav element
Root SHALL render a `<nav>` element with the provided `aria-label` attribute.

#### Scenario: Basic root rendering
- **WHEN** `<Root aria-label="Main">` is rendered
- **THEN** a `<nav aria-label="Main">` element is in the DOM

### Requirement: List renders menubar
List SHALL render a `<ul role="menubar">` element. The `aria-label` on List SHALL match the Root's `aria-label` if not explicitly provided.

#### Scenario: List rendering
- **WHEN** `<List>` is rendered inside Root
- **THEN** a `<ul role="menubar">` element is in the DOM

### Requirement: Item renders list item with none role
Item SHALL render a `<li role="none">` element, removing the implied listitem semantics.

#### Scenario: Item rendering
- **WHEN** `<Item>` is rendered inside List or Content
- **THEN** a `<li role="none">` element is in the DOM

### Requirement: Link renders menuitem anchor
Link SHALL render an `<a role="menuitem">` element with `data-navigation-menu-link` attribute. Link SHALL accept an `href` prop.

#### Scenario: Simple link rendering
- **WHEN** `<Link href="#home">Home</Link>` is rendered
- **THEN** an `<a role="menuitem" href="#home" data-navigation-menu-link>Home</a>` element is in the DOM

### Requirement: Trigger renders menuitem with haspopup
Trigger SHALL render an element with `role="menuitem"`, `aria-haspopup="true"`, and `data-navigation-menu-trigger` attribute. Trigger SHALL render `aria-expanded` reflecting whether its associated Content is open. Trigger's default element SHALL be `<a>`.

#### Scenario: Closed trigger rendering
- **WHEN** `<Trigger href="#about">About</Trigger>` is rendered and its Content is closed
- **THEN** an `<a role="menuitem" aria-haspopup="true" aria-expanded="false" data-navigation-menu-trigger>` element is in the DOM

#### Scenario: Open trigger rendering
- **WHEN** the Item's Content is open
- **THEN** the Trigger's `aria-expanded` attribute SHALL be `"true"`

#### Scenario: Trigger with render override
- **WHEN** `<Trigger render={<button />}>` is used
- **THEN** a `<button>` element is rendered with the same ARIA attributes

### Requirement: Content renders menu list
Content SHALL render a `<ul role="menu">` element with `data-navigation-menu-content`, `data-value`, and `data-state` attributes. Content SHALL have an `aria-label` prop.

#### Scenario: Closed content rendering
- **WHEN** Content is rendered and its parent Item is not open
- **THEN** `<ul role="menu" data-state="closed" data-navigation-menu-content>` is in the DOM

#### Scenario: Open content rendering
- **WHEN** Content's parent Item is open
- **THEN** `data-state` SHALL be `"open"`

### Requirement: Content always in DOM
Content SHALL always be present in the DOM regardless of open/closed state. Visibility SHALL be controlled by consumer CSS targeting the `data-state` attribute.

#### Scenario: Closed content remains in DOM
- **WHEN** a menu is closed
- **THEN** the Content `<ul>` element SHALL still exist in the DOM with `data-state="closed"`

### Requirement: Separator renders separator role
Separator SHALL render a `<li role="separator">` element.

#### Scenario: Separator rendering
- **WHEN** `<Separator />` is rendered inside Content
- **THEN** a `<li role="separator">` element is in the DOM

### Requirement: Recursive nesting without Sub component
Item + Trigger + Content SHALL work at any nesting depth. An Item with value, Trigger, and Content nested inside another Content creates a submenu. No separate Sub component is required.

#### Scenario: Nested submenu structure
- **WHEN** an Item with Trigger + Content is placed inside another Content
- **THEN** the DOM structure SHALL be `<li role="none"><a role="menuitem" aria-haspopup="true">...<ul role="menu">...</ul></li>` nested inside the parent `<ul role="menu">`

### Requirement: Trigger and Content linked by IDs
Trigger SHALL have an `id` attribute and Content SHALL have an `aria-labelledby` referencing the Trigger's `id`. Trigger SHALL have `aria-controls` referencing the Content's `id`.

#### Scenario: ID linkage
- **WHEN** Trigger and Content are rendered for the same Item
- **THEN** Trigger's `aria-controls` SHALL equal Content's `id`, and Content's `aria-labelledby` SHALL equal Trigger's `id`

### Requirement: Open state model uses path array
The open state SHALL be represented as a `string[]` where each element corresponds to the value of the open Item at that depth. Opening an item at depth N SHALL close all items at depths greater than N.

#### Scenario: Opening a top-level item
- **WHEN** Item with value "about" at depth 0 is opened
- **THEN** openPath SHALL be `["about"]`

#### Scenario: Opening a nested item
- **WHEN** Item with value "facts" at depth 1 is opened while "about" is open at depth 0
- **THEN** openPath SHALL be `["about", "facts"]`

#### Scenario: Switching top-level items closes deeper menus
- **WHEN** openPath is `["about", "facts"]` and Item "admissions" at depth 0 is opened
- **THEN** openPath SHALL be `["admissions"]`

### Requirement: Controlled mode
Root SHALL accept `value: string[]` and `onValueChange: (path: string[]) => void` props for controlled mode. When `value` is provided, the component SHALL use it as the openPath instead of internal state.

#### Scenario: Controlled open state
- **WHEN** `value={["about"]}` is passed to Root
- **THEN** the About menu SHALL be open regardless of internal interactions

#### Scenario: Controlled onChange callback
- **WHEN** a user interaction would change the open state
- **THEN** `onValueChange` SHALL be called with the new path array

### Requirement: useRender for element polymorphism
All components that render DOM elements SHALL support a `render` prop via `useRender` from `@base-ui/react` to override the default rendered element.

#### Scenario: Custom render element
- **WHEN** `<Item render={<div />}>` is used
- **THEN** a `<div>` element SHALL be rendered instead of `<li>` with all ARIA attributes preserved
