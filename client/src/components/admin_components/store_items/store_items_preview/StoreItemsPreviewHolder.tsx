import React, { useEffect } from "react";
import { Grid, Item } from "semantic-ui-react";
// css imports //
import "./css/storeItemsPreviewHolder.css";
// additional components //
import StoreItemPreview from "./StoreItemPreview";
import StoreItemsControls from "./StoreItemsControls";
import PopularStoreItemsHolder from "./popular_store_items/PopularStoreItemsHolder";
// types and interfaces //
import { AppAction, IGlobalAppState } from "../../../../state/Store";
// api actions //
import { getAllStoreItems } from "../actions/APIStoreItemActions";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

const StoreItemsPreviewHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { loadedStoreItems, numberOfItems } = state.storeItemState;
  useEffect(() => {
    getAllStoreItems(dispatch);
  }, []);

  return (
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
        <StoreItemsControls totalStoreItems={numberOfItems} />
        <PopularStoreItemsHolder popularStoreItems={loadedStoreItems}/>
      </Grid.Column>

      </Grid.Row>
      
    </Grid>
  )
};

export default StoreItemsPreviewHolder;