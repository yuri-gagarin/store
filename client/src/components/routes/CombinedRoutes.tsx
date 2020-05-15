import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainNavSideBar from "../client_components/navbars/MainNavSidebar";
import LoginComponent from "../admin_components/login/LoginComponent";
// import AdminRoutes from "./AdminRoutes";
// component imports //

const CombinedRoutes: React.FC<{}> = (props): JSX.Element =>  {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/admin/login">
          <LoginComponent />
        </Route>
        <Route path="/">
          <MainNavSideBar />
        </Route>
      </Switch>
      
      
    </BrowserRouter>
  );
};

export default CombinedRoutes;