import React from "react";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
// client routing imports //
import { withRouter, RouteComponentProps } from "react-router-dom";
// css imports //

interface Props extends RouteComponentProps {

}

const StoreItemFormNoStoreScreen: React.FC<Props> = ({ history }): JSX.Element => {

  const handleBackClick = () => {
    history.goBack();
  };
  const handleGoToStoreCreate = () => {
    history.push("/admin/home/my_stores/create");
  };

  return (
      <Segment placeholder>
        <Header icon>
          <Icon name="image"/>
            No Stores have been created yet. Please create at least one Store
        </Header>
        <Button 
          primary
          content={"Go Back"}
          onClick={handleBackClick}
        />
        <Button 
          primary 
          content={"Create a Store"}
          onClick={handleGoToStoreCreate}
        />

      </Segment>
  );
};

export default withRouter(StoreItemFormNoStoreScreen);