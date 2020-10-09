import React, { useContext, useEffect, useRef, useState } from "react";
import { Grid, Item } from "semantic-ui-react";
// routing //
import { withRouter, RouteComponentProps } from "react-router-dom";
// css imports //
import "./css/productsPreviewHolder.css";
// additional components //
import ProductPreview from "./ProductPreview";
import ProductsControls from "./ProductsControls";
import PopularProductsHolder from "./popular_products/PopularProductsHolder";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
import ErrorScreen from "../../miscelaneous/ErrorScreen";
// state - React.Context //
import { Store } from "../../../../state/Store";
// api actions //
import { getAllProducts } from "../actions/APIProductActions";

interface Props extends RouteComponentProps {
  
}

const ProductsPreviewHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedProducts, error } = state.productState;
  // local state //
  const [ newDataLoaded, setNewDataLoaded ] = useState<boolean>(false);
  const productsRef = useRef(loadedProducts);
  
  // lifecycle hooks //
  useEffect(() => {
    let componentLoaded = true;
    if (componentLoaded) {
      getAllProducts(dispatch)
        .then((_) => {
          // handle success //
          setNewDataLoaded(true);
        })
        .catch((_) => {
          // handle an error //
          setNewDataLoaded(false);
        });
    }
    return () => { componentLoaded = false };
  }, [ dispatch ]);
  
  useEffect(() => {
    if (productsRef.current != loadedProducts && !error && !loading) {
      setNewDataLoaded(true);
    }
  }, [ productsRef.current, loadedProducts, error, loading ]);
  // component return //
  return (
    newDataLoaded ? 
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
    (
      error ? <ErrorScreen lastRequest={ () => getAllProducts(dispatch) } /> : <LoadingScreen />
    )
  )
};
// test export without the router //
export { ProductsPreviewHolder };
// default export //
export default withRouter(ProductsPreviewHolder);