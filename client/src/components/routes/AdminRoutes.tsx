import React from "react";
import { Switch, Route } from "react-router-dom";
// component imports //
import LoginComponent from "../admin_components/login/LoginComponent";

const AdminRoutes: React.FC<{}> = (props): JSX.Element =>  {
  return (
    <Switch>
      <Route path="/admin/login">
        <LoginComponent />
      </Route>
    </Switch>
  );
};

export default AdminRoutes;