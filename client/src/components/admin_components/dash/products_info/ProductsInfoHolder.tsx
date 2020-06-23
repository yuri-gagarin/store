import React from "react";
// css imports //
import "./css/productsInfoHolder.css";
// state and actions //
import { IGlobalAppState, AppAction } from "../../../../state/Store";

interface Props {
  total?: number;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
const ProducsInfoHolder: React.FC<Props> = ({ total, state }): JSX.Element => {
  const numOfProducts = state.productState.loadedProducts.length;
  return (
    <div id="productsInfoHolder">
      <div className="productsCounter">
        Videos
      </div>
      <div className="productsTotal">
        {numOfProducts}
      </div>
    </div>
  )
};  

export default ProducsInfoHolder;