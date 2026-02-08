import { createContext, useContext } from "react";

import type {
  RootContextValue,
  DepthContextValue,
  ItemContextValue,
} from "./types.ts";

// ---------------------------------------------------------------------------
// Context definitions
// ---------------------------------------------------------------------------

export const RootContext = createContext<RootContextValue | null>(null);
export const DepthContext = createContext<DepthContextValue>({
  depth: 0,
  parentValue: null,
});
export const ItemContext = createContext<ItemContextValue | null>(null);

// ---------------------------------------------------------------------------
// Consumer hooks
// ---------------------------------------------------------------------------

export function useRoot(): RootContextValue {
  const ctx = useContext(RootContext);
  if (ctx === null) {
    throw new Error(
      "NavigationMenu: useRoot() must be used within a <Root> component.",
    );
  }
  return ctx;
}

export function useDepth(): DepthContextValue {
  return useContext(DepthContext);
}

export function useItem(): ItemContextValue {
  const ctx = useContext(ItemContext);
  if (ctx === null) {
    throw new Error(
      "NavigationMenu: useItem() must be used within an <Item> component.",
    );
  }
  return ctx;
}
