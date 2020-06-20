import React from "react";
import { Grid  } from "semantic-ui-react";
// additional components //
import StoresInfoHolder from "./stores_info/StoresInfoHolder";
import ProductsInfoHolder from "./products_info/ProductsInfoHolder";
import ServicesInfoHolder from "./services_info/ServicesInfoHolder";
import VideosInfoHolder from './videos_info/VideosInfoHolder';
// css imports //

interface Props {

}
const MainAdminDash: React.FC<Props> = (props): JSX.Element => {
  return (
    <Grid stackable>
      <Grid.Row>
        <Grid.Column computer={4} tablet={8} mobile={16}>
          <StoresInfoHolder />
        </Grid.Column>
        <Grid.Column computer={4} tablet={8} mobile={16}>
          <ProductsInfoHolder />

        </Grid.Column>
        <Grid.Column computer={4} tablet={8} mobile={16}>
          <ServicesInfoHolder />

        </Grid.Column>
        <Grid.Column computer={4} tablet={8} mobile={16}>
          <VideosInfoHolder />

        </Grid.Column>
      </Grid.Row>
      

    </Grid>
  )
}