import React, { useEffect, useState } from "react";
import { Grid, Item } from "semantic-ui-react";
// css imports //
import "./css/productsPreviewHolder.css";
// additional components //
import ProductPreview from "./ProductPreview";
import ProductsControls from "./ProductsControls";
import PopularProductsHolder from "./popular_products/PopularProductsHolder";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
// types and interfaces //
import { AppAction, IGlobalAppState } from "../../../../state/Store";
// api actions //
import { getAllProducts } from "../actions/APIProductActions";

interface Props {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
}

const ProductsPreviewHolder: React.FC<Props> = ({ state, dispatch }): JSX.Element => {
  const { loadedProducts } = state.productState;
  // local state //
  const [ dataLoaded, setDataLoaded ] = useState<boolean>(false);

  useEffect(() => {
    getAllProducts(dispatch)
      .then((success) => {
        if (success) {
          setDataLoaded(true);
        }
      })
  }, []);

  return (
    dataLoaded ? 
    <Grid stackable padded columns={2}>
      <Grid.Row>
      <Grid.Column computer={10} tablet={8} mobile={16}>
        <Item.Group>
          {
            loadedProducts.map((product) => {
              return (
                <ProductPreview 
                  key={product._id}
                  product={product}
                />
              );
            })
          }
        </Item.Group>
      </Grid.Column>
      <Grid.Column computer={6} tablet={8} mobile={16}>
        <ProductsControls totalProducts={loadedProducts.length} />
        <PopularProductsHolder popularProducts={loadedProducts}/>
      </Grid.Column>

      </Grid.Row>
      
    </Grid>
    :
    <LoadingScreen />
  )
};

export default ProductsPreviewHolder;