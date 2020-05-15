import React from "react";
import { Switch, Route } from "react-router-dom";
// component imports //
import HomeScreenComponent from "../client_components/home_screen/HomeScreenComponent";
import StoreHolder from "../client_components/store_screen/StoreHolder";
import MainNavSideBar from "../client_components/navbars/MainNavSidebar";

const ClientRoutes: React.FC<{}> = (props): JSX.Element =>  {
  return (
    <MainNavSideBar>
      <Switch>
        <Route exact path="/">
          <HomeScreenComponent title=""/>
        </Route>
        <Route exact path="/store">
          <StoreHolder />
        </Route>
      </Switch>
    </MainNavSideBar>
    
  );
};

export default ClientRoutes;