import React, { useRef, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
// css imports //
import "./css/homeStore.css";
interface Coordinates {
  elemY: number;
  windowY: number;
}

const HomeStore: React.FC<{}> = (props): JSX.Element => {
  const [ coordinates, setCoordinates ] = useState<Coordinates>({ elemY: 0, windowY: 0});
  const [ showElement, setShowElement ] = useState<boolean>(false);

  const homeStoreRef = useRef<HTMLDivElement>(null);

  const listenToScroll = (ev: Event): void => {
    console.log("firing")
    if (homeStoreRef.current) {
      const componentCoord: DOMRect = homeStoreRef.current.getBoundingClientRect();
      const windowY: number = window.innerHeight;
      setCoordinates({
        elemY: componentCoord.y,
        windowY: windowY
      });
    }
  }
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
              <p>Store Photo here</p>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className="homeScreenStoreDesc">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting 
                industry. Lorem Ipsum has been the industry's standard dummy text ever since the 
                1500s, when an unknown printer took a galley of type and scrambled it to make a type 
                specimen book. It has survived not only five centuries....
              </p>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default HomeStore;