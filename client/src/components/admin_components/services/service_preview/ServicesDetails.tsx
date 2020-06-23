import React from "react";
import { } from "semantic-ui-react";
// additional components //
// import PopularServiceHolder from "./popular_services/PopularServiceHolder";
// css imports //
import "./css/serviceDetails.css";

type Props = {
  totalServices: number;
}
const ServicesDetails: React.FC<Props> = ({ totalServices }): JSX.Element => {

  return (
    <div className="adminServiceDetailsHolder">
      <div className="adminServiceDetailsTitle">Service Details</div>
      <div className="adminServiceDetails">
        <div className="adminServiceCounter">
          <div>Total Services:</div>

          <div className="adminServicesCount">{totalServices}</div>
        </div>
      </div>
    </div>
  );
};

export default ServicesDetails;