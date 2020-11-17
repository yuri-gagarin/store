import React, { useContext, useEffect, useRef, useState } from "react";
import { Grid, Item } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps } from "react-router-dom";
// css imports //
import "./css/storeItemsPreviewHolder.css";
// additional components //
import StoreItemPreview from "./StoreItemPreview";
import StoreItemsControls from "./StoreItemsControls";
import PopularStoreItemsHolder from "./popular_store_items/PopularStoreItemsHolder";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
import ErrorScreen from "../../miscelaneous/ErrorScreen";
// types and interfaces //
import { Store } from "../../../../state/Store";
// api actions //
import { getAllStoreItems } from "../actions/APIStoreItemActions";

interface Props extends RouteComponentProps {
  
}

const StoreItemsPreviewHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedStoreItems, error } = state.storeItemState;
  // local state //
  const [ newDataLoaded, setNewDataLoaded ] = useState<boolean>(false);
  const storeItemsRef = useRef(loadedStoreItems);

  // lifecycle hooks //
  useEffect(() => {
    let componentLoaded = true;
    if (componentLoaded) {
      getAllStoreItems(dispatch)
        .then((_) => {
          setNewDataLoaded(true);
        })
        .catch((_) => {
          // handle error show modal ? //
          setNewDataLoaded(false);
        });
    }
    return () => { componentLoaded = false };
  }, [ dispatch ]);

  useEffect(() => {
    if(storeItemsRef.current !== loadedStoreItems && !loading && !error) {
      setNewDataLoaded(true);
    } 
  }, [ storeItemsRef.current, loadedStoreItems, loading, error ]);
  // component return //
  return (
    newDataLoaded ?
    <Grid stackable padded columns={2}>
      <Grid.Row>
      <Grid.Column computer={10} tablet={8} mobile={16}>
        <Item.Group>
          {
            loadedStoreItems.map((storeItem) => {
              return (
                <StoreItemPreview 
                  key={storeItem._id}
                  storeItem={storeItem}
                />
              );
            })
          }
        </Item.Group>
      </Grid.Column>
      <Grid.Column computer={6} tablet={8} mobile={16}>
        <StoreItemsControls state={state} dispatch={dispatch} />
        <PopularStoreItemsHolder popularStoreItems={loadedStoreItems}/>
      </Grid.Column>

      </Grid.Row>
      
    </Grid>
    : 
    (
      error ? <ErrorScreen lastRequest={ () => getAllStoreItems(dispatch) } /> : <LoadingScreen />
    )
  );
};
// test export without the router //
export { StoreItemsPreviewHolder };
// default export //
export default withRouter(StoreItemsPreviewHolder);