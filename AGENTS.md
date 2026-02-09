# AGENTS.md — naavi

> Instructions for AI coding agents operating in this repository.

## Project Overview

**naavi** — WAI-ARIA compliant navigation menu components for React. ESM-only.
Peer dependencies: `react`, `react-dom`, `@base-ui/react`, `typescript`.
Uses `@base-ui/react` for polymorphic rendering (`useRender`, `mergeProps`).

## Toolchain

- **Runtime:** Bun (NOT Node.js, npm, pnpm, yarn, or vite)
- **Language:** TypeScript 5+, strict mode
- **Package manager:** `bun install`
- **Test runner:** `bun test` (bun:test + @testing-library/react + happy-dom)
- **Type checking:** `bunx tsc --noEmit`
- **Build:** `bunchee` (NOT `bun build`) — reads `exports` from package.json
- **No linter/formatter configured**

## Commands

```sh
bun install                           # Install dependencies
bunx tsc --noEmit                     # Type check
bun test                              # Run all tests
bun test src/components.spec.tsx      # Run a single test file
bun test --grep "click trigger"       # Run tests matching pattern
bun run build                         # Build with bunchee → dist/
bun run dev                           # All dev servers via frunk
bun --hot playground/server.ts        # Playground only (port 3000)
```

## Dev Servers

| URL              | Script                              | Purpose                          |
|------------------|-------------------------------------|----------------------------------|
| `localhost:3000` | `bun --hot playground/server.ts`    | Playground — demo/example usage  |
| `localhost:3001` | `bun run wai-aria-spec/index.html`  | WAI-ARIA reference implementation|
| `localhost:3002` | `bun --hot docs/server.tsx`         | Docs site (SSR)                  |

`bun run dev` starts all three via `frunk`.

## Test Setup

- **bunfig.toml** preloads `tests/preload.ts` which registers happy-dom globally
- Tests use `bun:test` (`describe`, `test`, `expect`, `beforeEach`)
- DOM testing via `@testing-library/react` (`render`, `screen`, `fireEvent`, `act`)
- Clean up with `beforeEach(() => { document.body.innerHTML = ""; })`
- Some behaviors only reproduce in real browsers — verify via `agent-browser`

## Project Structure

```
src/
  index.ts              # Barrel export (public API)
  types.ts              # All TypeScript interfaces/types
  components.tsx        # All React components (Root, List, Item, Trigger, etc.)
  components.spec.tsx   # Co-located unit tests
  constants.ts          # Data attribute constants, selectors, ID generators
  context.ts            # React contexts + consumer hooks
  focus.ts              # DOM query helpers + focus management
  keyboard.ts           # useMenuKeyboard hook — keyboard navigation
playground/             # Demo app (port 3000)
docs/                   # SSR docs site (port 3002), deployed to Vercel
wai-aria-spec/          # W3C reference implementation (port 3001)
tests/
  preload.ts            # happy-dom global registration
openspec/               # Spec-driven change management
```

## Code Style

### File Naming

| Category         | Convention       | Example               |
|------------------|------------------|-----------------------|
| Source modules   | `kebab-case.ts`  | `focus.ts`            |
| React components | `PascalCase.tsx` | `App.tsx`             |
| React hooks      | `camelCase.ts`   | `useNavigation.ts`    |
| Unit tests       | `*.spec.tsx`     | `components.spec.tsx` |
| Barrel exports   | `index.ts`       | `src/index.ts`        |

### Imports

ESM only. `verbatimModuleSyntax` is enabled — **must use `import type` for
type-only imports**. `.ts`/`.tsx` extensions in import paths.

Order: react builtins → external packages → internal modules → types.
Separate groups with blank lines.

```ts
import { useState, useRef } from "react";

import { useRender } from "@base-ui/react/use-render";

import { useRoot } from "./context.ts";
import { focusItem } from "./focus.ts";
import type { RootProps } from "./types.ts";
```

Components file uses `"use client"` directive at the top.

### TypeScript

- **Strict mode** with `noUncheckedIndexedAccess`, `noImplicitOverride`,
  `noFallthroughCasesInSwitch`
- `noEmit: true` — TS is for type-checking only; Bun handles execution
- JSX uses `react-jsx` transform (no `import React` needed)
- Prefer `interface` for object shapes, `type` for unions/intersections

### Naming Conventions

| Element          | Convention        | Example                          |
|------------------|-------------------|----------------------------------|
| Functions/hooks  | `camelCase`       | `focusItem()`, `useMenuKeyboard` |
| Variables        | `camelCase`       | `menuState`, `openPath`          |
| Constants        | `UPPER_SNAKE_CASE`| `TRIGGER_ATTR`, `CONTENT_ATTR`   |
| Types/Interfaces | `PascalCase`      | `RootProps`, `OpenState`         |
| Components       | `PascalCase`      | `Root`, `Trigger`, `Content`     |
| Booleans         | `is`/`has` prefix | `isOpen`, `hasChildren`          |

### Error Handling

- Prefer `Result` types over throwing for expected failures
- `try/catch` only for truly exceptional errors
- Narrow errors — avoid `catch (e: any)`, prefer `unknown`
- Handle `T | undefined` from indexed access (due to `noUncheckedIndexedAccess`)

### Functions & Exports

- `function` declarations for top-level named exports
- Arrow functions for callbacks and closures
- Barrel `src/index.ts` re-exports public API with separate `export` and
  `export type` blocks

### Testing Pattern

```tsx
import { useState } from "react";
import { describe, test, expect, beforeEach } from "bun:test";
import { render, screen, fireEvent, act } from "@testing-library/react";

import { Root, List, Item, Trigger, Content } from "./components.tsx";

describe("feature name", () => {
  beforeEach(() => { document.body.innerHTML = ""; });

  test("descriptive sentence about behavior", async () => {
    render(<MyComponent />);
    await act(() => { fireEvent.click(screen.getByText("Button")); });
    expect(screen.getByTestId("result")).toBeDefined();
  });
});
```

- Co-locate unit tests as `*.spec.tsx` next to source
- Test names read as sentences: `"click trigger opens menu"`
- Use `async` + `await act()` for state updates
- Helper components/functions defined at top of test file

## Frontend Verification (MANDATORY)

When doing frontend work, **visually confirm changes** using `agent-browser`.

1. Make code changes
2. Open `localhost:3000` in agent-browser to verify
3. Compare against reference at `localhost:3001` for ARIA/a11y patterns
4. Only mark complete after browser confirmation

## Do NOT

- Use Node.js, npm, pnpm, yarn, or vite — Bun only
- Use `bun build` for the library — use `bun run build` (bunchee)
- Use `any` — prefer `unknown` and narrow with type guards
- Skip `import type` for type-only imports
- Use `dotenv` — Bun loads `.env` automatically
- Commit `.env` files, `node_modules/`, `dist/`, or `coverage/`
