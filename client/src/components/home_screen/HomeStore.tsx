import React, { useRef, useEffect, useState } from "react";
import { Grid , Image, Button } from "semantic-ui-react";
// additional components //
import AdditionalStoreImg from "./AdditionalStoreImg";
// css imports //
import "./css/homeStore.css";
import AddStoreImgs from "./AdditionalStoreImg";
interface Coordinates {
  elemY: number;
  windowY: number;
}
interface ScreenDimensions {
  innerWidth: number;
  innerHeight: number;
};

const getWindowDimensions = (): ScreenDimensions => {
  const { innerWidth, innerHeight } = window;
  return {
    innerWidth,
    innerHeight
  };
};


const HomeStore: React.FC<{}> = (props): JSX.Element => {
  const [ screenDimensions, setScreenDimensions ] = useState<ScreenDimensions>({ innerWidth: 0, innerHeight: 0});
  const [ coordinates, setCoordinates ] = useState<Coordinates>({ elemY: 0, windowY: 0});
  const [ showElement, setShowElement ] = useState<boolean>(false);
  const [ largeScreen, setLargeScreen ] = useState<boolean>(false);

  const homeStoreRef = useRef<HTMLDivElement>(null);

  const listenToScroll = (ev: Event): void => {
    if (homeStoreRef.current) {
      const componentCoord: DOMRect = homeStoreRef.current.getBoundingClientRect();
      const windowY: number = window.innerHeight;
      setCoordinates({
        elemY: componentCoord.y,
        windowY: windowY
      });
    }
  };
  const handleWinResize = () => {
    if (window.innerWidth > 968) {
      setLargeScreen(true);
    }
    else {
      setLargeScreen(false);
    }
  };
  // lifecycle hooks //
  // listen for a window resize to show more images on larger screen //
  useEffect(() => {
    setScreenDimensions((getWindowDimensions()));
    window.addEventListener("resize", handleWinResize);
    return () => window.removeEventListener("resize", handleWinResize);
  }, []);
  // show more images if larger screen opened //
  useEffect(() => {
    if (screenDimensions.innerWidth && screenDimensions.innerWidth > 968) {
      setLargeScreen(true);
    }
  }, [screenDimensions]);

  useEffect(() => {
    if (coordinates.elemY > 0 && coordinates.windowY > 0) {
      if (coordinates.elemY + 50 <= coordinates.windowY) {
        if (!showElement) {
          setShowElement(true);
        }
      }
    }
  }, [coordinates]);
  useEffect(() => {
    let divRef: HTMLDivElement;
    if (homeStoreRef.current) {
      divRef = homeStoreRef.current;
      window.addEventListener("scroll", listenToScroll, true);
    }
  }, [homeStoreRef]);
  
  return (
    <div ref={homeStoreRef} className={ showElement ? "homeScreenStoreComp storeShow" : "homeScreenStoreComp" }>
      <Grid centered columns={2} stackable>
        <Grid.Row >
          <Grid.Column largeScreen={8} tablet={12} mobile={16}>
              <div className="homeScreenStoreTitle">
                <p>Our Store</p>
              </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns={2}>
          <Grid.Column>
            <div className="homeStoreDefaultPhoto">
              <Image src="/images/home_page/stock_store6.jpeg" size="huge"/>

            </div>
          </Grid.Column>
          <Grid.Column style={{ height: "100%" }}>
            <div className="homeScreenStoreDesc">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting 
                industry. Lorem Ipsum has been the industry's standard dummy text ever since the 
                1500s, when an unknown printer took a galley of type and scrambled it to make a type 
                specimen book. It has survived not only five centuries....
              </p>
            </div>
            {
              largeScreen ? <AddStoreImgs showElement={showElement} /> : null
            }
            <Button id="goToStoreBtn">Go to Store</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default HomeStore;