import { useState } from "react";
import { describe, test, expect, beforeEach } from "bun:test";
import { render, screen, fireEvent, act } from "@testing-library/react";

import { Root, List, Item, Trigger, Content, Link } from "./components.tsx";

/**
 * Wrapper that uses controlled mode so we can inspect openPath directly
 * via onValueChange, avoiding stale-closure issues in happy-dom timers.
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

function getPath() {
  return JSON.parse(screen.getByTestId("path").textContent ?? "[]") as string[];
}

describe("depth-scoped close on mouse leave", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("mouse leave from depth-0 trigger closes all menus", async () => {
    render(<ControlledMenu hideDelay={30} />);
    const aboutTrigger = screen.getByText("About");

    fireEvent.click(aboutTrigger);
    expect(getPath()).toEqual(["about"]);

    fireEvent.mouseLeave(aboutTrigger);
    await act(() => sleep(50));

    expect(getPath()).toEqual([]);
  });

  test("mouse leave from depth-1 trigger preserves parent menu", async () => {
    render(<ControlledMenu hideDelay={30} />);
    const aboutTrigger = screen.getByText("About");

    fireEvent.click(aboutTrigger);
    expect(getPath()).toEqual(["about"]);

    const factsTrigger = screen.getByText("Facts");
    fireEvent.mouseEnter(factsTrigger);
    expect(getPath()).toEqual(["about", "facts"]);

    fireEvent.mouseLeave(factsTrigger);
    await act(() => sleep(50));

    // Facts should close, About should remain
    expect(getPath()).toEqual(["about"]);
  });

  test("mouse leave from depth-1 content preserves parent menu", async () => {
    render(<ControlledMenu hideDelay={30} />);
    const aboutTrigger = screen.getByText("About");

    fireEvent.click(aboutTrigger);
    const factsTrigger = screen.getByText("Facts");
    fireEvent.mouseEnter(factsTrigger);
    expect(getPath()).toEqual(["about", "facts"]);

    const factsContent = screen.getByLabelText("Facts");
    fireEvent.mouseEnter(factsContent);
    fireEvent.mouseLeave(factsContent);
    await act(() => sleep(50));

    expect(getPath()).toEqual(["about"]);
  });
});

describe("Link cancels hide timer on mouse enter", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("hovering a sibling link cancels timer and closes deeper submenus", async () => {
    render(<ControlledMenu hideDelay={30} />);
    const aboutTrigger = screen.getByText("About");

    fireEvent.click(aboutTrigger);
    const factsTrigger = screen.getByText("Facts");
    fireEvent.mouseEnter(factsTrigger);
    expect(getPath()).toEqual(["about", "facts"]);

    // Leave Facts (starts timer), immediately enter Administration link
    fireEvent.mouseLeave(factsTrigger);
    const adminLink = screen.getByText("Administration");
    fireEvent.mouseEnter(adminLink);

    await act(() => sleep(50));

    // Timer cancelled by link, but link closes deeper submenus immediately
    // About stays open, Facts closed
    expect(getPath()).toEqual(["about"]);
  });

  test("hovering from submenu trigger to sibling link keeps parent open", async () => {
    render(<ControlledMenu hideDelay={30} />);
    const aboutTrigger = screen.getByText("About");

    fireEvent.click(aboutTrigger);
    const factsTrigger = screen.getByText("Facts");
    fireEvent.mouseEnter(factsTrigger);

    fireEvent.mouseLeave(factsTrigger);
    const overviewLink = screen.getByText("Overview");
    fireEvent.mouseEnter(overviewLink);

    await act(() => sleep(50));

    // About stays open, Facts closed
    expect(getPath()).toEqual(["about"]);
  });
});
