import React from "react";
import { Route } from "react-router-dom";
// component imports //
import LoginComponent from "../admin_components/login/LoginComponent";

const AdminRoutes: React.FC<{}> = (props): JSX.Element =>  {
  return (
    <Route exact path="/admin/login">
      <LoginComponent />
    </Route>
  );
};

export default AdminRoutes;