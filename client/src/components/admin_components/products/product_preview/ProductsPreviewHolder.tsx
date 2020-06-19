import React, { useEffect } from "react";
import { Grid, Item } from "semantic-ui-react";
// additional components //
import ProductPreview from "./ProductPreview";
import  ProductsControls from "./ProductsControls"'';
import PopularProductsHolder from "./popular_products/PopularProductsHolder";
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
  useEffect(() => {
    getAllProducts(dispatch);
  }, []);

  return (
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
        <PopularProductsHolder popularProducts={popularProducts}/>
      </Grid.Column>

      </Grid.Row>
      
    </Grid>
  )
};

export default ProductsPreviewHolder;