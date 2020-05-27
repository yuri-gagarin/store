import React, { useContext } from "react";
// css imports //
import "./css/serviceView.css";
import AdminServiceMenu from "../menus/AdminServiceMenu";
import { Route, Switch } from "react-router-dom";
// additional components //

// state //
import { Store } from "../../../state/Store";

const ServiceView: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  return (
    <div id="adminServiceViewHolder">
      <AdminServiceMenu  dispatch={dispatch} />
      <Switch>
        <Route path="/admin/home/my_services/all">
          <h3>Store view</h3>
        </Route>
        <Route path="/admin/home/my_services/create">
          <h3>Service Create</h3>
        </Route>
        <Route path="/admin/home/my_services/manage">
        </Route>
      </Switch>
    </div>
  );
};

export default ServiceView;