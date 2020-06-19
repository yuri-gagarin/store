import React from "react";
import { } from "semantic-ui-react";
// css imports //
import "./css/productsControls.css";
// additional components //

interface Props {
  totalProducts: number;
}
const ProductsControls: React.FC<Props> = ({ totalProducts }): JSX.Element => {

  return (
    <div className="adminProductControlsHolder">
      <div className="adminProductControlsTitle">Product Controls</div>
      <div className="adminProductControls">
        <div className="adminProductCounter">
          <div>Total Products:</div>

          <div className="adminProductsCount">{totalProducts}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductsControls;