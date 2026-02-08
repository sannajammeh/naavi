## ADDED Requirements

### Requirement: Single keyboard handler on Root
All keyboard interactions SHALL be handled by a single `onKeyDown` handler on the Root `<nav>` element. The handler SHALL determine context (menubar vs submenu, depth, siblings) by reading DOM structure from `event.target`.

#### Scenario: Keyboard event delegation
- **WHEN** a key is pressed while focus is on any `[role="menuitem"]` within the navigation
- **THEN** the Root's keydown handler SHALL process the event based on the target's position in the menu hierarchy

### Requirement: Menubar ArrowRight
In the menubar, ArrowRight SHALL move focus to the next menuitem. If focus is on the last item, it SHALL wrap to the first. If a submenu is currently open (armed state), the newly focused item's submenu SHALL also open.

#### Scenario: ArrowRight in menubar
- **WHEN** focus is on "About" in the menubar and user presses ArrowRight
- **THEN** focus SHALL move to "Admissions"

#### Scenario: ArrowRight wraps at end
- **WHEN** focus is on the last menubar item and user presses ArrowRight
- **THEN** focus SHALL wrap to the first menubar item

#### Scenario: ArrowRight with open submenu
- **WHEN** "About" submenu is open and user presses ArrowRight on "About" trigger
- **THEN** focus SHALL move to "Admissions" and "Admissions" submenu SHALL open, "About" submenu SHALL close

### Requirement: Menubar ArrowLeft
In the menubar, ArrowLeft SHALL move focus to the previous menuitem. If focus is on the first item, it SHALL wrap to the last. If a submenu is currently open, the newly focused item's submenu SHALL also open.

#### Scenario: ArrowLeft in menubar
- **WHEN** focus is on "Admissions" in the menubar and user presses ArrowLeft
- **THEN** focus SHALL move to "About"

#### Scenario: ArrowLeft wraps at start
- **WHEN** focus is on the first menubar item and user presses ArrowLeft
- **THEN** focus SHALL wrap to the last menubar item

### Requirement: Menubar ArrowDown
In the menubar, ArrowDown SHALL open the focused item's submenu (if it has one) and move focus to the first item in that submenu.

#### Scenario: ArrowDown opens submenu
- **WHEN** focus is on "About" (has submenu) and user presses ArrowDown
- **THEN** About submenu SHALL open and focus SHALL move to "Overview" (first submenu item)

### Requirement: Menubar ArrowUp
In the menubar, ArrowUp SHALL open the focused item's submenu (if it has one) and move focus to the last item in that submenu.

#### Scenario: ArrowUp opens submenu to last item
- **WHEN** focus is on "About" (has submenu) and user presses ArrowUp
- **THEN** About submenu SHALL open and focus SHALL move to the last item in About's submenu

### Requirement: Submenu ArrowDown
In a submenu, ArrowDown SHALL move focus to the next menuitem. If focus is on the last item, it SHALL wrap to the first.

#### Scenario: ArrowDown in submenu
- **WHEN** focus is on "Overview" in About submenu and user presses ArrowDown
- **THEN** focus SHALL move to "Administration"

#### Scenario: ArrowDown wraps in submenu
- **WHEN** focus is on the last item in a submenu and user presses ArrowDown
- **THEN** focus SHALL wrap to the first item in that submenu

### Requirement: Submenu ArrowUp
In a submenu, ArrowUp SHALL move focus to the previous menuitem. If focus is on the first item, it SHALL wrap to the last.

#### Scenario: ArrowUp in submenu
- **WHEN** focus is on "Administration" in About submenu and user presses ArrowUp
- **THEN** focus SHALL move to "Overview"

#### Scenario: ArrowUp wraps in submenu
- **WHEN** focus is on the first item in a submenu and user presses ArrowUp
- **THEN** focus SHALL wrap to the last item in that submenu

### Requirement: Submenu ArrowRight with popup
In a submenu, if the focused item has a submenu, ArrowRight SHALL open it and focus the first item.

#### Scenario: ArrowRight opens nested submenu
- **WHEN** focus is on "Facts" (has submenu) in About submenu and user presses ArrowRight
- **THEN** Facts submenu SHALL open and focus SHALL move to "History" (first item)

### Requirement: Submenu ArrowRight without popup
In a submenu, if the focused item does NOT have a submenu, ArrowRight SHALL close all submenus, move focus to the next menubar item, and open that menubar item's submenu (keeping focus on the menubar item trigger).

#### Scenario: ArrowRight on leaf closes and advances
- **WHEN** focus is on "Overview" (no submenu) in About submenu and user presses ArrowRight
- **THEN** About submenu SHALL close, focus SHALL move to "Admissions" in menubar, and Admissions submenu SHALL open with focus on "Admissions" trigger

### Requirement: Submenu ArrowLeft closes submenu
In a submenu, ArrowLeft SHALL close the current submenu and move focus to the parent trigger. If the parent trigger is in the menubar, it SHALL also move focus to the previous menubar item and open that item's submenu (keeping focus on the menubar trigger).

#### Scenario: ArrowLeft in first-level submenu
- **WHEN** focus is on "Overview" in About submenu (parent is menubar) and user presses ArrowLeft
- **THEN** About submenu SHALL close, focus SHALL move to the previous menubar item (e.g., "Home"), and if that item has a submenu it SHALL open

#### Scenario: ArrowLeft in nested submenu
- **WHEN** focus is on "History" in Facts submenu (parent is About submenu) and user presses ArrowLeft
- **THEN** Facts submenu SHALL close and focus SHALL move to "Facts" trigger in About submenu

### Requirement: Enter and Space activate
Enter and Space SHALL activate the focused menuitem. If the item has a submenu, it SHALL open the submenu and focus the first item. If the item is a link, it SHALL activate the link.

#### Scenario: Enter on trigger with submenu
- **WHEN** focus is on "About" (has submenu) and user presses Enter
- **THEN** About submenu SHALL open and focus SHALL move to first submenu item

#### Scenario: Enter on leaf link
- **WHEN** focus is on "Overview" (leaf link) and user presses Enter
- **THEN** the link SHALL be activated and all menus SHALL close

#### Scenario: Space on trigger
- **WHEN** focus is on "About" (has submenu) and user presses Space
- **THEN** About submenu SHALL open and focus SHALL move to first submenu item

### Requirement: Escape closes submenu
Escape SHALL close the current submenu and move focus to the parent trigger.

#### Scenario: Escape in submenu
- **WHEN** focus is on "Overview" in About submenu and user presses Escape
- **THEN** About submenu SHALL close and focus SHALL move to "About" trigger in menubar

#### Scenario: Escape in nested submenu
- **WHEN** focus is on "History" in Facts submenu and user presses Escape
- **THEN** Facts submenu SHALL close and focus SHALL move to "Facts" trigger in About submenu

### Requirement: Home and End keys
Home SHALL move focus to the first menuitem in the current menu (menubar or submenu). End SHALL move focus to the last menuitem in the current menu.

#### Scenario: Home in menubar
- **WHEN** focus is on "Academics" and user presses Home
- **THEN** focus SHALL move to "Home" (first menubar item)

#### Scenario: End in submenu
- **WHEN** focus is on "Overview" in About submenu and user presses End
- **THEN** focus SHALL move to the last item in About submenu

### Requirement: Character navigation
When a printable character is pressed, focus SHALL move to the next menuitem in the current menu whose label starts with that character. If no match is found after the current item, search SHALL wrap from the beginning.

#### Scenario: Character search
- **WHEN** focus is on "Overview" in About submenu and user presses "f"
- **THEN** focus SHALL move to "Facts" (next item starting with "f")

#### Scenario: Character search no match
- **WHEN** user presses "z" and no items start with "z"
- **THEN** focus SHALL not move

### Requirement: Tab closes all menus
Tab SHALL close all open menus, disarm the menubar, and allow default Tab behavior to move focus out of the navigation.

#### Scenario: Tab with open menus
- **WHEN** any menu is open and user presses Tab
- **THEN** all menus SHALL close and focus SHALL move to the next focusable element outside the navigation
