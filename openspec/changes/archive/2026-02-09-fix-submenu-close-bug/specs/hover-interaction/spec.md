## MODIFIED Requirements

### Requirement: Hide delay on mouse leave
When the mouse leaves a trigger or its associated content, a configurable delay SHALL elapse before menus at that depth and deeper close. Menus at ancestor depths SHALL remain open. If the mouse re-enters any trigger or content within the delay, the close SHALL be cancelled. The armed state SHALL only be cleared when closing from depth 0.

#### Scenario: Mouse leave starts close timer
- **WHEN** mouse leaves the "About" trigger area (depth 0)
- **THEN** a timer of `hideDelay` milliseconds SHALL start; if it completes, About submenu SHALL close and the menubar SHALL disarm

#### Scenario: Mouse re-enter cancels close
- **WHEN** mouse leaves "About" trigger and re-enters "About" Content within the delay
- **THEN** the close timer SHALL be cancelled and About submenu SHALL remain open

#### Scenario: Custom hideDelay
- **WHEN** `hideDelay={200}` is set on Root
- **THEN** the grace period before closing SHALL be 200ms

#### Scenario: Submenu trigger mouse leave preserves parent menu
- **WHEN** About submenu is open (`openPath = ["about"]`), user hovers "Facts" trigger (depth 1) opening its submenu (`openPath = ["about", "facts"]`), then mouse leaves "Facts" trigger
- **THEN** a timer SHALL start; if it completes, the Facts submenu SHALL close (`openPath = ["about"]`) but the About menu SHALL remain open and the menubar SHALL remain armed

#### Scenario: Submenu content mouse leave preserves parent menu
- **WHEN** About submenu is open, Facts submenu content is open at depth 1, and mouse leaves the Facts content area
- **THEN** a timer SHALL start; if it completes, the Facts submenu SHALL close but the About menu SHALL remain open

#### Scenario: Mouse leave submenu trigger to sibling link
- **WHEN** About submenu is open, user hovers "Facts" trigger (depth 1) opening its submenu, then moves mouse to sibling "Administration" link within About's content
- **THEN** the "Administration" link SHALL cancel the hide timer; the Facts submenu SHALL close (path truncated to depth 1) but the About menu SHALL remain open

## ADDED Requirements

### Requirement: Link cancels hide timer on mouse enter
When the mouse enters a Link element, any pending hide timeout SHALL be cancelled. This ensures that moving between items within an open menu does not trigger unintended menu closure.

#### Scenario: Hover link cancels pending close
- **WHEN** a hide timer is pending and mouse enters a Link element
- **THEN** the hide timer SHALL be cancelled

#### Scenario: Hover from submenu trigger to sibling link
- **WHEN** About submenu is open, mouse leaves "Facts" trigger starting a hide timer, then mouse enters "Overview" link within About's content
- **THEN** the hide timer SHALL be cancelled and About submenu SHALL remain open
