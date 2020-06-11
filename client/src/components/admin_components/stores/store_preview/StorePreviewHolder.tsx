import React, { useEffect } from "react";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// additional components //
import StorePreview from "./StorePreview";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
import { getAllStores } from "../actions/APIstoreActions";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>
}

const StorePreviewHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { loadedStores, loading } = state.storeState;

  useEffect(() => {
    getAllStores(dispatch);
  }, []);

  if (loading) {
    return (
      <LoadingScreen />
    );
  } else {
    return (
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
              />
            );
          })
        }
      </div>
    );
  }
};

export default StorePreviewHolder;