import React from "react";
import { Grid } from "semantic-ui-react";

interface Props {

};

const HomeHeader: React.FC<Props> = (props): JSX.Element => {
  return (
    <Grid>
      <Grid.Column style={{ border: "2px solid red", height: "50vh", backgroundColor: "green" }}>

      </Grid.Column>
    </Grid>
  )
};

export default HomeHeader;