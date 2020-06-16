import React from "react";
import { Item } from "semantic-ui-react";
// additional componets //
import PopularService from "./PopularService";
// css imports //

type Props = {
  popularServices: IServiceData[];
}

const PopularServiceHolder: React.FC<Props> = ({ popularServices }): JSX.Element => {
  return (
    <Item.Group divided>
      {
        popularServices.map((service) => {
          return (
            <PopularService key={service._id} popularService={service} />
          );
        })
      }
    </Item.Group>
  );
};

export default PopularServiceHolder;