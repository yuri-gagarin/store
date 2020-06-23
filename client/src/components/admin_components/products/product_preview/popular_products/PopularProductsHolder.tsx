import React from "react";
import { Item } from "semantic-ui-react";
// additional componets //
import PopularProduct from "./PopularProduct";
// css imports //
import "./css/popularProductsHolder.css";

interface Props {
  popularProducts: IProductData[];
}

const PopularProductHolder: React.FC<Props> = ({ popularProducts }): JSX.Element => {
  return (
    <div className="popProductsHolder">
      <div className="popProductsHolTitle">Popular Products</div>
      <Item.Group divided>
        {
          popularProducts.map((product) => {
            return (
              <PopularProduct key={product._id}  popularProduct={product} />
            );
          })
        }
      </Item.Group>
    </div>  
  );
};

export default PopularProductHolder;