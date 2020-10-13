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
import { AdminStoreRoutes } from "../../../../routes/adminRoutes";

interface Props extends RouteComponentProps {};

const StoreManageHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedStores, error } = state.storeState;
  // local state //
  const [ newDataLoaded, setNewDataLoaded ] = useState<boolean>(false);
  const storesRef = useRef(loadedStores);
  // routing //
  const match = useRouteMatch(AdminStoreRoutes.MANAGE_ROUTE);
  const handleBack = () => {
    history.goBack();
  }
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getAllStores(dispatch)
        .then((_) => {
          setNewDataLoaded(true)
        })
        .catch(_ => {
          setNewDataLoaded(false)
        })
    }
    return () => { isMounted = false }; 

  }, []);

  useEffect(() => {
    if (storesRef.current != loadedStores && !error && !loading) {
      setNewDataLoaded(true);
    }
  }, [ storesRef.current, loadedStores, error, loading ]);


  /*
  useEffect(() => {
    console.log(state.storeState)
  }, [state.storeState])
  */

  return (
    newDataLoaded ?
    <Grid padded id="storeManageHolder">
      <Route path={match?.url + "/edit"}> 
        <Grid.Row>
          <Grid.Column>
            <h3>Editing Store: { state.storeState.currentStoreData.title }</h3>
            <Button inverted color="green" content="Back" onClick={handleBack}></Button>
          </Grid.Column>
        </Grid.Row>
        <StoreFormHolder />
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