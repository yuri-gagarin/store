import React, { useContext, useEffect, useState } from "react";
// css imports //
import "./css/serviceView.css";
import AdminServiceMenu from "../menus/AdminServiceMenu";
import { Route, Switch } from "react-router-dom";
// additional components //
import Spacer from "../miscelaneous/Spacer";
import ServicePreviewHolder from "./service_preview/ServicePreviewHolder";
import ServiceFormHolder from "./forms/ServiceFormHolder";
// css imports //
import "./css/serviceView.css";
// state //
import { Store } from "../../../state/Store";
import ServiceManageHolder from "./service_manage/ServiceManageHolder";

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
        <Route path="/admin/home/my_services/all">
          <Spacer width="100%" height="100px"/>
          <ServicePreviewHolder state={state} dispatch={dispatch} />
        </Route>
        <Route path="/admin/home/my_services/create">
          <Spacer width="100%" height="100px" />
          <ServiceFormHolder state={state} dispatch={dispatch} />
        </Route>
        <Route path="/admin/home/my_services/manage">
          <Spacer width="100%" height="100px"></Spacer>
          <ServiceManageHolder state={state} dispatch={dispatch} />
        </Route>
      </Switch>
    </div>
  );
};

export default ServiceView;