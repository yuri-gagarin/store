import React, { useContext, useEffect, useState } from "react";
// additional components //
import AdminProductsMenu from "../menus/AdminProductsMenu";
import Spacer from "../miscelaneous/Spacer";
import ProductsManageHolder from "./product_manage/ProductsManageHolder";
import ProductsPreviewHolder from "./product_preview/ProductsPreviewHolder";
import ProductFormHolder from "./forms/ProductFormHolder";
// css imports //
import "./css/productsView.css";
// routing //
import { Route, Switch } from "react-router-dom";
import { AdminProductRoutes } from "../../../routes/adminRoutes";
// state //
import { Store } from "../../../state/Store";

const ProductsView: React.FC<{}> = (props): JSX.Element => {
  const { dispatch } = useContext(Store);
  const [ popularProducts, setPopularProducts ] = useState<IProductData[]>([]);

  // set popular products -- to be added later -- maybe //
  useEffect(() => {
    setPopularProducts(() => {
      return popularProducts.slice(0, 4);
    })
  }, []);

  return (
    <div id="adminProductsViewHolder">
      <AdminProductsMenu dispatch={dispatch} />
      <Switch>
        <Route path={AdminProductRoutes.VIEW_ALL_ROUTE}>
          <Spacer width="100%" height="100px"/>
          <ProductsPreviewHolder />
        </Route>
        <Route path={AdminProductRoutes.CREATE_ROUTE}>
          <Spacer width="100%" height="100px" />
          <ProductFormHolder />
        </Route>
        <Route path={AdminProductRoutes.MANAGE_ROUTE}>
          <Spacer width="100%" height="100px"></Spacer>
          <ProductsManageHolder />
        </Route>
      </Switch>
    </div>
  );
};

export default ProductsView;