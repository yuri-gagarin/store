import React, { useContext, useEffect, useState } from "react";
// additional components //
import AdminProductsMenu from "../menus/AdminProductsMenu";
import Spacer from "../miscelaneous/Spacer";
// import ProductsManageHolder from "./product_manage/ProductsManageHolder";
// import ProductsPreviewHolder from "./product_preview/ProductsPreviewHolder";
// import ProductFormHolder from "./forms/ProductFormHolder";
// css imports //
import "./css/productsView.css";
// routing //
import { Route, Switch } from "react-router-dom";
// state //
import { Store } from "../../../state/Store";

const ProductsView: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const [ popularProducts, setPopularProducts ] = useState<IProductData[]>([]);

  // set popular productss -- to be added later -- maybe //
  useEffect(() => {
    setPopularProducts(() => {
      return popularProducts.slice(0, 4);
    })
  }, []);

  return (
    <div id="adminProductsViewHolder">
      <AdminProductsMenu dispatch={dispatch} />
      <Switch>
        <Route path="/admin/home/my_products/all">
          <Spacer width="100%" height="100px"/>
        </Route>
        <Route path="/admin/home/my_products/create">
          <Spacer width="100%" height="100px" />
        </Route>
        <Route path="/admin/home/my_products/manage">
          <Spacer width="100%" height="100px"></Spacer>
        </Route>
      </Switch>
    </div>
  );
};

export default ProductsView;