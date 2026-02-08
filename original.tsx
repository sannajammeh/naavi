// @ts-ignore
"use client";

import { useFocusTrap, useFocusWithin } from "@mantine/hooks";
import {
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Key, useControllableState, useListFocusController } from "../../hooks";
import { type AsChildProps, Slot } from "../_Slot";

const TRIGGER_ATTR = "data-navigation-menu-trigger";
const TRIGGER_SELECTOR = `[${TRIGGER_ATTR}]`;

const CONTENT_ATTR = "data-navigation-menu-content";
// const CONTENT_SELECTOR = `[${CONTENT_ATTR}]`;

const VIEWPORT_ATTR = "data-navigation-menu-viewport";
// const VIEWPORT_SELECTOR = `[${VIEWPORT_ATTR}]`;

const LINK_ATTR = "data-navigation-menu-link";
const LINK_SELECTOR = `[${LINK_ATTR}]`;

const Ids = {
  content: (value: string) => `nc-${value}`,
  trigger: (value: string) => `nt-${value}`,
};

export type NavigationMenuContext = {
  value: string | null;
  setValue: (value: string | null) => void;
  openOnHover?: boolean;
  closeOnClick?: boolean;
  hideTimeout: RefObject<NodeJS.Timeout | null>;
  hideDelay: number;
  viewport: HTMLElement | null;
  setViewport: (el: HTMLElement | null) => void;
  /**
   * Indicates if this is a submenu context
   */
  submenu?: boolean;
};

export const NavigationMenuContext =
  createContext<NavigationMenuContext | null>(null);

function useNavigationMenu(shouldThrow: true): NavigationMenuContext;
function useNavigationMenu(shouldThrow: false): NavigationMenuContext | null;
function useNavigationMenu(shouldThrow?: true): NavigationMenuContext;
function useNavigationMenu(shouldThrow = true) {
  const context = useContext(NavigationMenuContext);
  if (!context && shouldThrow) {
    throw new Error(
      "useNavigationMenu must be used within a NavigationMenu.Root",
    );
  }
  return context;
}

export { useNavigationMenu };

export interface RootProps extends React.ComponentProps<"nav"> {
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  openOnHover?: NavigationMenuContext["openOnHover"];
  closeOnClick?: NavigationMenuContext["closeOnClick"];
  "aria-label"?: string;
  hideDelay?: number;
  hideOnBlur?: boolean;
}

export const Root = ({
  children,
  value: controlledValue,
  onValueChange,
  openOnHover = true,
  closeOnClick = true,
  "aria-label": ariaLabel,
  hideDelay = 100,
  hideOnBlur = true,
  ...rest
}: RootProps) => {
  const [viewport, setViewport] = useState<HTMLElement | null>(null);
  const [value, setValue] = useControllableState(
    null,
    controlledValue,
    onValueChange,
  );
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const requestClose = useCallback(() => {
    setValue(null);
  }, [setValue]);

  const { ref } = useFocusWithin({
    onBlur: () => {
      if (!hideOnBlur) {
        return;
      }
      requestClose();
    },
  });

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === Key.ESCAPE) {
      requestClose();
    }
  };

  return (
    <NavigationMenuContext.Provider
      value={{
        value,
        setValue,
        openOnHover,
        closeOnClick,
        hideTimeout,
        hideDelay,
        viewport,
        setViewport,
      }}
    >
      <nav ref={ref} onKeyDown={handleKeyDown} aria-label={ariaLabel} {...rest}>
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
};

export interface ListProps extends React.ComponentProps<"ul"> {}

export const List = ({ children, ref: initialRef, ...rest }: ListProps) => {
  // Manage rowing through item triggers with arrow keys

  const ref = useRef<HTMLUListElement>(null!);
  const { setValue, value } = useNavigationMenu();
  const controller = useListFocusController({
    focusableElementSelector: `${TRIGGER_SELECTOR}, ${LINK_SELECTOR}`,
  });

  useImperativeHandle(initialRef, () => ref.current);

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    // Arrow left and right should move between trigger items
    // Arrow down should open the current item's content

    const list = ref.current;
    const triggers = Array.from(
      list.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR),
    );

    const currentIndex = triggers.indexOf(
      document.activeElement as HTMLElement,
    );

    if (event.key === Key.ARROW_RIGHT) {
      event.preventDefault();
      const trigger = controller.focusNext();
      // If the menu is open, also open the next item's content
      if (value !== null) {
        const itemValue = trigger?.getAttribute("data-value");
        if (itemValue) {
          setValue(itemValue);
        }
      }
    } else if (event.key === Key.ARROW_LEFT) {
      event.preventDefault();
      const trigger = controller.focusPrev();

      // If the menu is open, also open the previous item's content
      if (value !== null) {
        const itemValue = trigger?.getAttribute("data-value");
        if (itemValue) {
          setValue(itemValue);
        }
      }
    } else if (event.key === Key.ARROW_DOWN) {
      event.preventDefault();
      const currentTrigger = triggers[currentIndex];
      const itemValue = currentTrigger?.getAttribute("data-value");
      const isSubmenuTrigger = currentTrigger?.closest("[data-submenu]");

      // Don't open submenu triggers with arrow down
      if (isSubmenuTrigger) {
        return;
      }

      // If we are open and the value is the current item's value, focus the first focusable element in the content
      if (value === itemValue) {
        // Focus the first focusable element in the content
        const content = document.querySelector<HTMLElement>(
          `[${CONTENT_ATTR}][data-value="${itemValue}"]`,
        );
        if (content) {
          const focusableElements = content.querySelectorAll<HTMLElement>(
            useListFocusController.focusableElements,
          );
          if (focusableElements.length > 0) {
            focusableElements[0]?.focus();
          }
        }
        return;
      }

      if (itemValue) {
        setValue(itemValue);
      }
    } else if (event.key === Key.HOME) {
      event.preventDefault();
      const trigger = controller.focusFirst();
      if (value !== null) {
        const itemValue = trigger?.getAttribute("data-value");
        if (itemValue) {
          setValue(itemValue);
        }
      }
    } else if (event.key === Key.END) {
      event.preventDefault();
      const trigger = controller.focusLast();
      if (value !== null) {
        const itemValue = trigger?.getAttribute("data-value");
        if (itemValue) {
          setValue(itemValue);
        }
      }
    }
  };

  return (
    <ul
      ref={(el) => {
        ref.current = el!;
        controller.ref.current = el!;
      }}
      onKeyDown={handleKeyDown}
      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: <menubar is the correct ARIA role for navigation menu per W3C spec>
      role="menubar"
      {...rest}
    >
      {children}
    </ul>
  );
};

export const ItemContext = createContext<{
  value: string;
}>(null!);

const useItem = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItem must be used within a NavigationMenu.Item");
  }
  return context;
};

export interface ItemProps extends React.ComponentProps<"li"> {
  value?: string;
}

export const Item = ({ children, value, ...rest }: ItemProps) => {
  const internalValue = useId();
  const menu = useNavigationMenu(false);

  const Component = menu?.submenu ? "div" : "li";
  return (
    <ItemContext
      value={{
        value: value || internalValue,
      }}
    >
      <li role="none" {...(rest as React.HTMLAttributes<HTMLElement>)}>
        {children}
      </li>
    </ItemContext>
  );
};

export interface LinkProps extends AsChildProps<React.ComponentProps<"a">> {
  closeOnClick?: boolean;
}

export const Link = ({
  asChild,
  children,
  closeOnClick,
  ...rest
}: LinkProps) => {
  const Component = asChild ? Slot : "a";
  const { setValue, closeOnClick: initialCloseOnClick } = useNavigationMenu();

  const shouldClose = closeOnClick ?? initialCloseOnClick;
  return (
    <Component
      onClick={shouldClose ? () => setValue(null) : undefined}
      {...{
        [LINK_ATTR]: true,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

interface TriggerProps extends AsChildProps<React.ComponentProps<"button">> {}

export const Trigger = ({ asChild, children, ...rest }: TriggerProps) => {
  const Component = asChild ? Slot : "button";
  const {
    value: currentValue,
    setValue,
    openOnHover,
    hideTimeout,
    hideDelay,
  } = useNavigationMenu();
  const { value } = useItem();
  const currentValueRef = useRef(currentValue);
  const isOpen = currentValue === value;

  const toggle = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    if (isOpen) {
      setValue(null);
    } else {
      setValue(value);
    }
  };

  const openOnlyOnHover = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    if (!isOpen) {
      setValue(value);
    }
  };

  const closeIfNotAborted = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    hideTimeout.current = setTimeout(() => {
      currentValueRef.current = currentValue;
      if (currentValueRef.current === value) {
        setValue(null);
      }
    }, hideDelay);
  };

  return (
    <Component
      {...{
        [TRIGGER_ATTR]: true,
      }}
      data-value={value}
      onMouseEnter={openOnHover ? openOnlyOnHover : undefined}
      onMouseLeave={openOnHover === false ? undefined : closeIfNotAborted}
      onClick={toggle}
      // A11y props
      role="menuitem"
      aria-haspopup="true"
      aria-expanded={currentValue === value}
      aria-controls={Ids.content(value)}
      id={Ids.trigger(value)}
      {...rest}
    >
      {children}
    </Component>
  );
};

export interface ContentProps extends React.ComponentProps<"div"> {}

export const Content = ({ children, ...rest }: ContentProps) => {
  const {
    value: currentValue,
    hideTimeout,
    setValue,
    viewport,
    openOnHover,
    hideDelay,
  } = useNavigationMenu();
  const { value } = useContext(ItemContext);
  const isOpen = value === currentValue;

  const { focused, ref: ref2 } = useFocusWithin();
  const ref = useFocusTrap(isOpen && focused);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Set css variables of trigger (anchor) position
      const trigger = document.getElementById(Ids.trigger(value));
      const content = elementRef.current;
      if (trigger && content) {
        const triggerRect = trigger.getBoundingClientRect();
        content.style.setProperty(
          "--anchor-top",
          `${triggerRect.top + window.scrollY}px`,
        );
        content.style.setProperty(
          "--anchor-left",
          `${triggerRect.left + window.scrollX}px`,
        );
        content.style.setProperty("--anchor-width", `${triggerRect.width}px`);
        content.style.setProperty("--anchor-height", `${triggerRect.height}px`);
      }
    }
  }, [isOpen, value]);

  const controller = useListFocusController();

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    switch (event.key) {
      case Key.ARROW_DOWN:
        event.preventDefault();
        event.stopPropagation();
        controller.focusNext();
        break;
      case Key.ARROW_UP:
        event.preventDefault();
        event.stopPropagation();
        controller.focusPrev();
        break;
    }
  };

  const clearTimeoutOfClosingMenu = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
  };

  const startCloseTimeout = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    hideTimeout.current = setTimeout(() => {
      setValue(null);
    }, hideDelay);
  };

  const content = (
    <div
      onMouseEnter={
        openOnHover === false ? undefined : clearTimeoutOfClosingMenu
      }
      onMouseLeave={openOnHover === false ? undefined : startCloseTimeout}
      onKeyDown={handleKeyDown}
      ref={(el) => {
        if (!el) return;
        ref(el);
        ref2(el);
        controller.ref.current = el;
        elementRef.current = el;
      }}
      {...{
        [CONTENT_ATTR]: true,
      }}
      data-value={value}
      id={Ids.content(value)}
      data-state={isOpen ? "open" : "closed"}
      role="menu"
      aria-labelledby={Ids.trigger(value)}
      {...rest}
    >
      {children}
    </div>
  );

  if (viewport) {
    return createPortal(content, viewport);
  }

  return content;
};

interface ViewportProps extends React.ComponentProps<"div"> {}

export const Viewport = ({ children, ...rest }: ViewportProps) => {
  const { value, setViewport } = useNavigationMenu();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      setViewport(ref.current);
    }
  }, [setViewport]);

  return (
    <div
      ref={ref}
      data-state={value ? "open" : "closed"}
      {...{
        [VIEWPORT_ATTR]: true,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export interface PortalProps {
  selector?: string;
  children: React.ReactNode;
}

export const Portal = ({ selector, children }: PortalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (selector) {
      const element = document.querySelector<HTMLElement>(selector);
      setContainer(element);
    } else {
      const element = document.createElement("div");
      element.setAttribute("data-navigation-menu-portal", "");
      document.body.appendChild(element);
      setContainer(element);

      return () => {
        document.body.removeChild(element);
      };
    }
  }, [selector]);

  return container ? createPortal(children, container) : null;
};

// ============================================================================
// Sub Component (for nested navigation)
// ============================================================================

export interface SubProps extends React.ComponentProps<"nav"> {
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  openOnHover?: NavigationMenuContext["openOnHover"];
}

export const Sub = ({
  children,
  value: controlledValue,
  onValueChange,
  openOnHover,
  ...rest
}: SubProps) => {
  const parentContext = useNavigationMenu(); // Get parent menu context
  const { value: parentItemValue } = useItem(); // Get parent item's value
  const [value, setValue] = useControllableState(
    null,
    controlledValue,
    onValueChange,
  );
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const isParentOpenOnItem = parentContext.value === parentItemValue;

  useEffect(() => {
    if (!isParentOpenOnItem) {
      // Close submenu if parent menu is closed or another item is opened
      setValue(null);
    }
  }, [isParentOpenOnItem, setValue]);

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === Key.ESCAPE && value !== null) {
      event.stopPropagation(); // Prevent parent menus from handling this event
      setValue(null);

      // Return focus to the trigger of the submenu that just closed
      setTimeout(() => {
        const trigger = document.getElementById(Ids.trigger(value));
        if (trigger) {
          trigger.focus();
        }
      }, 0);
    }
  };

  return (
    <NavigationMenuContext.Provider
      value={{
        value,
        setValue,
        openOnHover: openOnHover ?? parentContext.openOnHover,
        closeOnClick: parentContext.closeOnClick,
        hideTimeout,
        hideDelay: parentContext.hideDelay,
        viewport: null, // Submenus don't use viewport, they position inline
        setViewport: () => {},
        submenu: true,
      }}
    >
      <li>
        <nav data-submenu onKeyDown={handleKeyDown} {...rest}>
          {children}
        </nav>
      </li>
    </NavigationMenuContext.Provider>
  );
};

export interface BackProps extends AsChildProps<
  React.ComponentProps<"button">
> {}

export const Back = ({ asChild, children, onClick, ...rest }: BackProps) => {
  const Component = asChild ? Slot : "button";
  const { value, setValue } = useNavigationMenu();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setValue(null);

    // Return focus to the trigger of the submenu that just closed
    if (value) {
      setTimeout(() => {
        const trigger = document.getElementById(Ids.trigger(value));
        trigger?.focus();
      }, 0);
    }

    onClick?.(event);
  };

  return (
    <Component type="button" onClick={handleClick} {...rest}>
      {children}
    </Component>
  );
};
