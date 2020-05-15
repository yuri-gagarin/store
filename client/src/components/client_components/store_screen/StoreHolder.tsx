import React from "react";
import { Grid } from "semantic-ui-react";
// css imports //
import "./css/storeHolder.css";

const StoreHolder: React.FC<{}> = (props): JSX.Element => {
  return (
    <div className="storeHolderDiv">
      <Grid columns={1}>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={12} computer={14}>

          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>

          </Grid.Column>
        </Grid.Row><Grid.Row>
          <Grid.Column>

          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default StoreHolder;