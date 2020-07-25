import React from "react";
import { Item } from "semantic-ui-react";
// additional componets //
import PopularStoreItem from "./PopularStoreItem";
// css imports //
import "./css/popularStoreItemsHolder.css";

interface Props {
  popularStoreItems: IStoreItemData[];
}

const PopularStoreItemHolder: React.FC<Props> = ({ popularStoreItems }): JSX.Element => {
  return (
    <div className="popStoreItemsHolder">
      <div className="popStoreItemsHolTitle">Popular Store Items</div>
      <Item.Group divided>
        {
          popularStoreItems.map((product) => {
            return (
              <PopularStoreItem key={product._id}  popularStoreItem={product} />
            );
          })
        }
      </Item.Group>
    </div>  
  );
};

export default PopularStoreItemHolder;