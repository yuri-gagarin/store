import React from "react";
import { Grid } from "semantic-ui-react";
import { Switch, Route } from "react-router-dom";
// additional components //
import AdminTopMenu from "../menus/AdminTopMenu";
import StoreView from "../stores/StoreView";
import ServiceView from "../services/ServiceView";
// css imports //
import "./css/adminHomeScreen.css"

const AdminHomeScreen: React.FC<{}> = (props): JSX.Element => {

  return (
    <div id="adminHomeScreenHolder">
      <AdminTopMenu />
      <Grid>
        <Grid.Row>
          <Switch>
            <Route path="/admin/home/my_stores">
              <StoreView />
            </Route>
            <Route path="/admin/home/my_services">
              <ServiceView />
            </Route>
            <Route path="/admin/home/my_products">
              <h1>My Products</h1>
            </Route>
            <Route path="/admin/home/my_videos">
              <h1>My Videos</h1>
            </Route>
          </Switch>
        </Grid.Row>
      </Grid>
    </div>
    
  )
};

export default AdminHomeScreen;