import React from "react";
import { Grid } from "semantic-ui-react";
import { Switch, Route } from "react-router-dom";
// additional components //
import MainAdminDash from "../dash/MainAdminDash";
import AdminTopMenu from "../menus/AdminTopMenu";
import StoreView from "../stores/StoreView";
import ProductsView from "../products/ProductsView";
import ServiceView from "../services/ServiceView";
import Spacer from "../../client_components/misc_components/Spacer";
// css imports //
import "./css/adminHomeScreen.css"

const AdminHomeScreen: React.FC<{}> = (props): JSX.Element => {

  return (
    <div id="adminHomeScreenHolder">
      <AdminTopMenu />
      <Grid>
        <Switch>
          <Route path="/admin/home/my_stores">
            <StoreView />
          </Route>
          <Route path="/admin/home/my_services">
            <ServiceView />
          </Route>
          <Route path="/admin/home/my_products">
            <ProductsView />
          </Route>
          <Route path="/admin/home/my_videos">
            <h1>My Videos</h1>
          </Route>
          <Route path="/admin/home/dash">
            <Spacer width="100%" height="75px"></Spacer>
            <MainAdminDash />
          </Route>
        </Switch>
      </Grid>
    </div>
    
  )
};

export default AdminHomeScreen;