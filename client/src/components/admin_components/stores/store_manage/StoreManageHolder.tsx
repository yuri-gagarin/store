import React, { useContext, useEffect } from "react";
import { Button, Grid } from "semantic-ui-react";
import StoreFormHolder from "../forms/StoreFormHolder";
import StoreCard from "./StoreCard";
import { withRouter, RouteComponentProps, useRouteMatch, Route } from "react-router-dom";
import { Store } from "../../../../state/Store";
import { getAllStores } from "../actions/APIstoreActions";

interface Props extends RouteComponentProps {};

const StoreManageHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loadedStores } = state.storeState;
  const match = useRouteMatch("/admin/home/my_store/manage");

  const handleBack = () => {
    history.goBack();
  }
  useEffect(() => {
    getAllStores(dispatch);
  }, []); 

  return (
    <Grid padded>
       
      <Route path={match?.url + "/edit"}> 
        <Grid.Row>
          <Grid.Column>
            <h3>Editing Store: { state.storeState.currentStoreData.title }</h3>
            <Button inverted color="green" content="Back" onClick={handleBack}></Button>
          </Grid.Column>
        </Grid.Row>
        <StoreFormHolder state={state} dispatch={dispatch} />
      </Route>
      <Route exact path={match?.url}>
        {
          loadedStores.map((store) => {
            return (
              <StoreCard 
                key={store._id}
                _id={store._id}
                title={store.title}
                description={store.description}
                imageCount={store.images.length}
                createdAt={store.createdAt}
                editedAt={store.editedAt}
                state={state}
                dispatch={dispatch}
              />
            );
          })
        }
      </Route>
     
    </Grid>
  );
};

export default withRouter(StoreManageHolder);