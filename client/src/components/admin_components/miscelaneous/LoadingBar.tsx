import React from "react";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

const LoadingBar: React.FC<{}> = (props): JSX.Element => {

  return (
    <div style={{ height: "50px", width: "100%" }}>
      <Segment>
        <Dimmer active>
          <Loader>Loading</Loader>
        </Dimmer>
      </Segment>
    </div>
  );
};

export default LoadingBar;
