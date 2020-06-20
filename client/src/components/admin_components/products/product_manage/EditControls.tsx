import React from "react";
import { Button, Grid } from "semantic-ui-react";

interface Props {
  handleProductEdit(e:  React.MouseEvent<HTMLButtonElement>): void;
}

const CancelEditControls: React.FC<Props> = ({ handleProductEdit }): JSX.Element => {
  return (
    <Grid.Row>
      <Grid.Column>
         <Button content="Close Edit" onClick={handleProductEdit}></Button>
      </Grid.Column>
    </Grid.Row>
  );
};

export default CancelEditControls;
