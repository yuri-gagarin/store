import React, { useContext, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
// additional components //
import StoreCard from "./StoreCard";
import { Store } from "../../../state/Store";
import { getAllStores } from "./actions/APIstoreActions";

const StoreViewHolder: React.FC<{}> = (props): JSX.Element => {
  const [ loaded, setLoaded ] = useState<boolean>(false);
  const { state, dispatch } = useContext(Store);
  const { loadedStores } = state.storeState;

  useEffect(() => {
    getAllStores(dispatch)
      .then((success) => {
        if (success) {
          setLoaded(true);
        }
      })
  }, [dispatch]);

  return (
    <Grid celled padded>
      {
        loadedStores.map((store) => {
          return (
            <StoreCard 
              key={store._id} 
              _id={store._id}
              title={store.title} 
              description={store.description} 
              createdAt={store.createdAt}
              imageCount={store.images.length}
              state={state}
              dispatch={dispatch}
              
            />
          );
        })
      }
    </Grid>
  );
};

export default StoreViewHolder;