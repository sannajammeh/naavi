# navi

WAI-ARIA compliant navigation menu components for React. Full keyboard navigation, hover state machine, nested submenus, and polymorphic rendering.

## Install

```bash
bun add navi
```

## Quick Start

```tsx
import { Root, List, Item, Trigger, Content, Link } from "navi"

function Nav() {
  return (
    <Root aria-label="Main">
      <List>
        <Item value="home">
          <Link href="/">Home</Link>
        </Item>
        <Item value="about">
          <Trigger>About</Trigger>
          <Content aria-label="About">
            <Item value="team">
              <Link href="/team">Team</Link>
            </Item>
            <Item value="blog">
              <Link href="/blog">Blog</Link>
            </Item>
          </Content>
        </Item>
      </List>
    </Root>
  )
}
```

## Features

- Full [WAI-ARIA menubar navigation](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/) pattern
- Keyboard: arrows, Home/End, Escape, Enter/Space, character search
- Hover arm/disarm state machine with configurable delay
- Nested submenus at any depth with depth-aware focus management
- Polymorphic rendering via `@base-ui/react` useRender
- Controlled and uncontrolled modes
- Zero runtime deps beyond React + @base-ui
- TypeScript strict mode, ESM-only

## Components

| Component | Element | Description |
|-----------|---------|-------------|
| `Root` | `<nav>` | Top-level wrapper. Manages open state, keyboard, outside click, blur. |
| `List` | `<ul>` | Menubar container with `role="menubar"`. |
| `Item` | `<li>` | Menu item wrapper. Provides context with unique `value`. |
| `Trigger` | `<a>` | Opens/closes submenu. Has `aria-haspopup` + `aria-expanded`. |
| `Content` | `<ul>` | Submenu panel with `role="menu"`. Portals into Viewport if present. |
| `Link` | `<a>` | Leaf navigation link with `role="menuitem"`. |
| `Separator` | `<li>` | Visual divider with `role="separator"`. |
| `Viewport` | `<div>` | Optional container for Content portaling. |
| `Portal` | — | createPortal wrapper. Target via `selector` prop or auto-created div. |

## API

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string[]` | — | Controlled open path. Each element = open item value at that depth. |
| `onValueChange` | `(path: string[]) => void` | — | Callback when the open path changes. |
| `openOnHover` | `boolean \| undefined` | `undefined` | `true` = always hover-open, `false` = never, `undefined` = arm/disarm state machine. |
| `hideDelay` | `number` | `200` | Delay in ms before menu closes after mouse leave. |
| `closeOnClick` | `boolean` | `true` | Whether clicking a Link closes all menus. |
| `hideOnBlur` | `boolean` | `true` | Whether blur closes all menus. |

### Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Unique identifier. Auto-generated via `useId()` if omitted. |

### Link

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `closeOnClick` | `boolean` | — | Override root `closeOnClick` for this specific link. |

### Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `aria-label` | `string` | — | Accessible label for the submenu. |

### Portal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selector` | `string` | — | CSS selector for portal target. If omitted, creates a div in `document.body`. |

## Keyboard Navigation

| Key | Menubar | Submenu |
|-----|---------|---------|
| `→` | Next item | Open submenu / next menubar item |
| `←` | Previous item | Close to parent / previous menubar item |
| `↓` | Open submenu (first item) | Next item |
| `↑` | Open submenu (last item) | Previous item |
| `Enter` / `Space` | Activate link or toggle submenu | Activate link or toggle submenu |
| `Escape` | Close current menu, focus parent trigger | Close current menu, focus parent trigger |
| `Home` | First item in current menu | First item in current menu |
| `End` | Last item in current menu | Last item in current menu |
| `A–Z` | Focus next item starting with that character | Focus next item starting with that character |

## Styling

Style with data attributes — no className conflicts, no CSS-in-JS required.

```css
[data-navi-content][data-state="open"] { display: block; }
[data-navi-content][data-state="closed"] { display: none; }

[data-navi-trigger] { }
[data-navi-content] { }
[data-navi-link] { }
[data-navi-viewport] { }
```

## Polymorphic Rendering

All components accept a `render` prop via `@base-ui/react` useRender:

```tsx
import { Item, Link } from "navi"
import NextLink from "next/link"

<Item value="about">
  <Link render={<NextLink href="/about" />}>
    About
  </Link>
</Item>
```

## Peer Dependencies

- `react` ^18 || ^19
- `react-dom` ^18 || ^19
- `@base-ui/react` ^1.1.0
- `typescript` ^5

## Development

```bash
bun install
bun run dev          # playground (3000) + reference (3001) + docs (3002)
bun test             # run tests
bun run typecheck    # type check
bun run build        # build for publish
```

## License

[MIT](LICENSE)
