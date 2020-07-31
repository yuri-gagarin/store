import React, { useEffect } from "react";
import { } from "semantic-ui-react";
// css imports //
import "./css/storeItemsControls.css";
// additional components //
// actions and state //
import { AppAction } from "../../../../state/Store";

interface Props {
  totalStoreItems: number;
  dispatch?: React.Dispatch<AppAction>;
}
const StoreItemsControls: React.FC<Props> = ({ totalStoreItems }): JSX.Element => {
  useEffect(() => {
  }, []);

  return (
    <div className="adminStoreItemControlsHolder">
      <div className="adminStoreItemControlsTitle">Store Item Controls</div>
      <div className="adminStoreItemControls">
        <div className="adminStoreItemCounter">
          <div>Total Store Items:</div>

          <div className="adminStoreItemsCount">{totalStoreItems}</div>
        </div>
      </div>
    </div>
  );
};

export default StoreItemsControls;