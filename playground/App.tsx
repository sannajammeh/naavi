import {
  Root,
  List,
  Item,
  Trigger,
  Content,
  Link,
  Separator,
} from "../src/index.ts";

export function App() {
  return (
    <div className="page">
      <header>
        <div className="title">Mythical University</div>
        <div className="tagline">Navigation Menu Component Playground</div>
      </header>

      <Root aria-label="Mythical University">
        <List>
          {/* Home — simple link, no submenu */}
          <Item value="home">
            <Link href="#home">Home</Link>
          </Item>

          {/* About — with nested submenus */}
          <Item value="about">
            <Trigger href="#about">
              About
              <DownArrow />
            </Trigger>
            <Content aria-label="About">
              <Item value="overview">
                <Link href="#overview">Overview</Link>
              </Item>
              <Item value="administration">
                <Link href="#administration">Administration</Link>
              </Item>
              <Item value="facts">
                <Trigger href="#facts">
                  Facts
                  <RightArrow />
                </Trigger>
                <Content aria-label="Facts">
                  <Item value="history">
                    <Link href="#history">History</Link>
                  </Item>
                  <Item value="current-statistics">
                    <Link href="#current-statistics">Current Statistics</Link>
                  </Item>
                  <Item value="awards">
                    <Link href="#awards">Awards</Link>
                  </Item>
                </Content>
              </Item>
              <Item value="campus-tours">
                <Trigger href="#campus-tours">
                  Campus Tours
                  <RightArrow />
                </Trigger>
                <Content aria-label="Campus Tours">
                  <Item value="for-prospective-students">
                    <Link href="#for-prospective-students">For prospective students</Link>
                  </Item>
                  <Item value="for-alumni">
                    <Link href="#for-alumni">For alumni</Link>
                  </Item>
                  <Item value="for-visitors">
                    <Link href="#for-visitors">For visitors</Link>
                  </Item>
                </Content>
              </Item>
            </Content>
          </Item>

          {/* Admissions — with nested submenu + separator */}
          <Item value="admissions">
            <Trigger href="#admissions">
              Admissions
              <DownArrow />
            </Trigger>
            <Content aria-label="Admissions">
              <Item value="apply">
                <Link href="#apply">Apply</Link>
              </Item>
              <Item value="tuition">
                <Trigger href="#tuition">
                  Tuition
                  <RightArrow />
                </Trigger>
                <Content aria-label="Tuition">
                  <Item value="undergraduate">
                    <Link href="#undergraduate">Undergraduate</Link>
                  </Item>
                  <Item value="graduate">
                    <Link href="#graduate">Graduate</Link>
                  </Item>
                  <Item value="professional-schools">
                    <Link href="#professional-schools">Professional Schools</Link>
                  </Item>
                </Content>
              </Item>
              <Item value="sign-up">
                <Link href="#sign-up">Sign Up</Link>
              </Item>
              <Separator />
              <Item value="visit">
                <Link href="#visit">Visit</Link>
              </Item>
              <Item value="photo-tour">
                <Link href="#photo-tour">Photo Tour</Link>
              </Item>
              <Item value="connect">
                <Link href="#connect">Connect</Link>
              </Item>
            </Content>
          </Item>

          {/* Academics — flat submenu with separator */}
          <Item value="academics">
            <Trigger href="#academics">
              Academics
              <DownArrow />
            </Trigger>
            <Content aria-label="Academics">
              <Item value="colleges-and-schools">
                <Link href="#colleges-and-schools">Colleges &amp; Schools</Link>
              </Item>
              <Item value="programs-of-study">
                <Link href="#programs-of-study">Programs of Study</Link>
              </Item>
              <Item value="honors-programs">
                <Link href="#honors-programs">Honors Programs</Link>
              </Item>
              <Item value="online-courses">
                <Link href="#online-courses">Online Courses</Link>
              </Item>
              <Separator />
              <Item value="course-explorer">
                <Link href="#course-explorer">Course Explorer</Link>
              </Item>
              <Item value="register-for-class">
                <Link href="#register-for-class">Register for Class</Link>
              </Item>
              <Item value="academic-calendar">
                <Link href="#academic-calendar">Academic Calendar</Link>
              </Item>
              <Item value="transcripts">
                <Link href="#transcripts">Transcripts</Link>
              </Item>
            </Content>
          </Item>
        </List>
      </Root>

      <div className="main">
        <section>
          <h1 className="page-title">Mythical University</h1>
          <p className="content">
            Navigate the menu above using keyboard or mouse to test the component.
          </p>
        </section>
      </div>

      <footer>Mythical University footer information</footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SVG Arrow Icons (matching WAI-ARIA reference)
// ---------------------------------------------------------------------------

function DownArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="arrow down"
      width="12"
      height="9"
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
      className="arrow right"
      width="9"
      height="12"
      viewBox="0 0 9 12"
    >
      <polygon points="0 1, 0 11, 8 6" />
    </svg>
  );
}
