import React from "react";
import { Button, Grid } from "semantic-ui-react";

interface Props {
  handleBonusVideoEdit(e:  React.MouseEvent<HTMLButtonElement>): void;
}

const CancelEditControls: React.FC<Props> = ({ handleBonusVideoEdit }): JSX.Element => {
  return (
    <Grid.Row>
      <Grid.Column>
         <Button content="Close Edit" onClick={handleBonusVideoEdit}></Button>
      </Grid.Column>
    </Grid.Row>
  );
};

export default CancelEditControls;
