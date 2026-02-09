// ---------------------------------------------------------------------------
// Docs page — SSR'd React component (bunchee-it style)
// ---------------------------------------------------------------------------

import { useState, useCallback } from "react";

import { NavigationMenu } from "../src/index.ts";

const PKG_MANAGERS = ["bun", "pnpm", "npm"] as const;
type PkgManager = (typeof PKG_MANAGERS)[number];

const BASIC_EXAMPLE = `
import { NavigationMenu } from "naavi"
// or
import { Root, List, Item, Trigger, Content, Link } from "naavi"
// or
import * as Naavi from "naavi"

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
}`.trim();

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

const NESTED_EXAMPLE = `<NavigationMenu.Item value="products">
  <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
  <NavigationMenu.Content aria-label="Products">
    <NavigationMenu.Item value="software">
      <NavigationMenu.Trigger>Software</NavigationMenu.Trigger>
      <NavigationMenu.Content aria-label="Software">
        <NavigationMenu.Item value="ide">
          <NavigationMenu.Link href="/ide">IDE</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="cli">
          <NavigationMenu.Link href="/cli">CLI Tools</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Separator />
    <NavigationMenu.Item value="docs">
      <NavigationMenu.Link href="/docs">Docs</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.Content>
</NavigationMenu.Item>`;

const CONTROLLED_EXAMPLE = `function ControlledNav() {
  const [path, setPath] = useState<string[]>([])

  return (
    <NavigationMenu.Root value={path} onValueChange={setPath}>
      <NavigationMenu.List>
        {/* ... */}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}`;

const POLYMORPHIC_EXAMPLE = `import { NavigationMenu } from "naavi"
import NextLink from "next/link"

<NavigationMenu.Item value="about">
  <NavigationMenu.Link render={<NextLink href="/about" />}>
    About
  </NavigationMenu.Link>
</NavigationMenu.Item>`;

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
      <NavigationMenu.Root aria-label="Basic example">
        <NavigationMenu.List>
          <NavigationMenu.Item value="home">
            <NavigationMenu.Link href="#home">Home</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="about">
            <NavigationMenu.Link href="#about">About</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="contact">
            <NavigationMenu.Link href="#contact">Contact</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}

function LiveDropdown() {
  return (
    <div className="example-wrapper">
      <NavigationMenu.Root aria-label="Dropdown example">
        <NavigationMenu.List>
          <NavigationMenu.Item value="home">
            <NavigationMenu.Link href="#home">Home</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger href="#products">
              Products
              <DownArrow />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content aria-label="Products">
              <NavigationMenu.Item value="analytics">
                <NavigationMenu.Link href="#analytics">
                  Analytics
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="automation">
                <NavigationMenu.Link href="#automation">
                  Automation
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="pricing">
            <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}

function LiveNested() {
  return (
    <div className="example-wrapper">
      <NavigationMenu.Root aria-label="Nested example">
        <NavigationMenu.List>
          <NavigationMenu.Item value="home">
            <NavigationMenu.Link href="#home">Home</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="docs">
            <NavigationMenu.Trigger href="#docs">
              Docs
              <DownArrow />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content aria-label="Docs">
              <NavigationMenu.Item value="guide">
                <NavigationMenu.Link href="#guide">Guide</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="api">
                <NavigationMenu.Trigger href="#api">
                  API
                  <RightArrow />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content aria-label="API">
                  <NavigationMenu.Item value="components">
                    <NavigationMenu.Link href="#components">
                      Components
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item value="hooks">
                    <NavigationMenu.Link href="#hooks">
                      Hooks
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="blog">
            <NavigationMenu.Link href="#blog">Blog</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}

function LiveSeparators() {
  return (
    <div className="example-wrapper">
      <NavigationMenu.Root aria-label="Separator example">
        <NavigationMenu.List>
          <NavigationMenu.Item value="file">
            <NavigationMenu.Trigger href="#file">
              File
              <DownArrow />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content aria-label="File">
              <NavigationMenu.Item value="new">
                <NavigationMenu.Link href="#new">New</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="open">
                <NavigationMenu.Link href="#open">Open</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Separator />
              <NavigationMenu.Item value="export">
                <NavigationMenu.Link href="#export">Export</NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="edit">
            <NavigationMenu.Trigger href="#edit">
              Edit
              <DownArrow />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content aria-label="Edit">
              <NavigationMenu.Item value="undo">
                <NavigationMenu.Link href="#undo">Undo</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Separator />
              <NavigationMenu.Item value="cut">
                <NavigationMenu.Link href="#cut">Cut</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="paste">
                <NavigationMenu.Link href="#paste">Paste</NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}

function LiveFull() {
  return (
    <div className="example-wrapper">
      <NavigationMenu.Root openOnHover={true} aria-label="Full example">
        <NavigationMenu.List>
          <NavigationMenu.Item value="home">
            <NavigationMenu.Link href="#home">Home</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="about">
            <NavigationMenu.Trigger href="#about">
              About
              <DownArrow />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content openOnHover={false} aria-label="About">
              <NavigationMenu.Item value="team">
                <NavigationMenu.Trigger href="#team">
                  Team
                  <RightArrow />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content aria-label="Team">
                  <NavigationMenu.Item value="eng">
                    <NavigationMenu.Link href="#eng">
                      Engineering
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item value="design">
                    <NavigationMenu.Link href="#design">
                      Design
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Separator />
              <NavigationMenu.Item value="careers">
                <NavigationMenu.Link href="#careers">
                  Careers
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="services">
            <NavigationMenu.Trigger href="#services">
              Services
              <DownArrow />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content aria-label="Services">
              <NavigationMenu.Item value="consulting">
                <NavigationMenu.Link href="#consulting">
                  Consulting
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="support">
                <NavigationMenu.Link href="#support">
                  Support
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="contact">
            <NavigationMenu.Link href="#contact">Contact</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
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

function InstallCmd() {
  const [pm, setPm] = useState<PkgManager>("bun");
  const [copied, setCopied] = useState(false);
  const cmd = `${pm} i naavi`;

  const copy = useCallback(() => {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [cmd]);

  return (
    <div className="terminal">
      <span className="terminal-prompt">→ ~/project $</span>{" "}
      <select
        className="pm-select"
        value={pm}
        onChange={(e) => setPm(e.target.value as PkgManager)}
        aria-label="Package manager"
      >
        {PKG_MANAGERS.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>{" "}
      i naavi
      <button
        className="copy-btn"
        onClick={copy}
        aria-label="Copy install command"
        type="button"
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="currentColor"
          >
            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="currentColor"
          >
            <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z" />
          </svg>
        )}
      </button>
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div className="page">
          <header>
            <svg
              className="logo"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
              aria-hidden="true"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z" />
            </svg>
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
              href="https://bundlejs.com/?q=naavi@0.2.0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="bundle-badge-size">8.95 kB</span>
              <span className="bundle-badge-label">gzip</span>
            </a>

            {/* Install */}
            <InstallCmd />

            {/* Basic usage */}
            <Code lang="tsx">{BASIC_EXAMPLE}</Code>

            {/* Why */}
            <h2># Why?</h2>
            <ul className="features">
              <li>
                9 kB gzip <code>naavi</code> vs 42.8 kB gzip{" "}
                <code>@base-ui/react</code>
              </li>
              <li>SEO safe rendering cycle</li>
              <li>Respects native behaviour</li>
              <li>
                Full{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/examples/menubar-navigation/">
                  WAI-ARIA menubar navigation
                </a>{" "}
                pattern
              </li>
              <li>Nested submenus with depth-aware focus management</li>
              <li>
                Polymorphic rendering via <code>@base-ui/react</code> useRender
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
              code={`<NavigationMenu.Root aria-label="Main">
  <NavigationMenu.List>
    <NavigationMenu.Item value="home">
      <NavigationMenu.Link href="/home">Home</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="about">
      <NavigationMenu.Link href="/about">About</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="contact">
      <NavigationMenu.Link href="/contact">Contact</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`}
              css={CSS_LINKS_ONLY}
            />

            <ExampleTabs
              label="Dropdown"
              preview={<LiveDropdown />}
              code={`<NavigationMenu.Root aria-label="Main">
  <NavigationMenu.List>
    <NavigationMenu.Item value="home">
      <NavigationMenu.Link href="/home">Home</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="products">
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content aria-label="Products">
        <NavigationMenu.Item value="analytics">
          <NavigationMenu.Link href="/analytics">Analytics</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="automation">
          <NavigationMenu.Link href="/automation">Automation</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="pricing">
      <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`}
              css={CSS_DROPDOWN}
            />

            <ExampleTabs
              label="Nested"
              preview={<LiveNested />}
              code={`<NavigationMenu.Root aria-label="Main">
  <NavigationMenu.List>
    <NavigationMenu.Item value="home">
      <NavigationMenu.Link href="/home">Home</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="docs">
      <NavigationMenu.Trigger>Docs</NavigationMenu.Trigger>
      <NavigationMenu.Content aria-label="Docs">
        <NavigationMenu.Item value="guide">
          <NavigationMenu.Link href="/guide">Guide</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="api">
          <NavigationMenu.Trigger>API</NavigationMenu.Trigger>
          <NavigationMenu.Content aria-label="API">
            <NavigationMenu.Item value="components">
              <NavigationMenu.Link href="/components">Components</NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="hooks">
              <NavigationMenu.Link href="/hooks">Hooks</NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="blog">
      <NavigationMenu.Link href="/blog">Blog</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`}
              css={CSS_NESTED}
            />

            <ExampleTabs
              label="Separators"
              preview={<LiveSeparators />}
              code={`<NavigationMenu.Root aria-label="Main">
  <NavigationMenu.List>
    <NavigationMenu.Item value="file">
      <NavigationMenu.Trigger>File</NavigationMenu.Trigger>
      <NavigationMenu.Content aria-label="File">
        <NavigationMenu.Item value="new">
          <NavigationMenu.Link href="/new">New</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="open">
          <NavigationMenu.Link href="/open">Open</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Separator />
        <NavigationMenu.Item value="export">
          <NavigationMenu.Link href="/export">Export</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="edit">
      <NavigationMenu.Trigger>Edit</NavigationMenu.Trigger>
      <NavigationMenu.Content aria-label="Edit">
        <NavigationMenu.Item value="undo">
          <NavigationMenu.Link href="/undo">Undo</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Separator />
        <NavigationMenu.Item value="cut">
          <NavigationMenu.Link href="/cut">Cut</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="paste">
          <NavigationMenu.Link href="/paste">Paste</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`}
              css={CSS_SEPARATOR}
            />

            <ExampleTabs
              label="Full"
              preview={<LiveFull />}
              code={`<NavigationMenu.Root openOnHover={true} aria-label="Main">
  <NavigationMenu.List>
    <NavigationMenu.Item value="home">
      <NavigationMenu.Link href="/home">Home</NavigationMenu.Link>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="about">
      <NavigationMenu.Trigger>About</NavigationMenu.Trigger>
      {/* Submenus require click — override root openOnHover */}
      <NavigationMenu.Content openOnHover={false} aria-label="About">
        <NavigationMenu.Item value="team">
          <NavigationMenu.Trigger>Team</NavigationMenu.Trigger>
          <NavigationMenu.Content aria-label="Team">
            <NavigationMenu.Item value="eng">
              <NavigationMenu.Link href="/eng">Engineering</NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item value="design">
              <NavigationMenu.Link href="/design">Design</NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Separator />
        <NavigationMenu.Item value="careers">
          <NavigationMenu.Link href="/careers">Careers</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="services">
      <NavigationMenu.Trigger>Services</NavigationMenu.Trigger>
      <NavigationMenu.Content aria-label="Services">
        <NavigationMenu.Item value="consulting">
          <NavigationMenu.Link href="/consulting">Consulting</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="support">
          <NavigationMenu.Link href="/support">Support</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item value="contact">
      <NavigationMenu.Link href="/contact">Contact</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`}
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
                  <td>
                    <code>Root</code>
                  </td>
                  <td>
                    <code>{"<nav>"}</code>
                  </td>
                  <td>
                    Top-level wrapper. Manages open state, keyboard, outside
                    click, blur.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>List</code>
                  </td>
                  <td>
                    <code>{"<ul>"}</code>
                  </td>
                  <td>
                    Menubar container with <code>role="menubar"</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>Item</code>
                  </td>
                  <td>
                    <code>{"<li>"}</code>
                  </td>
                  <td>
                    Menu item wrapper. Provides context with unique{" "}
                    <code>value</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>Trigger</code>
                  </td>
                  <td>
                    <code>{"<a>"}</code>
                  </td>
                  <td>
                    Opens/closes submenu. Has <code>aria-haspopup</code> +{" "}
                    <code>aria-expanded</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>Content</code>
                  </td>
                  <td>
                    <code>{"<ul>"}</code>
                  </td>
                  <td>
                    Submenu panel with <code>role="menu"</code>. Portals into
                    Viewport if present.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>Link</code>
                  </td>
                  <td>
                    <code>{"<a>"}</code>
                  </td>
                  <td>
                    Leaf navigation link with <code>role="menuitem"</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>Separator</code>
                  </td>
                  <td>
                    <code>{"<li>"}</code>
                  </td>
                  <td>
                    Visual divider with <code>role="separator"</code>.
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>Viewport</code>
                  </td>
                  <td>
                    <code>{"<div>"}</code>
                  </td>
                  <td>Optional container for Content portaling.</td>
                </tr>
                <tr>
                  <td>
                    <code>Portal</code>
                  </td>
                  <td>—</td>
                  <td>
                    createPortal wrapper. Target via <code>selector</code> prop
                    or auto-created div.
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Nested submenus */}
            <h2># Nested Submenus</h2>
            <p className="section-desc">
              Nest <code>Item → Trigger → Content</code> at any depth. Keyboard
              navigation is depth-aware — left/right moves between depths,
              up/down moves within.
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

            <h3>## Trigger</h3>
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
                  name="openOnHover"
                  type="boolean | undefined"
                  desc="Override cascading openOnHover for this trigger only. true = always hover, false = never, undefined = inherit from nearest SettingsContext."
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
                <PropRow
                  name="openOnHover"
                  type="boolean | undefined"
                  desc="Override cascading openOnHover for all triggers within this content subtree."
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
                  <td>
                    <kbd>→</kbd>
                  </td>
                  <td>Next item</td>
                  <td>Open submenu / next menubar item</td>
                </tr>
                <tr>
                  <td>
                    <kbd>←</kbd>
                  </td>
                  <td>Previous item</td>
                  <td>Close to parent / previous menubar item</td>
                </tr>
                <tr>
                  <td>
                    <kbd>↓</kbd>
                  </td>
                  <td>Open submenu (first item)</td>
                  <td>Next item</td>
                </tr>
                <tr>
                  <td>
                    <kbd>↑</kbd>
                  </td>
                  <td>Open submenu (last item)</td>
                  <td>Previous item</td>
                </tr>
                <tr>
                  <td>
                    <kbd>Enter</kbd> / <kbd>Space</kbd>
                  </td>
                  <td colSpan={2}>Activate link or toggle submenu</td>
                </tr>
                <tr>
                  <td>
                    <kbd>Escape</kbd>
                  </td>
                  <td colSpan={2}>Close current menu, focus parent trigger</td>
                </tr>
                <tr>
                  <td>
                    <kbd>Home</kbd>
                  </td>
                  <td colSpan={2}>First item in current menu</td>
                </tr>
                <tr>
                  <td>
                    <kbd>End</kbd>
                  </td>
                  <td colSpan={2}>Last item in current menu</td>
                </tr>
                <tr>
                  <td>
                    <kbd>A–Z</kbd>
                  </td>
                  <td colSpan={2}>
                    Focus next item starting with that character
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Data attributes */}
            <h2># Data Attributes</h2>
            <p className="section-desc">
              Style with data attributes — no className conflicts, no CSS-in-JS
              required.
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
              <li>
                <code>react</code> ^18 || ^19
              </li>
              <li>
                <code>react-dom</code> ^18 || ^19
              </li>
              <li>
                <code>@base-ui/react</code> ^1.1.0
              </li>
              <li>
                <code>typescript</code> ^5
              </li>
            </ul>
          </main>

          <footer>
            <a href="https://skala.sh">Skala</a> © 2026
          </footer>
        </div>
      </body>
    </html>
  );
}
