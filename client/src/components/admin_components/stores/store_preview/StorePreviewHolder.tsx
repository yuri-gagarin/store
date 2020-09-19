import React, { useContext, useEffect, useState } from "react";
// additional components //
import StorePreview from "./StorePreview";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
// actions and state //
import { getAllStores } from "../actions/APIstoreActions";
import { Store } from "../../../../state/Store";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps {
  
}

const StorePreviewHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedStores } = state.storeState;
  
  // lifecycle hook //
  useEffect(() => {
    let componentLoaded = true;
    if (componentLoaded) {
      getAllStores(dispatch)
        .then((_) => {
          // handle success //
        })
        .catch((_) => {
          // handle an error, show an error ? //
        });
    }
    return () => { componentLoaded = false };
  }, [ dispatch ]);
  // component render //
  return (
    loading ? 
    <LoadingScreen />
    :
    <div id="adminStorePreviewHolder">
      {
        loadedStores.map((store) => {
          return (
            <StorePreview 
              key={store._id}
              _id={store._id}
              title={store.title}
              description={store.description}
              images={store.images}
              createdAt={store.createdAt}
              editedAt={store.editedAt}
            />
          );
        })
      }
    </div>
  );
};
// test export without the router //
export { StorePreviewHolder };
// default export //
export default withRouter(StorePreviewHolder);