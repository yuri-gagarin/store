import React, { useEffect, useState, useRef } from "react";
import { Grid, Container, Reveal, Image, Segment, Button } from "semantic-ui-react";
// css imports //
import "./css/homeHeader.css";

interface Coordinates {
  elemY: number;
  windowY: number;
};
interface DisplaySettings {
  elmVisible: boolean
  picVisible: boolean;
};
interface Props {

};

const HomeHeader: React.FC<Props> = (props): JSX.Element => {
  const [ coordinates, setCoordinates ] = useState<Coordinates>({ elemY: 0, windowY: 0 });
  const [ displaySettings, setDisplaySettings ] = useState<DisplaySettings>({
    elmVisible: false,
    picVisible: false
  });
  const homeHeaderRef = useRef<HTMLDivElement>(document.createElement("div"));

  const handleButtonClick = (e: React.MouseEvent) => {

  };
  /*
  const listenToScroll = (e: Event): void => {
      const componentCoord: DOMRect = homeHeaderRef.current.getBoundingClientRect();
      setCoordinates({
        elemY: componentCoord.y,
        windowY: window.screenY
      });
  }
  */
  useEffect(() => {
    setTimeout(() => {
      setDisplaySettings((state) => {
        return {
          ...state,
          elmVisible: true
        }
      })
    }, 1000);
    setTimeout(() => {
      setDisplaySettings((state) => {
        return {
          ...state,
          picVisible: true
        }
      })
    }, 2500);
  }, []);
  /*
  useEffect(() => {
    if (homeHeaderRef.current) {
      window.addEventListener("scroll", listenToScroll, true);
    }
    return () => {
      window.removeEventListener("scroll", listenToScroll);
    }
  }, [homeHeaderRef]);
  */

  return (
    <div ref={homeHeaderRef}>
      <Grid>
        <Grid.Column>
          <h3 id="homeHeaderTitle"> - Our Store -</h3>
          <div id="homeScreenParallax">
          </div> 
          <Container id="homeHeaderDesc">
            <Grid stackable columns={2}>
              <Grid.Row>
                <Grid.Column style={{ position: "relative", paddingRight: "0px" }}>
                  <Reveal 
                    animated='move' 
                    className={ displaySettings.elmVisible ? "homeHeaderDescImg descImgMoved" : "homeHeaderDescImg" }
                    active={displaySettings.picVisible}
                  >
                    <Reveal.Content visible>
                      <Image src="/images/home_page/stock_Store3.jpeg" size='large' />
                    </Reveal.Content>
                    <Reveal.Content hidden>
                      <Image src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg' size='large' />
                    </Reveal.Content>
                  </Reveal>                  
                </Grid.Column>
                <Grid.Column style={{ position: "relative", paddingLeft: "0px" }}>
                  <Segment className={ displaySettings.elmVisible ? "homeHeaderDescText descTextMoved" : "homeHeaderDescText" }>
                    <p>
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Button basic color="green" onClick={handleButtonClick}>
                      See More..
                    </Button>
                  </Segment>
                </Grid.Column>
              </Grid.Row>  
            </Grid>   
          </Container>      
        </Grid.Column>
      </Grid>
    </div> 
  );
};

export default HomeHeader;