import React from "react";
import { Grid } from "semantic-ui-react";
// additional components //
import ServiceComponent from "./services/ServiceComponent";
import FooterBar from "../navbars/FooterBar";
// css imports //
import "./css/storeHolder.css";

// mock services, later from db //
const services = [
  {
    description: "service 1"
  },
  {
    description: "service 2"
  },
  {
    description: "service 3"
  },
  {
    description: "service 4"
  },
  {
    description: "service 5"
  }
];

const StoreHolder: React.FC<{}> = (props): JSX.Element => {
  return (
    <div className="storeHolderDiv">
      <div id="storeTitle">
        <p>Store</p>
        <p>and</p>
        <p>Services</p>
      </div>
      
      <Grid columns={1} centered>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={16} computer={16}>
            <div className="storeHeader">
              <div className="storeGallery">
                {
                  services.map((service) => <ServiceComponent description={service.description}/>)
                }
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={16} computer={16}>
            
          </Grid.Column>
        </Grid.Row><Grid.Row>
          <Grid.Column mobile={16} tablet={16} computer={16}>
            <div className="storeDetails">
            
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <FooterBar />
    </div>
  );
};

export default StoreHolder;