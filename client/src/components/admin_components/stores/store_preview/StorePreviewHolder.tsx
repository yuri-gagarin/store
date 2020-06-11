import React from "react";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// additional components //
import StorePreview from "./StorePreview";
import LoadingScreen from "../../miscelaneous/LoadingScreen";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>
}

const StorePreviewHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { loadedStores, loading } = state.storeState;
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
              <StorePreview />
            )
          })
        }
      </div>
    );
  }
};

export default StorePreviewHolder;