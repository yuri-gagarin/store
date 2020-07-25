import React from "react";
import { } from "semantic-ui-react";
// css imports //
import "./css/storeItemsControls.css";
// additional components //

interface Props {
  totalStoreItems: number;
}
const StoreItemsControls: React.FC<Props> = ({ totalStoreItems }): JSX.Element => {

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