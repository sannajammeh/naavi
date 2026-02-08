import type { RefObject } from "react";
import type { useRender } from "@base-ui/react/use-render";

// ---------------------------------------------------------------------------
// Component State Types (passed to useRender for data-* attribute mapping)
// ---------------------------------------------------------------------------

export interface OpenState {
  open: boolean;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Context Types
// ---------------------------------------------------------------------------

export interface RootContextValue {
  openPath: string[];
  setOpenPath: (path: string[]) => void;
  openOnHover: boolean | undefined;
  armed: boolean;
  setArmed: (armed: boolean) => void;
  hideDelay: number;
  hideTimeout: RefObject<ReturnType<typeof setTimeout> | null>;
  closeOnClick: boolean;
  hideOnBlur: boolean;
  navRef: RefObject<HTMLElement | null>;
  viewport: HTMLElement | null;
  setViewport: (el: HTMLElement | null) => void;
}

export interface DepthContextValue {
  depth: number;
  parentValue: string | null;
}

export interface ItemContextValue {
  value: string;
  depth: number;
}

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------

export interface RootProps
  extends Omit<React.ComponentPropsWithRef<"nav">, "children"> {
  children: React.ReactNode;
  /** Controlled open path. Each element is the value of the open item at that depth. */
  value?: string[];
  /** Callback when the open path changes. */
  onValueChange?: (path: string[]) => void;
  /**
   * Controls hover-to-open behavior.
   * - `true`: always armed (hover always opens)
   * - `false`: hover never opens
   * - `undefined`: armed state machine (arm on open, disarm on close-all)
   */
  openOnHover?: boolean;
  /** Delay in ms before a menu closes after mouse leave. @default 200 */
  hideDelay?: number;
  /** Whether clicking a Link closes all menus. @default true */
  closeOnClick?: boolean;
  /** Whether blur closes all menus. @default true */
  hideOnBlur?: boolean;
}

export interface ListProps extends useRender.ComponentProps<"ul"> {
  children: React.ReactNode;
}

export interface ItemProps extends useRender.ComponentProps<"li"> {
  children: React.ReactNode;
  /** Unique value identifying this item. Auto-generated via useId() if omitted. */
  value?: string;
}

export interface TriggerProps extends useRender.ComponentProps<"a", OpenState> {
  children: React.ReactNode;
}

export interface ContentProps extends useRender.ComponentProps<"ul", OpenState> {
  children: React.ReactNode;
  /** Accessible label for the submenu. */
  "aria-label"?: string;
}

export interface LinkProps extends useRender.ComponentProps<"a"> {
  children: React.ReactNode;
  /** Override root closeOnClick for this specific link. */
  closeOnClick?: boolean;
}

export interface SeparatorProps extends useRender.ComponentProps<"li"> {}

export interface ViewportProps extends useRender.ComponentProps<"div", OpenState> {}

export interface PortalProps {
  children: React.ReactNode;
  /** CSS selector for the portal target. If omitted, creates a div in document.body. */
  selector?: string;
}
