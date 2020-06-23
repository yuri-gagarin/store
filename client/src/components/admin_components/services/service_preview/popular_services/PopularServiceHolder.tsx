import React from "react";
import { Item } from "semantic-ui-react";
// additional componets //
import PopularService from "./PopularService";
// css imports //
import "./css/popularServiceHolder.css";

type Props = {
  popularServices: IServiceData[];
}

const PopularServiceHolder: React.FC<Props> = ({ popularServices }): JSX.Element => {
  return (
    <div className="popularServiceHolder">
      <div className="popServiceHolTitle">Popular Services</div>
      <Item.Group divided>
        {
          popularServices.map((service) => {
            return (
              <PopularService key={service._id} popularService={service} />
            );
          })
        }
      </Item.Group>
    </div>  
  );
};

export default PopularServiceHolder;