import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import StoreItemFormHolder from "../forms/StoreItemFormHolder";
import StoreItemCard from "./StoreItemCard";
import StoreItemControls from "../store_items_preview/StoreItemsControls";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
import ErrorScreen from "../../miscelaneous/ErrorScreen";
// actions and state //
import { getAllStoreItems } from "../actions/APIStoreItemActions";
import { Store } from "../../../../state/Store";
// additional dependencies //
import { withRouter, RouteComponentProps, useRouteMatch, Route } from "react-router-dom";
import { AdminStoreItemRoutes } from "../../../../routes/adminRoutes";

interface Props extends RouteComponentProps {
};

const StoreItemsManageHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedStoreItems, error } = state.storeItemState;
  // local state //
  const [ newDataLoaded, setNewDataLoaded ] = useState<boolean>(false);
  const storeItemsRef = useRef(loadedStoreItems);
  // client routing //
  const match = useRouteMatch(AdminStoreItemRoutes.MANAGE_ROUTE);

  const handleBack = () => {
    history.goBack();
  };
  // lifecycle hooks //
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getAllStoreItems(dispatch)
        .then((_) => {
          setNewDataLoaded(true);
        })
        .catch((_) => {
          setNewDataLoaded(false);
        });
    }
    return () => { isMounted = false };
  }, [ dispatch ]); 

  useEffect(() => {
    if (storeItemsRef.current != loadedStoreItems && !loading && !error) {
      setNewDataLoaded(true);
    }
  }, [ storeItemsRef.current, loadedStoreItems, loading, error ]);

  return (
    newDataLoaded ? 
    <Grid padded stackable columns={2}>
      <Route path={AdminStoreItemRoutes.EDIT_ROUTE}> 
        <Grid.Row>
          <Grid.Column computer={12} tablet={6} mobile={16}>
            <h3>Editing Store Item: { state.storeItemState.currentStoreItemData.name }</h3>
            <Button
              id="adminStoreItemsManageBackBtn"
              inverted 
              color="green" 
              content="Back" 
              onClick={handleBack}>
            </Button>
          </Grid.Column>
        </Grid.Row>
        <StoreItemFormHolder />
      </Route>
      <Route exact path={match?.url}>
        <Grid.Row>
          <Grid.Column computer={12} tablet={8} mobile={16}>
          {
            loadedStoreItems.map((storeItem) => {
              return (
                <StoreItemCard 
                  key={storeItem._id}
                  storeItem={storeItem}
                  imageCount={storeItem.images.length}
                  state={state}
                  dispatch={dispatch}
                />
              );
            })
          }
          </Grid.Column>
          <Grid.Column computer={4} tablet={8} mobile={16}>
            <StoreItemControls state={state} dispatch={dispatch} />
          </Grid.Column>
        </Grid.Row>
      </Route>
    </Grid>
    :
    (
      error ? <ErrorScreen lastRequest={ () => getAllStoreItems(dispatch) } /> : <LoadingScreen />
    )
  );
}
// for tests //
export { StoreItemsManageHolder };
// 
export default withRouter(StoreItemsManageHolder);