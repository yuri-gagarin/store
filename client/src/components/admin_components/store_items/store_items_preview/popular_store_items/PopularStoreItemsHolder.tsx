import React from "react";
import { Item } from "semantic-ui-react";
// additional componets //
import PopularStoreItem from "./PopularStoreItem";
// css imports //
import "./css/popularStoreItemsHolder.css";

interface Props {
  popularStoreItems: IStoreItemData[];
  // loading: boolean;
}

const PopularStoreItemHolder: React.FC<Props> = ({ popularStoreItems }): JSX.Element => {
  return (
    <div className="popStoreItemsHolder">
      <div className="popStoreItemsHolTitle">Popular Store Items</div>
      <Item.Group divided>
        {
          popularStoreItems.map((storeItem) => {
            return (
              <PopularStoreItem key={storeItem._id}  popularStoreItem={storeItem} />
            );
          })
        }
      </Item.Group>
    </div>  
  );
};

export default PopularStoreItemHolder;