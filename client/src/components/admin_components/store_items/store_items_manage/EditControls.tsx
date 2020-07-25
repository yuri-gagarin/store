import React from "react";
import { Button, Grid } from "semantic-ui-react";

interface Props {
  handleStoreItemEdit(e:  React.MouseEvent<HTMLButtonElement>): void;
}

const CancelEditControls: React.FC<Props> = ({ handleStoreItemEdit }): JSX.Element => {
  return (
    <Grid.Row>
      <Grid.Column>
         <Button content="Close Edit" onClick={handleStoreItemEdit}></Button>
      </Grid.Column>
    </Grid.Row>
  );
};

export default CancelEditControls;
