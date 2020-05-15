import React from "react";
import { BrowserRouter} from "react-router-dom";
import HomeScreenComponent from "../client_components/home_screen/HomeScreenComponent";
import AdminRoutes from "./AdminRoutes";
import ClientRoutes from "./ClientRoutes";
// component imports //

const CombinedRoutes: React.FC<{}> = (props): JSX.Element =>  {
  return (
    <BrowserRouter>
      <ClientRoutes />
      <AdminRoutes />
    </BrowserRouter>
  );
};

export default CombinedRoutes;