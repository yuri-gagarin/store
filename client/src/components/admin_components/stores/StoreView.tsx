import React from "react";
import StoreManageHolder from "./CreateStoreForm";
// css imports //
import "./css/adminStoreView.css";
import AdminStoreMenu from "../menus/AdminStoreMenu";
import { Route, Switch } from "react-router-dom";
// additional components //
import StoreViewHolder from "./StoreViewHolder";

const StoreView: React.FC<{}> = (props): JSX.Element => {
  return (
    <div id="adminStoreViewHolder">
      <AdminStoreMenu />
      <Switch>
        <Route path="/admin/home/my_store/all">
          <h3>Store view</h3>
          <StoreViewHolder />
        </Route>
        <Route path="/admin/home/my_store/create">
          <StoreManageHolder />
        </Route>
        <Route path="/admin/home/my_store/manage">
          <h3>Manage Stores</h3>
        </Route>
      </Switch>
     
    </div>
  )
};

export default StoreView;