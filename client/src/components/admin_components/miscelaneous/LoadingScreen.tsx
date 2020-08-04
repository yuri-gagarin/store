import React from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

const LoaderExampleText: React.FC<{}> = (props): JSX.Element => {
  return (
    <div style={{ height: "100vh" }}> 
      <Segment style={{ height: "100vh" }}>
        <Dimmer active inverted>
          <Loader>Please Wait</Loader>
        </Dimmer>
      </Segment>
    </div>
  )
};

export default LoaderExampleText