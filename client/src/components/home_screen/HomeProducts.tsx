import React from "react";
import { Grid, Segment } from "semantic-ui-react";

const HomeStore: React.FC<{}> = (props): JSX.Element => {
  return (
    <Grid stackable container columns={3}>
      <Grid.Column>
        <Segment style={{ border: "2px solid red", height: "300px" }}>

        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment style={{ border: "2px solid red", height: "300px" }}>

        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment style={{ border: "2px solid red", height: "300px" }}>

        </Segment>
      </Grid.Column>
    </Grid>
  )
};

export default HomeStore;