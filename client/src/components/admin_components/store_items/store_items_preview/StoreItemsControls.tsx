import React, { useEffect } from "react";
import { } from "semantic-ui-react";
// css imports //
import "./css/storeItemsControls.css";
// additional components //
import StoreItemsControlsMenu from "../menus/StoreItemsControlMenu";
// actions and state //
import { AppAction, IGlobalAppState } from "../../../../state/Store";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
const StoreItemsControls: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { numberOfItems } = state.storeItemState;


  return (
    <div className="adminStoreItemControlsHolder">
      <div className="adminStoreItemControlsTitle">Store Item Controls</div>
      <StoreItemsControlsMenu  state={state} dispatch={dispatch} />
      <div className="adminStoreItemControls">
        <div className="adminStoreItemCounter">
          <div>Total Store Items:</div>
          <div className="adminStoreItemsCount">{numberOfItems}</div>
        </div>
      </div>
    </div>
  );
};

export default StoreItemsControls;