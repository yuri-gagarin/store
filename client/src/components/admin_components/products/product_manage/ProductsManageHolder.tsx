import React, { useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
// additional components //
import ProductFormHolder from "../forms/ProductFormHolder";
import ProductCard from "./ProductCard";
import LoadingScreen from "../../miscelaneous/LoadingScreen";
// actions and state //
import { getAllProducts } from "../actions/APIProductActions";
import { IGlobalAppState, AppAction } from "../../../../state/Store";
// additional dependencies //
import { withRouter, RouteComponentProps, useRouteMatch, Route } from "react-router-dom";

interface Props extends RouteComponentProps {
  state: IGlobalAppState;
  dispatch: React.Dispatch<AppAction>;
};

const ProductsManageHolder: React.FC<Props> = ({ state, dispatch, history }): JSX.Element => {
  const { loadedProducts } = state.productState;
  // local state //
  const [ dataLoaded, setDataLoaded ] = useState<boolean>(false);
  // routing //
  const match = useRouteMatch("/admin/home/my_products/manage")
  const handleBack = () => {
    history.goBack();
  };
  useEffect(() => {
    getAllProducts(dispatch)
      .then((success) => {
        if (success) {
          setDataLoaded(true);
        }
      })
  }, []); 

  if (dataLoaded) {
    return (
      <Grid padded stackable columns={2}>
        <Route path={match?.url + "/edit"}> 
          <Grid.Row>
            <Grid.Column computer={12} tablet={6} mobile={16}>
              <h3>Editing Product: { state.productState.currentProductData.name }</h3>
              <Button inverted color="green" content="Back" onClick={handleBack}></Button>
            </Grid.Column>
          </Grid.Row>
          <ProductFormHolder state={state} dispatch={dispatch} />
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
    );
  } else {
    return (
      <LoadingScreen />
    );
  }
};

// export for testing //
export { ProductsManageHolder };
//
export default withRouter(ProductsManageHolder);