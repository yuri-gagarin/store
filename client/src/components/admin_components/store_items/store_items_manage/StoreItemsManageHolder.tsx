import React, { useEffect  } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import StoreItemFormHolder from "../forms/StoreItemFormHolder";
import StoreItemCard from "./StoreItemCard";
import StoreItemControls from "../store_items_preview/StoreItemsControls";
// actions and state //
import { getAllStoreItems } from "../actions/APIStoreItemActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// additional dependencies //
import { withRouter, RouteComponentProps, useRouteMatch, Route } from "react-router-dom";

interface Props extends RouteComponentProps {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
};

const StoreItemsManageHolder: React.FC<Props> = ({ state, dispatch, history }): JSX.Element => {
  const { loadedStoreItems } = state.storeItemState;
  const match = useRouteMatch("/admin/home/store_items/manage");

  const handleBack = () => {
    history.goBack();
  };
  useEffect(() => {
    getAllStoreItems(dispatch);
  }, []); 

  return (
    <Grid padded stackable columns={2}>
      <Route path={match?.url + "/edit"}> 
        <Grid.Row>
          <Grid.Column computer={12} tablet={6} mobile={16}>
            <h3>Editing Store Item: { state.storeItemState.currentStoreItemData.name }</h3>
            <Button inverted color="green" content="Back" onClick={handleBack}></Button>
          </Grid.Column>
        </Grid.Row>
        <StoreItemFormHolder state={state} dispatch={dispatch} />
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
            <StoreItemControls totalStoreItems={state.storeItemState.numberOfItems} />
          </Grid.Column>
        </Grid.Row>
      </Route>
    </Grid>
  );
};

export default withRouter(StoreItemsManageHolder);