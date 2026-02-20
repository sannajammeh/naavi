"use client";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";

import {
  RootContext,
  DepthContext,
  ItemContext,
  SettingsContext,
  useRoot,
  useDepth,
  useItem,
  useSettings,
} from "./context.ts";
import { useMenuKeyboard } from "./keyboard.ts";
import {
  Ids,
  TRIGGER_ATTR,
  CONTENT_ATTR,
  VIEWPORT_ATTR,
  LINK_ATTR,
  CLOSE_ATTR,
  PORTAL_ATTR,
  MENUITEM_SELECTOR,
} from "./constants.ts";
import { focusItem } from "./focus.ts";
import type {
  RootProps,
  ListProps,
  ItemProps,
  TriggerProps,
  ContentProps,
  LinkProps,
  CloseProps,
  SeparatorProps,
  ViewportProps,
  PortalProps,
  RootContextValue,
  SettingsContextValue,
  OpenState,
} from "./types.ts";

// ---------------------------------------------------------------------------
// 5.1 — Root
// ---------------------------------------------------------------------------

export function Root({
  children,
  value: controlledValue,
  onValueChange,
  openOnHover,
  hideDelay = 200,
  closeOnClick = true,
  hideOnBlur = true,
  ...navProps
}: RootProps) {
  const [internalPath, setInternalPath] = useState<string[]>([]);
  const [armed, setArmedInternal] = useState(false);
  const [viewport, setViewport] = useState<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = controlledValue !== undefined;
  const openPath = isControlled ? controlledValue : internalPath;

  const setOpenPath = useCallback(
    (path: string[]) => {
      if (!isControlled) {
        setInternalPath(path);
      }
      onValueChange?.(path);
    },
    [isControlled, onValueChange],
  );

  // 6.1 — Armed state machine: arm on open, disarm on close-all
  const setArmed = useCallback(
    (value: boolean) => {
      // 6.2 — openOnHover overrides
      if (openOnHover === true) return; // always armed
      if (openOnHover === false) return; // never armed
      setArmedInternal(value);
    },
    [openOnHover],
  );

  // Effective armed state: openOnHover overrides the state machine
  const effectiveArmed =
    openOnHover === true ? true : openOnHover === false ? false : armed;

  const ctx: RootContextValue = useMemo(
    () => ({
      openPath,
      setOpenPath,
      armed: effectiveArmed,
      setArmed,
      hideDelay,
      hideTimeout,
      closeOnClick,
      hideOnBlur,
      navRef,
      viewport,
      setViewport,
    }),
    [
      openPath,
      setOpenPath,
      effectiveArmed,
      setArmed,
      hideDelay,
      closeOnClick,
      hideOnBlur,
      viewport,
    ],
  );

  const settings: SettingsContextValue = useMemo(
    () => ({ openOnHover }),
    [openOnHover],
  );

  const onKeyDown = useMenuKeyboard({ ctx });

  // 6.4 — Click-outside handler
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenPath([]);
        setArmedInternal(false);
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
          hideTimeout.current = null;
        }
      }
    }
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [setOpenPath]);

  // 6.5 — Blur handler
  useEffect(() => {
    if (!hideOnBlur) return;

    function onFocusOut(e: FocusEvent) {
      const nav = navRef.current;
      if (!nav) return;
      // relatedTarget is the element receiving focus
      const newTarget = e.relatedTarget as Node | null;
      if (newTarget && nav.contains(newTarget)) return;
      // Focus left the nav entirely
      setOpenPath([]);
      setArmedInternal(false);
    }

    const nav = navRef.current;
    if (nav) {
      nav.addEventListener("focusout", onFocusOut);
      return () => nav.removeEventListener("focusout", onFocusOut);
    }
    return undefined;
  }, [hideOnBlur, setOpenPath]);

  // Set initial tabindex on first menuitem
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const firstItem = nav.querySelector<HTMLElement>(MENUITEM_SELECTOR);
    if (firstItem && firstItem.getAttribute("tabindex") !== "0") {
      firstItem.setAttribute("tabindex", "0");
    }
  }, []);

  return (
    <RootContext.Provider value={ctx}>
      <SettingsContext.Provider value={settings}>
        <nav ref={navRef} onKeyDown={onKeyDown} {...navProps}>
          {children}
        </nav>
      </SettingsContext.Provider>
    </RootContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// 5.2 — List
// ---------------------------------------------------------------------------

export function List({ children, render, ...otherProps }: ListProps) {
  const element = useRender({
    render,
    defaultTagName: "ul",
    props: mergeProps<"ul">({ role: "menubar" }, otherProps),
  });

  return (
    <DepthContext.Provider value={{ depth: 0, parentValue: null }}>
      {render ? (
        element
      ) : (
        <ul role="menubar" {...otherProps}>
          {children}
        </ul>
      )}
    </DepthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// 5.3 — Item
// ---------------------------------------------------------------------------

export function Item({
  children,
  value: valueProp,
  render,
  ...otherProps
}: ItemProps) {
  const generatedId = useId();
  const value = valueProp ?? generatedId;
  const { depth } = useDepth();

  const itemCtx = useMemo(() => ({ value, depth }), [value, depth]);

  const element = useRender({
    render,
    defaultTagName: "li",
    props: mergeProps<"li">({ role: "none" }, otherProps),
  });

  return (
    <ItemContext.Provider value={itemCtx}>
      {render ? (
        element
      ) : (
        <li role="none" {...otherProps}>
          {children}
        </li>
      )}
    </ItemContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// 5.4 — Trigger
// ---------------------------------------------------------------------------

export function Trigger({
  children,
  render,
  openOnHover: openOnHoverProp,
  ...otherProps
}: TriggerProps) {
  const ctx = useRoot();
  const { value } = useItem();
  const { depth } = useDepth();
  const settings = useSettings();
  const effectiveOpenOnHover = openOnHoverProp ?? settings.openOnHover;

  const isOpen = ctx.openPath[depth] === value;
  const state: OpenState = { open: isOpen };

  const triggerId = Ids.trigger(value);
  const contentId = Ids.content(value);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (isOpen) {
        // Close this and deeper
        ctx.setOpenPath(ctx.openPath.slice(0, depth));
        ctx.setArmed(false);
      } else {
        // Open at this depth
        const next = [...ctx.openPath.slice(0, depth), value];
        ctx.setOpenPath(next);
        ctx.setArmed(true);
      }
    },
    [ctx, value, depth, isOpen],
  );

  // 6.3 — Hover: mouseenter cancels hide timer, opens if armed
  const handleMouseEnter = useCallback(() => {
    if (ctx.hideTimeout.current) {
      clearTimeout(ctx.hideTimeout.current);
      ctx.hideTimeout.current = null;
    }
    // effectiveOpenOnHover: true = always hover, false = never hover, undefined = armed state
    if (effectiveOpenOnHover === false) return;
    if (effectiveOpenOnHover === true || ctx.armed || ctx.openPath.length > 0) {
      const next = [...ctx.openPath.slice(0, depth), value];
      ctx.setOpenPath(next);
    }
  }, [ctx, value, depth, effectiveOpenOnHover]);

  // 6.3 — Hover: mouseleave starts hide timer (depth-scoped)
  const handleMouseLeave = useCallback(() => {
    if (ctx.hideTimeout.current) {
      clearTimeout(ctx.hideTimeout.current);
    }
    ctx.hideTimeout.current = setTimeout(() => {
      ctx.setOpenPath(ctx.openPath.slice(0, depth));
      if (depth === 0) {
        ctx.setArmed(false);
      }
      ctx.hideTimeout.current = null;
    }, ctx.hideDelay);
  }, [ctx, depth]);

  const defaultProps: Record<string, unknown> = {
    id: triggerId,
    role: "menuitem",
    "aria-haspopup": "true",
    "aria-expanded": isOpen,
    "aria-controls": contentId,
    tabIndex: -1,
    [TRIGGER_ATTR]: "",
    "data-value": value,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    children,
  };

  const element = useRender({
    render,
    defaultTagName: "a",
    state,
    props: mergeProps<"a">(defaultProps, otherProps),
  });

  return element;
}

// ---------------------------------------------------------------------------
// 5.5 — Content
// ---------------------------------------------------------------------------

export function Content({
  children,
  render,
  "aria-label": ariaLabel,
  openOnHover,
  ...otherProps
}: ContentProps) {
  const ctx = useRoot();
  const { value } = useItem();
  const { depth } = useDepth();
  const inheritedSettings = useSettings();

  const isOpen = ctx.openPath[depth] === value;
  const state: OpenState = { open: isOpen };

  const triggerId = Ids.trigger(value);
  const contentId = Ids.content(value);

  // 6.3 — Hover on content: cancel hide timer
  const handleMouseEnter = useCallback(() => {
    if (ctx.hideTimeout.current) {
      clearTimeout(ctx.hideTimeout.current);
      ctx.hideTimeout.current = null;
    }
  }, [ctx]);

  // 6.3 — Hover leave: start hide timer (depth-scoped)
  const handleMouseLeave = useCallback(() => {
    if (ctx.hideTimeout.current) {
      clearTimeout(ctx.hideTimeout.current);
    }
    ctx.hideTimeout.current = setTimeout(() => {
      ctx.setOpenPath(ctx.openPath.slice(0, depth));
      if (depth === 0) {
        ctx.setArmed(false);
      }
      ctx.hideTimeout.current = null;
    }, ctx.hideDelay);
  }, [ctx, depth]);

  const defaultProps: Record<string, unknown> = {
    id: contentId,
    role: "menu",
    "aria-labelledby": triggerId,
    "aria-label": ariaLabel,
    "data-state": isOpen ? "open" : "closed",
    [CONTENT_ATTR]: "",
    "data-value": value,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    children,
  };

  const element = useRender({
    render,
    defaultTagName: "ul",
    state,
    props: mergeProps<"ul">(defaultProps, otherProps),
  });

  const hasSettingsOverride = openOnHover !== undefined;
  const settingsOverride: SettingsContextValue | null = hasSettingsOverride
    ? { openOnHover }
    : null;

  const inner = (
    <DepthContext.Provider value={{ depth: depth + 1, parentValue: value }}>
      {element}
    </DepthContext.Provider>
  );

  const content = settingsOverride ? (
    <SettingsContext.Provider value={settingsOverride}>
      {inner}
    </SettingsContext.Provider>
  ) : (
    inner
  );

  // If viewport exists, portal into it (only for depth 0 content)
  if (ctx.viewport && depth === 0) {
    return createPortal(content, ctx.viewport);
  }

  return content;
}

// ---------------------------------------------------------------------------
// 5.6 — Link
// ---------------------------------------------------------------------------

export function Link({
  children,
  render,
  closeOnClick: linkCloseOnClick,
  ...otherProps
}: LinkProps) {
  const ctx = useRoot();
  const { depth } = useDepth();

  const shouldClose = linkCloseOnClick ?? ctx.closeOnClick;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (shouldClose) {
        ctx.setOpenPath([]);
        ctx.setArmed(false);
      }
      // Don't prevent default — let the link navigate
    },
    [ctx, shouldClose],
  );

  // Cancel pending hide timer and close submenus deeper than this link
  const handleMouseEnter = useCallback(() => {
    if (ctx.hideTimeout.current) {
      clearTimeout(ctx.hideTimeout.current);
      ctx.hideTimeout.current = null;
    }
    // Close any submenus deeper than this link's depth
    if (ctx.openPath.length > depth) {
      ctx.setOpenPath(ctx.openPath.slice(0, depth));
    }
  }, [ctx, depth]);

  const defaultProps: Record<string, unknown> = {
    role: "menuitem",
    tabIndex: -1,
    [LINK_ATTR]: "",
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    children,
  };

  const element = useRender({
    render,
    defaultTagName: "a",
    props: mergeProps<"a">(defaultProps, otherProps),
  });

  return element;
}

// ---------------------------------------------------------------------------
// 5.6b — Close
// ---------------------------------------------------------------------------

export function Close({
  children,
  render,
  target = "root",
  ...otherProps
}: CloseProps) {
  const ctx = useRoot();
  const { depth } = useDepth();

  const handleClick = useCallback(() => {
    if (target === "root") {
      // Capture trigger ref before clearing openPath
      const triggerValue = ctx.openPath[0];
      ctx.setOpenPath([]);
      ctx.setArmed(false);
      // Focus menubar trigger that opened the chain
      if (triggerValue) {
        const triggerEl = document.getElementById(Ids.trigger(triggerValue));
        const navEl = ctx.navRef.current;
        if (triggerEl && navEl) {
          focusItem(navEl, triggerEl);
        }
      }
    } else {
      // target === "current": close only the containing menu
      ctx.setOpenPath(ctx.openPath.slice(0, depth - 1));
    }
  }, [ctx, depth, target]);

  const defaultProps: Record<string, unknown> = {
    role: "menuitem",
    tabIndex: -1,
    [CLOSE_ATTR]: "",
    onClick: handleClick,
    children,
  };

  const element = useRender({
    render,
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, otherProps),
  });

  return element;
}

// ---------------------------------------------------------------------------
// 5.7 — Separator
// ---------------------------------------------------------------------------

export function Separator({ render, ...otherProps }: SeparatorProps) {
  const element = useRender({
    render,
    defaultTagName: "li",
    props: mergeProps<"li">({ role: "separator" }, otherProps),
  });

  return element;
}

// ---------------------------------------------------------------------------
// 7.1 — Viewport
// ---------------------------------------------------------------------------

export function Viewport({ render, ...otherProps }: ViewportProps) {
  const ctx = useRoot();
  const isOpen = ctx.openPath.length > 0;
  const state: OpenState = { open: isOpen };

  const viewportRef = useCallback(
    (el: HTMLElement | null) => {
      ctx.setViewport(el);
    },
    [ctx],
  );

  const defaultProps: Record<string, unknown> = {
    ref: viewportRef,
    [VIEWPORT_ATTR]: "",
    "data-state": isOpen ? "open" : "closed",
  };

  const element = useRender({
    render,
    defaultTagName: "div",
    state,
    props: mergeProps<"div">(defaultProps, otherProps),
  });

  return element;
}

// ---------------------------------------------------------------------------
// 7.2 — Portal
// ---------------------------------------------------------------------------

export function Portal({ children, selector }: PortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (selector) {
      const el = document.querySelector<HTMLElement>(selector);
      setContainer(el);
      return undefined;
    }

    // Create a container in document.body
    const el = document.createElement("div");
    el.setAttribute(PORTAL_ATTR, "");
    document.body.appendChild(el);
    setContainer(el);

    return () => {
      document.body.removeChild(el);
    };
  }, [selector]);

  if (!container) return null;
  return createPortal(children, container);
}
