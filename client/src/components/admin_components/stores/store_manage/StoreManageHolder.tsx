import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import StoreFormHolder from "../forms/StoreFormHolder";
import StoreCard from "./StoreCard";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
import ErrorScreen from "../../miscelaneous/ErrorScreen";
// actions and state //
import { getAllStores } from "../actions/APIstoreActions";
import { Store } from "../../../../state/Store";
// routing and dependencies //
import { withRouter, RouteComponentProps, useRouteMatch, Route } from "react-router-dom";

interface Props extends RouteComponentProps {};

const StoreManageHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loadedStores, error } = state.storeState;
  // local state //
  const [ dataLoaded, setDataLoaded ] = useState<boolean>(false);
  // routing //
  const match = useRouteMatch("/admin/home/my_stores/manage");
  const handleBack = () => {
    history.goBack();
  }

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getAllStores(dispatch)
        .then((_) => {
          setDataLoaded(true);
        })
        .catch(_ => {
          setDataLoaded(false);
        })
    }
    return () => { isMounted = false }; 

  }, []);
  
  /*
  useEffect(() => {
    console.log(state);
  }, [state])
  */
  return (
    dataLoaded ?
    <Grid padded id="storeManageHolder">
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
    :
    (
      error ? <ErrorScreen lastRequest={() => getAllStores(dispatch)} /> : <LoadingScreen />
    )
  );
};

// for unit testing //
export { StoreManageHolder };

export default withRouter(StoreManageHolder);