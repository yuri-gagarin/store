import React, { useContext } from "react";
import StoreManageHolder from "./forms/StoreFormHolder";
// css imports //
import "./css/adminStoreView.css";
import AdminStoreMenu from "../menus/AdminStoreMenu";
import { Route, Switch } from "react-router-dom";
// additional components //
import StoreViewHolder from "./StoreViewHolder";
// state //
import { Store } from "../../../state/Store";

const StoreView: React.FC<{}> = (props): JSX.Element => {
  const { dispatch } = useContext(Store);
  return (
    <div id="adminStoreViewHolder">
      <AdminStoreMenu  dispatch={dispatch} />
      <Switch>
        <Route path="/admin/home/my_store/all">
          <h3>Store view</h3>
        </Route>
        <Route path="/admin/home/my_store/create">
          <StoreManageHolder />
        </Route>
        <Route path="/admin/home/my_store/manage">
          <StoreViewHolder />
        </Route>
      </Switch>
     
    </div>
  )
};

export default StoreView;