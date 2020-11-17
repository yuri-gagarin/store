import React, { useContext, useEffect, useState } from "react";
// additional components //
import AdminStoreItemsMenu from "../menus/AdminStoreItemsMenu";
import Spacer from "../miscelaneous/Spacer";
import StoreItemsManageHolder from "./store_items_manage/StoreItemsManageHolder";
import StoreItemsPreviewHolder from "./store_items_preview/StoreItemsPreviewHolder";
import StoreItemFormHolder from "./forms/StoreItemFormContainer";
// css imports //
import "./css/storeItemsView.css";
// routing //
import {  Route, Switch, withRouter } from "react-router-dom";
import { AdminStoreItemRoutes } from "../../../routes/adminRoutes";
// state //
import { Store } from "../../../state/Store";

const StoreItemsView: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const [ popularStoreItems, setPopularStoreItems ] = useState<IStoreItemData[]>([]);

  // set popular store Items -- to be added later -- maybe //
  useEffect(() => {
    setPopularStoreItems(() => {
      return popularStoreItems.slice(0, 4);
    });
  }, []);

  return (
    <div id="adminStoreItemsViewHolder">
      <AdminStoreItemsMenu dispatch={dispatch} />
      <Switch>
        <Route path={AdminStoreItemRoutes.VIEW_ALL_ROUTE}>
          <Spacer width="100%" height="100px"/>
          <StoreItemsPreviewHolder />
        </Route>
        <Route path={AdminStoreItemRoutes.CREATE_ROUTE}>
          <Spacer width="100%" height="100px" />
          <StoreItemFormHolder />
        </Route>
        <Route path={AdminStoreItemRoutes.MANAGE_ROUTE}>
          <Spacer width="100%" height="100px"></Spacer>
          <StoreItemsManageHolder />
        </Route>
      </Switch>
    </div>
  );
};

export default withRouter(StoreItemsView);