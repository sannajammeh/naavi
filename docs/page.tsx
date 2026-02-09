// ---------------------------------------------------------------------------
// Docs page — SSR'd React component (bunchee-it style)
// ---------------------------------------------------------------------------

import {
  Root,
  List,
  Item,
  Trigger,
  Content,
  Link,
  Separator,
} from "../src/index.ts";

const INSTALL_CMD = "bun add naavi";

const BASIC_EXAMPLE = `import { Root, List, Item, Trigger, Content, Link } from "naavi"

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
}`;

// ---------------------------------------------------------------------------
// Minimal CSS snippets for each example pattern
// ---------------------------------------------------------------------------

const CSS_LINKS_ONLY = `/* Links only — horizontal bar */
[role="menubar"] {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

[role="menuitem"] {
  padding: .5rem .85rem;
  color: inherit;
  text-decoration: none;
}`;

const CSS_DROPDOWN = `/* Dropdown — menubar + one level of submenus */
[role="menubar"] {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

[role="menuitem"] {
  padding: .5rem .85rem;
  color: inherit;
  text-decoration: none;
}

/* Position submenus below trigger */
[role="menubar"] > [role="none"] {
  position: relative;
}

[data-navi-content] {
  position: absolute;
  top: 100%;
  left: 0;
  list-style: none;
  margin: 0;
  padding: .25rem 0;
  min-width: 160px;
}

[data-navi-content][data-state="closed"] { display: none; }
[data-navi-content][data-state="open"]   { display: block; }`;

const CSS_NESTED = `/* Nested — adds flyout submenus to the right */
[data-navi-content] [role="none"] {
  position: relative;
}

[data-navi-content] [data-navi-content] {
  top: 0;
  left: 100%;
}`;

const CSS_SEPARATOR = `/* Separator — thin line between groups */
[role="separator"] {
  height: 1px;
  background: #ddd;
  margin: .25rem 0;
  list-style: none;
}`;

const CSS_FULL = `/* Full — all patterns combined (minimal) */
[role="menubar"] {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

[role="menuitem"] {
  padding: .5rem .85rem;
  color: inherit;
  text-decoration: none;
}

[role="menubar"] > [role="none"] { position: relative; }
[data-navi-content] [role="none"] { position: relative; }

[data-navi-content] {
  position: absolute;
  top: 100%;
  left: 0;
  list-style: none;
  margin: 0;
  padding: .25rem 0;
  min-width: 160px;
}

[data-navi-content][data-state="closed"] { display: none; }
[data-navi-content][data-state="open"]   { display: block; }

/* Nested: flyout right */
[data-navi-content] [data-navi-content] {
  top: 0;
  left: 100%;
}

/* Separator */
[role="separator"] {
  height: 1px;
  background: #ddd;
  margin: .25rem 0;
  list-style: none;
}`;

const NESTED_EXAMPLE = `<Item value="products">
  <Trigger>Products</Trigger>
  <Content aria-label="Products">
    <Item value="software">
      <Trigger>Software</Trigger>
      <Content aria-label="Software">
        <Item value="ide">
          <Link href="/ide">IDE</Link>
        </Item>
        <Item value="cli">
          <Link href="/cli">CLI Tools</Link>
        </Item>
      </Content>
    </Item>
    <Separator />
    <Item value="docs">
      <Link href="/docs">Docs</Link>
    </Item>
  </Content>
</Item>`;

const CONTROLLED_EXAMPLE = `function ControlledNav() {
  const [path, setPath] = useState<string[]>([])

  return (
    <Root value={path} onValueChange={setPath}>
      <List>
        {/* ... */}
      </List>
    </Root>
  )
}`;

const POLYMORPHIC_EXAMPLE = `import { Item, Link } from "naavi"
import NextLink from "next/link"

<Item value="about">
  <Link render={<NextLink href="/about" />}>
    About
  </Link>
</Item>`;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// SVG arrows for examples
// ---------------------------------------------------------------------------

function DownArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="navi-arrow down"
      width="10"
      height="7"
      viewBox="0 0 12 9"
    >
      <polygon points="1 0, 11 0, 6 8" />
    </svg>
  );
}

function RightArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="navi-arrow right"
      width="7"
      height="10"
      viewBox="0 0 9 12"
    >
      <polygon points="0 1, 0 11, 8 6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Live examples (SSR'd — renders real HTML with ARIA roles + data attrs)
// ---------------------------------------------------------------------------

function LiveBasic() {
  return (
    <div className="example-wrapper">
      <Root aria-label="Basic example">
        <List>
          <Item value="home">
            <Link href="#home">Home</Link>
          </Item>
          <Item value="about">
            <Link href="#about">About</Link>
          </Item>
          <Item value="contact">
            <Link href="#contact">Contact</Link>
          </Item>
        </List>
      </Root>
    </div>
  );
}

function LiveDropdown() {
  return (
    <div className="example-wrapper">
      <Root aria-label="Dropdown example">
        <List>
          <Item value="home">
            <Link href="#home">Home</Link>
          </Item>
          <Item value="products">
            <Trigger href="#products">
              Products
              <DownArrow />
            </Trigger>
            <Content aria-label="Products">
              <Item value="analytics">
                <Link href="#analytics">Analytics</Link>
              </Item>
              <Item value="automation">
                <Link href="#automation">Automation</Link>
              </Item>
            </Content>
          </Item>
          <Item value="pricing">
            <Link href="#pricing">Pricing</Link>
          </Item>
        </List>
      </Root>
    </div>
  );
}

function LiveNested() {
  return (
    <div className="example-wrapper">
      <Root aria-label="Nested example">
        <List>
          <Item value="home">
            <Link href="#home">Home</Link>
          </Item>
          <Item value="docs">
            <Trigger href="#docs">
              Docs
              <DownArrow />
            </Trigger>
            <Content aria-label="Docs">
              <Item value="guide">
                <Link href="#guide">Guide</Link>
              </Item>
              <Item value="api">
                <Trigger href="#api">
                  API
                  <RightArrow />
                </Trigger>
                <Content aria-label="API">
                  <Item value="components">
                    <Link href="#components">Components</Link>
                  </Item>
                  <Item value="hooks">
                    <Link href="#hooks">Hooks</Link>
                  </Item>
                </Content>
              </Item>
            </Content>
          </Item>
          <Item value="blog">
            <Link href="#blog">Blog</Link>
          </Item>
        </List>
      </Root>
    </div>
  );
}

function LiveSeparators() {
  return (
    <div className="example-wrapper">
      <Root aria-label="Separator example">
        <List>
          <Item value="file">
            <Trigger href="#file">
              File
              <DownArrow />
            </Trigger>
            <Content aria-label="File">
              <Item value="new">
                <Link href="#new">New</Link>
              </Item>
              <Item value="open">
                <Link href="#open">Open</Link>
              </Item>
              <Separator />
              <Item value="export">
                <Link href="#export">Export</Link>
              </Item>
            </Content>
          </Item>
          <Item value="edit">
            <Trigger href="#edit">
              Edit
              <DownArrow />
            </Trigger>
            <Content aria-label="Edit">
              <Item value="undo">
                <Link href="#undo">Undo</Link>
              </Item>
              <Separator />
              <Item value="cut">
                <Link href="#cut">Cut</Link>
              </Item>
              <Item value="paste">
                <Link href="#paste">Paste</Link>
              </Item>
            </Content>
          </Item>
        </List>
      </Root>
    </div>
  );
}

function LiveFull() {
  return (
    <div className="example-wrapper">
      <Root aria-label="Full example">
        <List>
          <Item value="home">
            <Link href="#home">Home</Link>
          </Item>
          <Item value="about">
            <Trigger href="#about">
              About
              <DownArrow />
            </Trigger>
            <Content aria-label="About">
              <Item value="team">
                <Trigger href="#team">
                  Team
                  <RightArrow />
                </Trigger>
                <Content aria-label="Team">
                  <Item value="eng">
                    <Link href="#eng">Engineering</Link>
                  </Item>
                  <Item value="design">
                    <Link href="#design">Design</Link>
                  </Item>
                </Content>
              </Item>
              <Separator />
              <Item value="careers">
                <Link href="#careers">Careers</Link>
              </Item>
            </Content>
          </Item>
          <Item value="services">
            <Trigger href="#services">
              Services
              <DownArrow />
            </Trigger>
            <Content aria-label="Services">
              <Item value="consulting">
                <Link href="#consulting">Consulting</Link>
              </Item>
              <Item value="support">
                <Link href="#support">Support</Link>
              </Item>
            </Content>
          </Item>
          <Item value="contact">
            <Link href="#contact">Contact</Link>
          </Item>
        </List>
      </Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Details/Summary tabs (CSS-only, no JS)
// ---------------------------------------------------------------------------

let tabGroupCounter = 0;

function ExampleTabs({
  preview,
  code,
  css,
  label,
}: {
  preview: React.ReactNode;
  code: string;
  css: string;
  label: string;
}) {
  const group = `example-tabs-${++tabGroupCounter}`;
  return (
    <div className="example-tabs">
      <details name={group} open>
        <summary>{label}</summary>
        <div className="tab-preview">{preview}</div>
      </details>
      <details name={group}>
        <summary>Code</summary>
        <div className="tab-code">
          <pre className="code-block">
            <code>{code}</code>
          </pre>
        </div>
      </details>
      <details name={group}>
        <summary>CSS</summary>
        <div className="tab-css">
          <pre className="code-block">
            <code>{css}</code>
          </pre>
        </div>
      </details>
    </div>
  );
}

function Terminal({ children }: { children: string }) {
  return (
    <div className="terminal">
      <span className="terminal-prompt">→ ~/project $</span> {children}
    </div>
  );
}

function Code({ children, lang }: { children: string; lang?: string }) {
  return (
    <pre className="code-block">
      <code>{children}</code>
    </pre>
  );
}

function PropRow({
  name,
  type,
  def,
  desc,
}: {
  name: string;
  type: string;
  def?: string;
  desc: string;
}) {
  return (
    <tr>
      <td className="prop-name">{name}</td>
      <td className="prop-type">{type}</td>
      <td className="prop-default">{def ?? "—"}</td>
      <td>{desc}</td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function Page() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>naavi</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div className="page">
          <header>
            <span className="logo">◆</span>
            <a
              className="header-link"
              href="https://github.com/sannajammeh/naavi"
            >
              README.md ↗
            </a>
          </header>

          <main>
            <h1 className="title">naavi</h1>
            <p className="subtitle">
              WAI-ARIA compliant navigation menu for React — full keyboard
              navigation, hover state machine, nested submenus.
            </p>

            <a
              className="bundle-badge"
              href="https://bundlejs.com/?q=naavi@0.1.1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="bundle-badge-size">8.95 kB</span>
              <span className="bundle-badge-label">gzip</span>
            </a>

            {/* Install */}
            <Terminal>{INSTALL_CMD}</Terminal>

            {/* Basic usage */}
            <Code lang="tsx">{BASIC_EXAMPLE}</Code>

            {/* Why */}
            <h2># Why this?</h2>
            <ul className="features">
              <li>
                Full{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/">
                  WAI-ARIA menubar navigation
                </a>{" "}
                pattern
              </li>
              <li>
                Keyboard: arrows, Home/End, Escape, Enter/Space, character
                search
              </li>
              <li>Hover arm/disarm state machine with configurable delay</li>
              <li>Nested submenus with depth-aware focus management</li>
              <li>
                Polymorphic rendering via{" "}
                <code>@base-ui/react</code> useRender
              </li>
              <li>Zero runtime deps beyond React + @base-ui</li>
              <li>TypeScript strict mode, ESM-only</li>
            </ul>

            {/* Examples */}
            <h2># Examples</h2>
            <p className="section-desc">
              Live rendered examples. These are actual naavi components
              server-rendered with their real ARIA roles and data attributes.
              Open the playground at <code>localhost:3000</code> for interactive
              demos with keyboard and hover.
            </p>

            <ExampleTabs
              label="Links only"
              preview={<LiveBasic />}
              code={`<Root aria-label="Main">
  <List>
    <Item value="home">
      <Link href="/home">Home</Link>
    </Item>
    <Item value="about">
      <Link href="/about">About</Link>
    </Item>
    <Item value="contact">
      <Link href="/contact">Contact</Link>
    </Item>
  </List>
</Root>`}
              css={CSS_LINKS_ONLY}
            />

            <ExampleTabs
              label="Dropdown"
              preview={<LiveDropdown />}
              code={`<Root aria-label="Main">
  <List>
    <Item value="home">
      <Link href="/home">Home</Link>
    </Item>
    <Item value="products">
      <Trigger>Products</Trigger>
      <Content aria-label="Products">
        <Item value="analytics">
          <Link href="/analytics">Analytics</Link>
        </Item>
        <Item value="automation">
          <Link href="/automation">Automation</Link>
        </Item>
      </Content>
    </Item>
    <Item value="pricing">
      <Link href="/pricing">Pricing</Link>
    </Item>
  </List>
</Root>`}
              css={CSS_DROPDOWN}
            />

            <ExampleTabs
              label="Nested"
              preview={<LiveNested />}
              code={`<Root aria-label="Main">
  <List>
    <Item value="home">
      <Link href="/home">Home</Link>
    </Item>
    <Item value="docs">
      <Trigger>Docs</Trigger>
      <Content aria-label="Docs">
        <Item value="guide">
          <Link href="/guide">Guide</Link>
        </Item>
        <Item value="api">
          <Trigger>API</Trigger>
          <Content aria-label="API">
            <Item value="components">
              <Link href="/components">Components</Link>
            </Item>
            <Item value="hooks">
              <Link href="/hooks">Hooks</Link>
            </Item>
          </Content>
        </Item>
      </Content>
    </Item>
    <Item value="blog">
      <Link href="/blog">Blog</Link>
    </Item>
  </List>
</Root>`}
              css={CSS_NESTED}
            />

            <ExampleTabs
              label="Separators"
              preview={<LiveSeparators />}
              code={`<Root aria-label="Main">
  <List>
    <Item value="file">
      <Trigger>File</Trigger>
      <Content aria-label="File">
        <Item value="new">
          <Link href="/new">New</Link>
        </Item>
        <Item value="open">
          <Link href="/open">Open</Link>
        </Item>
        <Separator />
        <Item value="export">
          <Link href="/export">Export</Link>
        </Item>
      </Content>
    </Item>
    <Item value="edit">
      <Trigger>Edit</Trigger>
      <Content aria-label="Edit">
        <Item value="undo">
          <Link href="/undo">Undo</Link>
        </Item>
        <Separator />
        <Item value="cut">
          <Link href="/cut">Cut</Link>
        </Item>
        <Item value="paste">
          <Link href="/paste">Paste</Link>
        </Item>
      </Content>
    </Item>
  </List>
</Root>`}
              css={CSS_SEPARATOR}
            />

            <ExampleTabs
              label="Full"
              preview={<LiveFull />}
              code={`<Root aria-label="Main">
  <List>
    <Item value="home">
      <Link href="/home">Home</Link>
    </Item>
    <Item value="about">
      <Trigger>About</Trigger>
      <Content aria-label="About">
        <Item value="team">
          <Trigger>Team</Trigger>
          <Content aria-label="Team">
            <Item value="eng">
              <Link href="/eng">Engineering</Link>
            </Item>
            <Item value="design">
              <Link href="/design">Design</Link>
            </Item>
          </Content>
        </Item>
        <Separator />
        <Item value="careers">
          <Link href="/careers">Careers</Link>
        </Item>
      </Content>
    </Item>
    <Item value="services">
      <Trigger>Services</Trigger>
      <Content aria-label="Services">
        <Item value="consulting">
          <Link href="/consulting">Consulting</Link>
        </Item>
        <Item value="support">
          <Link href="/support">Support</Link>
        </Item>
      </Content>
    </Item>
    <Item value="contact">
      <Link href="/contact">Contact</Link>
    </Item>
  </List>
</Root>`}
              css={CSS_FULL}
            />

            {/* Components */}
            <h2># Components</h2>
            <table className="components-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Element</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>Root</code></td>
                  <td><code>{"<nav>"}</code></td>
                  <td>Top-level wrapper. Manages open state, keyboard, outside click, blur.</td>
                </tr>
                <tr>
                  <td><code>List</code></td>
                  <td><code>{"<ul>"}</code></td>
                  <td>Menubar container with <code>role="menubar"</code>.</td>
                </tr>
                <tr>
                  <td><code>Item</code></td>
                  <td><code>{"<li>"}</code></td>
                  <td>Menu item wrapper. Provides context with unique <code>value</code>.</td>
                </tr>
                <tr>
                  <td><code>Trigger</code></td>
                  <td><code>{"<a>"}</code></td>
                  <td>Opens/closes submenu. Has <code>aria-haspopup</code> + <code>aria-expanded</code>.</td>
                </tr>
                <tr>
                  <td><code>Content</code></td>
                  <td><code>{"<ul>"}</code></td>
                  <td>Submenu panel with <code>role="menu"</code>. Portals into Viewport if present.</td>
                </tr>
                <tr>
                  <td><code>Link</code></td>
                  <td><code>{"<a>"}</code></td>
                  <td>Leaf navigation link with <code>role="menuitem"</code>.</td>
                </tr>
                <tr>
                  <td><code>Separator</code></td>
                  <td><code>{"<li>"}</code></td>
                  <td>Visual divider with <code>role="separator"</code>.</td>
                </tr>
                <tr>
                  <td><code>Viewport</code></td>
                  <td><code>{"<div>"}</code></td>
                  <td>Optional container for Content portaling.</td>
                </tr>
                <tr>
                  <td><code>Portal</code></td>
                  <td>—</td>
                  <td>createPortal wrapper. Target via <code>selector</code> prop or auto-created div.</td>
                </tr>
              </tbody>
            </table>

            {/* Nested submenus */}
            <h2># Nested Submenus</h2>
            <p className="section-desc">
              Nest <code>Item → Trigger → Content</code> at any depth.
              Keyboard navigation is depth-aware — left/right moves between
              depths, up/down moves within.
            </p>
            <Code lang="tsx">{NESTED_EXAMPLE}</Code>

            {/* Controlled */}
            <h2># Controlled Mode</h2>
            <p className="section-desc">
              Pass <code>value</code> and <code>onValueChange</code> to control
              the open path externally. Each array element is the open item's
              value at that depth.
            </p>
            <Code lang="tsx">{CONTROLLED_EXAMPLE}</Code>

            {/* Polymorphic */}
            <h2># Polymorphic Rendering</h2>
            <p className="section-desc">
              All components accept a <code>render</code> prop (via{" "}
              <code>@base-ui/react</code> useRender) for custom element
              rendering. Works with Next.js Link, React Router, or any
              component.
            </p>
            <Code lang="tsx">{POLYMORPHIC_EXAMPLE}</Code>

            {/* API — Root */}
            <h2># API Reference</h2>
            <h3>## Root</h3>
            <table className="api-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <PropRow
                  name="value"
                  type="string[]"
                  desc="Controlled open path. Each element = open item value at that depth."
                />
                <PropRow
                  name="onValueChange"
                  type="(path: string[]) => void"
                  desc="Callback when the open path changes."
                />
                <PropRow
                  name="openOnHover"
                  type="boolean | undefined"
                  desc="true = always hover-open, false = never, undefined = arm/disarm state machine."
                />
                <PropRow
                  name="hideDelay"
                  type="number"
                  def="200"
                  desc="Delay in ms before menu closes after mouse leave."
                />
                <PropRow
                  name="closeOnClick"
                  type="boolean"
                  def="true"
                  desc="Whether clicking a Link closes all menus."
                />
                <PropRow
                  name="hideOnBlur"
                  type="boolean"
                  def="true"
                  desc="Whether blur closes all menus."
                />
              </tbody>
            </table>

            <h3>## Item</h3>
            <table className="api-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <PropRow
                  name="value"
                  type="string"
                  desc="Unique identifier. Auto-generated via useId() if omitted."
                />
              </tbody>
            </table>

            <h3>## Link</h3>
            <table className="api-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <PropRow
                  name="closeOnClick"
                  type="boolean"
                  desc="Override root closeOnClick for this specific link."
                />
              </tbody>
            </table>

            <h3>## Content</h3>
            <table className="api-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <PropRow
                  name="aria-label"
                  type="string"
                  desc="Accessible label for the submenu."
                />
              </tbody>
            </table>

            <h3>## Portal</h3>
            <table className="api-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <PropRow
                  name="selector"
                  type="string"
                  desc="CSS selector for portal target. If omitted, creates a div in document.body."
                />
              </tbody>
            </table>

            {/* Keyboard */}
            <h2># Keyboard Navigation</h2>
            <table className="keyboard-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Menubar</th>
                  <th>Submenu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><kbd>→</kbd></td>
                  <td>Next item</td>
                  <td>Open submenu / next menubar item</td>
                </tr>
                <tr>
                  <td><kbd>←</kbd></td>
                  <td>Previous item</td>
                  <td>Close to parent / previous menubar item</td>
                </tr>
                <tr>
                  <td><kbd>↓</kbd></td>
                  <td>Open submenu (first item)</td>
                  <td>Next item</td>
                </tr>
                <tr>
                  <td><kbd>↑</kbd></td>
                  <td>Open submenu (last item)</td>
                  <td>Previous item</td>
                </tr>
                <tr>
                  <td><kbd>Enter</kbd> / <kbd>Space</kbd></td>
                  <td colSpan={2}>Activate link or toggle submenu</td>
                </tr>
                <tr>
                  <td><kbd>Escape</kbd></td>
                  <td colSpan={2}>Close current menu, focus parent trigger</td>
                </tr>
                <tr>
                  <td><kbd>Home</kbd></td>
                  <td colSpan={2}>First item in current menu</td>
                </tr>
                <tr>
                  <td><kbd>End</kbd></td>
                  <td colSpan={2}>Last item in current menu</td>
                </tr>
                <tr>
                  <td><kbd>A–Z</kbd></td>
                  <td colSpan={2}>Focus next item starting with that character</td>
                </tr>
              </tbody>
            </table>

            {/* Data attributes */}
            <h2># Data Attributes</h2>
            <p className="section-desc">
              Style with data attributes — no className conflicts, no CSS-in-JS required.
            </p>
            <Code>{`/* Target open/closed state */
[data-navi-content][data-state="open"] { display: block; }
[data-navi-content][data-state="closed"] { display: none; }

/* Target specific components */
[data-navi-trigger] { }
[data-navi-content] { }
[data-navi-link] { }
[data-navi-viewport] { }`}</Code>

            {/* Peer deps */}
            <h2># Peer Dependencies</h2>
            <ul className="features">
              <li><code>react</code> ^18 || ^19</li>
              <li><code>react-dom</code> ^18 || ^19</li>
              <li><code>@base-ui/react</code> ^1.1.0</li>
              <li><code>typescript</code> ^5</li>
            </ul>
          </main>

          <footer><a href="https://skala.sh">Skala</a> © 2026</footer>
        </div>
      </body>
    </html>
  );
}
