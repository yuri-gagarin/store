import React from "react";
import { Grid, Segment } from "semantic-ui-react";
// additional components //
import "./HomeHeader";
import HomeHeader from "./HomeHeader";

interface Props {
  title: string
}
const HomeScreenComponent: React.FC<Props> = (props): JSX.Element => {
  return (
    <React.Fragment>
      <HomeHeader />
      <Grid stackable columns={3}>
        <Grid.Column>
          <Segment>
            <p>First Column</p>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment>
            <p>Second Column</p>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment>
            <p>Third Column</p>
          </Segment>
        </Grid.Column>
      </Grid>
    </React.Fragment> 
  );
};

export default HomeScreenComponent;
