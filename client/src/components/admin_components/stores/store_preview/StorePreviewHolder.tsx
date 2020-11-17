import React, { useContext, useEffect, useRef, useState } from "react";
import { Grid } from "semantic-ui-react";
// additional components //
import StorePreview from "./StorePreview";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
// actions and state //
import { getAllStores } from "../actions/APIstoreActions";
import { Store } from "../../../../state/Store";
import { withRouter, RouteComponentProps } from "react-router-dom";
import ErrorScreen from "../../miscelaneous/ErrorScreen";

interface Props extends RouteComponentProps {
  
}

const StorePreviewHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedStores, error } = state.storeState;
  // local state //
  const [ newDataLoaded, setnewDataLoaded ] = useState<boolean>(false);
  const storesRef = useRef(loadedStores)
  
  // lifecycle hooks //
  useEffect(() => {
    let componentLoaded = true;
    if (componentLoaded) {
      getAllStores(dispatch)
        .then((_) => {
          // handle success //
          setnewDataLoaded(true);
        })
        .catch((_) => {
          // handle an error, show an error ? //
          setnewDataLoaded(false);
        });
    }
    return () => { componentLoaded = false };
  }, [ dispatch ]);

  useEffect(() => {
    if ((storesRef.current != loadedStores) && !loading && !error) {
      setnewDataLoaded(true);
    }
  }, [ storesRef.current, loadedStores, loading, error ]);
  // component render //
  return (
    newDataLoaded ?
    <Grid 
      id="adminStorePreviewHolder"
      stackable
      padded
      columns={2}
    >
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
    </Grid>
    :
    (
      error ? <ErrorScreen lastRequest={ () => getAllStores(dispatch) } /> : <LoadingScreen />
    )
  );
};
// test export without the router //
export { StorePreviewHolder };
// default export //
export default withRouter(StorePreviewHolder);