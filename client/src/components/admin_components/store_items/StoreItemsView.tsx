import React, { useContext, useEffect, useState } from "react";
// additional components //
import AdminStoreItemsMenu from "../menus/AdminStoreItemsMenu";
import Spacer from "../miscelaneous/Spacer";
import StoreItemsManageHolder from "./store_items_manage/StoreItemsManageHolder";
import StoreItemsPreviewHolder from "./store_items_preview/StoreItemsPreviewHolder";
import StoreItemFormHolder from "./forms/StoreItemFormHolder";
// css imports //
import "./css/storeItemsView.css";
// routing //
import { RouteComponentProps, Route, Switch, withRouter } from "react-router-dom";
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
      <AdminStoreItemsMenu state={state} dispatch={dispatch} />
      <Switch>
        <Route path="/admin/home/store_items/all">
          <Spacer width="100%" height="100px"/>
          <StoreItemsPreviewHolder state={state} dispatch={dispatch} />
        </Route>
        <Route path="/admin/home/store_items/create">
          <Spacer width="100%" height="100px" />
          <StoreItemFormHolder />
        </Route>
        <Route path="/admin/home/store_items/manage">
          <Spacer width="100%" height="100px"></Spacer>
          <StoreItemsManageHolder />
        </Route>
      </Switch>
    </div>
  );
};

export default withRouter(StoreItemsView);