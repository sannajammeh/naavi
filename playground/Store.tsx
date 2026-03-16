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
          {/* Smykker — section with sub-sections */}
          <Item value="smykker">
            <Trigger openOnHover href="#smykker">Smykker</Trigger>
            <Content
              aria-label="Smykker"
              className="store-mega store-grid-layout"
              openOnHover
            >
              <Item value="back-smykker">
                <Close className="store-back" target="current">
                  <LeftArrow /> Smykker
                </Close>
              </Item>

              {/* Sub-section: Nyheter */}
              <Item value="nyheter">
                <Trigger href="#nyheter">
                  Nyheter
                  <RightArrow />
                </Trigger>
                <Content
                  aria-label="Nyheter"
                  className="store-mega store-grid-layout store-subcontent"
                >
                  <Item value="back-nyheter">
                    <Close className="store-back" target="current">
                      <LeftArrow /> Nyheter
                    </Close>
                  </Item>
                  <Item value="nye-ringer">
                    <Link href="#nye-ringer">Nye ringer</Link>
                  </Item>
                  <Item value="nye-kjeder">
                    <Link href="#nye-kjeder">Nye kjeder</Link>
                  </Item>
                  <Item value="nye-oredobber">
                    <Link href="#nye-oredobber">Nye oredobber</Link>
                  </Item>
                  <Item value="nye-armband">
                    <Link href="#nye-armband">Nye armband</Link>
                  </Item>

                  <li role="none" className="store-cards">
                    <p className="store-cards-title">Nyheter i fokus</p>
                    <div className="store-campaign-card">Kampanje</div>
                  </li>
                </Content>
              </Item>

              {/* Sub-section: Ringer */}
              <Item value="ringer">
                <Trigger href="#ringer">
                  Ringer
                  <RightArrow />
                </Trigger>
                <Content
                  aria-label="Ringer"
                  className="store-mega store-grid-layout store-subcontent"
                >
                  <Item value="back-ringer">
                    <Close className="store-back" target="current">
                      <LeftArrow /> Ringer
                    </Close>
                  </Item>
                  <Item value="forlovelsesringer">
                    <Link href="#forlovelsesringer">Forlovelsesringer</Link>
                  </Item>
                  <Item value="gifteringer">
                    <Link href="#gifteringer">Gifteringer</Link>
                  </Item>
                  <Item value="signetringer">
                    <Link href="#signetringer">Signetringer</Link>
                  </Item>

                  <li role="none" className="store-cards">
                    <p className="store-cards-title">Ringer i fokus</p>
                    <div className="store-campaign-card">Kampanje</div>
                  </li>
                </Content>
              </Item>

              {/* Sub-section: Kjeder */}
              <Item value="kjeder">
                <Trigger href="#kjeder">
                  Kjeder
                  <RightArrow />
                </Trigger>
                <Content
                  aria-label="Kjeder"
                  className="store-mega store-grid-layout store-subcontent"
                >
                  <Item value="back-kjeder">
                    <Close className="store-back" target="current">
                      <LeftArrow /> Kjeder
                    </Close>
                  </Item>
                  <Item value="gullkjeder">
                    <Link href="#gullkjeder">Gullkjeder</Link>
                  </Item>
                  <Item value="solvkjeder">
                    <Link href="#solvkjeder">Solvkjeder</Link>
                  </Item>
                  <Item value="anheng">
                    <Link href="#anheng">Anheng</Link>
                  </Item>

                  <li role="none" className="store-cards">
                    <p className="store-cards-title">Kjeder i fokus</p>
                    <div className="store-campaign-card">Kampanje</div>
                  </li>
                </Content>
              </Item>

              {/* Sub-section: Oredobber */}
              <Item value="oredobber">
                <Trigger href="#oredobber">
                  Oredobber
                  <RightArrow />
                </Trigger>
                <Content
                  aria-label="Oredobber"
                  className="store-mega store-grid-layout store-subcontent"
                >
                  <Item value="back-oredobber">
                    <Close className="store-back" target="current">
                      <LeftArrow /> Oredobber
                    </Close>
                  </Item>
                  <Item value="stikkers">
                    <Link href="#stikkers">Stikkers</Link>
                  </Item>
                  <Item value="hengende">
                    <Link href="#hengende">Hengende</Link>
                  </Item>
                  <Item value="creoler">
                    <Link href="#creoler">Creoler</Link>
                  </Item>

                  <li role="none" className="store-cards">
                    <p className="store-cards-title">Oredobber i fokus</p>
                    <div className="store-campaign-card">Kampanje</div>
                  </li>
                </Content>
              </Item>

              {/* Plain links */}
              <Item value="armband">
                <Link href="#armband">Armband</Link>
              </Item>

              <Separator />

              <Item value="bunadssolv">
                <Link href="#bunadssolv">Bunadssolv</Link>
              </Item>
              <Item value="til-herre">
                <Link href="#til-herre">Til herre</Link>
              </Item>
              <Item value="til-barn">
                <Link href="#til-barn">Til barn</Link>
              </Item>

              {/* Campaign cards */}
              <li role="none" className="store-cards">
                <p className="store-cards-title">Se vare kampanjer innen smykker</p>
                <div className="store-campaign-card">Kampanje 1</div>
                <div className="store-campaign-card">Kampanje 2</div>
              </li>
            </Content>
          </Item>

          {/* Klokker — section with only links */}
          <Item value="klokker">
            <Trigger openOnHover href="#klokker">Klokker</Trigger>
            <Content
              aria-label="Klokker"
              className="store-mega store-grid-layout"
              openOnHover
            >
              <Item value="back-klokker">
                <Close className="store-back" target="current">
                  <LeftArrow /> Klokker
                </Close>
              </Item>
              <Item value="herrer-klokker">
                <Link href="#herrer-klokker">Herreklokker</Link>
              </Item>
              <Item value="dameklokker">
                <Link href="#dameklokker">Dameklokker</Link>
              </Item>
              <Item value="smartklokker">
                <Link href="#smartklokker">Smartklokker</Link>
              </Item>

              <li role="none" className="store-cards">
                <p className="store-cards-title">Klokker i fokus</p>
                <div className="store-campaign-card">Kampanje</div>
              </li>
            </Content>
          </Item>

          {/* Anledninger — section with only links */}
          <Item value="anledninger">
            <Trigger openOnHover href="#anledninger">Anledninger</Trigger>
            <Content
              aria-label="Anledninger"
              className="store-mega store-grid-layout"
              openOnHover
            >
              <Item value="back-anledninger">
                <Close className="store-back" target="current">
                  <LeftArrow /> Anledninger
                </Close>
              </Item>
              <Item value="bryllup">
                <Link href="#bryllup">Bryllup</Link>
              </Item>
              <Item value="konfirmasjon">
                <Link href="#konfirmasjon">Konfirmasjon</Link>
              </Item>
              <Item value="bursdag">
                <Link href="#bursdag">Bursdag</Link>
              </Item>
              <Item value="jul">
                <Link href="#jul">Jul</Link>
              </Item>

              <li role="none" className="store-cards">
                <p className="store-cards-title">Gaver til enhver anledning</p>
                <div className="store-campaign-card">Gaveguide</div>
              </li>
            </Content>
          </Item>

          {/* Merker — plain link */}
          <Item value="merker">
            <Link href="#merker">Merker</Link>
          </Item>
        </List>
      </Root>

      <div className="store-main">
        <h1>Velkommen</h1>
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
