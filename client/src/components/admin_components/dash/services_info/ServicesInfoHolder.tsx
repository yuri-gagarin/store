import React from "react";
// css imports //
import "./css/servicesInfoHolder.css";
// state and actions //
import { IGlobalAppState, AppAction } from "../../../../state/Store";

interface Props {
  total?: number;
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}
const ServicesInfoHolder: React.FC<Props> = ({ total, state }): JSX.Element => {
  const numOfServices = state.serviceState.loadedServices.length;
  return (
    <div id="servicesInfoHolder">
      <div className="servicesCounter">
        Videos
      </div>
      <div className="servicesTotal">
        {numOfServices}
      </div>
    </div>
  )
};  

export default ServicesInfoHolder;