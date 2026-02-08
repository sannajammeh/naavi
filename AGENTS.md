# AGENTS.md — navigation-menu

> Instructions for AI coding agents operating in this repository.

## Project Overview

Bun-native TypeScript library for navigation menu components. Part of the
`skala-org/libraries` collection. ESM-only, no runtime dependencies.

## Toolchain

- **Runtime/bundler:** Bun (NOT Node.js, npm, pnpm, yarn, or vite)
- **Language:** TypeScript 5+ with strict mode
- **Package manager:** `bun install`
- **Test runner:** `bun test` (bun:test, NOT jest/vitest)
- **Type checking:** `bunx tsc --noEmit`
- **No linter/formatter configured** — follow the conventions below

## Commands

```sh
# Install dependencies
bun install

# Run a file
bun <file.ts>

# Run with hot reload (dev server)
bun --hot ./index.ts

# Type check
bunx tsc --noEmit

# Run all tests
bun test

# Run a single test file
bun test <path/to/file.test.ts>

# Run tests matching a pattern
bun test --grep "pattern"

# Build
bun build <entry.ts|entry.html>
```

## Cursor Rules

The `.cursor/rules/` directory contains a symlink to `CLAUDE.md` enforcing Bun
usage. Key rule: **always use Bun instead of Node.js, npm, vite, or any
Node-ecosystem equivalent.**

## Code Style

### File Naming

| Category              | Convention       | Example                     |
|-----------------------|------------------|-----------------------------|
| Source modules        | `kebab-case.ts`  | `menu-item.ts`              |
| Type definition files | `types.ts`       | `src/types.ts`              |
| React components      | `PascalCase.tsx` | `NavigationMenu.tsx`        |
| React hooks           | `camelCase.ts`   | `useNavigation.ts`          |
| Unit tests (co-loc)   | `*.spec.ts`      | `src/menu-item.spec.ts`     |
| Integration tests     | `*.test.ts`      | `tests/navigation.test.ts`  |
| Barrel exports        | `index.ts`       | `src/index.ts`              |
| Styles                | `kebab-case.css` | `global.css`                |

### Imports

- **ESM only** — `"type": "module"` in package.json.
- **Use `import type` for type-only imports** — `verbatimModuleSyntax` is
  enabled, so `import type { Foo } from "./types.ts"` is required when
  importing types that are erased at runtime.
- `.ts` extensions are allowed in import paths (`allowImportingTsExtensions`).
- Order imports: built-in/bun modules, external packages, internal modules,
  then types. Separate groups with a blank line.

```ts
import { describe, test, expect } from "bun:test";

import { someLib } from "external-package";

import { menuItem } from "./menu-item.ts";
import type { MenuItem } from "./types.ts";
```

### TypeScript

- **Strict mode** with extra checks:
  - `noUncheckedIndexedAccess` — array/object index access returns `T | undefined`.
    Always narrow before using indexed values.
  - `noImplicitOverride` — use `override` keyword when overriding base methods.
  - `noFallthroughCasesInSwitch` — every `case` must `break`/`return`.
- `noEmit: true` — TypeScript is for type-checking only; Bun handles execution.
- JSX uses `react-jsx` transform (no `import React` needed in .tsx files).
- Prefer `interface` for object shapes, `type` for unions/intersections/mapped types.
- Export types alongside values from barrel `index.ts` files.

### Naming Conventions

| Element          | Convention    | Example                 |
|------------------|---------------|-------------------------|
| Functions        | `camelCase`   | `getActiveItem()`       |
| Variables        | `camelCase`   | `menuState`             |
| Constants        | `camelCase`   | `defaultConfig`         |
| Types/Interfaces | `PascalCase`  | `MenuConfig`            |
| Enums            | `PascalCase`  | `MenuDirection`         |
| Type parameters  | Single letter | `T`, `K`, `V`           |
| Boolean vars     | `is`/`has`    | `isOpen`, `hasChildren` |

### Error Handling

- Prefer returning `Result` types (`{ ok: true; value: T } | { ok: false; error: E }`)
  over throwing exceptions for expected failure cases.
- Use `try/catch` only for truly exceptional/unexpected errors.
- Always type errors narrowly — avoid `catch (e: any)`.
- When indexed access may be undefined (due to `noUncheckedIndexedAccess`),
  use explicit null checks or optional chaining.

### Functions & Exports

- Prefer `function` declarations over arrow function expressions for top-level
  named exports.
- Use arrow functions for callbacks, inline handlers, and closures.
- Every package should have a barrel `src/index.ts` re-exporting public API.
- Keep modules small and focused — one concept per file.

### Testing (bun:test)

```ts
import { describe, test, expect } from "bun:test";

import { createMenu } from "./menu.ts";
import type { MenuConfig } from "./types.ts";

describe("createMenu", () => {
  test("creates a menu with default config", () => {
    const menu = createMenu();
    expect(menu).toBeDefined();
    expect(menu.items).toEqual([]);
  });

  test("accepts custom config", () => {
    const config: MenuConfig = { direction: "vertical" };
    const menu = createMenu(config);
    expect(menu.direction).toBe("vertical");
  });
});
```

- Co-locate unit tests as `*.spec.ts` next to source files.
- Place integration tests in a `tests/` directory as `*.test.ts`.
- Use `describe` blocks to group related tests.
- Test names should read as sentences: `"creates a menu with default config"`.

### Bun-Specific APIs (Prefer These)

| Need           | Use                 | Do NOT use            |
|----------------|---------------------|-----------------------|
| HTTP server    | `Bun.serve()`       | express, fastify      |
| File I/O       | `Bun.file()`        | `node:fs` read/write  |
| SQLite         | `bun:sqlite`        | better-sqlite3        |
| Redis          | `Bun.redis`         | ioredis               |
| Postgres       | `Bun.sql`           | pg, postgres.js       |
| WebSockets     | Built-in WebSocket  | ws                    |
| Shell commands | `` Bun.$`cmd` ``    | execa, child_process  |
| Env vars       | `process.env` / Bun | dotenv                |
| Dev server     | `bun --hot`         | vite, nodemon         |
| Bundling       | `bun build`         | webpack, esbuild      |
| Package exec   | `bunx`              | npx                   |

### Project Structure Convention

```
src/
  index.ts              # Barrel export (public API)
  types.ts              # Shared type definitions
  <module>.ts           # Feature modules (kebab-case)
  <module>.spec.ts      # Co-located unit tests
tests/
  <feature>.test.ts     # Integration tests
```

## Frontend Verification (MANDATORY)

When doing any frontend work (components, styles, layout, interactions), you
**must** visually confirm your changes using the `agent-browser` skill. Do not
consider frontend work complete until you have verified it in the browser.

Two dev servers are always running:

| URL                  | Purpose                                          |
|----------------------|--------------------------------------------------|
| `localhost:3000`     | Playground app — example/demo usage              |
| `localhost:3001`     | WAI-ARIA specification reference implementation  |

**Workflow:**
1. Make your code changes.
2. Use `agent-browser` to open `localhost:3000` and visually verify the result.
3. Compare behavior against the reference implementation at `localhost:3001`
   when implementing or fixing accessibility/ARIA patterns.
4. Only mark the task as complete after browser confirmation.

### Do NOT

- Use Node.js, npm, pnpm, yarn, or vite — use Bun equivalents.
- Use `dotenv` — Bun loads `.env` automatically.
- Use `any` — prefer `unknown` and narrow with type guards.
- Skip `import type` for type-only imports — `verbatimModuleSyntax` enforces it.
- Commit `.env` files, `node_modules/`, `dist/`, or `coverage/`.
