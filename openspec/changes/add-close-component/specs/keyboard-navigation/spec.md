## MODIFIED Requirements

### Requirement: Enter and Space activate
Enter and Space SHALL activate the focused menuitem. If the item has a submenu, it SHALL open the submenu and focus the first item. If the item is a link, it SHALL activate the link. If the item is a close button (has `data-naavi-close` attribute), it SHALL activate the close button's click handler.

#### Scenario: Enter on trigger with submenu
- **WHEN** focus is on "About" (has submenu) and user presses Enter
- **THEN** About submenu SHALL open and focus SHALL move to first submenu item

#### Scenario: Enter on leaf link
- **WHEN** focus is on "Overview" (leaf link) and user presses Enter
- **THEN** the link SHALL be activated and all menus SHALL close

#### Scenario: Space on trigger
- **WHEN** focus is on "About" (has submenu) and user presses Space
- **THEN** About submenu SHALL open and focus SHALL move to first submenu item

#### Scenario: Enter on close button
- **WHEN** focus is on a Close menuitem and user presses Enter
- **THEN** the Close button's click handler SHALL be invoked (closing menus per its `target` prop)

#### Scenario: Space on close button
- **WHEN** focus is on a Close menuitem and user presses Space
- **THEN** the Close button's click handler SHALL be invoked (closing menus per its `target` prop)
