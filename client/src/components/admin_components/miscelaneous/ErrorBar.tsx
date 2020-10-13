import React from "react";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

const ErrorBar: React.FC<{}> = (props): JSX.Element => {

  return (
    <div style={{ height: "50px", width: "100%" }}>
      <Segment>
        <Dimmer active>
          <Loader>Error Occured</Loader>
        </Dimmer>
      </Segment>
    </div>
  );
};

export default ErrorBar;
