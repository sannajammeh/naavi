import { useCallback } from "react";

import {
  getContainingMenu,
  getMenuItems,
  getMenubarItems,
  getSubmenu,
  getParentTrigger,
  getMenubar,
  isMenubar,
  hasPopup,
  focusItem,
  focusFirstItem,
  focusLastItem,
  focusNextItem,
  focusPrevItem,
  focusByChar,
} from "./focus.ts";
import { LINK_ATTR, CLOSE_ATTR, MENUITEM_SELECTOR } from "./constants.ts";
import type { RootContextValue } from "./types.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isPrintableCharacter(key: string): boolean {
  return key.length === 1 && /\S/.test(key);
}

/**
 * Opens the item at `depth` in the openPath, closing anything deeper.
 */
function openAtDepth(
  ctx: RootContextValue,
  value: string,
  depth: number,
): void {
  const next = [...ctx.openPath.slice(0, depth), value];
  ctx.setOpenPath(next);
}

function closeAll(ctx: RootContextValue): void {
  ctx.setOpenPath([]);
  ctx.setArmed(false);
}

function closeCurrentSubmenu(ctx: RootContextValue): void {
  if (ctx.openPath.length === 0) return;
  ctx.setOpenPath(ctx.openPath.slice(0, -1));
}

/**
 * Given a menuitem, determine its depth in the menu hierarchy.
 * menubar items = depth 0, first submenu = depth 1, etc.
 */
function getItemDepth(item: HTMLElement): number {
  let depth = 0;
  let node = item.parentElement;
  while (node) {
    const role = node.getAttribute("role");
    if (role === "menu") {
      depth++;
    } else if (role === "menubar") {
      // menubar items are depth 0
      break;
    }
    node = node.parentElement;
  }
  return depth;
}

/**
 * Gets the value attribute from the Item's data-value on the trigger,
 * or from the trigger's containing <li>.
 */
function getItemValue(trigger: HTMLElement): string | null {
  return trigger.getAttribute("data-value");
}

// ---------------------------------------------------------------------------
// 4.1 — useMenuKeyboard hook
// ---------------------------------------------------------------------------

export interface UseMenuKeyboardParams {
  ctx: RootContextValue;
}

export function useMenuKeyboard({
  ctx,
}: UseMenuKeyboardParams): React.KeyboardEventHandler<HTMLElement> {
  return useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;

      // Only handle events on menuitems
      if (!target.matches(MENUITEM_SELECTOR)) return;

      const navEl = ctx.navRef.current;
      if (!navEl) return;

      const menu = getContainingMenu(target);
      if (!menu) return;

      const key = event.key;
      let flag = false;

      const inMenubar = isMenubar(menu);

      if (inMenubar) {
        // ---------------------------------------------------------------
        // 4.2 — Menubar key mappings
        // ---------------------------------------------------------------
        switch (key) {
          case "ArrowRight": {
            const next = focusNextItem(navEl, menu, target);
            if (next && (ctx.openPath.length > 0 || ctx.armed)) {
              const val = getItemValue(next);
              if (val && hasPopup(next)) {
                openAtDepth(ctx, val, 0);
              } else {
                ctx.setOpenPath([]);
              }
            }
            flag = true;
            break;
          }

          case "ArrowLeft": {
            const prev = focusPrevItem(navEl, menu, target);
            if (prev && (ctx.openPath.length > 0 || ctx.armed)) {
              const val = getItemValue(prev);
              if (val && hasPopup(prev)) {
                openAtDepth(ctx, val, 0);
              } else {
                ctx.setOpenPath([]);
              }
            }
            flag = true;
            break;
          }

          case "ArrowDown": {
            if (hasPopup(target)) {
              const val = getItemValue(target);
              if (val) {
                openAtDepth(ctx, val, 0);
                ctx.setArmed(true);
                // Focus first item in submenu after state update
                requestAnimationFrame(() => {
                  const sub = getSubmenu(target);
                  if (sub) focusFirstItem(navEl, sub);
                });
              }
            }
            flag = true;
            break;
          }

          case "ArrowUp": {
            if (hasPopup(target)) {
              const val = getItemValue(target);
              if (val) {
                openAtDepth(ctx, val, 0);
                ctx.setArmed(true);
                requestAnimationFrame(() => {
                  const sub = getSubmenu(target);
                  if (sub) focusLastItem(navEl, sub);
                });
              }
            }
            flag = true;
            break;
          }

          case "Home": {
            focusFirstItem(navEl, menu);
            flag = true;
            break;
          }

          case "End": {
            focusLastItem(navEl, menu);
            flag = true;
            break;
          }

          // Enter/Space/Escape/Tab handled in shared section below
          default:
            break;
        }
      } else {
        // ---------------------------------------------------------------
        // 4.3 — Submenu key mappings
        // ---------------------------------------------------------------
        switch (key) {
          case "ArrowDown": {
            focusNextItem(navEl, menu, target);
            flag = true;
            break;
          }

          case "ArrowUp": {
            focusPrevItem(navEl, menu, target);
            flag = true;
            break;
          }

          case "ArrowRight": {
            if (hasPopup(target)) {
              // Open nested submenu
              const val = getItemValue(target);
              const depth = getItemDepth(target);
              if (val) {
                openAtDepth(ctx, val, depth);
                requestAnimationFrame(() => {
                  const sub = getSubmenu(target);
                  if (sub) focusFirstItem(navEl, sub);
                });
              }
            } else {
              // Close all submenus, advance to next menubar item, open its submenu
              const menubar = getMenubar(navEl);
              if (menubar) {
                const menubarItems = getMenubarItems(navEl);
                // Find current menubar ancestor
                const currentMenubarValue = ctx.openPath[0];
                let currentMenubarItem: HTMLElement | null = null;
                for (const mi of menubarItems) {
                  if (getItemValue(mi) === currentMenubarValue) {
                    currentMenubarItem = mi;
                    break;
                  }
                }
                if (currentMenubarItem) {
                  const next = focusNextItem(navEl, menubar, currentMenubarItem);
                  if (next) {
                    const val = getItemValue(next);
                    if (val && hasPopup(next)) {
                      openAtDepth(ctx, val, 0);
                      // Keep focus on the menubar trigger, submenu opens beneath
                    } else {
                      ctx.setOpenPath([]);
                    }
                  }
                }
              }
            }
            flag = true;
            break;
          }

          case "ArrowLeft": {
            const parentTrigger = getParentTrigger(menu);
            if (parentTrigger) {
              const parentMenu = getContainingMenu(parentTrigger);
              if (parentMenu && isMenubar(parentMenu)) {
                // Parent is menubar: close submenu, go to prev menubar item, open its submenu
                const prev = focusPrevItem(navEl, parentMenu, parentTrigger);
                if (prev) {
                  const val = getItemValue(prev);
                  if (val && hasPopup(prev)) {
                    openAtDepth(ctx, val, 0);
                  } else {
                    ctx.setOpenPath([]);
                  }
                }
              } else {
                // Parent is submenu: close current level, focus parent trigger
                closeCurrentSubmenu(ctx);
                focusItem(navEl, parentTrigger);
              }
            }
            flag = true;
            break;
          }

          case "Home": {
            focusFirstItem(navEl, menu);
            flag = true;
            break;
          }

          case "End": {
            focusLastItem(navEl, menu);
            flag = true;
            break;
          }

          default:
            break;
        }
      }

      // ---------------------------------------------------------------
      // 4.4 — Enter/Space, Escape, Tab (shared across menubar & submenu)
      // ---------------------------------------------------------------
      if (!flag) {
        switch (key) {
          case "Enter":
          case " ": {
            if (hasPopup(target)) {
              const val = getItemValue(target);
              const depth = getItemDepth(target);
              if (val) {
                openAtDepth(ctx, val, depth);
                ctx.setArmed(true);
                requestAnimationFrame(() => {
                  const sub = getSubmenu(target);
                  if (sub) focusFirstItem(navEl, sub);
                });
              }
            } else {
              // Leaf menuitem — activate it
              if (
                target.hasAttribute(LINK_ATTR) ||
                target.tagName === "A" ||
                target.hasAttribute(CLOSE_ATTR)
              ) {
                target.click();
              }
            }
            flag = true;
            break;
          }

          case "Escape": {
            if (inMenubar) {
              // In menubar, close all and restore roving tabindex on current trigger
              closeAll(ctx);
              focusItem(navEl, target);
            } else {
              // In submenu, close current submenu, focus parent trigger
              const parentTrigger = getParentTrigger(menu);
              closeCurrentSubmenu(ctx);
              if (parentTrigger) {
                focusItem(navEl, parentTrigger);
              }
            }
            flag = true;
            break;
          }

          case "Tab": {
            // Close all menus, disarm, let default Tab behavior happen
            closeAll(ctx);
            // Restore roving tabindex so the menubar trigger remains tabbable.
            // Don't call focusItem (which also calls .focus()) — let Tab move
            // focus naturally to the next/previous element.
            const prev = navEl.querySelector<HTMLElement>(
              `${MENUITEM_SELECTOR}[tabindex="0"]`,
            );
            if (prev && prev !== target) {
              prev.setAttribute("tabindex", "-1");
            }
            target.setAttribute("tabindex", "0");
            // Don't preventDefault — let Tab move focus naturally
            break;
          }

          default: {
            // Character navigation
            if (isPrintableCharacter(key)) {
              focusByChar(navEl, menu, target, key);
              flag = true;
            }
            break;
          }
        }
      }

      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    [ctx],
  );
}
