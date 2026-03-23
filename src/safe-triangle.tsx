"use client";
import { useState, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { SAFE_TRIANGLE_ANCHOR_SELECTOR } from "./constants.ts";

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

export interface Point {
  x: number;
  y: number;
}

/**
 * Returns true if point (px, py) is inside the triangle formed by
 * (ax, ay), (bx, by), (cx, cy) using the cross-product sign method.
 */
export function pointInTriangle(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): boolean {
  const d1 = sign(px, py, ax, ay, bx, by);
  const d2 = sign(px, py, bx, by, cx, cy);
  const d3 = sign(px, py, cx, cy, ax, ay);

  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

  return !(hasNeg && hasPos);
}

function sign(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
}

/**
 * Computes the three triangle vertices from cursor position to the two
 * nearest corners of the content rect. Auto-detects direction.
 *
 * Returns [cursor, cornerA, cornerB] or null if cursor is inside the rect.
 */
export function computeTrianglePoints(
  cursorX: number,
  cursorY: number,
  rect: DOMRect,
): [Point, Point, Point] | null {
  const cursor: Point = { x: cursorX, y: cursorY };

  // If cursor is inside the rect, no triangle needed
  if (
    cursorX >= rect.left &&
    cursorX <= rect.right &&
    cursorY >= rect.top &&
    cursorY <= rect.bottom
  ) {
    return null;
  }

  // Prioritize vertical position: if cursor is above or below the rect,
  // always target the nearest horizontal edge. This ensures dropdown menus
  // always get a triangle to the top edge regardless of horizontal offset.
  if (cursorY <= rect.top) {
    // Cursor is ABOVE content → target top edge
    return [cursor, { x: rect.left, y: rect.top }, { x: rect.right, y: rect.top }];
  }
  if (cursorY >= rect.bottom) {
    // Cursor is BELOW content → target bottom edge
    return [cursor, { x: rect.left, y: rect.bottom }, { x: rect.right, y: rect.bottom }];
  }
  // Cursor is vertically within the rect → use left/right edge (flyout case)
  if (cursorX < rect.left) {
    return [cursor, { x: rect.left, y: rect.top }, { x: rect.left, y: rect.bottom }];
  }
  return [cursor, { x: rect.right, y: rect.top }, { x: rect.right, y: rect.bottom }];
}

/**
 * If the content element contains a child with data-safe-triangle-anchor,
 * use that child's rect instead of the content element's rect.
 */
function resolveTargetRect(contentEl: HTMLElement): DOMRect {
  const anchor = contentEl.querySelector<HTMLElement>(SAFE_TRIANGLE_ANCHOR_SELECTOR);
  if (anchor) return anchor.getBoundingClientRect();

  return contentEl.getBoundingClientRect();
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface SafeTriangleAPI {
  isInsideTriangle: (x: number, y: number) => boolean;
  setContentEl: (value: string, el: HTMLElement | null) => void;
  setOrigin: (x: number, y: number) => void;
  updateCursor: (x: number, y: number) => void;
  enabled: boolean;
}

export interface UseSafeTriangleResult {
  api: SafeTriangleAPI;
  triangle: [Point, Point, Point] | null;
}

export function useSafeTriangle(opts: {
  enabled: boolean;
  openPath: string[];
  debug?: boolean;
}): UseSafeTriangleResult {
  const { enabled, openPath, debug = false } = opts;
  const contentEls = useRef<Map<string, HTMLElement>>(new Map());
  const originRef = useRef<Point | null>(null);
  const [triangle, setTriangle] = useState<[Point, Point, Point] | null>(null);

  const setContentEl = useCallback(
    (value: string, el: HTMLElement | null) => {
      if (el) {
        contentEls.current.set(value, el);
      } else {
        contentEls.current.delete(value);
      }
    },
    [],
  );

  /**
   * Store the cursor position when content opens. This fixed "origin"
   * point becomes the triangle apex so that later `isInsideTriangle`
   * checks test whether the *new* cursor position falls inside the
   * path from the origin to the open content.
   */
  const setOrigin = useCallback((x: number, y: number) => {
    originRef.current = { x, y };
  }, []);

  // Find the deepest open content element based on openPath
  const getDeepestContentEl = useCallback((): HTMLElement | null => {
    for (let i = openPath.length - 1; i >= 0; i--) {
      const value = openPath[i];
      if (!value) continue;
      const el = contentEls.current.get(value);
      if (el && el.isConnected) return el;
    }
    return null;
  }, [openPath]);

  const isInsideTriangle = useCallback(
    (x: number, y: number): boolean => {
      if (!enabled || openPath.length === 0) return false;

      const origin = originRef.current;
      if (!origin) return false;

      const deepestEl = getDeepestContentEl();
      if (!deepestEl) return false;

      const rect = resolveTargetRect(deepestEl);
      const tri = computeTrianglePoints(origin.x, origin.y, rect);
      if (!tri) return false; // origin inside content rect

      return pointInTriangle(x, y, tri[0].x, tri[0].y, tri[1].x, tri[1].y, tri[2].x, tri[2].y);
    },
    [enabled, openPath, getDeepestContentEl],
  );

  const updateCursor = useCallback(
    (x: number, y: number) => {
      // Keep origin tracking the cursor so the triangle stays narrow
      originRef.current = { x, y };

      if (!debug || !enabled || openPath.length === 0) {
        setTriangle(null);
        return;
      }

      const deepestEl = getDeepestContentEl();
      if (!deepestEl) {
        setTriangle(null);
        return;
      }

      const rect = resolveTargetRect(deepestEl);
      const tri = computeTrianglePoints(x, y, rect);
      setTriangle(tri);
    },
    [debug, enabled, openPath, getDeepestContentEl],
  );

  // Stable API object — does not change when triangle state changes
  const api = useMemo(
    () => ({ isInsideTriangle, setContentEl, setOrigin, updateCursor, enabled }),
    [isInsideTriangle, setContentEl, setOrigin, updateCursor, enabled],
  );

  return { api, triangle };
}

// ---------------------------------------------------------------------------
// Debug Overlay Component
// ---------------------------------------------------------------------------

export function SafeTriangleOverlay(props: {
  triangle: [Point, Point, Point] | null;
}) {
  const { triangle } = props;

  if (!triangle || typeof document === "undefined") return null;

  const points = triangle.map((p) => `${p.x},${p.y}`).join(" ");

  return createPortal(
    <svg
      data-naavi-safe-triangle=""
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 2147483647,
      }}
    >
      <polygon
        points={points}
        style={{
          fill: "var(--naavi-safe-triangle-fill, rgba(102, 51, 153, 0.15))",
          stroke: "var(--naavi-safe-triangle-stroke, rgba(102, 51, 153, 0.5))",
          strokeWidth: 1,
        }}
      />
    </svg>,
    document.body,
  );
}
