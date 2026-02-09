/** Data attribute placed on trigger elements. */
export const TRIGGER_ATTR = "data-navi-trigger";
export const TRIGGER_SELECTOR = `[${TRIGGER_ATTR}]`;

/** Data attribute placed on content (submenu) elements. */
export const CONTENT_ATTR = "data-navi-content";
export const CONTENT_SELECTOR = `[${CONTENT_ATTR}]`;

/** Data attribute placed on the viewport element. */
export const VIEWPORT_ATTR = "data-navi-viewport";
export const VIEWPORT_SELECTOR = `[${VIEWPORT_ATTR}]`;

/** Data attribute placed on link elements. */
export const LINK_ATTR = "data-navi-link";
export const LINK_SELECTOR = `[${LINK_ATTR}]`;

/** Data attribute placed on portal-created containers. */
export const PORTAL_ATTR = "data-navi-portal";

/** Selector for menuitem role elements. */
export const MENUITEM_SELECTOR = '[role="menuitem"]';

/** Selector for menu role elements (submenus). */
export const MENU_SELECTOR = '[role="menu"]';

/** Selector for menubar role elements. */
export const MENUBAR_SELECTOR = '[role="menubar"]';

/** ID generators for linking trigger ↔ content via aria-controls / aria-labelledby. */
export const Ids = {
  trigger: (value: string) => `nt-${value}`,
  content: (value: string) => `nc-${value}`,
};
