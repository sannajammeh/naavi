## ADDED Requirements

### Requirement: Armed state machine
The menubar SHALL implement an "armed" state. When not armed, mouse hover SHALL NOT open menus. When armed, mouse hover over a menubar trigger SHALL open its submenu and close other open submenus.

#### Scenario: Hover when not armed
- **WHEN** the menubar is not armed and user hovers over "About" trigger
- **THEN** About submenu SHALL NOT open

#### Scenario: Hover when armed
- **WHEN** the menubar is armed and user hovers over "About" trigger
- **THEN** About submenu SHALL open

### Requirement: Arming via interaction
The menubar SHALL become armed when a submenu is opened via click or keyboard. The menubar SHALL become disarmed when all menus close (Escape, Tab, click outside, blur).

#### Scenario: Click arms the menubar
- **WHEN** user clicks "About" trigger and the submenu opens
- **THEN** the menubar SHALL become armed; hovering over "Admissions" SHALL open its submenu

#### Scenario: Escape disarms
- **WHEN** user presses Escape and all menus close
- **THEN** the menubar SHALL become disarmed

### Requirement: openOnHover prop override
Root SHALL accept an `openOnHover` prop. When `true`, the menubar SHALL always be armed (hover always opens). When `false`, hover SHALL never open menus. When not specified, the armed state machine SHALL apply.

#### Scenario: openOnHover true
- **WHEN** `openOnHover={true}` is set on Root
- **THEN** hovering over any trigger SHALL open its submenu regardless of armed state

#### Scenario: openOnHover false
- **WHEN** `openOnHover={false}` is set on Root
- **THEN** hovering over triggers SHALL never open submenus

### Requirement: Hide delay on mouse leave
When the mouse leaves a trigger or its associated content, a configurable delay SHALL elapse before the submenu closes. If the mouse re-enters the trigger or content within the delay, the close SHALL be cancelled.

#### Scenario: Mouse leave starts close timer
- **WHEN** mouse leaves the "About" trigger area
- **THEN** a timer of `hideDelay` milliseconds SHALL start; if it completes, About submenu SHALL close

#### Scenario: Mouse re-enter cancels close
- **WHEN** mouse leaves "About" trigger and re-enters "About" Content within the delay
- **THEN** the close timer SHALL be cancelled and About submenu SHALL remain open

#### Scenario: Custom hideDelay
- **WHEN** `hideDelay={200}` is set on Root
- **THEN** the grace period before closing SHALL be 200ms

### Requirement: Hover opens submenus within open menus
When a submenu is open and the mouse hovers over a menuitem with a nested submenu, that nested submenu SHALL open (if the menubar is armed or any popup is open).

#### Scenario: Hover in open submenu opens nested menu
- **WHEN** About submenu is open and user hovers over "Facts" (has nested submenu)
- **THEN** Facts submenu SHALL open

### Requirement: Click outside closes all menus
When a `pointerdown` event occurs outside the navigation, all menus SHALL close and the menubar SHALL disarm.

#### Scenario: Click on page body
- **WHEN** About submenu is open and user clicks on the page body outside the nav
- **THEN** all menus SHALL close and menubar SHALL disarm

### Requirement: Trigger click toggles submenu
Clicking a trigger SHALL toggle its submenu open/closed. If another submenu was open, it SHALL close.

#### Scenario: Click opens submenu
- **WHEN** no submenu is open and user clicks "About" trigger
- **THEN** About submenu SHALL open

#### Scenario: Click closes submenu
- **WHEN** About submenu is open and user clicks "About" trigger
- **THEN** About submenu SHALL close

#### Scenario: Click switches submenu
- **WHEN** About submenu is open and user clicks "Admissions" trigger
- **THEN** About submenu SHALL close and Admissions submenu SHALL open

### Requirement: closeOnClick for links
Root SHALL accept a `closeOnClick` prop (default `true`). When `true`, clicking a Link (leaf menuitem) SHALL close all menus. Link MAY also accept its own `closeOnClick` prop to override the root setting.

#### Scenario: Link click closes menus
- **WHEN** `closeOnClick={true}` and user clicks "Overview" link in About submenu
- **THEN** all menus SHALL close

#### Scenario: Link click with closeOnClick false
- **WHEN** `closeOnClick={false}` on Root and user clicks "Overview" link
- **THEN** menus SHALL remain open

### Requirement: Blur closes menus
When focus leaves the entire navigation (not moving to another element within it), all menus SHALL close after a brief delay. Root SHALL accept `hideOnBlur` prop (default `true`) to control this.

#### Scenario: Focus leaves navigation
- **WHEN** focus moves from a menuitem to an element outside the navigation
- **THEN** all menus SHALL close

#### Scenario: hideOnBlur false
- **WHEN** `hideOnBlur={false}` is set and focus leaves the navigation
- **THEN** menus SHALL remain open
