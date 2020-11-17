import React from "react";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

interface Props {
  message?: string;
}
const LoadingBar: React.FC<Props> = ({ message }): JSX.Element => {

  return (
    <div style={{ height: "50px", width: "100%" }}>
      <Segment>
        <Dimmer active>
          <Loader>{message ? message : "Loading"}</Loader>
        </Dimmer>
      </Segment>
    </div>
  );
};

export default LoadingBar;
