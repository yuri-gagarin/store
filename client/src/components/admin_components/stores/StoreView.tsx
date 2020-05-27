import React, { useContext } from "react";
import StoreFormHolder from "./forms/StoreFormHolder";
// css imports //
import "./css/adminStoreView.css";
import AdminStoreMenu from "../menus/AdminStoreMenu";
import { Route, Switch } from "react-router-dom";
// additional components //
import StoreManageView from "./StoreManageView";

// state //
import { Store } from "../../../state/Store";

const StoreView: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  return (
    <div id="adminStoreViewHolder">
      <AdminStoreMenu  dispatch={dispatch} />
      <Switch>
        <Route path="/admin/home/my_store/all">
          <h3>Store view</h3>
        </Route>
        <Route path="/admin/home/my_store/create">
          <StoreFormHolder state={state} dispatch={dispatch} />
        </Route>
        <Route path="/admin/home/my_store/manage">
          <StoreManageView />
        </Route>
      </Switch>
     
    </div>
  )
};

export default StoreView;