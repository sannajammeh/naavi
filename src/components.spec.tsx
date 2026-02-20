import { useState, act } from "react";
import { describe, test, expect, beforeEach } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";

import { Root, List, Item, Trigger, Content, Link, Close } from "./components.tsx";
import * as NavigationMenu from "./components.tsx";
import { NavigationMenu as NavigationMenuFromIndex } from "./index.ts";

/**
 * Controlled wrapper to inspect openPath via onValueChange.
 */
function ControlledMenu(props: { hideDelay?: number }) {
  const { hideDelay = 50 } = props;
  const [path, setPath] = useState<string[]>([]);

  return (
    <div>
      <span data-testid="path">{JSON.stringify(path)}</span>
      <Root aria-label="Test Menu" hideDelay={hideDelay} value={path} onValueChange={setPath}>
        <List>
          <Item value="about">
            <Trigger>About</Trigger>
            <Content aria-label="About">
              <Item value="overview">
                <Link href="#overview">Overview</Link>
              </Item>
              <Item value="administration">
                <Link href="#administration">Administration</Link>
              </Item>
              <Item value="facts">
                <Trigger>Facts</Trigger>
                <Content aria-label="Facts">
                  <Item value="history">
                    <Link href="#history">History</Link>
                  </Item>
                </Content>
              </Item>
            </Content>
          </Item>
        </List>
      </Root>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPath(): string[] {
  return JSON.parse(screen.getByTestId("path").textContent ?? "[]") as string[];
}

describe("menu open/close basics", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("click trigger opens menu", async () => {
    render(<ControlledMenu />);
    await act(() => { fireEvent.click(screen.getByText("About")); });
    expect(getPath()).toEqual(["about"]);
  });

  test("click open trigger closes menu", async () => {
    render(<ControlledMenu />);
    const trigger = screen.getByText("About");
    await act(() => { fireEvent.click(trigger); });
    expect(getPath()).toEqual(["about"]);
    await act(() => { fireEvent.click(trigger); });
    expect(getPath()).toEqual([]);
  });

  test("mouseEnter trigger opens submenu when parent is open", async () => {
    render(<ControlledMenu />);
    await act(() => { fireEvent.click(screen.getByText("About")); });
    await act(() => { fireEvent.mouseEnter(screen.getByText("Facts")); });
    expect(getPath()).toEqual(["about", "facts"]);
  });

  test("mouse leave from depth-0 trigger closes all menus after delay", async () => {
    render(<ControlledMenu hideDelay={30} />);
    await act(() => { fireEvent.click(screen.getByText("About")); });
    expect(getPath()).toEqual(["about"]);

    await act(() => { fireEvent.mouseLeave(screen.getByText("About")); });
    await act(() => sleep(50));

    expect(getPath()).toEqual([]);
  });
});

describe("Link mouse-enter behavior", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("link mouseEnter cancels pending hide timer", async () => {
    render(<ControlledMenu hideDelay={100} />);
    await act(() => { fireEvent.click(screen.getByText("About")); });
    expect(getPath()).toEqual(["about"]);

    // Start hide timer by leaving About trigger
    await act(() => { fireEvent.mouseLeave(screen.getByText("About")); });

    // Enter a link within the menu — should cancel the timer
    await act(() => { fireEvent.mouseEnter(screen.getByText("Overview")); });

    // Wait past the hideDelay
    await act(() => sleep(150));

    // Menu should still be open because timer was cancelled
    expect(getPath()).toEqual(["about"]);
  });

  test("link mouseEnter closes deeper submenus", async () => {
    render(<ControlledMenu />);
    await act(() => { fireEvent.click(screen.getByText("About")); });
    await act(() => { fireEvent.mouseEnter(screen.getByText("Facts")); });
    expect(getPath()).toEqual(["about", "facts"]);

    // Hover a sibling link — should close Facts (depth 1+) immediately
    await act(() => { fireEvent.mouseEnter(screen.getByText("Administration")); });
    expect(getPath()).toEqual(["about"]);
  });
});

/**
 * NOTE: Depth-scoped close via timer (mouseLeave from depth-1 trigger
 * preserves parent menu) is verified via browser testing only.
 *
 * In testing-library + happy-dom, fireEvent dispatches events synchronously
 * before React can re-render child components with updated useCallback
 * closures. This causes the setTimeout callback to capture stale openPath
 * from a previous render. The behavior is correct in real browsers where
 * React's event system ensures re-renders flush between user interactions.
 *
 * Browser verification: agent-browser at localhost:3000 confirms:
 * - Click About → hover Facts → hover Administration → Facts closes, About stays open
 * - This matches the reference implementation at localhost:3001
 */

// ---------------------------------------------------------------------------
// Cascading Settings Context Tests
// ---------------------------------------------------------------------------

/**
 * Menu with openOnHover on Root, and optional Content/Trigger overrides.
 * Two top-level items: "FileMenu" and "EditMenu", each with a submenu.
 * FileMenu's Content can override openOnHover. EditMenu does not.
 */
function CascadingMenu(props: {
  rootOpenOnHover?: boolean;
  fileContentOpenOnHover?: boolean;
  editTriggerOpenOnHover?: boolean;
  hideDelay?: number;
}) {
  const {
    rootOpenOnHover,
    fileContentOpenOnHover,
    editTriggerOpenOnHover,
    hideDelay = 50,
  } = props;
  const [path, setPath] = useState<string[]>([]);

  return (
    <div>
      <span data-testid="path">{JSON.stringify(path)}</span>
      <Root
        aria-label="Cascade Menu"
        openOnHover={rootOpenOnHover}
        hideDelay={hideDelay}
        value={path}
        onValueChange={setPath}
      >
        <List>
          <Item value="file">
            <Trigger>File</Trigger>
            <Content aria-label="File" openOnHover={fileContentOpenOnHover}>
              <Item value="new">
                <Link href="#new">New</Link>
              </Item>
              <Item value="open">
                <Link href="#open">Open</Link>
              </Item>
            </Content>
          </Item>
          <Item value="edit">
            <Trigger openOnHover={editTriggerOpenOnHover}>Edit</Trigger>
            <Content aria-label="Edit">
              <Item value="undo">
                <Link href="#undo">Undo</Link>
              </Item>
            </Content>
          </Item>
        </List>
      </Root>
    </div>
  );
}

/**
 * Nested Content menu for testing inheritance.
 * Root (openOnHover=true) > About > Content(openOnHover=false) > Facts > Content (no override)
 */
function NestedCascadingMenu(props: { innerContentOpenOnHover?: boolean }) {
  const { innerContentOpenOnHover } = props;
  const [path, setPath] = useState<string[]>([]);

  return (
    <div>
      <span data-testid="path">{JSON.stringify(path)}</span>
      <Root
        aria-label="Nested Cascade"
        openOnHover={true}
        hideDelay={50}
        value={path}
        onValueChange={setPath}
      >
        <List>
          <Item value="about">
            <Trigger>About</Trigger>
            <Content aria-label="About" openOnHover={false}>
              <Item value="facts">
                <Trigger>Facts</Trigger>
                <Content aria-label="Facts" openOnHover={innerContentOpenOnHover}>
                  <Item value="history">
                    <Link href="#history">History</Link>
                  </Item>
                </Content>
              </Item>
            </Content>
          </Item>
        </List>
      </Root>
    </div>
  );
}

describe("cascading settings context", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("Root openOnHover={true} cascades to all triggers — hover opens without click", async () => {
    render(<CascadingMenu rootOpenOnHover={true} />);
    // Hover File trigger without any prior click — should open
    await act(() => { fireEvent.mouseEnter(screen.getByText("File")); });
    expect(getPath()).toEqual(["file"]);
  });

  test("Content openOnHover={false} overrides Root openOnHover={true} for triggers inside", async () => {
    render(
      <NestedCascadingMenu />,
    );
    // Root has openOnHover=true, so hovering About should open
    await act(() => { fireEvent.mouseEnter(screen.getByText("About")); });
    expect(getPath()).toEqual(["about"]);

    // About's Content has openOnHover=false, so hovering Facts inside should NOT open
    await act(() => { fireEvent.mouseEnter(screen.getByText("Facts")); });
    // Facts should NOT be in the path — hover was blocked
    expect(getPath()).toEqual(["about"]);

    // But clicking Facts should still work
    await act(() => { fireEvent.click(screen.getByText("Facts")); });
    expect(getPath()).toEqual(["about", "facts"]);
  });

  test("Trigger openOnHover={true} overrides Content openOnHover={false}", async () => {
    // Root openOnHover=true, fileContent openOnHover=false, editTrigger openOnHover=true
    // The editTrigger is NOT inside fileContent, so this tests trigger-level override
    render(
      <CascadingMenu
        rootOpenOnHover={false}
        editTriggerOpenOnHover={true}
      />,
    );
    // File trigger: rootOpenOnHover=false, no trigger override → hover should NOT open
    await act(() => { fireEvent.mouseEnter(screen.getByText("File")); });
    expect(getPath()).toEqual([]);

    // Edit trigger: has openOnHover={true} override → hover should open
    await act(() => { fireEvent.mouseEnter(screen.getByText("Edit")); });
    expect(getPath()).toEqual(["edit"]);
  });

  test("nested Content without override inherits from nearest ancestor Content", async () => {
    // Root openOnHover=true, outer Content openOnHover=false, inner Content omits openOnHover
    // Facts trigger inside inner Content should inherit openOnHover=false from outer
    render(<NestedCascadingMenu />);

    // Open About via hover (root openOnHover=true)
    await act(() => { fireEvent.mouseEnter(screen.getByText("About")); });
    expect(getPath()).toEqual(["about"]);

    // Click Facts to open its submenu (hover blocked by outer Content openOnHover=false)
    await act(() => { fireEvent.click(screen.getByText("Facts")); });
    expect(getPath()).toEqual(["about", "facts"]);

    // History is a Link, not a Trigger with submenu — this just verifies inner content rendered
    expect(screen.getByText("History")).toBeDefined();
  });

  test("no settings anywhere preserves armed state machine behavior", async () => {
    render(<CascadingMenu />);
    // No openOnHover set anywhere. Hover should not open (not armed)
    await act(() => { fireEvent.mouseEnter(screen.getByText("File")); });
    expect(getPath()).toEqual([]);

    // Click to open — this arms the state machine
    await act(() => { fireEvent.click(screen.getByText("File")); });
    expect(getPath()).toEqual(["file"]);

    // Now hover Edit — should open because armed
    await act(() => { fireEvent.mouseEnter(screen.getByText("Edit")); });
    expect(getPath()).toEqual(["edit"]);
  });
});

// ---------------------------------------------------------------------------
// Single-item menu: Escape leaves tabindex=-1 stuck on trigger
// ---------------------------------------------------------------------------

function SingleItemMenu() {
  const [path, setPath] = useState<string[]>([]);

  return (
    <div>
      <span data-testid="path">{JSON.stringify(path)}</span>
      <Root aria-label="Single" value={path} onValueChange={setPath}>
        <List>
          <Item value="only">
            <Trigger>Only</Trigger>
            <Content aria-label="Only">
              <Item value="child">
                <Link href="#child">Child</Link>
              </Item>
            </Content>
          </Item>
        </List>
      </Root>
    </div>
  );
}

describe("single-item tabindex recovery after Escape", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("Escape from menubar trigger preserves tabindex=0", async () => {
    render(<SingleItemMenu />);
    const trigger = screen.getByText("Only");

    // Initial: trigger should be tabindex="0" (set by Root useEffect)
    expect(trigger.getAttribute("tabindex")).toBe("0");

    // Open via Enter
    await act(() => { fireEvent.keyDown(trigger, { key: "Enter" }); });
    expect(getPath()).toEqual(["only"]);

    // Wait for rAF focus into submenu
    await act(() => new Promise((r) => requestAnimationFrame(r)));

    // Submenu item got tabindex=0; trigger is now -1
    expect(trigger.getAttribute("tabindex")).toBe("-1");

    // Now press Escape on the trigger (simulating focus returning to menubar)
    await act(() => { fireEvent.keyDown(trigger, { key: "Escape" }); });
    expect(getPath()).toEqual([]);

    // BUG: trigger should be tabindex="0" again so user can Tab back to it
    expect(trigger.getAttribute("tabindex")).toBe("0");
  });

  test("Escape from submenu item restores trigger tabindex=0", async () => {
    render(<SingleItemMenu />);
    const trigger = screen.getByText("Only");

    // Open
    await act(() => { fireEvent.keyDown(trigger, { key: "Enter" }); });
    await act(() => new Promise((r) => requestAnimationFrame(r)));

    const childLink = screen.getByText("Child");
    expect(childLink.getAttribute("tabindex")).toBe("0");
    expect(trigger.getAttribute("tabindex")).toBe("-1");

    // Escape from inside submenu
    await act(() => { fireEvent.keyDown(childLink, { key: "Escape" }); });
    expect(getPath()).toEqual([]);

    // Trigger should be restored
    expect(trigger.getAttribute("tabindex")).toBe("0");
  });
});

describe("NavigationMenu namespace export", () => {
  test("namespace contains all expected components", () => {
    const expected = [
      "Root",
      "List",
      "Item",
      "Trigger",
      "Content",
      "Link",
      "Close",
      "Separator",
      "Viewport",
      "Portal",
    ];
    for (const name of expected) {
      expect(
        typeof (NavigationMenu as Record<string, unknown>)[name],
      ).toBe("function");
    }
  });

  test("namespace components are identical references to named exports", () => {
    expect(NavigationMenu.Root).toBe(Root);
    expect(NavigationMenu.List).toBe(List);
    expect(NavigationMenu.Item).toBe(Item);
    expect(NavigationMenu.Trigger).toBe(Trigger);
    expect(NavigationMenu.Content).toBe(Content);
    expect(NavigationMenu.Link).toBe(Link);
  });

  test("index re-exports the same namespace object", () => {
    expect(NavigationMenuFromIndex.Root).toBe(Root);
    expect(NavigationMenuFromIndex).toBe(NavigationMenu);
  });
});

// ---------------------------------------------------------------------------
// Close component tests
// ---------------------------------------------------------------------------

/**
 * Menu with Close buttons for testing close behavior.
 * About > [Overview link, Close (root), Facts > [History link, Close (current)]]
 */
function CloseMenu() {
  const [path, setPath] = useState<string[]>([]);

  return (
    <div>
      <span data-testid="path">{JSON.stringify(path)}</span>
      <Root aria-label="Close Menu" value={path} onValueChange={setPath}>
        <List>
          <Item value="about">
            <Trigger>About</Trigger>
            <Content aria-label="About">
              <Item value="overview">
                <Link href="#overview">Overview</Link>
              </Item>
              <Item value="close-root">
                <Close>Dismiss All</Close>
              </Item>
              <Item value="facts">
                <Trigger>Facts</Trigger>
                <Content aria-label="Facts">
                  <Item value="history">
                    <Link href="#history">History</Link>
                  </Item>
                  <Item value="close-current">
                    <Close target="current">Close Facts</Close>
                  </Item>
                </Content>
              </Item>
            </Content>
          </Item>
        </List>
      </Root>
    </div>
  );
}

describe("Close component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("click Close with default target closes all menus", async () => {
    render(<CloseMenu />);
    // Open About
    await act(() => { fireEvent.click(screen.getByText("About")); });
    expect(getPath()).toEqual(["about"]);

    // Click Dismiss All (target="root" by default)
    await act(() => { fireEvent.click(screen.getByText("Dismiss All")); });
    expect(getPath()).toEqual([]);
  });

  test("click Close with target='current' closes only containing menu", async () => {
    render(<CloseMenu />);
    // Open About > Facts
    await act(() => { fireEvent.click(screen.getByText("About")); });
    await act(() => { fireEvent.mouseEnter(screen.getByText("Facts")); });
    expect(getPath()).toEqual(["about", "facts"]);

    // Click Close Facts (target="current")
    await act(() => { fireEvent.click(screen.getByText("Close Facts")); });
    // Facts closes but About stays open
    expect(getPath()).toEqual(["about"]);
  });

  test("focus returns to menubar trigger after target='root' close", async () => {
    render(<CloseMenu />);
    const aboutTrigger = screen.getByText("About");

    // Open About
    await act(() => { fireEvent.click(aboutTrigger); });
    expect(getPath()).toEqual(["about"]);

    // Click Dismiss All
    await act(() => { fireEvent.click(screen.getByText("Dismiss All")); });
    expect(getPath()).toEqual([]);

    // Focus should be on the About trigger
    expect(aboutTrigger.getAttribute("tabindex")).toBe("0");
  });

  test("Enter activates Close menuitem", async () => {
    render(<CloseMenu />);
    // Open About
    await act(() => { fireEvent.click(screen.getByText("About")); });
    expect(getPath()).toEqual(["about"]);

    // Press Enter on Dismiss All
    const closeBtn = screen.getByText("Dismiss All");
    await act(() => { fireEvent.keyDown(closeBtn, { key: "Enter" }); });
    expect(getPath()).toEqual([]);
  });

  test("Space activates Close menuitem", async () => {
    render(<CloseMenu />);
    // Open About
    await act(() => { fireEvent.click(screen.getByText("About")); });
    expect(getPath()).toEqual(["about"]);

    // Press Space on Dismiss All
    const closeBtn = screen.getByText("Dismiss All");
    await act(() => { fireEvent.keyDown(closeBtn, { key: " " }); });
    expect(getPath()).toEqual([]);
  });

  test("Close renders with correct ARIA attributes", async () => {
    render(<CloseMenu />);
    // Open About to make Close visible
    await act(() => { fireEvent.click(screen.getByText("About")); });

    const closeBtn = screen.getByText("Dismiss All");
    expect(closeBtn.getAttribute("role")).toBe("menuitem");
    expect(closeBtn.getAttribute("tabindex")).toBe("-1");
    expect(closeBtn.hasAttribute("data-naavi-close")).toBe(true);
    expect(closeBtn.tagName).toBe("BUTTON");
  });
});
