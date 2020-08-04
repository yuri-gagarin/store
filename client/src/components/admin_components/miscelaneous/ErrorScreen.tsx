import React from 'react'
import { Button, Dimmer, Header, Icon, Segment } from 'semantic-ui-react'

interface Props {
  errorMessage?: string;
}
const ErrorScreen: React.FC<Props> = ({ errorMessage }): JSX.Element => {

  const handleRetry = (e: React.MouseEvent<HTMLButtonElement>): void => {

  };
  
  return (
    <div style={{ height: "100vh" }}> 
      <Segment style={{ height: "100vh" }}>
        <Dimmer active>
          <Header as='h2' icon inverted>
            <Icon name='exclamation circle' />
              An Error Occured!
            <Header.Subheader>Dimmer sub-header</Header.Subheader>
            <Button inverted color="green" content="Retry" onClick={handleRetry} />
          </Header>
        </Dimmer>
      </Segment>
    </div>
  )
};

export default ErrorScreen