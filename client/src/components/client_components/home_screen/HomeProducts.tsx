import React, { useState, useRef, useEffect } from "react";
import { Grid, Segment, Image, Icon, Button } from "semantic-ui-react";
// css imports //
import "./css/homeProducts.css";

interface ElementStatus {
  firstVisible: boolean;
  secondVisible: boolean;
  thirdVisible: boolean;
};

const HomeProducts: React.FC<{}> = (props): JSX.Element => {
  const initElStatus: ElementStatus = { firstVisible: false, secondVisible: false, thirdVisible: false }; 
  // local state and refs //
  const homeProductsRef = useRef<HTMLDivElement>(document.createElement("div"));
  const [ elementStatus, setElementStatus ] = useState<ElementStatus>(initElStatus);
  const [ showComp, setShowComp ] = useState<boolean>(false);

  // scroll spy to watch if component is in view //
  const scrollSpy = (e: Event): void => {
    if (homeProductsRef.current) {
      const compRect: DOMRect = homeProductsRef.current.getBoundingClientRect();
      if (compRect.y + 100 < window.innerHeight) {
        setShowComp(true);
      }
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", scrollSpy, true);
    return () => window.removeEventListener("scroll", scrollSpy);
  }, [homeProductsRef]);
  // will fade in each element one by one //
  useEffect(() => {
    if (showComp) {
      setTimeout(() => {
        setElementStatus((state) => ({ ...state, firstVisible: true }));
      }, 500);
      setTimeout(() => {
        setElementStatus((state) => ({ ...state, secondVisible: true }));
      }, 1000);
      setTimeout(() => {
        setElementStatus((state) => ({ ...state, thirdVisible: true }));
      }, 1500);
      window.removeEventListener("scroll", scrollSpy);
    }
  }, [showComp]);

  return (
    <div className="homeProductsHolder" ref={homeProductsRef}>
      <Grid stackable container columns={3}>
        <Grid.Row>
            <h3 className="homeProductsHeader">Products Showcase</h3>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column 
            className={ elementStatus.firstVisible ? "homeProdSegHolder showHomeProd" : "homeProdSegHolder" }
          >
            <Segment className="homeProductSegment">
              <Image src="/images/home_page/stock_store1.jpeg"></Image>
              <div className="homeProductImgCover">
                <Icon name="search plus" className="homeProductMoreIcon"></Icon>
              </div>
            </Segment>
            <Segment className="homeProductDesc">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's..   
              </p>
              <Button basic color="olive" className="productMoreBtn">
                More...
              </Button>
            </Segment>
        
          </Grid.Column>
          <Grid.Column className={ elementStatus.secondVisible ? "homeProdSegHolder showHomeProd" : "homeProdSegHolder" }>
            <Segment className="homeProductSegment">
              <Image src="/images/home_page/stock_store1.jpeg"></Image>
              <div className="homeProductImgCover">
                <Icon name="search plus" className="homeProductMoreIcon"></Icon>
              </div>
            </Segment>
            <Segment className="homeProductDesc">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's..   
              </p>
              <Button basic color="olive" className="productMoreBtn">
                More...
              </Button>
            </Segment>
        
          </Grid.Column>
          <Grid.Column className={ elementStatus.thirdVisible ? "homeProdSegHolder showHomeProd" : "homeProdSegHolder" }>
            <Segment className="homeProductSegment">
              <Image src="/images/home_page/stock_store1.jpeg"></Image>
              <div className="homeProductImgCover">
                <Icon name="search plus" className="homeProductMoreIcon"></Icon>
              </div>
            </Segment>
            <Segment className="homeProductDesc">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's..   
              </p>
              <Button basic color="olive" className="productMoreBtn">
                More...
              </Button>
            </Segment>
        
          </Grid.Column>

        </Grid.Row>
       
      </Grid>
    </div>
  );
};

export default HomeProducts;