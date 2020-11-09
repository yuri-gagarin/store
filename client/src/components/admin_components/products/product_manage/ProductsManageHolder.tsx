import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import ProductFormHolder from "../forms/ProductFormContainer";
import ProductCard from "./ProductCard";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
import ErrorScreen from "../../miscelaneous/ErrorScreen";
// actions and state //
import { getAllProducts } from "../actions/APIProductActions";
import { Store } from "../../../../state/Store";
// client routing //
import { withRouter, RouteComponentProps, useRouteMatch, Route } from "react-router-dom";
import { AdminProductRoutes } from "../../../../routes/adminRoutes";

interface Props extends RouteComponentProps {
};

const ProductsManageHolder: React.FC<Props> = ({ history }): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const { loading, loadedProducts, error } = state.productState;
  // local state //
  const [ newDataLoaded, setNewDataLoaded ] = useState<boolean>(false);
  const newProductsRef = useRef(loadedProducts);
  // routing //
  const match = useRouteMatch(AdminProductRoutes.MANAGE_ROUTE)
  const handleBack = () => {
    history.goBack();
  };

  // lifecycle hooks //
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getAllProducts(dispatch)
        .then((_) => {
          setNewDataLoaded(true);
        })
        .catch((_) => {
          setNewDataLoaded(false);
        });
    }
    return () => { isMounted = false };
  }, [ dispatch ]); 

  useEffect(() => {
    if (newProductsRef.current != loadedProducts && !loading && !error) {
      setNewDataLoaded(true);
    } 
  }, [ newProductsRef.current, loadedProducts, loading, error ]);
 
  return (
    newDataLoaded ?
    <Grid id="productsManageHolder" padded stackable columns={2}>
      <Route path={match?.url + "/edit"}> 
        <Grid.Row>
          <Grid.Column computer={12} tablet={6} mobile={16}>
            <h3>Editing Product: { state.productState.currentProductData.name }</h3>
            <Button 
              id="adminProductsManageBackBtn"
              inverted 
              color="green" 
              content="Back" 
              onClick={handleBack}>

            </Button>
          </Grid.Column>
        </Grid.Row>
        <ProductFormHolder />
      </Route>
      <Route exact path={match?.url}>
        <Grid.Row>
          <Grid.Column computer={12} tablet={8} mobile={16}>
          {
            loadedProducts.map((product) => {
              return (
                <ProductCard 
                  key={product._id}
                  product={product}
                  imageCount={product.images.length}
                  state={state}
                  dispatch={dispatch}
                />
              );
            })
          }
          </Grid.Column>
          <Grid.Column computer={4} tablet={8} mobile={16}>
            
          </Grid.Column>
        </Grid.Row>
      </Route>
    </Grid>
    : 
    ( 
      error ? <ErrorScreen lastRequest={ () => getAllProducts(dispatch) }/> : <LoadingScreen /> 
    )
  );
};

// export for testing //
export { ProductsManageHolder };
// default export //
export default withRouter(ProductsManageHolder);