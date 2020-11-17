import React from 'react'
import { Button, Dimmer, Header, Icon, Segment } from 'semantic-ui-react'
import axios from "axios";

type RetryLastReqFunc = <T> () => T
interface Props {
  errorMessage?: string;
  lastRequest?: () => Promise<void>;
}
const ErrorScreen: React.FC<Props> = ({ errorMessage, lastRequest }): JSX.Element => {

  const handleRetry = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (lastRequest) {
      lastRequest();
    }
  };
  
  return (
    <div style={{ height: "100vh" }}> 
      <Segment style={{ height: "100vh" }}>
        <Dimmer active>
          <Header as='h2' icon inverted>
            <Icon name='exclamation circle' />
              An Error Occured!
            <Header.Subheader>Dimmer sub-header</Header.Subheader>
            <Button 
              id="errorScreenRetryButton"
              inverted 
              color="green" 
              content="Retry" 
              onClick={handleRetry} 
            />
          </Header>
        </Dimmer>
      </Segment>
    </div>
  )
};

export default ErrorScreen