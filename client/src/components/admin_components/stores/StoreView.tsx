import React from "react";
import CreateStoreForm from "./CreateStoreForm";
import StoreImageUplForm from "./StoreImageUplForm";
// css imports //
import "./css/adminStoreView.css";
import AdminStoreMenu from "../menus/AdminStoreMenu";
import { Route, Switch } from "react-router-dom";

const StoreView: React.FC<{}> = (props): JSX.Element => {
  return (
    <div id="adminStoreViewHolder">
      <AdminStoreMenu />
      <Switch>
        <Route path="/admin/home/my_store/all">
          <h3>Store view</h3>
        </Route>
        <Route path="/admin/home/my_store/create">
          <CreateStoreForm />
          <StoreImageUplForm />
        </Route>
        <Route path="/admin/home/my_store/manage">
          <h3>Manage Stores</h3>
        </Route>
      </Switch>
     
    </div>
  )
};

export default StoreView;