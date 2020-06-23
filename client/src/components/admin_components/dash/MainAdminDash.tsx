import React, { useContext, useEffect } from "react";
import { Grid  } from "semantic-ui-react";
// additional components //
import StoresInfoHolder from "./stores_info/StoresInfoHolder";
import ProductsInfoHolder from "./products_info/ProductsInfoHolder";
import ServicesInfoHolder from "./services_info/ServicesInfoHolder";
import VideosInfoHolder from './videos_info/VideosInfoHolder';
// state and actions //
import { Store } from "../../../state/Store";
import { getAllStores } from "../stores/actions/APIstoreActions";
import { getAllServices } from "../services/actions/APIServiceActions";
import { getAllProducts } from "../products/actions/APIProductActions";
// css imports //

interface Props {

}
const MainAdminDash: React.FC<Props> = (props): JSX.Element => {
  const { dispatch, state } = useContext(Store);

  useEffect(() => {
    Promise.all([getAllStores(dispatch), getAllServices(dispatch), getAllProducts(dispatch)])
      .then(() => {
        // provide a message with successful load? //
      })
      .catch((err) => {
        console.error(err);
      })
  }, []);
  return (
    <Grid stackable style={{ width: "100%", padding: 0 }}>
      <Grid.Row>
        <Grid.Column computer={4} tablet={8} mobile={16} style={{ padding: 0 }}>
          <StoresInfoHolder state={state} dispatch={dispatch} />
        </Grid.Column>
        <Grid.Column computer={4} tablet={8} mobile={16} style={{ padding: 0 }}>
          <ProductsInfoHolder state={state} dispatch={dispatch} />

        </Grid.Column>
        <Grid.Column computer={4} tablet={8} mobile={16} style={{ padding: 0 }}>
          <ServicesInfoHolder state={state} dispatch={dispatch} />

        </Grid.Column>
        <Grid.Column computer={4} tablet={8} mobile={16} style={{ padding: 0 }}>
          <VideosInfoHolder state={state} dispatch={dispatch} />

        </Grid.Column>
      </Grid.Row>
      

    </Grid>
  );
};

export default MainAdminDash;