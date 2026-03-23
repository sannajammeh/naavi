import {
  Root,
  List,
  Item,
  Trigger,
  Content,
  Link,
  Close,
  Separator,
} from "../src/index.ts";

export function Store() {
  return (
    <div className="store-page">
      <header className="store-header">
        <div className="store-logo">Jewelry Store</div>
      </header>

      <Root aria-label="Store navigation" debugSafeTriangle openOnHover>
        <List className="store-menubar">
          {/* Jewelry — section with sub-sections */}
          <Item value="jewelry">
            <Trigger openOnHover href="#jewelry">Jewelry</Trigger>
            <Content
              aria-label="Jewelry"
              className="store-mega store-grid-layout"
              openOnHover={false}
            >
              <Item value="back-jewelry">
                <Close className="store-back" target="current">
                  <LeftArrow /> Jewelry
                </Close>
              </Item>

              {/* Sub-section: New Arrivals */}
              <Item value="new-arrivals">
                <Trigger href="#new-arrivals">
                  New Arrivals
                  <RightArrow />
                </Trigger>
                <Content
                  aria-label="New Arrivals"
                  className="store-mega store-grid-layout store-subcontent"
                >
                  <Item value="back-new-arrivals">
                    <Close className="store-back" target="current">
                      <LeftArrow /> New Arrivals
                    </Close>
                  </Item>
                  <Item value="new-rings">
                    <Link href="#new-rings">New Rings</Link>
                  </Item>
                  <Item value="new-necklaces">
                    <Link href="#new-necklaces">New Necklaces</Link>
                  </Item>
                  <Item value="new-earrings">
                    <Link href="#new-earrings">New Earrings</Link>
                  </Item>
                  <Item value="new-bracelets">
                    <Link href="#new-bracelets">New Bracelets</Link>
                  </Item>

                  <li role="none" className="store-cards">
                    <p className="store-cards-title">New Arrivals in Focus</p>
                    <div className="store-campaign-card">Promotion</div>
                  </li>
                </Content>
              </Item>

              {/* Sub-section: Rings */}
              <Item value="rings">
                <Trigger href="#rings">
                  Rings
                  <RightArrow />
                </Trigger>
                <Content
                  aria-label="Rings"
                  className="store-mega store-grid-layout store-subcontent"
                  openOnHover={false}
                >
                  <Item value="back-rings">
                    <Close className="store-back" target="current">
                      <LeftArrow /> Rings
                    </Close>
                  </Item>
                  <Item value="engagement-rings">
                    <Link href="#engagement-rings">Engagement Rings</Link>
                  </Item>
                  <Item value="wedding-rings">
                    <Link href="#wedding-rings">Wedding Rings</Link>
                  </Item>
                  <Item value="signet-rings">
                    <Link href="#signet-rings">Signet Rings</Link>
                  </Item>

                  <li role="none" className="store-cards">
                    <p className="store-cards-title">Rings in Focus</p>
                    <div className="store-campaign-card">Promotion</div>
                  </li>
                </Content>
              </Item>

              {/* Sub-section: Necklaces */}
              <Item value="necklaces">
                <Trigger href="#necklaces">
                  Necklaces
                  <RightArrow />
                </Trigger>
                <Content
                  aria-label="Necklaces"
                  className="store-mega store-grid-layout store-subcontent"
                  openOnHover={false}
                >
                  <Item value="back-necklaces">
                    <Close className="store-back" target="current">
                      <LeftArrow /> Necklaces
                    </Close>
                  </Item>
                  <Item value="gold-necklaces">
                    <Link href="#gold-necklaces">Gold Necklaces</Link>
                  </Item>
                  <Item value="silver-necklaces">
                    <Link href="#silver-necklaces">Silver Necklaces</Link>
                  </Item>
                  <Item value="pendants">
                    <Link href="#pendants">Pendants</Link>
                  </Item>

                  <li role="none" className="store-cards">
                    <p className="store-cards-title">Necklaces in Focus</p>
                    <div className="store-campaign-card">Promotion</div>
                  </li>
                </Content>
              </Item>

              {/* Sub-section: Earrings */}
              <Item value="earrings">
                <Trigger href="#earrings">
                  Earrings
                  <RightArrow />
                </Trigger>
                <Content
                  aria-label="Earrings"
                  className="store-mega store-grid-layout store-subcontent"
                  openOnHover={false}
                >
                  <Item value="back-earrings">
                    <Close className="store-back" target="current">
                      <LeftArrow /> Earrings
                    </Close>
                  </Item>
                  <Item value="studs">
                    <Link href="#studs">Studs</Link>
                  </Item>
                  <Item value="drop-earrings">
                    <Link href="#drop-earrings">Drop Earrings</Link>
                  </Item>
                  <Item value="hoops">
                    <Link href="#hoops">Hoops</Link>
                  </Item>

                  <li role="none" className="store-cards">
                    <p className="store-cards-title">Earrings in Focus</p>
                    <div className="store-campaign-card">Promotion</div>
                  </li>
                </Content>
              </Item>

              {/* Plain links */}
              <Item value="bracelets">
                <Link href="#bracelets">Bracelets</Link>
              </Item>

              <Separator />

              <Item value="traditional-silver">
                <Link href="#traditional-silver">Traditional Silver</Link>
              </Item>
              <Item value="for-him">
                <Link href="#for-him">For Him</Link>
              </Item>
              <Item value="for-kids">
                <Link href="#for-kids">For Kids</Link>
              </Item>

              {/* Campaign cards */}
              <li role="none" className="store-cards">
                <p className="store-cards-title">See our jewelry promotions</p>
                <div className="store-campaign-card">Promotion 1</div>
                <div className="store-campaign-card">Promotion 2</div>
              </li>
            </Content>
          </Item>

          {/* Watches — section with only links */}
          <Item value="watches">
            <Trigger openOnHover href="#watches">Watches</Trigger>
            <Content
              aria-label="Watches"
              className="store-mega store-grid-layout"
            >
              <Item value="back-watches">
                <Close className="store-back" target="current">
                  <LeftArrow /> Watches
                </Close>
              </Item>
              <Item value="mens-watches">
                <Link href="#mens-watches">Men's Watches</Link>
              </Item>
              <Item value="womens-watches">
                <Link href="#womens-watches">Women's Watches</Link>
              </Item>
              <Item value="smart-watches">
                <Link href="#smart-watches">Smart Watches</Link>
              </Item>

              <li role="none" className="store-cards">
                <p className="store-cards-title">Watches in Focus</p>
                <div className="store-campaign-card">Promotion</div>
              </li>
            </Content>
          </Item>

          {/* Occasions — section with only links */}
          <Item value="occasions">
            <Trigger openOnHover href="#occasions">Occasions</Trigger>
            <Content
              aria-label="Occasions"
              className="store-mega store-grid-layout"
            >
              <Item value="back-occasions">
                <Close className="store-back" target="current">
                  <LeftArrow /> Occasions
                </Close>
              </Item>
              <Item value="wedding">
                <Link href="#wedding">Wedding</Link>
              </Item>
              <Item value="confirmation">
                <Link href="#confirmation">Confirmation</Link>
              </Item>
              <Item value="birthday">
                <Link href="#birthday">Birthday</Link>
              </Item>
              <Item value="christmas">
                <Link href="#christmas">Christmas</Link>
              </Item>

              <li role="none" className="store-cards">
                <p className="store-cards-title">Gifts for Every Occasion</p>
                <div className="store-campaign-card">Gift Guide</div>
              </li>
            </Content>
          </Item>

          {/* Brands — plain link */}
          <Item value="brands">
            <Link href="#brands">Brands</Link>
          </Item>
        </List>
      </Root>

      <div className="store-main">
        <h1>Welcome</h1>
        <p>Hover the menu above to see the safe triangle in action.</p>
      </div>
    </div>
  );
}

function LeftArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="arrow left"
      width="9"
      height="12"
      viewBox="0 0 9 12"
    >
      <polygon points="8 1, 8 11, 0 6" />
    </svg>
  );
}

function RightArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="arrow right"
      width="9"
      height="12"
      viewBox="0 0 9 12"
    >
      <polygon points="0 1, 0 11, 8 6" />
    </svg>
  );
}
