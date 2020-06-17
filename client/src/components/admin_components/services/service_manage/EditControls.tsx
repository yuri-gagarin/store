import React from "react";
import { Button, Grid } from "semantic-ui-react";

interface Props {
  handleServiceEdit(e:  React.MouseEvent<HTMLButtonElement>): void;
}

const CancelEditControls: React.FC<Props> = ({ handleServiceEdit }): JSX.Element => {
  return (
    <Grid.Row>
      <Grid.Column>
         <Button content="Close Edit" onClick={handleServiceEdit}></Button>
      </Grid.Column>
    </Grid.Row>
  );
};

export default CancelEditControls;
