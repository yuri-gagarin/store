import React from "react";
import { Grid, Segment, Image } from "semantic-ui-react";
// css imports //
import "./css/homeProducts.css";

const HomeProducts: React.FC<{}> = (props): JSX.Element => {
  return (
    <div className="homeProductsScreenComp">
      <Grid stackable container columns={3}>
        <Grid.Column>
          <Segment style={{ border: "2px solid red", height: "300px" }}>
            <Image src="/images/home_page/stock_store1.jpeg"></Image>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment style={{ border: "2px solid red", height: "300px" }}>
            <Image src="/images/home_page/stock_store1.jpeg"></Image>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment style={{ border: "2px solid red", height: "300px" }}>
            <Image src="/images/home_page/stock_store1.jpeg"></Image>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default HomeProducts;