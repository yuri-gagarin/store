import React, { useEffect, useState } from "react";
// additional components //
import StorePreview from "./StorePreview";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
// actions and state //
import { getAllStores } from "../actions/APIstoreActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>
}

const StorePreviewHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { loadedStores, loading } = state.storeState;
  // local state //
  const [ dataLoaded, setDataLoaded ] = useState<boolean>(false);

  useEffect(() => {
    getAllStores(dispatch)
      .then((success) => {
        setDataLoaded(true);
      });
  }, []);

  return (
    dataLoaded ?
    <div>
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
    : 
    <LoadingScreen />
  );
};

export default StorePreviewHolder;