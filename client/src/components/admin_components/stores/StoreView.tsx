import React, { useContext } from "react";
import StoreFormHolder from "./forms/StoreFormHolder";
// css imports //
import "./css/adminStoreView.css";
import AdminStoreMenu from "../menus/AdminStoreMenu";
import { Route, Switch } from "react-router-dom";
// additional components //
import StorePreviewHolder from "./store_preview/StorePreviewHolder";
import StoreManageHolder from "./store_manage/StoreManageHolder";
import Spacer from "../miscelaneous/Spacer";
// client routes //
import AdminStoreRoutes from "../../../routes/adminStoreRoutes";
// state //
import { Store } from "../../../state/Store";

const StoreGeneralView: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  return (
    <div id="adminStoreViewHolder">
      <AdminStoreMenu  dispatch={dispatch} />
      <Switch>
        <Route path={AdminStoreRoutes.ADMIN_STORES_VIEW_ALL_ROUTE}>
          <Spacer width="100%" height="100px" />
          <StorePreviewHolder />
        </Route>
        <Route path={AdminStoreRoutes.ADMIN_STORES_CREATE_ROUTE}>
          <Spacer width="100%" height="100px"/>
          <StoreFormHolder />
        </Route>
        <Route path={AdminStoreRoutes.ADMIN_STORES_VIEW_ALL_ROUTE}>
          <Spacer width="100%" height="100px" />
          <StoreManageHolder />
        </Route>
      </Switch>
     
    </div>
  )
};

export default StoreGeneralView;