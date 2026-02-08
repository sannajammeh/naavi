import {
  MENUITEM_SELECTOR,
  MENU_SELECTOR,
  MENUBAR_SELECTOR,
} from "./constants.ts";

// ---------------------------------------------------------------------------
// 3.1 — DOM query helpers
// ---------------------------------------------------------------------------

/**
 * Finds the nearest ancestor with `role="menu"` or `role="menubar"`.
 * Returns `null` if none found.
 */
export function getContainingMenu(el: Element): HTMLElement | null {
  let node = el.parentElement;
  while (node) {
    const role = node.getAttribute("role");
    if (role === "menu" || role === "menubar") {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * Returns the direct menuitem children of a menu/menubar.
 * "Direct" means: `menu > li > [role="menuitem"]` — does NOT recurse into
 * nested `role="menu"` containers.
 */
export function getMenuItems(menu: HTMLElement): HTMLElement[] {
  const items: HTMLElement[] = [];
  const children = menu.children;

  for (let i = 0; i < children.length; i++) {
    const li = children[i];
    if (!li) continue;
    // Each immediate child should be a <li>. Find the menuitem inside it.
    const menuitem = li.querySelector<HTMLElement>(`:scope > ${MENUITEM_SELECTOR}`);
    if (menuitem) {
      items.push(menuitem);
    }
  }

  return items;
}

/**
 * Determines the depth of a menu element.
 * `role="menubar"` → 0, first `role="menu"` → 1, nested → 2, etc.
 */
export function getMenuDepth(menu: HTMLElement): number {
  let depth = 0;
  let node = menu.parentElement;
  while (node) {
    const role = node.getAttribute("role");
    if (role === "menu" || role === "menubar") {
      depth++;
    }
    node = node.parentElement;
  }
  return depth;
}

/**
 * Finds the trigger (menuitem with aria-haspopup) that controls the given menu.
 * In the DOM structure: `<li role="none"><a role="menuitem">…</a><ul role="menu">…</ul></li>`
 * The trigger is the previous sibling element of the menu.
 */
export function getParentTrigger(menu: HTMLElement): HTMLElement | null {
  const prev = menu.previousElementSibling;
  if (
    prev instanceof HTMLElement &&
    prev.getAttribute("role") === "menuitem"
  ) {
    return prev;
  }
  return null;
}

/**
 * Returns all direct menuitem children of the menubar (`role="menubar"`)
 * within the given `<nav>` element.
 */
export function getMenubarItems(nav: HTMLElement): HTMLElement[] {
  const menubar = nav.querySelector<HTMLElement>(MENUBAR_SELECTOR);
  if (!menubar) return [];
  return getMenuItems(menubar);
}

/**
 * Returns `true` if the given element has `role="menubar"`.
 */
export function isMenubar(menu: HTMLElement): boolean {
  return menu.getAttribute("role") === "menubar";
}

/**
 * Returns the menubar element from within the nav.
 */
export function getMenubar(nav: HTMLElement): HTMLElement | null {
  return nav.querySelector<HTMLElement>(MENUBAR_SELECTOR);
}

/**
 * Returns the `role="menu"` element immediately following a trigger.
 * In the DOM: `<a role="menuitem" aria-haspopup="true">…</a><ul role="menu">…</ul>`
 */
export function getSubmenu(trigger: HTMLElement): HTMLElement | null {
  const next = trigger.nextElementSibling;
  if (next instanceof HTMLElement && next.matches(MENU_SELECTOR)) {
    return next;
  }
  return null;
}

/**
 * Returns `true` if the menuitem has `aria-haspopup="true"`.
 */
export function hasPopup(menuitem: HTMLElement): boolean {
  return menuitem.getAttribute("aria-haspopup") === "true";
}

// ---------------------------------------------------------------------------
// 3.2 — focusItem
// ---------------------------------------------------------------------------

/**
 * Sets `tabindex="0"` on `item`, `tabindex="-1"` on the previous active item
 * within the same navigation tree, and calls `item.focus()`.
 *
 * @param navEl  The root `<nav>` element (used to scope the roving tabindex)
 * @param item   The menuitem to focus
 */
export function focusItem(navEl: HTMLElement, item: HTMLElement): void {
  // Remove tabindex=0 from the previously active item
  const prev = navEl.querySelector<HTMLElement>(
    `${MENUITEM_SELECTOR}[tabindex="0"]`,
  );
  if (prev && prev !== item) {
    prev.setAttribute("tabindex", "-1");
  }

  item.setAttribute("tabindex", "0");
  item.focus();
}

// ---------------------------------------------------------------------------
// 3.3 — focusFirstItem, focusLastItem, focusNextItem, focusPrevItem
// ---------------------------------------------------------------------------

/**
 * Focuses the first menuitem in the given menu (menubar or submenu).
 * Returns the focused element, or `null` if the menu is empty.
 */
export function focusFirstItem(
  navEl: HTMLElement,
  menu: HTMLElement,
): HTMLElement | null {
  const items = getMenuItems(menu);
  const first = items[0];
  if (!first) return null;
  focusItem(navEl, first);
  return first;
}

/**
 * Focuses the last menuitem in the given menu.
 */
export function focusLastItem(
  navEl: HTMLElement,
  menu: HTMLElement,
): HTMLElement | null {
  const items = getMenuItems(menu);
  const last = items[items.length - 1];
  if (!last) return null;
  focusItem(navEl, last);
  return last;
}

/**
 * Focuses the next menuitem in the given menu, wrapping to the first
 * if `current` is the last item.
 */
export function focusNextItem(
  navEl: HTMLElement,
  menu: HTMLElement,
  current: HTMLElement,
): HTMLElement | null {
  const items = getMenuItems(menu);
  const idx = items.indexOf(current);
  if (idx === -1) return null;
  const next = items[(idx + 1) % items.length];
  if (!next) return null;
  focusItem(navEl, next);
  return next;
}

/**
 * Focuses the previous menuitem in the given menu, wrapping to the last
 * if `current` is the first item.
 */
export function focusPrevItem(
  navEl: HTMLElement,
  menu: HTMLElement,
  current: HTMLElement,
): HTMLElement | null {
  const items = getMenuItems(menu);
  const idx = items.indexOf(current);
  if (idx === -1) return null;
  const prev = items[(idx - 1 + items.length) % items.length];
  if (!prev) return null;
  focusItem(navEl, prev);
  return prev;
}

// ---------------------------------------------------------------------------
// 3.4 — focusByChar (first-character search with wrap-around)
// ---------------------------------------------------------------------------

/**
 * Moves focus to the next menuitem whose visible text starts with `char`.
 * Search starts after `current` and wraps around.
 */
export function focusByChar(
  navEl: HTMLElement,
  menu: HTMLElement,
  current: HTMLElement,
  char: string,
): HTMLElement | null {
  const items = getMenuItems(menu);
  if (items.length === 0) return null;

  const lowerChar = char.toLowerCase();
  const startIdx = items.indexOf(current);
  if (startIdx === -1) return null;

  // Search from current+1 to end, then from 0 to current
  for (let i = 1; i <= items.length; i++) {
    const candidate = items[(startIdx + i) % items.length];
    if (!candidate) continue;
    const text = candidate.textContent?.trim().toLowerCase();
    if (text && text.charAt(0) === lowerChar) {
      focusItem(navEl, candidate);
      return candidate;
    }
  }

  return null;
}
