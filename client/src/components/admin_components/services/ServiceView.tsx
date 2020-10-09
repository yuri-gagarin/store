import React, { useContext, useEffect, useState } from "react";
// client routing //
import { Route, Switch } from "react-router-dom";
import { AdminServiceRoutes } from "../../../routes/adminRoutes";
// additional components //
import AdminServiceMenu from "../menus/AdminServiceMenu";
import Spacer from "../miscelaneous/Spacer";
import ServicePreviewHolder from "./service_preview/ServicePreviewHolder";
import ServiceFormHolder from "./forms/ServiceFormHolder";
import ServiceManageHolder from "./service_manage/ServiceManageHolder";
// css imports //
import "./css/serviceView.css";
// state //
import { Store } from "../../../state/Store";

const ServiceView: React.FC<{}> = (props): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const [ popularServices, setPopularSerices ] = useState<IServiceData[]>([]);

  // set popular services -- to be added later -- maybe //
  useEffect(() => {
    setPopularSerices(() => {
      return popularServices.slice(0, 4);
    })
  }, []);

  return (
    <div id="adminServiceViewHolder">
      <AdminServiceMenu  dispatch={dispatch} />
      <Switch>
        <Route path={AdminServiceRoutes.VIEW_ALL_ROUTE}>
          <Spacer width="100%" height="100px"/>
          <ServicePreviewHolder />
        </Route>
        <Route path={AdminServiceRoutes.CREATE_ROUTE}>
          <Spacer width="100%" height="100px" />
          <ServiceFormHolder />
        </Route>
        <Route path={AdminServiceRoutes.MANAGE_ROUTE}>
          <Spacer width="100%" height="100px"></Spacer>
          <ServiceManageHolder />
        </Route>
      </Switch>
    </div>
  );
};

export default ServiceView;