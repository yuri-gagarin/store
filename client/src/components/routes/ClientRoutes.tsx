import React from "react";
import { Switch, Route } from "react-router-dom";
// component imports //
import MainNavSideBar from "../client_components/navbars/MainNavSidebar";

const ClientRoutes: React.FC<{}> = (props): JSX.Element =>  {
  return (
    <Switch>
      <Route exact path="/">
        <MainNavSideBar />
      </Route>
    </Switch>
  );
};

export default ClientRoutes;