import React from "react";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
// css imports //

const StoreItemFormNoStoreScreen: React.FC<{}> = (props): JSX.Element => {

  return (
      <Segment placeholder>
        <Header icon>
          <Icon name="image"/>
            No Stores have been created yet. Please create at least one Store
        </Header>
        <Button primary>Go Back</Button>
        <Button primary>Create A Store</Button>

      </Segment>
  );
};

export default StoreItemFormNoStoreScreen;