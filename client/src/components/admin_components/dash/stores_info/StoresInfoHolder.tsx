import React from "react";
// css imports //
import "./css/storesInfoHolder.css";
// state and actions //
import { IGlobalAppState, AppAction } from "../../../../state/Store";

interface Props {
  total?: number;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
const StoresInfoHolder: React.FC<Props> = ({ state, total }): JSX.Element => {
  const numOfStores = state.storeState.loadedStores.length;
  return (
    <div id="storesInfoHolder">
      <div className="storesCounter">
        Videos
      </div>
      <div className="storesTotal">
        {numOfStores}
      </div>
    </div>
  )
};  

export default StoresInfoHolder;